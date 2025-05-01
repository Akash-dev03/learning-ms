import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import BookList from '@/components/BookList';
import Navbar from '@/components/Navbar';
import { Book } from 'lucide-react';
import TestConnection from '@/components/TestConnection';
import { books as booksApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Book {
  id: number;
  title: string;
  author: string;
  cover_image: string;
  published_year: number;
  genres: string[];
  description: string;
  is_available: boolean;
  rating: number;
  page_count: number;
  isbn: string;
}

const Index = () => {
  const [searchResults, setSearchResults] = useState<Book[] | null>(null);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Fetch all books
        const allBooksData = await booksApi.getAll();
        setAllBooks(allBooksData);

        // Get featured books (highest rated)
        const featured = [...allBooksData]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4);
        setFeaturedBooks(featured);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch books",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);
  
  const handleSearch = async (query: string) => {
    try {
      const results = await booksApi.getAll({ search: query });
      setSearchResults(results);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search books",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="bg-gradient-to-r from-library-light to-library-accent py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-3 rounded-full shadow-md">
              <Book className="h-10 w-10 text-library-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-library-dark">Libra</span> 
            <span className="text-library-primary"> Mind</span> 
            <span className="text-library-dark"> Archive</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Discover, manage, and explore our vast collection of books.
          </p>
          
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading books...</p>
          </div>
        ) : searchResults ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            <BookList books={searchResults} />
          </div>
        ) : (
          <>
            <div className="mb-16">
              <BookList 
                books={featuredBooks}
                title="Featured Books"
              />
            </div>
            
            <div className="mb-16">
              <BookList 
                books={allBooks} 
                title="Browse Our Collection"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-library-light rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-2">Smart Search</h3>
                <p className="text-gray-600">Find the perfect book with our advanced search system.</p>
              </div>
              <div className="bg-library-light rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-2">Easy Book Management</h3>
                <p className="text-gray-600">Check out, return, and manage your books with our intuitive system.</p>
              </div>
              <div className="bg-library-light rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-2">Cloud Library Access</h3>
                <p className="text-gray-600">Access your books and reading history from anywhere, anytime.</p>
              </div>
            </div>
          </>
        )}
      </div>
      
      <footer className="bg-library-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Book className="h-6 w-6 text-library-primary mr-2" />
                <span className="text-xl font-bold">Libra Mind Archive</span>
              </div>
              <p className="mt-2 text-gray-300 text-sm">Smart Library Management</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Navigation</h4>
                <ul className="space-y-2">
                  <li><a href="/" className="text-gray-300 hover:text-white text-sm">Home</a></li>
                  <li><a href="/books" className="text-gray-300 hover:text-white text-sm">Browse Books</a></li>
                  <li><a href="/about" className="text-gray-300 hover:text-white text-sm">About</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white text-sm">Help Center</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white text-sm">Contact Support</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400">
            <p>© 2025 Libra Mind Archive. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <TestConnection />
    </div>
  );
};

export default Index;
