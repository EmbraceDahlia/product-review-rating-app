import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  outOf?: number;
  onRatingChange?: (rating: number) => void;
  isReviewPage?: boolean;
  style?: React.CSSProperties;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, outOf = 5, onRatingChange, isReviewPage = false, style }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = outOf - fullStars - (hasHalfStar ? 1 : 0);

  const handleStarClick = (newRating: number) => {
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', ...style }}>
      {Array.from({ length: fullStars }, (_, i) => (
        <FaStar
          key={`full-${i}`}
          style={{
            color: 'darkred',
            fontSize: isReviewPage ? '1.5rem':'1rem',
            cursor: isReviewPage ? 'pointer' : 'default',
          }}
          onClick={() => isReviewPage && handleStarClick(i + 1)}
        />
      ))}

      {hasHalfStar && (
        <FaStarHalfAlt
          style={{
            color: 'darkred',
            fontSize: isReviewPage ? '1.5rem':'1rem',
            cursor: isReviewPage ? 'pointer' : 'default',
          }}
          onClick={() => isReviewPage && handleStarClick(fullStars + 0.5)}
        />
      )}
      
      {Array.from({ length: emptyStars }, (_, i) => (
        <FaRegStar
          key={`empty-${i}`}
          style={{
            color: 'darkred',
            fontSize: isReviewPage ? '1.5rem':'1rem',
            cursor: isReviewPage ? 'pointer' : 'default',
          }}
          onClick={() => isReviewPage && handleStarClick(fullStars + i + 1)}
        />
      ))}
    </div>
  );
};

export default StarRating;
