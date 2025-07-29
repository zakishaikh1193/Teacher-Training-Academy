import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '../../ui/Button';

export const SchoolGroupsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Removed back button as per new navigation policy */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School Groups</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create and manage groups within schools
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <UserPlus className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Group Management
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          School groups management functionality will be implemented here.
        </p>
      </div>
    </div>
  );
};