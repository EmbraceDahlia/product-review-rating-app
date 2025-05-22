import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

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
      {/* Full Stars */}
      {Array.from({ length: fullStars }, (_, i) => (
        <i
          key={`full-${i}`}
          className="bi bi-star-fill"
          style={{
            color: 'darkred',
            fontSize: isReviewPage ? '1.5rem' : '1rem',
            cursor: isReviewPage ? 'pointer' : 'default',
          }}
          onClick={() => isReviewPage && handleStarClick(i + 1)}
        />
      ))}
      {hasHalfStar && (
        <i
          className="bi bi-star-half"
          style={{
            color: 'darkred',
            fontSize: isReviewPage ? '1.5rem' : '1rem',
            cursor: isReviewPage ? 'pointer' : 'default',
          }}
          onClick={() => isReviewPage && handleStarClick(fullStars + 0.5)}
        />
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <i
          key={`empty-${i}`}
          className="bi bi-star"
          style={{
            color: 'darkred',
            fontSize: isReviewPage ? '1.5rem' : '1rem',
            cursor: isReviewPage ? 'pointer' : 'default',
          }}
          onClick={() => isReviewPage && handleStarClick(fullStars + i + 1)}
        />
      ))}
    </div>
  );
};

export default StarRating;
