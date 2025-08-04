import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseContents } from '../services/apiService';
import DOMPurify from 'dompurify';
import axios from 'axios';
import { 
  Loader2, BookOpen, Tag, FileText, Link as LinkIcon, ChevronLeft, Image as ImageIcon, 
  Clock, Calendar, FileText as DocumentIcon, ArrowUpRight, Play, CheckCircle, 
  Users, Target, Award, Zap, Lightbulb, Database, Code, BarChart3, Video, 
  MessageSquare, FileCheck, Star, TrendingUp, BookMarked, Activity, Brain,
  Globe, PenTool, Camera, Mic, Headphones, Bookmark, Download, Upload,
  Share2, Heart, ThumbsUp, MessageCircle, CalendarDays, Timer,
  GraduationCap, Trophy, Medal, Badge, Shield, Lock, Unlock,
  Eye, EyeOff, Settings, HelpCircle, Info, AlertCircle, CheckSquare,
  Square, Circle, ArrowRight, ArrowLeft, RotateCcw, RefreshCw,
  Flame, Sparkles, Rocket, Compass, Map, Navigation, Flag, Home,
  Search, Filter, SortAsc, SortDesc, Grid, List, Maximize, Minimize,
  ChevronDown, ChevronUp, Plus, Minus, Calendar as CalendarIcon,
  Laptop, Database as DatabaseIcon, Network, Lightbulb as LightbulbIcon
} from 'lucide-react';

// Define types locally for clarity
interface ContentModule {
  id: number;
  name: string;
  modname: string;
  url?: string;
  description?: string;
  pagecontent?: string;
  renderedContent?: string;
  mainUrl?: string;
  fileName?: string;
}

interface CourseSection {
    id: number;
    name:string;
    section: number;
    summary: string;
    modules: ContentModule[];
}

interface DayData {
    dayNumber: number;
    dayName: string;
    section: CourseSection;
    hourlyActivities: Array<{
        hour: number;
        modules: ContentModule[];
        timeRange: string;
    }>;
    totalActivities: number;
    completedActivities?: number;
}

interface CourseViewerProps {
  courseId?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  backUrl?: string;
  title?: string;
  className?: string;
}

// Function to decode HTML entities
const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
};

// Get module styling based on type (exactly like Graduate Programme colors)
const getModuleStyle = (modname: string, name: string, index: number) => {
  const lowerName = name.toLowerCase();
  
  // Blue modules (Some technical experience required)
  if (lowerName.includes('python') || lowerName.includes('programming') || lowerName.includes('introduction') || 
      lowerName.includes('data') || lowerName.includes('preprocessing') || modname === 'resource') {
    return {
      bgColor: 'bg-blue-500',
      textColor: 'text-white',
      icon: <Laptop className="w-6 h-6" />,
      experience: 'Some technical experience required'
    };
  }
  
  // Yellow modules (Good technical experience required)
  if (lowerName.includes('ml') || lowerName.includes('machine learning') || lowerName.includes('supervised') || 
      lowerName.includes('unsupervised') || lowerName.includes('ai') || lowerName.includes('advanced') ||
      modname === 'quiz' || modname === 'assign') {
    return {
      bgColor: 'bg-yellow-500',
      textColor: 'text-white',
      icon: <Network className="w-6 h-6" />,
      experience: 'Good technical experience required'
    };
  }
  
  // Teal modules (No technical experience required)
  if (lowerName.includes('storytelling') || lowerName.includes('workshop') || lowerName.includes('discussion') ||
      modname === 'forum') {
    return {
      bgColor: 'bg-teal-500',
      textColor: 'text-white',
      icon: <LightbulbIcon className="w-6 h-6" />,
      experience: 'No technical experience required'
    };
  }
  
  // Grey modules (Skills Adoption and Workshops)
  if (lowerName.includes('project') || lowerName.includes('designing') || lowerName.includes('delivering') ||
      lowerName.includes('group') || lowerName.includes('mentor') || modname === 'workshop') {
    return {
      bgColor: 'bg-gray-500',
      textColor: 'text-white',
      icon: <LightbulbIcon className="w-6 h-6" />,
      experience: 'Skills Adoption and Workshops'
    };
  }
  
  // Default blue
  return {
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    icon: <Activity className="w-6 h-6" />,
    experience: 'Some technical experience required'
  };
};

