import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Step 1: Import axios directly
import { ArrowLeft, User, BookOpen, Award } from 'lucide-react';
import { Button } from '../ui/Button';
import { coursesService } from '../../services/coursesService';
import { usersService } from '../../services/usersService';
import { Course, User as UserType } from '../../types';

// Step 2: Get the base URL and token from environment variables, just like your service file
const IOMAD_BASE_URL = import.meta.env.VITE_IOMAD_URL || 'https://iomad.bylinelms.com/webservice/rest/server.php';
const IOMAD_TOKEN = import.meta.env.VITE_IOMAD_TOKEN || '4a2ba2d6742afc7d13ce4cf486ba7633';


export const AssignTrainerToCoursePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [teachers, setTeachers] = useState<UserType[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teacherRoleId, setTeacherRoleId] = useState<number | null>(null);
  
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // This useEffect is correct and does not need changes.
    const fetchData = async () => {
      setLoading(true);
      setMessage(null);
      try {
        const rolesData = await coursesService.getAvailableRoles();
        const teacherRole = rolesData.find(r => r.shortname === 'teachers');

        if (!teacherRole) {
          throw new Error("Could not find the 'teachers' role in the system.");
        }
        
        const foundTeacherRoleId = teacherRole.id;
        setTeacherRoleId(foundTeacherRoleId);

        const [coursesData, teachersData] = await Promise.all([
          coursesService.getAllCourses(),
          usersService.getUsersByRoleId(foundTeacherRoleId)
        ]);

        setCourses(coursesData);
        setTeachers(teachersData);

      } catch (error) {
        console.error("Failed to fetch data for assignment page:", error);
        setMessage("Could not load necessary data. Please try again later.");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // --- THIS IS THE UPDATED FUNCTION ---
  const handleAssign = async () => {
    if (!selectedUser || !selectedCourse || !teacherRoleId) {
      setMessage('Please select a trainer and a course.');
      return;
    }

    setAssigning(true);
    setMessage(null);

    try {
      // Step 3: Build the form-encoded data using URLSearchParams
      const params = new URLSearchParams();
      params.append('wstoken', IOMAD_TOKEN);
      params.append('wsfunction', 'enrol_manual_enrol_users');
      params.append('moodlewsrestformat', 'json');
      params.append('enrolments[0][courseid]', selectedCourse);
      params.append('enrolments[0][userid]', selectedUser);
      params.append('enrolments[0][roleid]', String(teacherRoleId));

      // Step 4: Make a direct axios POST request with the correct headers
      const response = await axios.post(IOMAD_BASE_URL, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Step 5: Check the response for success or failure
      if (response.data && response.data.exception) {
        console.error('Moodle enrollment error:', response.data);
        setMessage('Assignment failed. The trainer may already be enrolled in this course.');
      } else {
        // A successful response is often null or an empty array
        setMessage('Trainer successfully assigned to the course!');
        setSelectedUser('');
        setSelectedCourse('');
      }
    } catch (error) {
      setMessage('An error occurred during assignment. Please check the console.');
      console.error('Full error object:', error);
    
    }
    setAssigning(false);
  };

  // --- The rest of your component remains the same ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading trainers and courses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Assign Course to Trainer</h1>
          <p className="text-gray-600">Enroll a trainer into a course with the teaching role.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl">
        <div className="space-y-4">
          
          <div>
            <label htmlFor="user-select" className="block text-sm font-medium mb-1 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" /> Select Trainer
            </label>
            <select
              id="user-select"
              className="w-full px-3 py-2 border rounded-lg"
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
            >
              <option value="">-- Choose a trainer --</option>
              {teachers.map(u => (
                <option key={u.id} value={u.id}>{u.fullname || `${u.firstname} ${u.lastname}`}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="course-select" className="block text-sm font-medium mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-500" /> Select Course
            </label>
            <select
              id="course-select"
              className="w-full px-3 py-2 border rounded-lg"
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
            >
              <option value="">-- Choose a course --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.fullname}</option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleAssign}
            disabled={assigning || !selectedUser || !selectedCourse}
            className="mt-4"
          >
            {assigning ? 'Assigning...' : 'Assign Trainer to Course'}
          </Button>

          {message && <div className={`mt-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>}
        </div>
      </div>
    </div>
  );
};