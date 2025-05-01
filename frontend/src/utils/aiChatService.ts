import { Book } from '@/lib/types';
import { books as booksApi } from '@/lib/api';

// Simple keyword matching for our demo
const keywordMap: Record<string, string[]> = {
  'fantasy': ['fantasy', 'magic', 'dragons', 'adventure', 'mythical'],
  'science fiction': ['sci-fi', 'space', 'future', 'alien', 'technology'],
  'mystery': ['mystery', 'detective', 'crime', 'thriller', 'suspense'],
  'self help': ['self-help', 'motivation', 'productivity', 'habits', 'improvement'],
  'fiction': ['fiction', 'novel', 'story'],
  'non-fiction': ['non-fiction', 'true', 'factual', 'educational'],
  'biography': ['biography', 'memoir', 'life', 'autobiography'],
  'psychology': ['psychology', 'mind', 'behavior', 'mental'],
  'classic': ['classic', 'literary', 'old', 'traditional']
};

// Extract keywords from the prompt
const extractKeywords = (prompt: string): string[] => {
  const lowercasePrompt = prompt.toLowerCase();
  const extractedKeywords: string[] = [];
  
  Object.entries(keywordMap).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowercasePrompt.includes(keyword))) {
      extractedKeywords.push(category);
    }
  });
  
  return extractedKeywords;
};

// Analyze sentiment for rating preference
const analyzePromptForRating = (prompt: string): number => {
  const lowercasePrompt = prompt.toLowerCase();
  
  if (lowercasePrompt.includes('best') || 
      lowercasePrompt.includes('top') || 
      lowercasePrompt.includes('highest rated')) {
    return 4.5; // Only return highly rated books
  }
  
  return 0; // No specific rating filter
};

// Check if the book matches the given prompt
const bookMatchesPrompt = (book: Book, prompt: string): number => {
  const lowercasePrompt = prompt.toLowerCase();
  let score = 0;
  
  // Extract keywords from prompt
  const keywords = extractKeywords(prompt);
  
  // Title and author match
  if (book.title.toLowerCase().includes(lowercasePrompt) || 
      book.author.toLowerCase().includes(lowercasePrompt)) {
    score += 10;
  }
  
  // Genre match
  book.genres.forEach(genre => {
    const genreName = genre.name.toLowerCase();
    if (keywords.includes(genreName) || 
        lowercasePrompt.includes(genreName)) {
      score += 5;
    }
  });
  
  // Description match
  keywords.forEach(keyword => {
    if (book.description.toLowerCase().includes(keyword)) {
      score += 3;
    }
  });
  
  // Published year match
  const yearMatches = prompt.match(/\b(19|20)\d{2}\b/g);
  if (yearMatches && yearMatches.some(year => book.published_year.toString() === year)) {
    score += 8;
  }
  
  // Rating threshold
  const minRating = analyzePromptForRating(prompt);
  if (minRating > 0 && book.rating >= minRating) {
    score += 5;
  } else if (minRating > 0 && book.rating < minRating) {
    score -= 5; // Penalize books that don't meet the rating threshold
  }
  
  return score;
};

// Simulate an AI processing delay
const simulateAiProcessing = async (): Promise<void> => {
  const delay = Math.random() * 1000 + 500; // Random delay between 500-1500ms
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Get book recommendations based on the given prompt
export const getBooksForPrompt = async (prompt: string): Promise<Book[]> => {
  // Simulate AI processing
  await simulateAiProcessing();
  
  try {
    // Get all books from the API
    const allBooks = await booksApi.getAll();
    
    // Score and sort books based on prompt
    const scoredBooks = allBooks.map(book => ({
      book,
      score: bookMatchesPrompt(book, prompt)
    }));
    
    // Sort by score and return top results
    return scoredBooks
      .sort((a, b) => b.score - a.score)
      .filter(item => item.score > 0)
      .slice(0, 6)
      .map(item => item.book);
  } catch (error) {
    console.error('Error fetching books for recommendations:', error);
    throw error;
  }
};
