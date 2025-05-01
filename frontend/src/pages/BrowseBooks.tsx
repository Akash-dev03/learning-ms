import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BookList from '@/components/BookList';
import SearchBar from '@/components/SearchBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { books as booksApi, genres as genresApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

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

const BrowseBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [yearRange, setYearRange] = useState([1900, 2025]);
  const [isLoading, setIsLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch books
        const booksData = await booksApi.getAll({
          search: searchQuery,
          available_only: availableOnly,
        });
        setBooks(booksData);

        // Fetch genres
        const genresData = await genresApi.getAll();
        setGenres(genresData.map((genre: any) => genre.name));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch books and genres",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, availableOnly]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };
  
  const filteredBooks = books.filter(book => {
    // Filter by selected genres (if any are selected)
    const matchesGenre = 
      selectedGenres.length === 0 || 
      book.genres.some(g => selectedGenres.includes(g));
    
    // Filter by year range
    const matchesYearRange = 
      book.published_year >= yearRange[0] && 
      book.published_year <= yearRange[1];
    
    return matchesGenre && matchesYearRange;
  });
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Browse Books</h1>
          <span className="text-gray-500">
            Showing {filteredBooks.length} of {books.length} books
          </span>
        </div>
        
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Availability</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="available"
                      checked={availableOnly}
                      onCheckedChange={() => setAvailableOnly(!availableOnly)}
                    />
                    <Label htmlFor="available">Available now</Label>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Publication Year</h3>
                  <div className="px-2">
                    <Slider 
                      defaultValue={yearRange}
                      min={1900}
                      max={currentYear}
                      step={1}
                      value={yearRange}
                      onValueChange={(value) => setYearRange(value as number[])}
                      className="mb-6"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{yearRange[0]}</span>
                      <span>{yearRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Genres</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {genres.map(genre => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={`genre-${genre}`}
                          checked={selectedGenres.includes(genre)}
                          onCheckedChange={() => handleGenreToggle(genre)}
                        />
                        <Label htmlFor={`genre-${genre}`}>{genre}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading books...</p>
              </div>
            ) : (
              <BookList books={filteredBooks} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowseBooks;
