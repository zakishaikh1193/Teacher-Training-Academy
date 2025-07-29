import React, { useEffect, useState } from 'react';
import { usersService } from '../../../services/usersService';
import { coursesService } from '../../../services/coursesService';
import { Button } from '../../ui/Button';
import { motion } from 'framer-motion';
import { ChevronLeft, User, BookOpen, Loader2, CheckCircle, UserPlus, ChevronDown, Award, AlertCircle, XCircle, Info } from 'lucide-react';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  username?: string;
}

interface Course {
  id: string;
  fullname: string;
}

interface LicenseInfo {
  licenseId: number;
  allocation: number;
  used: number;
  available: number;
  hasLicense: boolean;
  isExpired?: boolean;
}

interface AssignCourseToUsersProps {
  companyId: number;
  onBack?: () => void;
}

export const AssignCourseToUsers: React.FC<AssignCourseToUsersProps> = ({ companyId, onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<{ [courseId: string]: string[] }>({});
  const [licenseInfo, setLicenseInfo] = useState<{ [courseId: string]: LicenseInfo }>({});
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<{ [key: string]: boolean }>({});
  const [activeCourse, setActiveCourse] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      usersService.getCompanyUsers(companyId),
      coursesService.getCompanyCourses(companyId)
    ]).then(async ([users, courses]) => {
      setUsers(users);
      setCourses(courses);
      
      // Fetch enrollments and license info for each course
      const enrollmentsObj: { [courseId: string]: string[] } = {};
      const licenseInfoObj: { [courseId: string]: LicenseInfo } = {};
      
      for (const course of courses) {
        // Get enrollments
        const enrolled = await coursesService.getCourseEnrollments(course.id);
        enrollmentsObj[course.id] = enrolled.map((u: any) => u.id?.toString() || u.userid?.toString());
        
        // Get license information
        try {
          const licenseData = await coursesService.getCourseLicenseInfo(companyId, course.id);
          
          if (licenseData && licenseData.licenses && licenseData.licenses.length > 0) {
            
            // Find all licenses for this specific course by parsing the license name
            // License names follow the pattern: "License for course {courseId} in school {schoolId}"
            const courseLicenses = licenseData.licenses.filter((license: any) => {
              // Parse course ID from license name
              const nameMatch = license.name.match(/License for course (\d+) in school/);
              const licenseForCourseId = nameMatch ? nameMatch[1] : null;
              return licenseForCourseId == course.id;
            });
            
            // Select the best license (non-expired, with available slots)
            const now = Math.floor(Date.now() / 1000);
            const courseLicense = courseLicenses
              .filter((license: any) => {
                // IOMAD treats expirydate: 0 as expired, so filter those out too
                const isExpired = (license.expirydate === 0) || (license.expirydate > 0 && license.expirydate < now);
                const hasAvailable = (parseInt(license.allocation) || 0) > (parseInt(license.used) || 0);
                return !isExpired && hasAvailable;
              })
              .sort((a: any, b: any) => {
                // Sort by most available licenses first
                const aAvailable = (parseInt(a.allocation) || 0) - (parseInt(a.used) || 0);
                const bAvailable = (parseInt(b.allocation) || 0) - (parseInt(b.used) || 0);
                return bAvailable - aAvailable;
              })[0] || courseLicenses[0]; // Fallback to first license if no valid ones found
            
            if (courseLicense) {
              // Check if license is expired
              const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
              // IOMAD treats expirydate: 0 as expired (Unix epoch), so we check for that too
              const isExpired = (courseLicense.expirydate === 0) || (courseLicense.expirydate > 0 && courseLicense.expirydate < now);
              
              licenseInfoObj[course.id] = {
                licenseId: courseLicense.id,
                allocation: parseInt(courseLicense.allocation) || 0,
                used: parseInt(courseLicense.used) || 0,
                available: Math.max(0, (parseInt(courseLicense.allocation) || 0) - (parseInt(courseLicense.used) || 0)),
                hasLicense: true,
                isExpired: isExpired
              };
            } else {
              licenseInfoObj[course.id] = {
                licenseId: 0,
                allocation: 0,
                used: 0,
                available: 0,
                hasLicense: false
              };
            }
          } else {
            licenseInfoObj[course.id] = {
              licenseId: 0,
              allocation: 0,
              used: 0,
              available: 0,
              hasLicense: false
            };
          }
        } catch (error) {
          console.error(`Error fetching license info for course ${course.id}:`, error);
          licenseInfoObj[course.id] = {
            licenseId: 0,
            allocation: 0,
            used: 0,
            available: 0,
            hasLicense: false
          };
        }
      }
      
      setEnrollments(enrollmentsObj);
      setLicenseInfo(licenseInfoObj);
      if (courses.length > 0) setActiveCourse(courses[0].id);
    }).finally(() => setLoading(false));
  }, [companyId]);

const handleAssign = async (courseId: string, userId: string) => {
    const courseLicense = licenseInfo[courseId];

    // --- Pre-flight Checks (Your existing logic is good) ---
    if (!courseLicense?.hasLicense || courseLicense.isExpired || courseLicense.available <= 0) {
      alert('Cannot assign user. Please check license availability and status.');
      return;
    }

    setAssigning(prev => ({ ...prev, [`${courseId}-${userId}`]: true }));

    try {
      // --- STEP 1: ALLOCATE THE LICENSE SEAT ---
      // This reserves a spot for the user and decrements the "available" count in IOMAD.
      const licenseAllocated = await coursesService.allocateLicenseToUser(
        courseLicense.licenseId,
        parseInt(userId),
        parseInt(courseId)
      );

      // If the license could not be allocated, stop the entire process.
      if (!licenseAllocated) {
        alert('Failed to reserve a license seat. The user has NOT been enrolled. Please check server logs or contact support.');
        setAssigning(prev => ({ ...prev, [`${courseId}-${userId}`]: false }));
        return;
      }
      
      console.log('STEP 1 SUCCESS: License seat allocated.');

      // --- STEP 2: ENROLL THE USER IN THE COURSE ---
      // Now that the license is secured, give the user access to the course in Moodle.
      console.log('STEP 2: Enrolling user in course...');
      const userEnrolled = await coursesService.enrollUserInCourse(courseId, userId);

      if (userEnrolled) {
        // --- FINAL SUCCESS: BOTH STEPS WORKED ---
        console.log('STEP 2 SUCCESS: User enrolled. Updating UI.');

        // Update the UI to reflect the successful assignment.
        // We can do an "optimistic update" first for a snappy user experience.
        
        // Move user from "Unassigned" to "Assigned" list in the UI
        setEnrollments(prev => ({
          ...prev,
          [courseId]: [...(prev[courseId] || []), userId]
        }));
        
        // Decrement the available license count in the UI
        setLicenseInfo(prev => ({
          ...prev,
          [courseId]: {
            ...prev[courseId],
            used: prev[courseId].used + 1,
            available: Math.max(0, prev[courseId].available - 1)
          }
        }));

      } else {
        // This is a critical error state that requires manual intervention.
        // The license was consumed, but the enrollment failed.
        alert('CRITICAL ERROR: A license was successfully consumed, but the user could not be enrolled in the course. Please contact support immediately to resolve this discrepancy.');
        // Note: We don't roll back the UI license count here because a license WAS used.
        // The UI should reflect the reality on the server.
      }
    } catch (error) {
      console.error('An error occurred during the assignment process:', error);
      alert('A critical error occurred. Please check the console and contact support.');
    } finally {
      // Stop the loading indicator for this specific user button.
      setAssigning(prev => ({ ...prev, [`${courseId}-${userId}`]: false }));
    }
  };

  const getAssignedUsers = (courseId: string) =>
    users.filter(u => enrollments[courseId]?.includes(u.id));
  const getUnassignedUsers = (courseId: string) =>
    users.filter(u => !enrollments[courseId]?.includes(u.id));

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
      <span className="text-xl text-gray-700">Loading Course Assignments...</span>
      <p className="text-gray-500 mt-2">Fetching users and courses, please wait.</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen py-8 px-4">
      <div className="flex items-center mb-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-gray-100 p-2 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <span>User Course Enrollment</span>
        </h2>
      </div>

      <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <label htmlFor="course-select" className="block text-lg font-semibold text-gray-800 mb-2">
            Select a Course
          </label>
          <p className="text-gray-500 mb-4">Choose a course from the list below to manage its user enrollments.</p>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
                id="course-select"
                value={activeCourse || ''}
                onChange={(e) => setActiveCourse(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-gray-50 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
                <option value="" disabled>-- Select a Course --</option>
                {courses.map(course => (
                    <option key={course.id} value={course.id}>
                        {course.fullname}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
      </div>
      
      {activeCourse ? (
        <motion.div
          key={activeCourse}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-6 pb-4 border-b border-gray-200">
            Managing: {courses.find(c => c.id === activeCourse)?.fullname}
          </h3>
          
          {/* License Status Display */}
          {licenseInfo[activeCourse] && (
            <div className="mb-6 p-4 bg-white rounded-xl border">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-900">License Status</h4>
              </div>
              
              {licenseInfo[activeCourse].hasLicense ? (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{licenseInfo[activeCourse].allocation}</div>
                    <div className="text-sm text-blue-800">Total Licenses</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{licenseInfo[activeCourse].used}</div>
                    <div className="text-sm text-yellow-800">Used</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{licenseInfo[activeCourse].available}</div>
                    <div className="text-sm text-green-800">Available</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">No License Assigned</span>
                  <span className="text-sm ml-2">Contact administrator to assign licenses for this course.</span>
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Unassigned Users */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white p-4 border-b flex items-center gap-3">
                <UserPlus className="w-6 h-6 text-blue-500" /> Unassigned Users
              </h4>
              <div className="p-4">
                {getUnassignedUsers(activeCourse).length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p className="font-semibold">All users are assigned!</p>
                  </div>
                ) : (
                  <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {getUnassignedUsers(activeCourse).map(user => (
                        <li key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div>
                            <p className="font-semibold text-gray-900">{user.firstname} {user.lastname}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <Button
                              size="sm"
                              variant="primary"
                              loading={assigning[activeCourse + '-' + user.id]}
                              disabled={!licenseInfo[activeCourse]?.hasLicense || licenseInfo[activeCourse]?.isExpired || licenseInfo[activeCourse]?.available <= 0}
                              onClick={() => handleAssign(activeCourse, user.id)}
                              className={`${!licenseInfo[activeCourse]?.hasLicense || licenseInfo[activeCourse]?.isExpired || licenseInfo[activeCourse]?.available <= 0 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                              {!licenseInfo[activeCourse]?.hasLicense 
                                ? 'No License' 
                                : licenseInfo[activeCourse]?.isExpired 
                                ? 'Expired' 
                                : licenseInfo[activeCourse]?.available <= 0 
                                ? 'Full' 
                                : 'Assign'}
                          </Button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
            {/* Assigned Users */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border">
               <h4 className="text-lg font-semibold text-gray-800 dark:text-white p-4 border-b flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" /> Assigned Users
              </h4>
              <div className="p-4">
                {getAssignedUsers(activeCourse).length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No users assigned to this course yet.</p>
                  </div>
                ) : (
                  <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {getAssignedUsers(activeCourse).map(user => (
                        <li key={user.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-green-800">{user.firstname} {user.lastname}</p>
                            <p className="text-sm text-green-700">{user.email}</p>
                          </div>
                           <CheckCircle className="w-6 h-6 text-green-500" />
                        </li>
                      ))}
                   </ul>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg border">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Please select a course</h3>
            <p className="text-gray-500 mt-2">Once you select a course, you can manage user enrollments here.</p>
        </div>
      )}
    </div>
  );
}; 