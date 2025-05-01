import React from 'react';
import { Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: number;
  user: {
    username: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-library-light flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-library-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{review.user.username}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          size={16}
                          className={`${
                            value <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}

      {reviews.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          No reviews yet. Be the first to review this book!
        </div>
      )}
    </div>
  );
};

export default ReviewList; 