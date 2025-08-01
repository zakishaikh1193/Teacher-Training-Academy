import React from 'react';
import { ChatCategory } from '../types';
import { getAllCategories } from '../services/enhancedChatbotService';
import { useEnhancedChat } from '../context/EnhancedChatContext';
import { Bot, Clock, Users, BookOpen, Settings, DollarSign, HelpCircle } from 'lucide-react';

export const CategorySelection: React.FC = () => {
  const { selectCategory, selectedLanguage } = useEnhancedChat();
  const categories = getAllCategories();

  const handleCategorySelect = (category: ChatCategory) => {
    selectCategory(category);
  };

  // Icon mapping for categories
  const getCategoryIcon = (categoryId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'course-enrollment': <BookOpen className="w-6 h-6" />,
      'teacher-training': <Users className="w-6 h-6" />,
      'student-access': <Bot className="w-6 h-6" />,
      'technical-support': <Settings className="w-6 h-6" />,
      'pricing-plans': <DollarSign className="w-6 h-6" />,
      'general-inquiry': <HelpCircle className="w-6 h-6" />
    };
    return iconMap[categoryId] || <Bot className="w-6 h-6" />;
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-50" dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-b-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg">
              {selectedLanguage === 'ar' ? 'مرحباً! كيف يمكنني مساعدتك؟' : 'Hello! How can I help you?'}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm opacity-90">
                {selectedLanguage === 'ar' ? 'متصل الآن' : 'We\'re online!'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-fade-in">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedLanguage === 'ar' 
                  ? 'مرحباً! أنا مساعدك الذكي. اختر من القائمة أدناه للحصول على مساعدة مخصصة:'
                  : 'Hi! I\'m your AI assistant. Choose from the options below to get specialized help:'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-1 gap-3">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category)}
              className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 transform hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${category.color}`}>
                  {getCategoryIcon(category.id)}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {selectedLanguage === 'ar' ? category.nameAr : category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {selectedLanguage === 'ar' ? category.descriptionAr : category.description}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <div className="bg-white/50 rounded-lg p-3">
          <p className="text-xs text-gray-500">
            {selectedLanguage === 'ar' 
              ? 'اختر فئة لبدء محادثة مخصصة' 
              : 'Select a category to start a personalized conversation'
            }
          </p>
        </div>
      </div>
    </div>
  );
}; 