// Get IOMAD activity logo based on modname - Real IOMAD/Moodle API Integration
const getIOMADActivityLogo = (modname: string) => {
  // Real IOMAD/Moodle activity icons - these match the actual Moodle activity icons
  const activityLogos = {
    'assign': '/api/moodle/activity_icons/assign.png',
    'attendance': '/api/moodle/activity_icons/attendance.png',
    'book': '/api/moodle/activity_icons/book.png',
    'choice': '/api/moodle/activity_icons/choice.png',
    'data': '/api/moodle/activity_icons/data.png',
    'facetoface': '/api/moodle/activity_icons/facetoface.png',
    'feedback': '/api/moodle/activity_icons/feedback.png',
    'file': '/api/moodle/activity_icons/file.png',
    'folder': '/api/moodle/activity_icons/folder.png',
    'forum': '/api/moodle/activity_icons/forum.png',
    'glossary': '/api/moodle/activity_icons/glossary.png',
    'h5p': '/api/moodle/activity_icons/h5p.png',
    'imscp': '/api/moodle/activity_icons/imscp.png',
    'iomadcertificate': '/api/moodle/activity_icons/iomadcertificate.png',
    'lesson': '/api/moodle/activity_icons/lesson.png',
    'page': '/api/moodle/activity_icons/page.png',
    'quiz': '/api/moodle/activity_icons/quiz.png',
    'scorm': '/api/moodle/activity_icons/scorm.png',
    'label': '/api/moodle/activity_icons/label.png',
    'trainingevent': '/api/moodle/activity_icons/trainingevent.png',
    'url': '/api/moodle/activity_icons/url.png',
    'wiki': '/api/moodle/activity_icons/wiki.png',
    'workshop': '/api/moodle/activity_icons/workshop.png',
    'zoom': '/api/moodle/activity_icons/zoom.png',
    'resource': '/api/moodle/activity_icons/resource.png',
    'default': '/api/moodle/activity_icons/default.png'
  };

  return activityLogos[modname as keyof typeof activityLogos] || activityLogos.default;
};

