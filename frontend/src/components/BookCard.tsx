import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Book as BookIcon } from 'lucide-react';

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

interface BookCardProps {
  book: Book;
  minimal?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, minimal = false }) => {
  if (minimal) {
    return (
      <Link to={`/books/${book.id}`} className="block">
        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 p-3">
            <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden">
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <BookIcon size={20} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-medium text-sm line-clamp-1">{book.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-500 text-xs">★</span>
                <span className="text-xs">{book.rating}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/books/${book.id}`} className="block">
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-[2/3] relative overflow-hidden">
          {book.cover_image ? (
            <img 
              src={book.cover_image} 
              alt={book.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <BookIcon size={48} className="text-gray-400" />
            </div>
          )}
          {!book.is_available && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                Unavailable
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold truncate">{book.title}</h3>
          <p className="text-sm text-gray-500 truncate">{book.author}</p>
          <div className="flex items-center mt-2 justify-between">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-sm">{book.rating}</span>
            </div>
            <span className="text-xs text-gray-500">{book.published_year}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BookCard;
