import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Award, Clock, ArrowUpRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Course } from '../../types';
import { CourseViewer } from '../../pages/CourseViewerPage';

const fallbackImage = '/images/default-course.jpg';

const LearningPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    async function fetchLearning() {
      if (user && user.id) {
        setLoading(true);
        setError(null);
        try {
          const fetchedCourses = await apiService.getUserCourses(user.id);
          setCourses(Array.isArray(fetchedCourses) ? fetchedCourses : []);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch learning data');
        } finally {
          setLoading(false);
        }
      }
    }
    fetchLearning();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">Error Loading Courses</div>
          <div className="text-red-500 dark:text-red-300">{error}</div>
        </div>
      </div>
    );
  }

  // If a course is selected, show the CourseViewer
  if (selectedCourse) {
    return (
      <CourseViewer 
        courseId={selectedCourse.id.toString()}
        onBack={() => setSelectedCourse(null)}
        title={`${selectedCourse.fullname} - Learning Pathway`}
        showBackButton={true}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Learning</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Access your enrolled courses and track your progress
        </p>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No Courses Enrolled</h3>
          <p className="text-gray-500 dark:text-gray-400">You haven't enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div 
              key={course.id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedCourse(course)}
            >
              <div>
                <div className="relative mb-4">
                  <img
                    src={course.courseimage || fallbackImage}
                    alt={course.fullname}
                    className="w-full h-48 object-cover rounded-lg" 
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackImage; }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
                </div>
                
                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white line-clamp-2">
                  {course.fullname}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {course.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {course.progress === 100 ? 'Completed' : 'In Progress'}
                </span>
                <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span className="text-sm font-medium">View Course</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPage;
