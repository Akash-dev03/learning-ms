
import React from 'react';
import Navbar from '@/components/Navbar';
import ChatBot from '@/components/ChatBot';

const ChatBotPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-library-dark">
          AI Book Recommendations
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Chat with our AI assistant and get personalized book recommendations based on your interests and preferences.
        </p>
        
        <div className="mt-6">
          <ChatBot />
        </div>
      </div>
    </div>
  );
};

export default ChatBotPage;
