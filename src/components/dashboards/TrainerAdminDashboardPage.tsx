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
    let isMounted = true;
    const abortController = new AbortController();
    
    const fetchData = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Step 1: Get all base data with error handling for each
        const [categoriesData, coursesData, rolesData] = await Promise.allSettled([
          coursesService.getAllCategories(),
          coursesService.getAllCourses(),
          coursesService.getAvailableRoles(),
        ]);

        // Handle each promise result
        const categories = categoriesData.status === 'fulfilled' ? categoriesData.value : [];
        const courses = coursesData.status === 'fulfilled' ? coursesData.value : [];
        const roles = rolesData.status === 'fulfilled' ? rolesData.value : [];
        
        if (!isMounted) return;
        
        setCategories(categories);
        setCourses(courses);
        
        if (categoriesData.status === 'rejected') {
          console.warn('Failed to load categories:', categoriesData.reason);
        }
        if (coursesData.status === 'rejected') {
          console.warn('Failed to load courses:', coursesData.reason);
        }
        if (rolesData.status === 'rejected') {
          console.warn('Failed to load roles, using default roles:', rolesData.reason);
        }
        
        // Step 2: Identify teacher roles
        const teacherRoleShortnames = ['teachers', 'editingteacher', 'teacher'];
        const teacherRoleIDs = new Set(
          roles
            .filter((role: any) => teacherRoleShortnames.includes(role.shortname))
            .map((role: any) => role.id)
        );

        if (teacherRoleIDs.size === 0) {
          console.warn('No teacher roles found, using default role IDs');
          teacherRoleIDs.add(3); // Default teacher role ID
          teacherRoleIDs.add(4); // Default non-editing teacher role ID
        }
        
        // Step 3: Get all trainers
        try {
          const trainerPromises = Array.from(teacherRoleIDs).map(id => 
            usersService.getUsersByRoleId(id as number)
          );
          const trainersByRole = await Promise.allSettled(trainerPromises);
          
          if (!isMounted) return;
          
          const allTrainersMap = new Map<string, UserType>();
          trainersByRole
            .filter((result): result is PromiseFulfilledResult<UserType[]> => result.status === 'fulfilled')
            .flatMap(result => result.value)
            .forEach(trainer => allTrainersMap.set(trainer.id, trainer));
            
          setAllTrainers(Array.from(allTrainersMap.values()));
          
          // Log any failed role fetches
          trainersByRole
            .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
            .forEach((result, index) => {
              console.warn(`Failed to fetch users for role ID ${Array.from(teacherRoleIDs)[index]}:`, result.reason);
            });
        } catch (err) {
          console.error('Error fetching trainers:', err);
          // Continue with empty trainers list
          setAllTrainers([]);
        }

        // Step 4: Fetch course enrollments in batches to avoid overwhelming the server
        const BATCH_SIZE = 5;
        const trainersMap: { [courseId: string]: UserType[] } = {};
        
        for (let i = 0; i < courses.length; i += BATCH_SIZE) {
          if (!isMounted) return;
          
          const batch = courses.slice(i, i + BATCH_SIZE);
          const batchPromises = batch.map(course => 
            coursesService.getCourseEnrollments(String(course.id))
          );
          
          const batchResults = await Promise.allSettled(batchPromises);
          
          batchResults.forEach((result, idx) => {
            if (result.status === 'fulfilled') {
              const course = batch[idx];
              const enrollmentsForCourse = result.value;
              
              const assignedTrainers = enrollmentsForCourse.filter((enrollment: any) => 
                enrollment.roles?.some((role: any) => teacherRoleIDs.has(role.roleid))
              );
              
              trainersMap[course.id] = assignedTrainers;
            } else {
              console.warn(`Failed to fetch enrollments for course ${batch[idx]?.id}:`, result.reason);
            }
          });
          
          // Update state after each batch
          if (isMounted) {
            setTrainersByCourse(prev => ({
              ...prev,
              ...trainersMap
            }));
          }
        }
        
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load trainer dashboard data:", err);
          setError(
            "Failed to load some dashboard data. Some information may be incomplete. " +
            "Please refresh the page to try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
      abortController.abort();
    };
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