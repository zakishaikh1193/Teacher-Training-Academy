import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Course, User as UserType } from '../../types';
import { coursesService } from '../../services/coursesService';
import { usersService } from '../../services/usersService';
import { BookOpen, User as UserIcon, Loader2, ChevronsRight } from 'lucide-react';

export const TrainerAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [allTrainers, setAllTrainers] = useState<UserType[]>([]);
  const [trainersByCourse, setTrainersByCourse] = useState<{ [courseId: string]: UserType[] }>({});
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Step 1: Get all base data in parallel
        const [categoriesData, coursesData, rolesData] = await Promise.all([
          coursesService.getAllCategories(),
          coursesService.getAllCourses(),
          coursesService.getAvailableRoles(),
        ]);

        setCategories(categoriesData);
        setCourses(coursesData);
        
        // --- THIS IS THE KEY INSIGHT ---
        // Step 2: Identify ALL roles that should be considered a "teacher" or "trainer".
        // The mismatch was because we only looked for one role, but Moodle has several.
        const teacherRoleShortnames = ['teachers', 'editingteacher', 'teacher'];
        const teacherRoleIDs = new Set( // Use a Set for efficient lookups
          rolesData
            .filter(role => teacherRoleShortnames.includes(role.shortname))
            .map(role => role.id)
        );

        if (teacherRoleIDs.size === 0) {
          throw new Error("Could not find any teacher-like roles (teachers, editingteacher, teacher).");
        }
        
        // Step 3: Get the list of ALL users who have ANY of these teacher roles for the right-hand column.
        const trainerPromises = Array.from(teacherRoleIDs).map(id => usersService.getUsersByRoleId(id));
        const trainersByRole = await Promise.all(trainerPromises);
        
        const allTrainersMap = new Map<string, UserType>();
        trainersByRole.flat().forEach(trainer => allTrainersMap.set(trainer.id, trainer));
        setAllTrainers(Array.from(allTrainersMap.values()));

        // Step 4: Fetch enrollments for EVERY course. This is the single source of truth.
        // The System Admin token should see all users from all companies in this core function.
        const enrollmentPromises = coursesData.map(course => 
          coursesService.getCourseEnrollments(String(course.id))
        );
        const allEnrollments = await Promise.all(enrollmentPromises);

        // Step 5: Process the enrollments, checking against our complete list of teacher role IDs.
        const trainersMap: { [courseId: string]: UserType[] } = {};
        coursesData.forEach((course, index) => {
          const enrollmentsForCourse = allEnrollments[index];
          
          const assignedTrainers = enrollmentsForCourse.filter(enrollment => 
            enrollment.roles?.some((role: any) => teacherRoleIDs.has(role.roleid))
          );
          
          trainersMap[course.id] = assignedTrainers;
        });
        
        setTrainersByCourse(trainersMap);

      } catch (err) {
        console.error("Failed to load trainer dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const coursesByCategory = useMemo(() => {
    if (!categories.length || !courses.length) return [];
    
    return categories.map(category => ({
      ...category,
      courses: courses.filter(course => course.categoryid === category.id)
    }));
  }, [categories, courses]);

  // The JSX for rendering the component remains exactly the same.
  // The fix was purely in the data fetching logic.
  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-4 text-gray-600">Loading Dashboard Data...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 bg-red-100 text-red-800 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold">Trainer Management</h2>
          <p className="text-gray-600">Platform-wide overview of courses and their assigned trainers.</p>
        </div>
        <Button 
          onClick={() => navigate('/assign-trainer-to-course')} 
          className="bg-blue-600 text-white"
        >
          Assign Course to Trainer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Courses & Assigned Trainers</h3>
            </div>
            <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              {coursesByCategory.map(category => (
                <details key={category.id} className="group border rounded-lg p-3" open>
                  <summary className="font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                    {category.name}
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">{category.courses.length} courses</span>
                  </summary>
                  <div className="mt-4 pl-4 border-l-2 border-blue-200 space-y-4">
                    {category.courses.length > 0 ? (
                      category.courses.map(course => {
                        const assignedTrainers = trainersByCourse[course.id] || [];
                        return (
                          <div key={course.id}>
                            <p className="font-medium text-gray-800">{course.fullname}</p>
                            {assignedTrainers.length > 0 ? (
                              <div className="pl-4 mt-2 space-y-2">
                                {assignedTrainers.map(trainer => (
                                  <div key={trainer.id} className="flex items-center gap-2 text-sm text-gray-600">
                                    <ChevronsRight className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span>{trainer.fullname}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="pl-4 mt-1 text-xs text-gray-400">No trainers assigned to this course.</p>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="mt-2 text-sm text-gray-500">No courses in this category.</p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <div className="flex items-center gap-3 mb-4">
              <UserIcon className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold">All Trainers ({allTrainers.length})</h3>
            </div>
            <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
              {allTrainers.map(trainer => (
                <div key={trainer.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={trainer.profileimageurl || `https://ui-avatars.com/api/?name=${trainer.firstname}+${trainer.lastname}&background=random`} 
                    alt={`${trainer.firstname} ${trainer.lastname}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{trainer.fullname || `${trainer.firstname} ${trainer.lastname}`}</p>
                    <p className="text-xs text-gray-500">{trainer.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrainerAdminDashboardPage;