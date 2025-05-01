import React, { useState } from 'react';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Genre {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  cover_image: string;
  published_year: number;
  genres: Genre[];
  description: string;
  is_available: boolean;
  rating: number;
  page_count: number;
  isbn: string;
}

interface BookListProps {
  books: Book[];
  title?: string;
}

const BookList: React.FC<BookListProps> = ({ books, title }) => {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [displayCount, setDisplayCount] = useState<number>(8);
  
  // Get unique genres from all books
  const genres = Array.from(new Set(books.flatMap(book => book.genres.map(g => g.name)))).sort();
  
  const filteredBooks = selectedGenre === "All" 
    ? books
    : books.filter(book => book.genres.some(g => g.name === selectedGenre));
  
  const displayedBooks = filteredBooks.slice(0, displayCount);
  const hasMore = displayedBooks.length < filteredBooks.length;

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-library-dark">{title}</h2>
      )}
      
      <div className="mb-6 overflow-x-auto pb-2">
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger 
              value="All" 
              onClick={() => setSelectedGenre("All")}
              className="px-4 py-2"
            >
              All
            </TabsTrigger>
            {genres.slice(0, 6).map((genre) => (
              <TabsTrigger 
                key={genre} 
                value={genre}
                onClick={() => setSelectedGenre(genre)}
                className="px-4 py-2"
              >
                {genre}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedBooks.length > 0 ? (
          displayedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No books found in this category.</p>
          </div>
        )}
      </div>
      
      {hasMore && (
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => setDisplayCount(prevCount => prevCount + 8)}
            className="border-library-primary text-library-primary hover:bg-library-primary hover:text-white"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookList;
