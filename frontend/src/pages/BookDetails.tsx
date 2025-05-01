import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Book } from 'lucide-react';
import BookCard from '@/components/BookCard';
import Navbar from '@/components/Navbar';
import { useToast } from "@/hooks/use-toast";
import { books as booksApi, loans as loansApi, reviews as reviewsApi } from '@/lib/api';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface Review {
  id: number;
  user: {
    username: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        
        // Fetch book details
        const bookData = await booksApi.getById(parseInt(id));
        setBook(bookData);
        
        // Fetch similar books based on genre
        const similarBooksData = await booksApi.getAll({
          genre_id: bookData.genres[0]?.id,
          limit: 4
        });
        setSimilarBooks(similarBooksData.filter(b => b.id !== bookData.id));

        // Fetch reviews
        const reviewsData = await reviewsApi.getBookReviews(parseInt(id));
        setReviews(reviewsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch book details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);
  
  const handleCheckout = async () => {
    if (!book) return;
    
    try {
      await loansApi.create(book.id);
      toast({
        title: `${book.title} checked out`,
        description: "The book has been added to your account.",
      });
      
      // Refresh book data to update availability
      const updatedBook = await booksApi.getById(book.id);
      setBook(updatedBook);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to check out book",
        variant: "destructive",
      });
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!book) return;
    
    try {
      setIsSubmittingReview(true);
      await reviewsApi.create(book.id, rating, comment);
      
      // Refresh reviews
      const reviewsData = await reviewsApi.getBookReviews(book.id);
      setReviews(reviewsData);
      
      // Refresh book to update rating
      const updatedBook = await booksApi.getById(book.id);
      setBook(updatedBook);
      
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Book Not Found</h2>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the book you're looking for.</p>
            <Link to="/">
              <Button>Return to Homepage</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-library-primary hover:text-library-secondary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Library</span>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={`${book.title} cover`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <Book size={64} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-2 mb-3">
              {book.genres.map((genre, index) => (
                <Badge key={index} variant="outline" className="bg-library-accent text-library-dark">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-medium">{book.rating}</span>
                <span className="text-gray-400 text-sm ml-1">/ 5</span>
              </div>
              <div className="text-gray-500">
                {book.page_count} pages • Published {book.published_year}
              </div>
            </div>
            
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
            
            <div className="mb-8">
              <div className="text-sm text-gray-500 mb-1">ISBN</div>
              <div>{book.isbn}</div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                disabled={!book.is_available}
                className={book.is_available ? "bg-library-primary hover:bg-library-secondary" : ""}
                onClick={handleCheckout}
              >
                {book.is_available ? "Check Out" : "Currently Unavailable"}
              </Button>
              
              <Button variant="outline" size="lg">
                Add to Reading List
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewList reviews={reviews} />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewForm onSubmit={handleReviewSubmit} isLoading={isSubmittingReview} />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {similarBooks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {similarBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
