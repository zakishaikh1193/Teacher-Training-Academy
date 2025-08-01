import React from 'react';
import { useChat } from '../context/ChatContext';
import { MyAIBuddyChat } from './MyAIBuddyChat';
import { MessageSquare, Bot } from 'lucide-react';

export const AIBuddyFAB: React.FC = () => {
  const { isChatOpen, toggleChat } = useChat();

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className={`group relative p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
            isChatOpen 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
          }`}
          aria-label={isChatOpen ? 'Close AI Buddy' : 'Open AI Buddy'}
        >
          {isChatOpen ? (
            <MessageSquare size={24} />
          ) : (
            <Bot size={24} />
          )}
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {isChatOpen ? 'Close AI Buddy' : 'Chat with AI Buddy'}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>
      
      {/* Chat Component */}
      <MyAIBuddyChat isOpen={isChatOpen} onToggle={toggleChat} />
    </>
  );
}; 