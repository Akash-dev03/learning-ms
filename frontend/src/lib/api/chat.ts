import { api } from './api';

export interface ChatMessage {
  message: string;
  user_id?: number;
}

export interface BookRecommendation {
  title: string;
  author: string;
  genres: string[];
  available_copies: number;
}

export interface ChatResponse {
  response: string;
  book_recommendations?: BookRecommendation[];
}

export const sendChatMessage = async (message: ChatMessage): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>('/chat', message);
  return response.data;
}; 