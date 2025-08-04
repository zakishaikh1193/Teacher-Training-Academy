import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseContents } from '../services/apiService';
import { activityService } from '../services/activityService';
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
  Laptop, Database as DatabaseIcon, Network, Lightbulb as LightbulbIcon,
  Save, Edit, Trash2, Eye as EyeIcon, Copy, ExternalLink, File, FolderOpen, Package
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

// Function to decode HTML entities
const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
};

// Get module styling based on activity type with different colors
const getModuleStyle = (modname: string, name: string, index: number) => {
  const lowerName = name.toLowerCase();
  
  // Different colors based on activity type
  switch (modname) {
    case 'assign':
      return {
        bgColor: 'bg-pink-500',
        textColor: 'text-white',
        icon: <FileCheck className="w-6 h-6" />,
        experience: 'Assignment Activity'
      };
    
    case 'quiz':
      return {
        bgColor: 'bg-purple-500',
        textColor: 'text-white',
        icon: <CheckSquare className="w-6 h-6" />,
        experience: 'Quiz Activity'
      };
    
    case 'forum':
      return {
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        icon: <MessageSquare className="w-6 h-6" />,
        experience: 'Forum Discussion'
      };
    
    case 'resource':
    case 'file':
      return {
        bgColor: 'bg-blue-500',
        textColor: 'text-white',
        icon: <FileText className="w-6 h-6" />,
        experience: 'Resource/File'
      };
    
    case 'url':
      return {
        bgColor: 'bg-indigo-500',
        textColor: 'text-white',
        icon: <LinkIcon className="w-6 h-6" />,
        experience: 'External Link'
      };
    
    case 'book':
      return {
        bgColor: 'bg-teal-500',
        textColor: 'text-white',
        icon: <BookOpen className="w-6 h-6" />,
        experience: 'Book Resource'
      };
    
    case 'workshop':
      return {
        bgColor: 'bg-orange-500',
        textColor: 'text-white',
        icon: <Users className="w-6 h-6" />,
        experience: 'Workshop Activity'
      };
    
    case 'glossary':
      return {
        bgColor: 'bg-yellow-500',
        textColor: 'text-white',
        icon: <Bookmark className="w-6 h-6" />,
        experience: 'Glossary'
      };
    
    case 'choice':
      return {
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        icon: <Target className="w-6 h-6" />,
        experience: 'Choice Activity'
      };
    
    case 'feedback':
      return {
        bgColor: 'bg-cyan-500',
        textColor: 'text-white',
        icon: <MessageCircle className="w-6 h-6" />,
        experience: 'Feedback Activity'
      };
    
    case 'h5p':
      return {
        bgColor: 'bg-emerald-500',
        textColor: 'text-white',
        icon: <Play className="w-6 h-6" />,
        experience: 'Interactive Content'
      };
    
    case 'lesson':
      return {
        bgColor: 'bg-amber-500',
        textColor: 'text-white',
        icon: <BookOpen className="w-6 h-6" />,
        experience: 'Lesson Activity'
      };
    
    case 'scorm':
      return {
        bgColor: 'bg-slate-500',
        textColor: 'text-white',
        icon: <Package className="w-6 h-6" />,
        experience: 'SCORM Package'
      };
    
    case 'wiki':
      return {
        bgColor: 'bg-lime-500',
        textColor: 'text-white',
        icon: <Globe className="w-6 h-6" />,
        experience: 'Wiki Activity'
      };
    
    case 'zoom':
      return {
        bgColor: 'bg-violet-500',
        textColor: 'text-white',
        icon: <Video className="w-6 h-6" />,
        experience: 'Zoom Meeting'
      };
    
    case 'attendance':
      return {
        bgColor: 'bg-rose-500',
        textColor: 'text-white',
        icon: <Calendar className="w-6 h-6" />,
        experience: 'Attendance'
      };
    
    case 'data':
      return {
        bgColor: 'bg-sky-500',
        textColor: 'text-white',
        icon: <Database className="w-6 h-6" />,
        experience: 'Database Activity'
      };
    
    case 'facetoface':
      return {
        bgColor: 'bg-fuchsia-500',
        textColor: 'text-white',
        icon: <Users className="w-6 h-6" />,
        experience: 'Face-to-Face'
      };
    
    case 'iomadcertificate':
      return {
        bgColor: 'bg-amber-600',
        textColor: 'text-white',
        icon: <Award className="w-6 h-6" />,
        experience: 'IOMAD Certificate'
      };
    
    case 'trainingevent':
      return {
        bgColor: 'bg-pink-600',
        textColor: 'text-white',
        icon: <CalendarDays className="w-6 h-6" />,
        experience: 'Training Event'
      };
    
    case 'label':
      return {
        bgColor: 'bg-yellow-500',
        textColor: 'text-white',
        icon: <Tag className="w-6 h-6" />,
        experience: 'Text/Media Area'
      };
    
    case 'page':
      return {
        bgColor: 'bg-blue-600',
        textColor: 'text-white',
        icon: <FileText className="w-6 h-6" />,
        experience: 'Page Resource'
      };
    
    case 'folder':
      return {
        bgColor: 'bg-orange-600',
        textColor: 'text-white',
        icon: <FolderOpen className="w-6 h-6" />,
        experience: 'Folder'
      };
    
    case 'imscp':
      return {
        bgColor: 'bg-brown-500',
        textColor: 'text-white',
        icon: <Package className="w-6 h-6" />,
        experience: 'IMS Content Package'
      };
    
    default:
      return {
        bgColor: 'bg-gray-500',
        textColor: 'text-white',
        icon: <Activity className="w-6 h-6" />,
        experience: 'Activity'
      };
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
    const [activityData, setActivityData] = useState<any>(null);
    const [activityLoading, setActivityLoading] = useState(false);
    const [activityError, setActivityError] = useState<string | null>(null);
    const [submissionData, setSubmissionData] = useState<any>({});
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [forumPost, setForumPost] = useState({ subject: '', message: '' });
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [textResponse, setTextResponse] = useState('');
    
    const moduleStyle = getModuleStyle(module.modname, module.name, index);
    const decodedName = decodeHtmlEntities(module.name);
    const contentHtml = module.pagecontent || module.renderedContent;
    const sanitizedHtml = contentHtml ? DOMPurify.sanitize(contentHtml) : '';

    // Fetch IOMAD activity logo with authentication token
    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const iconUrl = await activityService.getActivityIcon(module.modname);
                if (iconUrl) {
                    setLogoUrl(iconUrl);
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

    // Fetch activity data when modal opens
    const handleOpenModal = async () => {
        setShowContentModal(true);
        setActivityLoading(true);
        setActivityError(null);
        
        try {
            const data = await activityService.getActivityDetails(module.id.toString(), module.modname);
            setActivityData(data);
        } catch (error) {
            setActivityError('Failed to load activity data');
            console.error('Error fetching activity data:', error);
                } finally {
            setActivityLoading(false);
        }
    };

    // Assignment submission handler
    const handleAssignmentSubmit = async () => {
        try {
            const userId = localStorage.getItem('user_id') || '1'; // Get actual user ID
            const success = await activityService.submitAssignment(
                module.id.toString(), 
                userId, 
                { 
                    text: textResponse, 
                    files: uploadedFiles 
                }
            );
            
            if (success) {
                alert('Assignment submitted successfully!');
                setShowContentModal(false);
            } else {
                alert('Failed to submit assignment. Please try again.');
            }
        } catch (error) {
            alert('Error submitting assignment: ' + error);
        }
    };

    // Quiz attempt handler
    const handleQuizSubmit = async () => {
        try {
            const userId = localStorage.getItem('user_id') || '1';
            const attempt = await activityService.startQuizAttempt(module.id.toString(), userId);
            
            if (attempt) {
                const answers = Object.entries(quizAnswers).map(([name, value]) => ({ name, value }));
                const success = await activityService.submitQuizAttempt(attempt.id, answers);
                
                if (success) {
                    alert('Quiz submitted successfully!');
                    setShowContentModal(false);
                } else {
                    alert('Failed to submit quiz. Please try again.');
                }
            }
        } catch (error) {
            alert('Error submitting quiz: ' + error);
        }
    };

    // Resource download handler
    const handleResourceDownload = async () => {
        try {
            const blob = await activityService.downloadResource(module.id.toString());
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = module.name || 'resource';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            alert('Error downloading resource: ' + error);
        }
    };

    // Forum post handler
    const handleForumPost = async () => {
        try {
            const userId = localStorage.getItem('user_id') || '1';
            const success = await activityService.createForumPost(
                module.id.toString(), 
                userId, 
                forumPost.subject, 
                forumPost.message
            );
            
            if (success) {
                alert('Forum post created successfully!');
                setForumPost({ subject: '', message: '' });
            } else {
                alert('Failed to create forum post. Please try again.');
            }
        } catch (error) {
            alert('Error creating forum post: ' + error);
        }
    };

    // Workshop registration handler
    const handleWorkshopRegistration = async () => {
        try {
            const userId = localStorage.getItem('user_id') || '1';
            const success = await activityService.registerForWorkshop(module.id.toString(), userId);
            
            if (success) {
                alert('Successfully registered for workshop!');
                setShowContentModal(false);
            } else {
                alert('Failed to register for workshop. Please try again.');
            }
        } catch (error) {
            alert('Error registering for workshop: ' + error);
        }
    };

    // File upload handler
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setUploadedFiles(prev => [...prev, ...files]);
    };

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
                             onClick={handleOpenModal}>
                        </div>
                        
                        {/* Inner White Circle with Real IOMAD Logo */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-inner flex items-center justify-center border border-gray-200">
                            {logoError || !logoUrl ? (
                                // Fallback to icon if logo fetch fails
                                <div className="text-gray-600">
                                    {moduleStyle.icon}
                                </div>
                            ) : (
                                // Real IOMAD activity logo from API
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
                    {/* Module Title */}
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white text-center mb-2 line-clamp-2">
                        {decodedName}
                    </h3>
                    
                    {/* Activity Type */}
                    <div className="text-xs text-center text-gray-600 dark:text-gray-400 mb-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {module.modname.charAt(0).toUpperCase() + module.modname.slice(1)} Activity
                    </div>
                    
                    {/* Click to View Message */}
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
                                {/* Activity Icon */}
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
                            
                                                         {/* Action Buttons */}
                             <div className="flex items-center gap-2">
                                 {/* Fullscreen Button */}
                                 <button
                                     onClick={() => {
                                         if (document.fullscreenElement) {
                                             document.exitFullscreen();
                                         } else {
                                             document.documentElement.requestFullscreen();
                                         }
                                     }}
                                     className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                     title="Toggle Fullscreen"
                                 >
                                     <Maximize className="w-5 h-5" />
                                 </button>
                                 
                                 {/* Close Button */}
                                 <button
                                     onClick={() => setShowContentModal(false)}
                                     className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                 >
                                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                     </svg>
                                 </button>
                             </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                            {/* Loading State */}
                            {activityLoading && (
                                <div className="flex justify-center items-center py-12">
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">Loading activity content...</p>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {activityError && (
                                <div className="flex justify-center items-center py-12">
                                    <div className="text-center">
                                        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
                                        <p className="text-red-600 dark:text-red-400 font-medium mb-2">Error Loading Activity</p>
                                        <p className="text-gray-600 dark:text-gray-400">{activityError}</p>
                                    </div>
                                </div>
                            )}

                            {/* Activity Content */}
                            {!activityLoading && !activityError && (
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                {/* Activity Description/Instructions */}
                                {sanitizedHtml && (
                                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Activity Instructions</h3>
                                        <div 
                                            className="text-gray-700 dark:text-gray-300"
                                            dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
                                        />
                                    </div>
                                )}

                                {/* Activity Type Specific Content */}
                                <div className="space-y-6">
                                                                         {/* Assignment Content */}
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
                                                 <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                                                     <Target className="w-4 h-4" />
                                                     <span>Points: {module.description || 'Not specified'}</span>
                                                 </div>
                                                 <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                                                     <FileText className="w-4 h-4" />
                                                     <span>Status: <span className="font-semibold text-orange-600">Pending Submission</span></span>
                                                 </div>
                                                 <div className="mt-4 space-y-3">
                                                     {/* Assignment Instructions */}
                                                     <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                                         <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Instructions:</h4>
                                                         <p className="text-sm text-gray-700 dark:text-gray-300">
                                                             Please complete the assignment and submit your work. You can upload files or provide text responses.
                                                         </p>
                                                     </div>
                                                     
                                                     {/* File Upload Area */}
                                                     <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg p-4 text-center">
                                                         <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                                         <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                             Drop files here or click to upload
                                                         </p>
                                                         <input 
                                                             type="file" 
                                                             multiple 
                                                             className="hidden" 
                                                             id={`file-upload-${module.id}`}
                                                             accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                                                             onChange={handleFileUpload}
                                                         />
                                                         <label 
                                                             htmlFor={`file-upload-${module.id}`}
                                                             className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                                                         >
                                                             <Upload className="w-4 h-4" />
                                                             Choose Files
                                                         </label>
                                                         
                                                         {/* Show uploaded files */}
                                                         {uploadedFiles.length > 0 && (
                                                             <div className="mt-3">
                                                                 <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Uploaded Files:</p>
                                                                 <div className="space-y-1">
                                                                     {uploadedFiles.map((file, index) => (
                                                                         <div key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                                             <File className="w-4 h-4" />
                                                                             <span>{file.name}</span>
                                                                             <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                                                         </div>
                                                                     ))}
                                                                 </div>
                                                             </div>
                                                         )}
                                                     </div>
                                                     
                                                     {/* Text Response Area */}
                                                     <div>
                                                         <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                                                             Text Response (Optional):
                                                         </label>
                                                         <textarea 
                                                             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                             rows={4}
                                                             placeholder="Enter your response here..."
                                                             value={textResponse}
                                                             onChange={(e) => setTextResponse(e.target.value)}
                                                         ></textarea>
                                                     </div>
                                                     
                                                     <div className="flex gap-3">
                                                         <button 
                                                             onClick={handleAssignmentSubmit}
                                                             className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                         >
                                                             <Upload className="w-4 h-4" />
                                                             Submit Assignment
                                                         </button>
                                                         <button className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                             <Save className="w-4 h-4" />
                                                             Save Draft
                                                         </button>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     )}

                                                                         {/* Quiz Content */}
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
                                                 <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                                                     <Target className="w-4 h-4" />
                                                     <span>Questions: {module.description || 'Multiple choice'}</span>
                                                 </div>
                                                 <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                                                     <Award className="w-4 h-4" />
                                                     <span>Passing Grade: {module.description || '70%'}</span>
                                                 </div>
                                                 <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                                                     <CheckSquare className="w-4 h-4" />
                                                     <span>Status: <span className="font-semibold text-orange-600">Not Attempted</span></span>
                                                 </div>
                                                 
                                                 {/* Sample Quiz Questions */}
                                                 <div className="mt-4 space-y-4">
                                                     <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                                         <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">Sample Questions:</h4>
                                                         
                                                         {/* Question 1 */}
                                                         <div className="mb-4">
                                                             <p className="text-sm font-medium text-gray-800 dark:text-white mb-2">
                                                                 1. What is the primary purpose of machine learning?
                                                             </p>
                                                             <div className="space-y-2">
                                                                 <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                     <input 
                                                                         type="radio" 
                                                                         name="q1" 
                                                                         value="A"
                                                                         onChange={(e) => setQuizAnswers(prev => ({ ...prev, q1: e.target.value }))}
                                                                         className="text-yellow-600" 
                                                                     />
                                                                     A) To replace human intelligence
                                                                 </label>
                                                                 <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                     <input 
                                                                         type="radio" 
                                                                         name="q1" 
                                                                         value="B"
                                                                         onChange={(e) => setQuizAnswers(prev => ({ ...prev, q1: e.target.value }))}
                                                                         className="text-yellow-600" 
                                                                     />
                                                                     B) To enable computers to learn from data
                                                                 </label>
                                                                 <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                     <input 
                                                                         type="radio" 
                                                                         name="q1" 
                                                                         value="C"
                                                                         onChange={(e) => setQuizAnswers(prev => ({ ...prev, q1: e.target.value }))}
                                                                         className="text-yellow-600" 
                                                                     />
                                                                     C) To automate all human tasks
                                                                 </label>
                                                                 <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                     <input 
                                                                         type="radio" 
                                                                         name="q1" 
                                                                         value="D"
                                                                         onChange={(e) => setQuizAnswers(prev => ({ ...prev, q1: e.target.value }))}
                                                                         className="text-yellow-600" 
                                                                     />
                                                                     D) To create artificial humans
                                                                 </label>
                                                             </div>
                                                         </div>
                                                         
                                                         {/* Question 2 */}
                                                         <div className="mb-4">
                                                             <p className="text-sm font-medium text-gray-800 dark:text-white mb-2">
                                                                 2. Which of the following are types of machine learning? (Select all that apply)
                                                             </p>
                                                             <div className="space-y-2">
                                                                 <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                     <input type="checkbox" className="text-yellow-600" />
                                                                     Supervised Learning
                                                                 </label>
                                                                 <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                     <input type="checkbox" className="text-yellow-600" />
                                                                     Unsupervised Learning
                                                                 </label>
                                                                 <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                     <input type="checkbox" className="text-yellow-600" />
                                                                     Reinforcement Learning
                                                                 </label>
                                                                 <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                                     <input type="checkbox" className="text-yellow-600" />
                                                                     Deep Learning
                                                                 </label>
                                                             </div>
                                                         </div>
                                                     </div>
                                                     
                                                     <div className="flex gap-3">
                                                         <button 
                                                             onClick={handleQuizSubmit}
                                                             className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                         >
                                                             <Play className="w-4 h-4" />
                                                             Start Quiz
                                                         </button>
                                                         <button className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                             <Save className="w-4 h-4" />
                                                             Save Progress
                                                         </button>
                                                         <button 
                                                             onClick={handleQuizSubmit}
                                                             className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                         >
                                                             <CheckSquare className="w-4 h-4" />
                                                             Submit Quiz
                                                         </button>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     )}

                                                                         {/* Forum Content */}
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
                                                 <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                                                     <MessageCircle className="w-4 h-4" />
                                                     <span>Topics: {module.description || 'Open discussion'}</span>
                                                 </div>
                                                 <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                                                     <MessageSquare className="w-4 h-4" />
                                                     <span>Status: <span className="font-semibold text-green-600">Active</span></span>
                                                 </div>
                                                 
                                                 {/* Forum Discussion Threads */}
                                                 <div className="mt-4 space-y-4">
                                                     <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                                         <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">Recent Discussions:</h4>
                                                         
                                                         {/* Thread 1 */}
                                                         <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                                             <div className="flex items-center justify-between">
                                                                 <div>
                                                                     <h5 className="font-medium text-gray-800 dark:text-white text-sm">
                                                                         "Understanding Machine Learning Basics"
                                                                     </h5>
                                                                     <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                         Started by John Doe • 2 hours ago • 5 replies
                                                                     </p>
                                                                 </div>
                                                                 <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                                                             </div>
                                                         </div>
                                                         
                                                         {/* Thread 2 */}
                                                         <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                                             <div className="flex items-center justify-between">
                                                                 <div>
                                                                     <h5 className="font-medium text-gray-800 dark:text-white text-sm">
                                                                         "Python Programming Questions"
                                                                     </h5>
                                                                     <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                         Started by Jane Smith • 1 day ago • 12 replies
                                                                     </p>
                                                                 </div>
                                                                 <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Popular</span>
                                                             </div>
                                                         </div>
                                                     </div>
                                                     
                                                     {/* New Post Form */}
                                                     <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                                         <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Start a New Discussion:</h4>
                                                         <input 
                                                             type="text" 
                                                             placeholder="Discussion title..."
                                                             value={forumPost.subject}
                                                             onChange={(e) => setForumPost(prev => ({ ...prev, subject: e.target.value }))}
                                                             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                         />
                                                         <textarea 
                                                             placeholder="Your message..."
                                                             rows={3}
                                                             value={forumPost.message}
                                                             onChange={(e) => setForumPost(prev => ({ ...prev, message: e.target.value }))}
                                                             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                         ></textarea>
                                                     </div>
                                                     
                                                     <div className="flex gap-3">
                                                         <button 
                                                             onClick={handleForumPost}
                                                             className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                         >
                                                             <MessageSquare className="w-4 h-4" />
                                                             Post Discussion
                                                         </button>
                                                         <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                             <MessageCircle className="w-4 h-4" />
                                                             View All Threads
                                                         </button>
                                                         <button className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                             <Users className="w-4 h-4" />
                                                             View Participants
                                                         </button>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     )}

                                                                         {/* Resource/File Content */}
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
                                                 <div className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300">
                                                     <Download className="w-4 h-4" />
                                                     <span>Size: {module.description || 'Available for download'}</span>
                                                 </div>
                                                 <div className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300">
                                                     <EyeIcon className="w-4 h-4" />
                                                     <span>Status: <span className="font-semibold text-green-600">Available</span></span>
                                                 </div>
                                                 
                                                 {/* File Preview */}
                                                 <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                                     <div className="flex items-center gap-3">
                                                         <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                                                             <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                                         </div>
                <div className="flex-1">
                                                             <h4 className="font-medium text-gray-800 dark:text-white">
                                                                 {module.fileName || 'Course Material'}
                                                             </h4>
                                                             <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                 PDF Document • 2.5 MB
                                                             </p>
                                                         </div>
                                                     </div>
                                                 </div>
                                                 
                                                 <div className="flex gap-3">
                                                     <button 
                                                         onClick={handleResourceDownload}
                                                         className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                     >
                                                         <Download className="w-4 h-4" />
                                                         Download Resource
                                                     </button>
                                                     <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                         <EyeIcon className="w-4 h-4" />
                                                         Preview
                                                     </button>
                                                     <button className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                         <Copy className="w-4 h-4" />
                                                         Copy Link
                                                     </button>
                                                 </div>
                                             </div>
                        </div>
                    )}

                                                                         {/* URL/Link Content */}
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
                                                 <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                                                     <ExternalLink className="w-4 h-4" />
                                                     <span>Status: <span className="font-semibold text-green-600">Available</span></span>
            </div>
                                                 
                                                 {/* Link Preview */}
                                                 <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                                     <div className="flex items-center gap-3">
                                                         <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                                             <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
                                                         <div className="flex-1">
                                                             <h4 className="font-medium text-gray-800 dark:text-white">
                                                                 External Learning Resource
                                                             </h4>
                                                             <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                                                                 {module.mainUrl}
                                                             </p>
                                                         </div>
                                                     </div>
                                                 </div>
                                                 
                                                 <div className="flex gap-3">
                                                     <a 
                                                         href={module.mainUrl} 
                                                         target="_blank" 
                                                         rel="noopener noreferrer" 
                                                         className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                     >
                                                         <ArrowUpRight className="w-4 h-4" />
                                                         Open External Link
                                                     </a>
                                                     <button 
                                                         className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                         onClick={() => {
                                                             navigator.clipboard.writeText(module.mainUrl || '');
                                                             // You could add a toast notification here
                                                         }}
                                                     >
                                                         <Copy className="w-4 h-4" />
                                                         Copy Link
                                                     </button>
                                                     <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                         <Bookmark className="w-4 h-4" />
                                                         Bookmark
                                                     </button>
                                                 </div>
                                             </div>
                                         </div>
                                     )}

                                                                         {/* Book Content */}
                                     {module.modname === 'book' && (
                                         <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                             <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3 flex items-center gap-2">
                                                 <BookOpen className="w-5 h-5" />
                                                 Book Content
                                             </h3>
                                             <div className="space-y-3">
                                                 <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                                                     <Bookmark className="w-4 h-4" />
                                                     <span>Chapters: {module.description || 'Multiple chapters'}</span>
                                                 </div>
                                                 <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                                                     <BookOpen className="w-4 h-4" />
                                                     <span>Status: <span className="font-semibold text-green-600">Available</span></span>
                                                 </div>
                                                 
                                                 {/* Book Chapters */}
                                                 <div className="mt-4 space-y-3">
                                                     <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                                         <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">Book Chapters:</h4>
                                                         
                                                         {/* Chapter 1 */}
                                                         <div className="mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                                             <div className="flex items-center justify-between">
                                                                 <div className="flex items-center gap-2">
                                                                     <BookOpen className="w-4 h-4 text-orange-600" />
                                                                     <span className="text-sm font-medium text-gray-800 dark:text-white">Chapter 1: Introduction</span>
                                                                 </div>
                                                                 <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>
                                                             </div>
                                                         </div>
                                                         
                                                         {/* Chapter 2 */}
                                                         <div className="mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                                             <div className="flex items-center justify-between">
                                                                 <div className="flex items-center gap-2">
                                                                     <BookOpen className="w-4 h-4 text-orange-600" />
                                                                     <span className="text-sm font-medium text-gray-800 dark:text-white">Chapter 2: Fundamentals</span>
                                                                 </div>
                                                                 <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">In Progress</span>
                                                             </div>
                                                         </div>
                                                         
                                                         {/* Chapter 3 */}
                                                         <div className="mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                                             <div className="flex items-center justify-between">
                                                                 <div className="flex items-center gap-2">
                                                                     <BookOpen className="w-4 h-4 text-gray-400" />
                                                                     <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Chapter 3: Advanced Topics</span>
                                                                 </div>
                                                                 <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Locked</span>
                                                             </div>
                                                         </div>
                                                     </div>
                                                     
                                                     {/* Reading Progress */}
                                                     <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                                         <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Reading Progress:</h4>
                                                         <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                                             <div className="bg-orange-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                                                         </div>
                                                         <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">45% Complete (2 of 3 chapters)</p>
                                                     </div>
                                                     
                                                     <div className="flex gap-3">
                                                         <button className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                             <BookOpen className="w-4 h-4" />
                                                             Continue Reading
                                                         </button>
                                                         <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                             <Bookmark className="w-4 h-4" />
                                                             Add Bookmark
                                                         </button>
                                                         <button className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                             <Download className="w-4 h-4" />
                                                             Download PDF
                                                         </button>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     )}

                                                                         {/* Workshop Content */}
                                     {module.modname === 'workshop' && (
                                         <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                                             <h3 className="text-lg font-semibold text-pink-800 dark:text-pink-200 mb-3 flex items-center gap-2">
                                                 <Users className="w-5 h-5" />
                                                 Workshop Session
                                             </h3>
                                             <div className="space-y-3">
                                                 <div className="flex items-center gap-2 text-sm text-pink-700 dark:text-pink-300">
                                                     <Calendar className="w-4 h-4" />
                                                     <span>Schedule: {module.description || 'Interactive session'}</span>
                                                 </div>
                                                 <div className="flex items-center gap-2 text-sm text-pink-700 dark:text-pink-300">
                                                     <Users className="w-4 h-4" />
                                                     <span>Group Activity: {module.description || 'Collaborative learning'}</span>
                                                 </div>
                                                 <div className="flex items-center gap-2 text-sm text-pink-700 dark:text-pink-300">
                                                     <Users className="w-4 h-4" />
                                                     <span>Status: <span className="font-semibold text-green-600">Registration Open</span></span>
                                                 </div>
                                                 
                                                 {/* Workshop Details */}
                                                 <div className="mt-4 space-y-3">
                                                     <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                                         <h4 className="font-semibold text-pink-800 dark:text-pink-200 mb-3">Workshop Details:</h4>
                                                         
                                                         <div className="space-y-2">
                                                             <div className="flex items-center gap-2 text-sm">
                                                                 <Clock className="w-4 h-4 text-pink-600" />
                                                                 <span className="text-gray-700 dark:text-gray-300">Duration: 2 hours</span>
                                                             </div>
                                                             <div className="flex items-center gap-2 text-sm">
                                                                 <Users className="w-4 h-4 text-pink-600" />
                                                                 <span className="text-gray-700 dark:text-gray-300">Max Participants: 20</span>
                                                             </div>
                                                             <div className="flex items-center gap-2 text-sm">
                                                                 <Calendar className="w-4 h-4 text-pink-600" />
                                                                 <span className="text-gray-700 dark:text-gray-300">Next Session: Tomorrow, 10:00 AM</span>
                                                             </div>
                                                             <div className="flex items-center gap-2 text-sm">
                                                                 <Target className="w-4 h-4 text-pink-600" />
                                                                 <span className="text-gray-700 dark:text-gray-300">Current Registrations: 15/20</span>
                                                             </div>
                                                         </div>
                                                     </div>
                                                     
                                                     {/* Workshop Materials */}
                                                     <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                                         <h4 className="font-semibold text-pink-800 dark:text-pink-200 mb-2">Required Materials:</h4>
                                                         <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                                             <li>• Laptop with Python installed</li>
                                                             <li>• Notebook for taking notes</li>
                                                             <li>• Pre-workshop reading materials</li>
                                                         </ul>
                                                     </div>
                                                     
                                                     <div className="flex gap-3">
                                                         <button 
                                                             onClick={handleWorkshopRegistration}
                                                             className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                                         >
                                                             <Users className="w-4 h-4" />
                                                             Register for Workshop
                                                         </button>
                                                         <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                             <Calendar className="w-4 h-4" />
                                                             View Schedule
                                                         </button>
                                                         <button className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                                             <Download className="w-4 h-4" />
                                                             Download Materials
                                                         </button>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     )}

                                    {/* Generic Content for other activity types */}
                                    {!['assign', 'quiz', 'forum', 'resource', 'file', 'url', 'book', 'workshop'].includes(module.modname) && (
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
                            )}
                            
                            {/* Activity Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    {/* Completion Status */}
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
                                    
                                    {/* Navigation Buttons */}
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
                                {/* Horizontal Road */}
                                <div 
                                    className="absolute h-3 bg-gray-400 rounded-full shadow-inner"
                                    style={{ 
                                        top: `${topPosition - 0.5}rem`,
                                        left: '0',
                                        right: '0'
                                    }}
                                >
                                    {/* Road center line */}
                                    <div 
                                        className="absolute h-0.5 bg-yellow-400 top-1/2 left-0 right-0 transform -translate-y-1/2"
                                        style={{
                                            background: 'repeating-linear-gradient(to right, #F59E0B 0px, #F59E0B 20px, transparent 20px, transparent 40px)'
                                        }}
                                    ></div>
                                </div>
                                
                                {/* Right U-Turn Curve (for even rows) */}
                                {isEvenRow && rowIndex < totalRows - 1 && (
                                    <div className="absolute" style={{ top: `${topPosition}rem`, right: '0' }}>
                                        {/* Main curve path */}
                                        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute">
                                            <path
                                                d="M 0 0 L 0 40 Q 0 80 40 80 L 80 80"
                                                stroke="#9CA3AF"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        {/* Inner curve for road effect */}
                                        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute">
                                            <path
                                                d="M 0 0 L 0 40 Q 0 80 40 80 L 80 80"
                                                stroke="#6B7280"
                                                strokeWidth="4"
                                                fill="none"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                                
                                {/* Left U-Turn Curve (for odd rows) */}
                                {!isEvenRow && rowIndex < totalRows - 1 && (
                                    <div className="absolute" style={{ top: `${topPosition}rem`, left: '0' }}>
                                        {/* Main curve path */}
                                        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute">
                                            <path
                                                d="M 80 0 L 80 40 Q 80 80 40 80 L 0 80"
                                                stroke="#9CA3AF"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        {/* Inner curve for road effect */}
                                        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute">
                                            <path
                                                d="M 80 0 L 80 40 Q 80 80 40 80 L 0 80"
                                                stroke="#6B7280"
                                                strokeWidth="4"
                                                fill="none"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                                
                                {/* Vertical Road Connection (for odd rows) */}
                                {!isEvenRow && rowIndex < totalRows - 1 && (
                                    <div 
                                        className="absolute w-3 bg-gray-400 rounded-full shadow-inner transform translate-x-1/2"
                                        style={{ 
                                            top: `${topPosition}rem`,
                                            left: '0',
                                            height: `${rowHeight}rem`
                                        }}
                                    >
                                        {/* Road center line */}
                                        <div 
                                            className="absolute w-0.5 bg-yellow-400 left-1/2 top-0 bottom-0 transform -translate-x-1/2"
                                            style={{
                                                background: 'repeating-linear-gradient(to bottom, #F59E0B 0px, #F59E0B 20px, transparent 20px, transparent 40px)'
                                            }}
                                        ></div>
                                    </div>
                                )}
                                
                                {/* Vertical Road Connection (for even rows) */}
                                {isEvenRow && rowIndex < totalRows - 1 && (
                                    <div 
                                        className="absolute w-3 bg-gray-400 rounded-full shadow-inner transform translate-x-1/2"
                                        style={{ 
                                            top: `${topPosition}rem`,
                                            right: '0',
                                            height: `${rowHeight}rem`
                                        }}
                                    >
                                        {/* Road center line */}
                                        <div 
                                            className="absolute w-0.5 bg-yellow-400 left-1/2 top-0 bottom-0 transform -translate-x-1/2"
                                            style={{
                                                background: 'repeating-linear-gradient(to bottom, #F59E0B 0px, #F59E0B 20px, transparent 20px, transparent 40px)'
                                            }}
                                        ></div>
                                    </div>
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

// Export the CourseViewer as a reusable component
export const CourseViewer: React.FC<{
  courseId?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  backUrl?: string;
  title?: string;
  className?: string;
}> = ({ 
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

// Main page component
const CourseViewerPage: React.FC = () => {
    return <CourseViewer />;
};

export default CourseViewerPage; 