import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, ChatResponse, BookRecommendation } from '@/lib/api/chat';
import { Button, Input, Card, Typography, Divider } from '@/components/ui';
import { Send, Loader2, Book } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
  recommendations?: BookRecommendation[];
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: "Hello! I'm your AI library assistant. I can help you find books and answer questions about the library. Try asking me:\n\n" +
                "• Recommend some fiction books\n" +
                "• Find mystery books\n" +
                "• Show me business books\n" +
                "• What are the library hours?\n" +
                "• How do I borrow books?",
          isUser: false,
        },
      ]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);

    try {
      const response = await sendChatMessage({ message: userMessage });
      
      // Add AI response
      setMessages(prev => [...prev, {
        text: response.response,
        isUser: false,
        recommendations: response.book_recommendations
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4">
      <Card className="flex-1 mb-4 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <Typography className="whitespace-pre-line">
                  {message.text}
                </Typography>
              </div>

              {message.recommendations && message.recommendations.length > 0 && (
                <div className="mt-4 space-y-3 w-full">
                  <Typography variant="h4" className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Recommended Books:
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {message.recommendations.map((book, bookIndex) => (
                      <Card key={bookIndex} className="p-4 hover:shadow-lg transition-shadow">
                        <Typography variant="h5" className="font-semibold">
                          {book.title}
                        </Typography>
                        <Typography variant="muted" className="italic">
                          by {book.author}
                        </Typography>
                        <Typography className="text-sm mt-2">
                          {book.description && book.description.length > 150 
                            ? `${book.description.substring(0, 150)}...` 
                            : book.description}
                        </Typography>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {book.genres.map((genre, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                        <Typography className="text-sm mt-2 text-green-600">
                          {book.available_copies} copies available
                        </Typography>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about books or the library..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-16"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}; 