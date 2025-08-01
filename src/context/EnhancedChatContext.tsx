import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ChatCategory, CategoryChat, ChatMessage } from '../types';

interface EnhancedChatContextType {
  isChatOpen: boolean;
  selectedCategory: ChatCategory | null;
  categoryChats: Record<string, CategoryChat>;
  isCategoryView: boolean;
  selectedLanguage: 'en' | 'ar';
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  selectCategory: (category: ChatCategory) => void;
  backToCategories: () => void;
  addMessageToCategory: (categoryId: string, message: ChatMessage) => void;
  clearCategoryChat: (categoryId: string) => void;
  setLanguage: (language: 'en' | 'ar') => void;
  toggleLanguage: () => void;
}

const EnhancedChatContext = createContext<EnhancedChatContextType | undefined>(undefined);

interface EnhancedChatProviderProps {
  children: ReactNode;
}

export const EnhancedChatProvider: React.FC<EnhancedChatProviderProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory | null>(null);
  const [categoryChats, setCategoryChats] = useState<Record<string, CategoryChat>>({});
  const [isCategoryView, setIsCategoryView] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar'>('en');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('chatbot-language') as 'en' | 'ar';
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ar')) {
        setSelectedLanguage('ar');
      }
    }
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('chatbot-language', selectedLanguage);
  }, [selectedLanguage]);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
    if (!isChatOpen) {
      setIsCategoryView(true);
      setSelectedCategory(null);
    }
  };

  const openChat = () => {
    setIsChatOpen(true);
    setIsCategoryView(true);
    setSelectedCategory(null);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setIsCategoryView(false);
    setSelectedCategory(null);
  };

  const selectCategory = (category: ChatCategory) => {
    setSelectedCategory(category);
    setIsCategoryView(false);
    
    // Initialize category chat if it doesn't exist
    if (!categoryChats[category.id]) {
      setCategoryChats(prev => ({
        ...prev,
        [category.id]: {
          categoryId: category.id,
          messages: []
        }
      }));
    }
  };

  const backToCategories = () => {
    setIsCategoryView(true);
    setSelectedCategory(null);
  };

  const addMessageToCategory = (categoryId: string, message: ChatMessage) => {
    setCategoryChats(prev => ({
      ...prev,
      [categoryId]: {
        categoryId,
        messages: [...(prev[categoryId]?.messages || []), message]
      }
    }));
  };

  const clearCategoryChat = (categoryId: string) => {
    setCategoryChats(prev => ({
      ...prev,
      [categoryId]: {
        categoryId,
        messages: []
      }
    }));
  };

  const setLanguage = (language: 'en' | 'ar') => {
    setSelectedLanguage(language);
  };

  const toggleLanguage = () => {
    setSelectedLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const value: EnhancedChatContextType = {
    isChatOpen,
    selectedCategory,
    categoryChats,
    isCategoryView,
    selectedLanguage,
    toggleChat,
    openChat,
    closeChat,
    selectCategory,
    backToCategories,
    addMessageToCategory,
    clearCategoryChat,
    setLanguage,
    toggleLanguage
  };

  return (
    <EnhancedChatContext.Provider value={value}>
      {children}
    </EnhancedChatContext.Provider>
  );
};

export const useEnhancedChat = (): EnhancedChatContextType => {
  const context = useContext(EnhancedChatContext);
  if (context === undefined) {
    throw new Error('useEnhancedChat must be used within an EnhancedChatProvider');
  }
  return context;
}; 