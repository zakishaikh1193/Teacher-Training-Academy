import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { coursesService } from '../../services/coursesService';
import { usersService } from '../../services/usersService';
import * as contentBuilderService from '../../services/contentBuilderService';
import { Course, User as UserType } from '../../types';

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

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleAssign = async () => {
    if (!selectedUser || !selectedCourse || !teacherRoleId) {
      setMessage('Please select a trainer and a course.');
      return;
    }

    setAssigning(true);
    setMessage(null);

    try {
      const courseIdNum = Number(selectedCourse);
      const userIdNum = Number(selectedUser);
      const courseInfo = courses.find(c => c.id === selectedCourse);

      // --- Step 1: ENROLL THE USER IN THE COURSE (This must happen first!) ---
      console.log('Step 1: Enrolling user in course...');
      const params = new URLSearchParams();
      params.append('wstoken', IOMAD_TOKEN);
      params.append('wsfunction', 'enrol_manual_enrol_users');
      params.append('moodlewsrestformat', 'json');
      params.append('enrolments[0][courseid]', selectedCourse);
      params.append('enrolments[0][userid]', selectedUser);
      params.append('enrolments[0][roleid]', String(teacherRoleId));

      const response = await axios.post(IOMAD_BASE_URL, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      if (response.data && response.data.exception) {
        console.error('Moodle enrollment error:', response.data);
        throw new Error('Assignment failed. The trainer may already be enrolled in this course.');
      }
      console.log('Step 1 Succeeded: User is now enrolled in the course.');

      // --- Step 2: NOW manage the group, since the user is in the course ---
      const targetGroupName = `${courseInfo?.fullname} - Trainers`;
      console.log(`Step 2: Target group for this course is: "${targetGroupName}"`);

      const existingGroups = await contentBuilderService.getCourseGroups(courseIdNum);
      let targetGroup = existingGroups.find(g => g.name === targetGroupName);
      
      if (!targetGroup) {
        console.log(`Group "${targetGroupName}" not found. Creating it...`);
        const newGroupResponse = await contentBuilderService.createCourseGroup(courseIdNum, targetGroupName, "System-generated group for trainers.");
        if (!newGroupResponse || !newGroupResponse.groupid) {
          throw new Error('CRITICAL: Failed to auto-create the necessary group for trainers.');
        }
        targetGroup = { id: newGroupResponse.groupid, name: targetGroupName };
        console.log(`Step 2 Succeeded: Group created with ID: ${targetGroup.id}`);
      } else {
        console.log(`Step 2 Succeeded: Found existing group with ID: ${targetGroup.id}`);
      }
      
      // Step 3: Add the now-enrolled user to the group
      await contentBuilderService.addGroupMember(targetGroup.id, userIdNum);
      console.log(`Step 3 Succeeded: User ${userIdNum} added to group ${targetGroup.id}.`);

      // If we reach here, everything was successful.
      setMessage('Trainer successfully assigned to the course and added to the trainers group!');
      setSelectedUser('');
      setSelectedCourse('');

    } catch (error: any) {
      setMessage(error.message || 'An error occurred during assignment.');
      console.error('Full error object:', error);
    }
    setAssigning(false);
  };

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
            {assigning ? 'Assigning...' : 'Assign Trainer & Add to Group'}
          </Button>

          {message && <div className={`mt-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>}
        </div>
      </div>
    </div>
  );
};