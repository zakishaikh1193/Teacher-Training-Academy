import React, { useState, useEffect } from 'react';
import { activityService } from '../services/activityService';
import { Star, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActivityIcon {
  type: string;
  name: string;
  iconUrl: string;
  description: string;
}

const ActivityIconGallery: React.FC = () => {
  const [activityIcons, setActivityIcons] = useState<ActivityIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'activities' | 'resources'>('all');
  const [fetchStatus, setFetchStatus] = useState<{ success: number; failed: number; total: number }>({ success: 0, failed: 0, total: 0 });
  const navigate = useNavigate();

  const activityData = [
    { type: 'assign', name: 'Assignment', description: 'Submit work for grading' },
    { type: 'attendance', name: 'Attendance', description: 'Track student attendance' },
    { type: 'book', name: 'Book', description: 'Multi-page resource with chapters' },
    { type: 'choice', name: 'Choice', description: 'Allow students to make selections' },
    { type: 'data', name: 'Database', description: 'Build, display and search a bank of entries' },
    { type: 'facetoface', name: 'Face-to-Face', description: 'Manage face-to-face sessions' },
    { type: 'feedback', name: 'Feedback', description: 'Create and conduct surveys' },
    { type: 'file', name: 'File', description: 'Upload and share files' },
    { type: 'folder', name: 'Folder', description: 'Organize files in folders' },
    { type: 'forum', name: 'Forum', description: 'Create discussions and conversations' },
    { type: 'glossary', name: 'Glossary', description: 'Create and maintain lists of definitions' },
    { type: 'h5p', name: 'H5P', description: 'Interactive content and applications' },
    { type: 'imscp', name: 'IMS content package', description: 'Add content from IMS packages' },
    { type: 'iomadcertificate', name: 'IOMAD Certificate', description: 'Issue certificates for course completion' },
    { type: 'lesson', name: 'Lesson', description: 'Create branching scenarios' },
    { type: 'page', name: 'Page', description: 'Create a web page resource' },
    { type: 'quiz', name: 'Quiz', description: 'Create and conduct assessments' },
    { type: 'scorm', name: 'SCORM package', description: 'Add SCORM content packages' },
    { type: 'label', name: 'Text and media area', description: 'Add text and media to course page' },
    { type: 'trainingevent', name: 'Training event', description: 'Manage training events' },
    { type: 'url', name: 'URL', description: 'Link to external websites' },
    { type: 'wiki', name: 'Wiki', description: 'Collaborative editing of web pages' },
    { type: 'workshop', name: 'Workshop', description: 'Peer assessment and grading' },
    { type: 'zoom', name: 'Zoom meeting', description: 'Schedule and conduct Zoom meetings' }
  ];

  const activities = ['assign', 'attendance', 'choice', 'data', 'facetoface', 'feedback', 'forum', 'glossary', 'h5p', 'iomadcertificate', 'lesson', 'quiz', 'trainingevent', 'wiki', 'workshop', 'zoom'];
  const resources = ['book', 'file', 'folder', 'imscp', 'page', 'scorm', 'label', 'url'];

  useEffect(() => {
    const fetchIcons = async () => {
      setLoading(true);
      let successCount = 0;
      let failedCount = 0;
      
      try {
        const icons: ActivityIcon[] = [];
        
        for (const activity of activityData) {
          try {
            const iconUrl = await activityService.getActivityIcon(activity.type);
            if (iconUrl) {
              icons.push({
                type: activity.type,
                name: activity.name,
                iconUrl,
                description: activity.description
              });
              successCount++;
            } else {
              failedCount++;
            }
          } catch (error) {
            console.error(`Error fetching icon for ${activity.type}:`, error);
            failedCount++;
          }
        }
        
        setActivityIcons(icons);
        setFetchStatus({ success: successCount, failed: failedCount, total: activityData.length });
      } catch (error) {
        console.error('Error fetching activity icons:', error);
        setFetchStatus({ success: 0, failed: activityData.length, total: activityData.length });
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, []);

  const filteredIcons = activityIcons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         icon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'activities') {
      return matchesSearch && activities.includes(icon.type);
    } else if (activeTab === 'resources') {
      return matchesSearch && resources.includes(icon.type);
    }
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading IOMAD activity icons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-blue-600">Add an activity or resource</h1>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 mb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'activities' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Activities
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'resources' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Resources
          </button>
        </div>
      </div>

      {/* Activity Icons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredIcons.map((icon) => (
          <div
            key={icon.type}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          >
            {/* Icon */}
            <div className="flex justify-center mb-3">
              <img
                src={icon.iconUrl}
                alt={icon.name}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://cdn-icons-png.flaticon.com/512/2991/2991110.png';
                }}
              />
            </div>
            
            {/* Name */}
            <h3 className="text-sm font-medium text-gray-800 text-center mb-2 line-clamp-2">
              {icon.name}
            </h3>
            
            {/* Action Icons */}
            <div className="flex justify-center space-x-2">
              <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Star className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-blue-500 transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredIcons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No activities found matching your search.</p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">IOMAD Activity Icons</h3>
        <p className="text-blue-700 text-sm">
          This gallery displays all available activity and resource icons from your IOMAD/Moodle system. 
          The icons are fetched directly from the IOMAD API using authentication tokens. 
          If the API is unavailable, fallback icons are used to ensure the interface remains functional.
        </p>
        <p className="text-blue-700 text-sm mt-2">
          <strong>Total Icons Loaded:</strong> {activityIcons.length} / {activityData.length}
        </p>
        <p className="text-blue-700 text-sm">
          <strong>Success Rate:</strong> {fetchStatus.success} successful, {fetchStatus.failed} failed
        </p>
      </div>
    </div>
  );
};

export default ActivityIconGallery; 