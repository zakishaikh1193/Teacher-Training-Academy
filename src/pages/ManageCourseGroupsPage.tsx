import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as contentBuilderService from '../services/contentBuilderService';
import { Button } from '../components/ui/Button';
import { Loader2, PlusCircle, Users, ArrowLeft } from 'lucide-react';

interface Group {
  id: number;
  name: string;
  description: string;
}

export const ManageCourseGroupsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchGroups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const groupsData = await contentBuilderService.getCourseGroups(Number(courseId));
      setGroups(groupsData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch groups.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName) {
      alert("Group name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await contentBuilderService.createCourseGroup(Number(courseId), newGroupName, newGroupDesc);
      // Success! Close modal, clear form, and refresh the list.
      setShowCreateModal(false);
      setNewGroupName('');
      setNewGroupDesc('');
      await fetchGroups();
    } catch (err: any) {
      setError(err.message || "Failed to create the group.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        {/* Removed back button as per new navigation policy */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Course Groups</h1>
        <p className="text-gray-500">Create and view groups to manage content visibility and user cohorts.</p>
      </div>

      <div className="bg-white rounded-xl shadow-md border p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Existing Groups
            </h2>
            <Button onClick={() => setShowCreateModal(true)}>
                <PlusCircle className="w-4 h-4 mr-2" /> Create New Group
            </Button>
        </div>

        {loading ? (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">{error}</div>
        ) : (
            <div className="space-y-3">
                {groups.length > 0 ? (
                    groups.map(group => (
                        <div key={group.id} className="bg-gray-50 p-4 rounded-lg border">
                            <h3 className="font-semibold text-gray-900">{group.name}</h3>
                            <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: group.description }} />
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-10 border-2 border-dashed rounded-lg">
                        <p>No groups found for this course yet.</p>
                        <p className="text-sm mt-1">Click "Create New Group" to get started.</p>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setShowCreateModal(false)}>×</button>
            <h2 className="text-xl font-bold mb-4">Create New Group</h2>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label htmlFor="group-name" className="block font-medium mb-1">Group Name</label>
                <input
                  id="group-name"
                  type="text"
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., Trainers, Trainees, School Admins"
                  required
                />
              </div>
              <div>
                <label htmlFor="group-desc" className="block font-medium mb-1">Description (Optional)</label>
                <textarea
                  id="group-desc"
                  value={newGroupDesc}
                  onChange={e => setNewGroupDesc(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder="A brief summary of this group's purpose."
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="animate-spin w-4 h-4 mr-2 inline" />}
                    Create Group
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};