// Fetch IOMAD activity logo with authentication token
const fetchIOMADActivityLogo = async (modname: string, authToken: string) => {
  try {
    const logoPath = getIOMADActivityLogo(modname);
    const response = await axios.get(logoPath, { 
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    return { url, error: false };
  } catch (error) {
    console.log('Could not fetch IOMAD logo, using fallback');
    return { url: '', error: true };
  }
};

// Group modules by day (sections) and create hourly structure
const organizeModulesByDay = (sections: CourseSection[]): DayData[] => {
  const days: DayData[] = [];
  
  sections.forEach((section, sectionIndex) => {
    const dayNumber = sectionIndex + 1;
    const dayName = `Day ${dayNumber}`;
    
    // Group modules by hour (every 2-3 modules per hour)
    const hourlyActivities = [];
    const modulesPerHour = Math.ceil(section.modules.length / 8); // 8 hours per day
    
    for (let hour = 0; hour < 8; hour++) {
      const startIndex = hour * modulesPerHour;
      const endIndex = Math.min(startIndex + modulesPerHour, section.modules.length);
      const hourModules = section.modules.slice(startIndex, endIndex);
      
      if (hourModules.length > 0) {
        hourlyActivities.push({
          hour: hour + 9, // Start from 9 AM
          modules: hourModules,
          timeRange: `${hour + 9}:00 - ${hour + 10}:00`
        });
      }
    }
    
    days.push({
      dayNumber,
      dayName,
      section: section,
      hourlyActivities,
      totalActivities: section.modules.length
    });
  });
  
  return days;
};

// Day Selection Card Component
const DaySelectionCard: React.FC<{ day: DayData; isSelected: boolean; onClick: () => void }> = ({ day, isSelected, onClick }) => {
    return (
        <div 
            className={`relative cursor-pointer transition-all duration-300 ${
                isSelected 
                    ? 'bg-blue-600 text-white shadow-lg scale-105' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700'
            } rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        isSelected ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                        {day.dayNumber}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{day.dayName}</h3>
                        <p className={`text-sm ${isSelected ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                            {day.totalActivities} activities • 8 hours
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                        {Math.round((day.completedActivities || 0) / day.totalActivities * 100)}%
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        Complete
                    </div>
                </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(day.completedActivities || 0) / day.totalActivities * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

// Graduate Programme Module Card Component (Classic Map Pin Style - Connected to Road)
const GraduateModuleCard: React.FC<{ module: ContentModule; index: number; position: 'above' | 'below' | 'center' | 'top' | 'middle' | 'bottom' }> = ({ module, index, position }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string>('');
    const [logoError, setLogoError] = useState(false);
    const [showContentModal, setShowContentModal] = useState(false);
    
    const moduleStyle = getModuleStyle(module.modname, module.name, index);
    const decodedName = decodeHtmlEntities(module.name);
    const contentHtml = module.pagecontent || module.renderedContent;
    const sanitizedHtml = contentHtml ? DOMPurify.sanitize(contentHtml) : '';

    // Fetch IOMAD activity logo with authentication token
    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const authToken = localStorage.getItem('iomad_token') || sessionStorage.getItem('iomad_token');
                
                if (!authToken) {
                    console.log('No IOMAD authentication token found, using fallback');
                    setLogoError(true);
                    return;
                }

                const result = await fetchIOMADActivityLogo(module.modname, authToken);
                if (!result.error) {
                    setLogoUrl(result.url);
                    setLogoError(false);
                } else {
                    setLogoError(true);
                }
            } catch (error) {
                console.log('Could not fetch IOMAD logo, using fallback');
                setLogoError(true);
            }
        };

        fetchLogo();
    }, [module.modname]);

    return (
        <>
            <div className="relative group w-full max-w-xs mx-auto">
                {/* Classic Map Pin Icon (connected to road at bottom) */}
                <div className="relative flex justify-center">
                    {/* Map Pin Shape */}
                    <div className="relative w-16 h-20">
                        {/* Map Pin Body - Classic rounded top, tapering to point */}
                        <div className={`absolute inset-0 ${moduleStyle.bgColor} rounded-t-full shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200`} 
                             style={{
                                 clipPath: 'polygon(50% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%, 0% 0%)'
                             }}
                             onClick={() => setShowContentModal(true)}>
                        </div>
                        
                        {/* Inner White Circle with Real IOMAD Logo */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-inner flex items-center justify-center border border-gray-200">
                            {logoError || !logoUrl ? (
                                <div className="text-gray-600">
                                    {moduleStyle.icon}
                                </div>
                            ) : (
                                <img 
                                    src={logoUrl} 
                                    alt={`${module.modname} activity`}
                                    className="w-8 h-8 object-contain"
                                    onError={() => setLogoError(true)}
                                />
                            )}
                        </div>
                        
                        {/* Road connection point at bottom of map pin */}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                </div>
                
                {/* Activity Title/Heading (always visible) */}
                <div className="mt-2 text-center">
                    <div className="text-xs font-semibold text-gray-800 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm border border-gray-200 dark:border-gray-700 max-w-[120px] line-clamp-2">
                        {decodedName}
                    </div>
                </div>
                
                {/* Quick Info Tooltip (appears on hover) */}
                <div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700 min-w-[200px] max-w-[250px] opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                >
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white text-center mb-2 line-clamp-2">
                        {decodedName}
                    </h3>
                    
                    <div className="text-xs text-center text-gray-600 dark:text-gray-400 mb-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {module.modname.charAt(0).toUpperCase() + module.modname.slice(1)} Activity
                    </div>
                    
                    <div className="text-xs text-center text-blue-600 dark:text-blue-400 font-medium">
                        Click to view content
                    </div>
                </div>
            </div>

            {/* Full Content Modal */}
            {showContentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${moduleStyle.bgColor} rounded-full flex items-center justify-center text-white`}>
                                    {logoError || !logoUrl ? (
                                        <div className="text-white">
                                            {moduleStyle.icon}
                                        </div>
                                    ) : (
                                        <img 
                                            src={logoUrl} 
                                            alt={`${module.modname} activity`}
                                            className="w-8 h-8 object-contain"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                        {decodedName}
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {module.modname.charAt(0).toUpperCase() + module.modname.slice(1)} Activity
                                    </p>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => setShowContentModal(false)}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                {sanitizedHtml && (
                                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Activity Instructions</h3>
                                        <div 
                                            className="text-gray-700 dark:text-gray-300"
                                            dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
                                        />
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {/* Activity Type Specific Content */}
                                    {module.modname === 'assign' && (
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                                                <FileText className="w-5 h-5" />
                                                Assignment Details
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Due Date: {module.description || 'Not specified'}</span>
                                                </div>
                                                <div className="mt-4">
                                                    <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                        <Upload className="w-4 h-4" />
                                                        Submit Assignment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {module.modname === 'quiz' && (
                                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2">
                                                <CheckSquare className="w-5 h-5" />
                                                Quiz Information
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Time Limit: {module.description || 'No time limit'}</span>
                                                </div>
                                                <div className="mt-4">
                                                    <button className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                        <Play className="w-4 h-4" />
                                                        Start Quiz
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {module.modname === 'forum' && (
                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                                                <MessageSquare className="w-5 h-5" />
                                                Discussion Forum
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                                                    <Users className="w-4 h-4" />
                                                    <span>Participants: {module.description || 'All students'}</span>
                                                </div>
                                                <div className="mt-4">
                                                    <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                        <MessageSquare className="w-4 h-4" />
                                                        Join Discussion
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {(module.modname === 'resource' || module.modname === 'file') && (
                                        <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                                            <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-200 mb-3 flex items-center gap-2">
                                                <FileText className="w-5 h-5" />
                                                Resource Material
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300">
                                                    <FileText className="w-4 h-4" />
                                                    <span>Type: {module.fileName || 'Document'}</span>
                                                </div>
                                                <div className="mt-4">
                                                    <button className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                        <Download className="w-4 h-4" />
                                                        Download Resource
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {module.modname === 'url' && module.mainUrl && (
                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
                                                <LinkIcon className="w-5 h-5" />
                                                External Resource
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                                                    <Globe className="w-4 h-4" />
                                                    <span>URL: {module.mainUrl}</span>
                                                </div>
                                                <div className="mt-4">
                                                    <a 
                                                        href={module.mainUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                    >
                                                        <ArrowUpRight className="w-4 h-4" />
                                                        Open External Link
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!['assign', 'quiz', 'forum', 'resource', 'file', 'url'].includes(module.modname) && (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                                {moduleStyle.icon}
                                                {module.modname.charAt(0).toUpperCase() + module.modname.slice(1)} Activity
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {module.description || 'Activity content available'}
                                                </div>
                                                <div className="mt-4">
                                                    <button className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                        <Play className="w-4 h-4" />
                                                        Start Activity
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Activity Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setIsCompleted(!isCompleted)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                                isCompleted 
                                                    ? 'bg-green-600 text-white' 
                                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                            }`}
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            {isCompleted ? 'Completed' : 'Mark as Complete'}
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <button className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                            <Bookmark className="w-4 h-4" />
                                            Save Progress
                                        </button>
                                        <button className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                            <Share2 className="w-4 h-4" />
                                            Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Graduate Programme Timeline Flowchart Component (Road Connected to Map Pin Bottoms)
const GraduateTimelineFlowchart: React.FC<{ day: DayData }> = ({ day }) => {
    const allModules = day.hourlyActivities.flatMap(hour => hour.modules);
    const activitiesPerRow = 6; // 6 activities per row
    const totalRows = Math.ceil(allModules.length / activitiesPerRow);
    const rowHeight = 16; // Height for each row

    return (
        <div className="relative w-full max-w-7xl mx-auto">
            {/* Day Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{day.dayName} Learning Pathway</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">Road Connected Timeline</p>
            </div>

            {/* Road Connected Timeline */}
            <div className="relative" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                {/* Main Timeline Path */}
                <div className="relative">
                    {/* Generate multiple rows with curves */}
                    {Array.from({ length: totalRows }, (_, rowIndex) => {
                        const isEvenRow = rowIndex % 2 === 0;
                        const topPosition = rowIndex * rowHeight;
                        
                        return (
                            <div key={rowIndex}>
                                {/* Horizontal Row */}
                                <div 
                                    className="absolute h-2 bg-gray-400"
                                    style={{ 
                                        top: `${topPosition}rem`,
                                        left: '0',
                                        right: '0'
                                    }}
                                ></div>
                                
                                {/* Right Curve (for even rows) */}
                                {isEvenRow && rowIndex < totalRows - 1 && (
                                    <div 
                                        className="absolute w-16 h-16 border-r-2 border-b-2 border-gray-400 rounded-br-full transform translate-x-8"
                                        style={{ top: `${topPosition}rem`, right: '0' }}
                                    ></div>
                                )}
                                
                                {/* Left Curve (for odd rows) */}
                                {!isEvenRow && rowIndex < totalRows - 1 && (
                                    <div 
                                        className="absolute w-16 h-16 border-l-2 border-b-2 border-gray-400 rounded-bl-full transform -translate-x-8"
                                        style={{ top: `${topPosition}rem`, left: '0' }}
                                    ></div>
                                )}
                                
                                {/* Vertical Connection (for odd rows) */}
                                {!isEvenRow && rowIndex < totalRows - 1 && (
                                    <div 
                                        className="absolute w-2 bg-gray-400 transform translate-x-1/2"
                                        style={{ 
                                            top: `${topPosition}rem`,
                                            left: '0',
                                            height: `${rowHeight}rem`
                                        }}
                                    ></div>
                                )}
                                
                                {/* Vertical Connection (for even rows) */}
                                {isEvenRow && rowIndex < totalRows - 1 && (
                                    <div 
                                        className="absolute w-2 bg-gray-400 transform translate-x-1/2"
                                        style={{ 
                                            top: `${topPosition}rem`,
                                            right: '0',
                                            height: `${rowHeight}rem`
                                        }}
                                    ></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Start Point */}
                <div 
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ top: '0rem', left: '0' }}
                >
                    <div className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
                        Start
                    </div>
                </div>
                
                {/* End Point */}
                <div 
                    className="absolute transform translate-x-1/2 translate-y-1/2"
                    style={{ 
                        top: `${(totalRows - 1) * rowHeight}rem`, 
                        right: totalRows % 2 === 0 ? '0' : '0'
                    }}
                >
                    <div className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
                        Complete
                    </div>
                </div>

                {/* Map Pins positioned above the road */}
                <div className="relative">
                    {Array.from({ length: totalRows }, (_, rowIndex) => {
                        const startIndex = rowIndex * activitiesPerRow;
                        const endIndex = Math.min(startIndex + activitiesPerRow, allModules.length);
                        const rowModules = allModules.slice(startIndex, endIndex);
                        const topPosition = rowIndex * rowHeight;
                        
                        return (
                            <div 
                                key={rowIndex}
                                className="absolute left-0 right-0 flex justify-between items-center px-16"
                                style={{ top: `${topPosition - 2}rem` }} // Position pins above the road
                            >
                                {rowModules.map((module, index) => (
                                    <div key={module.id} className="flex-1 flex justify-center">
                                        <GraduateModuleCard 
                                            module={module} 
                                            index={startIndex + index} 
                                            position="center"
                                        />
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Day Timeline Flowchart Component (for specific day) - Updated to use Graduate style
const DayTimelineFlowchart: React.FC<{ day: DayData }> = ({ day }) => {
    return <GraduateTimelineFlowchart day={day} />;
};

// Main CourseViewer Component
const CourseViewer: React.FC<CourseViewerProps> = ({ 
  courseId: propCourseId, 
  onBack, 
  showBackButton = true, 
  backUrl, 
  title = "Learning Pathway",
  className = ""
}) => {
    const params = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const courseId = propCourseId || params.courseId;
    
    const [sections, setSections] = useState<CourseSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
    const [days, setDays] = useState<DayData[]>([]);

    useEffect(() => {
        if (!courseId) return;
        const fetchCourseData = async () => {
            setLoading(true);
            setError(null);
            try {
                const content = await getCourseContents(courseId);
                setSections(content);
                const organizedDays = organizeModulesByDay(content);
                setDays(organizedDays);
                // Don't auto-select first day - show day selection by default
                setSelectedDay(null);
            } catch (err: any) {
                setError(err.message || "Failed to load course content.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId]);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (backUrl) {
            navigate(backUrl);
        } else {
            navigate(-1);
        }
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading your learning pathway...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex justify-center items-center h-screen bg-red-50 dark:bg-red-900/20 ${className}`}>
                <div className="text-center">
                    <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">Error Loading Course</div>
                    <div className="text-red-500 dark:text-red-300">{error}</div>
                </div>
            </div>
        );
    }

    const totalActivities = sections.reduce((total, section) => total + section.modules.length, 0);
    const completedActivities = 0; // This would come from user progress tracking

    return (
        <div className={`bg-gray-50 dark:bg-gray-900 min-h-screen ${className}`}>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    {showBackButton && (
                        <button 
                            onClick={handleBack}
                            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
                        >
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Back
                        </button>
                    )}
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{title}</h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    {selectedDay ? `${selectedDay.dayName} Timeline` : 'Select a day to view the learning schedule'}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {Math.round((completedActivities / totalActivities) * 100)}%
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {completedActivities} of {totalActivities} modules completed
                                </div>
                            </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300" 
                                style={{ width: `${(completedActivities / totalActivities) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Day Selection - Show by default */}
                {!selectedDay && (
                    <div className="mb-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Course Learning Days</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Click on any day to view the detailed learning timeline
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {days.map((day) => (
                                <DaySelectionCard 
                                    key={day.dayNumber}
                                    day={day}
                                    isSelected={false}
                                    onClick={() => setSelectedDay(day)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Selected Day Timeline */}
                {selectedDay && (
                    <div>
                        {/* Back to Day Selection */}
                        <button 
                            onClick={() => setSelectedDay(null)}
                            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
                        >
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Back to Day Selection
                        </button>

                        {/* Day Timeline Flowchart */}
                        <DayTimelineFlowchart day={selectedDay} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseViewer; 