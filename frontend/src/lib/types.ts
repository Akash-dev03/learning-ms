export interface Book {
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

export interface Review {
  id: number;
  user: {
    username: string;
  };
  rating: number;
  comment: string;
  created_at: string;
} 