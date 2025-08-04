import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEnhancedChat } from '../context/EnhancedChatContext';
import { processCategoryChatMessage, detectLanguage, ChatbotResponse } from '../services/enhancedChatbotService';
import { Course, School, User, ChatMessage } from '../types';
import { CategorySelection } from './CategorySelection';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Globe, 
  ChevronDown, 
  ChevronUp,
  X,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { RobotIcon } from './RobotIcon';

export const EnhancedAIBuddyChat: React.FC = () => {
  const { user } = useAuth();
  const { 
    isChatOpen, 
    selectedCategory, 
    categoryChats, 
    isCategoryView,
    selectedLanguage,
    toggleChat, 
    backToCategories, 
    addMessageToCategory, 
    clearCategoryChat,
    toggleLanguage
  } = useEnhancedChat();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get current category messages
  const currentMessages = selectedCategory ? categoryChats[selectedCategory.id]?.messages || [] : [];

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && inputRef.current && selectedCategory) {
      inputRef.current.focus();
    }
  }, [isChatOpen, selectedCategory]);

  // Initialize with welcome message for selected category
  useEffect(() => {
    if (selectedCategory && currentMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: selectedLanguage === 'ar' 
          ? `مرحباً! أنا متخصص في ${selectedCategory.nameAr}. كيف يمكنني مساعدتك اليوم؟`
          : `Hello! I'm your ${selectedCategory.name} specialist. How can I help you today?`,
        role: 'assistant',
        timestamp: Date.now(),
        language: selectedLanguage
      };
      addMessageToCategory(selectedCategory.id, welcomeMessage);
    }
  }, [selectedCategory, selectedLanguage, addMessageToCategory]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !selectedCategory) return;

    const userLanguage = detectLanguage(inputMessage);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: Date.now(),
      language: userLanguage
    };

    addMessageToCategory(selectedCategory.id, userMsg);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response: ChatbotResponse = await processCategoryChatMessage(
        inputMessage,
        selectedCategory,
        user,
        currentMessages,
        selectedLanguage // Pass selected language to ensure AI responds in correct language
      );

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant',
        timestamp: Date.now(),
        language: selectedLanguage // Use selected language, not detected language
      };

      addMessageToCategory(selectedCategory.id, assistantMsg);

      // If there's data to display, create a data message
      if (response.data) {
        const dataMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          content: formatDataForDisplay(response.data, selectedLanguage),
          role: 'assistant',
          timestamp: Date.now(),
          language: selectedLanguage
        };
        addMessageToCategory(selectedCategory.id, dataMsg);
      }

    } catch (error: any) {
      console.error('Error processing message:', error);
      
      // The enhanced service now returns graceful error responses instead of throwing
      // But if it does throw, handle it gracefully
      let errorMessage: string;
      
      if (error.message) {
        // Use the error message from the service if available
        errorMessage = error.message;
      } else {
        // Fallback to generic message
        errorMessage = selectedLanguage === 'ar' 
          ? 'عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was an error processing your message. Please try again.';
      }
      
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        role: 'assistant',
        timestamp: Date.now(),
        language: selectedLanguage
      };
      addMessageToCategory(selectedCategory.id, errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDataForDisplay = (data: any, language: 'en' | 'ar'): string => {
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return language === 'ar' ? 'لا توجد بيانات متاحة.' : 'No data available.';
      }

      if (data[0] && 'fullname' in data[0]) {
        // Courses data
        const courseList = data.map((course: Course) => 
          `• ${course.fullname} (${course.shortname})`
        ).join('\n');
        return language === 'ar' 
          ? `قائمة الدورات المتاحة:\n${courseList}`
          : `Available courses:\n${courseList}`;
      }

      if (data[0] && 'name' in data[0]) {
        // Schools data
        const schoolList = data.map((school: School) => 
          `• ${school.name}`
        ).join('\n');
        return language === 'ar' 
          ? `قائمة المدارس:\n${schoolList}`
          : `Schools list:\n${schoolList}`;
      }

      if (data[0] && 'firstname' in data[0]) {
        // Users data
        const userList = data.map((user: User) => 
          `• ${user.firstname} ${user.lastname} (${user.email})`
        ).join('\n');
        return language === 'ar' 
          ? `قائمة المستخدمين:\n${userList}`
          : `Users list:\n${userList}`;
      }
    }

    return language === 'ar' ? 'تم جلب البيانات بنجاح.' : 'Data retrieved successfully.';
  };

  const handleClearChat = () => {
    if (selectedCategory) {
      clearCategoryChat(selectedCategory.id);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
          isChatOpen 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
        }`}
        aria-label={isChatOpen ? (selectedLanguage === 'ar' ? 'إغلاق الدردشة' : 'Close chat') : (selectedLanguage === 'ar' ? 'فتح الدردشة' : 'Open chat')}
      >
        {isChatOpen ? <X size={24} /> : <RobotIcon size={24} />}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-[350px] sm:w-[450px] h-[500px] sm:h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-t-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse-glow">
                  <Bot size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex-1">
                <span className="font-semibold text-sm sm:text-base">
                  {selectedLanguage === 'ar' ? 'مساعدي الذكي' : 'My AI Buddy'}
                </span>
                {selectedCategory && (
                  <span className="text-xs sm:text-sm opacity-80 hidden sm:inline ml-2">
                    • {selectedLanguage === 'ar' ? selectedCategory.nameAr : selectedCategory.name}
                  </span>
                )}
                <div className="flex items-center space-x-1 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs opacity-90">
                    {selectedLanguage === 'ar' ? 'متصل الآن' : 'Online'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Back to Categories Button */}
              {selectedCategory && (
                <button
                  onClick={backToCategories}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  title={selectedLanguage === 'ar' ? 'العودة للفئات' : 'Back to categories'}
                >
                  <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                </button>
              )}

              {/* Language Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-105"
                >
                  <Globe size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">{selectedLanguage.toUpperCase()}</span>
                  {showLanguageDropdown ? <ChevronUp size={14} className="sm:w-4 sm:h-4" /> : <ChevronDown size={14} className="sm:w-4 sm:h-4" />}
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 animate-fade-in">
                    <button
                      onClick={() => {
                        toggleLanguage();
                        setShowLanguageDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      {selectedLanguage === 'en' ? 'العربية' : 'English'}
                    </button>
                  </div>
                )}
              </div>

              {/* Clear Chat */}
              {selectedCategory && (
                <button
                  onClick={handleClearChat}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  title={selectedLanguage === 'ar' ? 'مسح الدردشة' : 'Clear chat'}
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden" dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}>
            {isCategoryView ? (
              <CategorySelection />
            ) : selectedCategory ? (
              <>
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 h-[350px] sm:h-[450px] chat-scrollbar">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} message-bubble ${message.role}`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[90%] sm:max-w-[85%] ${
                          message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-blue-500 text-white animate-bounce-in' 
                            : 'bg-gray-200 text-gray-600 animate-bounce-in'
                        }`}>
                          {message.role === 'user' ? <UserIcon size={12} className="sm:w-4 sm:h-4" /> : <Bot size={12} className="sm:w-4 sm:h-4" />}
                        </div>
                        
                        <div
                          className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-sm ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-800 border border-gray-100'
                          }`}
                          dir={message.language === 'ar' ? 'rtl' : 'ltr'}
                        >
                          <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">{message.content}</div>
                          <div className={`text-xs mt-1 sm:mt-2 opacity-70 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start message-bubble assistant">
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center animate-bounce-in">
                          <Bot size={12} className="sm:w-4 sm:h-4" />
                        </div>
                        <div className="px-3 py-2 sm:px-4 sm:py-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600">
                              {selectedLanguage === 'ar' ? 'جاري الكتابة...' : 'Typing...'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 sm:p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={
                          selectedLanguage === 'ar' 
                            ? 'اكتب رسالتك هنا...' 
                            : 'Type your message here...'
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm bg-white shadow-sm transition-all duration-300"
                        dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
                        disabled={isLoading}
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Bot className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                      title={selectedLanguage === 'ar' ? 'إرسال' : 'Send'}
                    >
                      <Send size={14} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}; 