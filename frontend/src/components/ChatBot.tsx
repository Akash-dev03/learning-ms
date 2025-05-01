import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Book, MessageSquare } from 'lucide-react';
import { getBooksForPrompt } from '@/utils/aiChatService';
import { Book as BookType } from '@/lib/types';
import BookCard from '@/components/BookCard';

interface Message {
  content: string;
  isUser: boolean;
  recommendations?: BookType[];
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your AI book assistant. Tell me what kind of books you're interested in, and I'll recommend something for you!",
      isUser: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      content: input,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const recommendedBooks = await getBooksForPrompt(input);
      
      let responseContent = "Based on your interests, I recommend these books:";
      if (recommendedBooks.length === 0) {
        responseContent = "I couldn't find any books matching your criteria. Could you try a different description or interest?";
      }
      
      const aiMessage: Message = {
        content: responseContent,
        isUser: false,
        recommendations: recommendedBooks.length > 0 ? recommendedBooks : undefined
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting book recommendations:", error);
      setMessages(prev => [
        ...prev, 
        {
          content: "Sorry, I had trouble finding recommendations. Please try again!",
          isUser: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-library-primary/20">
      <CardHeader className="bg-gradient-to-r from-library-light to-library-accent">
        <CardTitle className="flex items-center gap-2">
          <Book className="text-library-primary" size={24} />
          <span>Book Recommendation Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 max-h-[500px] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                <Avatar className={`h-8 w-8 ${message.isUser ? 'bg-blue-600' : 'bg-library-primary'}`}>
                  <span className="text-xs text-white">
                    {message.isUser ? 'You' : <MessageSquare size={16} />}
                  </span>
                </Avatar>
                
                <div className={`rounded-lg px-4 py-2 ${message.isUser 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800'}`}>
                  <p>{message.content}</p>
                  
                  {message.recommendations && (
                    <div className="mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        {message.recommendations.slice(0, 4).map((book) => (
                          <BookCard key={book.id} book={book} minimal={true} />
                        ))}
                      </div>
                      {message.recommendations.length > 4 && (
                        <Button 
                          variant="link" 
                          className="p-0 h-auto mt-2 text-sm text-blue-500"
                        >
                          See {message.recommendations.length - 4} more recommendations
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
          <Input
            placeholder="Describe what you're looking for..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-library-primary hover:bg-library-secondary"
          >
            {isLoading ? "Thinking..." : "Send"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatBot;
