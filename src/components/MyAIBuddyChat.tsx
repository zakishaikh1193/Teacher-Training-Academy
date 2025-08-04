import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { processChatMessage, detectLanguage, ChatMessage, ChatbotResponse } from '../services/chatbotService';
import { Course, School, User } from '../types';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Loader2, 
  Globe, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  X
} from 'lucide-react';

interface MyAIBuddyChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MyAIBuddyChat: React.FC<MyAIBuddyChatProps> = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar'>('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: selectedLanguage === 'ar' 
          ? 'مرحباً! أنا مساعدك الذكي في نظام إدارة التعلم. كيف يمكنني مساعدتك اليوم؟'
          : 'Hello! I\'m your AI assistant for the Learning Management System. How can I help you today?',
        role: 'assistant',
        timestamp: Date.now(),
        language: selectedLanguage
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedLanguage]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userLanguage = detectLanguage(inputMessage);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: Date.now(),
      language: userLanguage
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response: ChatbotResponse = await processChatMessage(
        inputMessage,
        user,
        messages
      );

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant',
        timestamp: Date.now(),
        language: response.language
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (response.data) {
        const dataMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          content: formatDataForDisplay(response.data, response.language),
          role: 'assistant',
          timestamp: Date.now(),
          language: response.language
        };
        setMessages(prev => [...prev, dataMsg]);
      }

    } catch (error: any) {
      console.error('Error processing message:', error);
      
      // Use the error message from the service if available, otherwise fallback
      let errorMessage: string;
      
      if (error.message) {
        errorMessage = error.message;
      } else {
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
      setMessages(prev => [...prev, errorMsg]);
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
        const courseList = data.map((course: Course) => 
          `• ${course.fullname} (${course.shortname})`
        ).join('\n');
        return language === 'ar' 
          ? `قائمة الدورات المتاحة:\n${courseList}`
          : `Available courses:\n${courseList}`;
      }

      if (data[0] && 'name' in data[0]) {
        const schoolList = data.map((school: School) => 
          `• ${school.name}`
        ).join('\n');
        return language === 'ar' 
          ? `قائمة المدارس:\n${schoolList}`
          : `Schools list:\n${schoolList}`;
      }

      if (data[0] && 'firstname' in data[0]) {
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

  const toggleLanguage = () => {
    setSelectedLanguage(prev => prev === 'en' ? 'ar' : 'en');
    setShowLanguageDropdown(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-3 sm:right-6 z-50 p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <MessageSquare size={20} className="sm:w-6 sm:h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-3 sm:right-6 z-40 w-[350px] sm:w-[450px] h-[500px] sm:h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden max-h-[80vh] max-w-[calc(100vw-24px)] sm:max-w-none">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot size={16} className="sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base">My AI Buddy</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center space-x-1 px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Globe size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">{selectedLanguage.toUpperCase()}</span>
                  {showLanguageDropdown ? <ChevronUp size={14} className="sm:w-4 sm:h-4" /> : <ChevronDown size={14} className="sm:w-4 sm:h-4" />}
                </button>
                {showLanguageDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={toggleLanguage}
                      className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {selectedLanguage === 'en' ? 'العربية' : 'English'}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={clearChat}
                className="p-1 rounded hover:bg-white/20 transition-colors"
                title="Clear chat"
              >
                <X size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Message Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[90%] sm:max-w-[85%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.role === 'user' ? <UserIcon size={12} className="sm:w-4 sm:h-4" /> : <Bot size={12} className="sm:w-4 sm:h-4" />}
                  </div>
                  
                  <div
                    className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    dir={message.language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <div className="whitespace-pre-wrap text-xs sm:text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 opacity-70 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <Bot size={12} className="sm:w-4 sm:h-4" />
                  </div>
                  <div className="px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-gray-100">
                    <div className="flex items-center space-x-2">
                      <Loader2 size={14} className="sm:w-4 sm:h-4 animate-spin" />
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

          {/* Input Section */}
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
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
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm bg-white"
                  dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-3 py-2 sm:px-4 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[44px] sm:min-w-[52px]"
                title={selectedLanguage === 'ar' ? 'إرسال' : 'Send'}
              >
                <Send size={14} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
