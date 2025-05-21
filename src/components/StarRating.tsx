import React from 'react';

interface StarRatingProps {
    rating: number;
    outOf?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, outOf = 5 }) => {
    const safeOutOf = Math.max(1, Math.floor(outOf)); 
    const safeRating = Math.max(0, Math.min(rating, safeOutOf));

    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating - fullStars >= 0.5;
    const emptyStars = safeOutOf - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div style={{ color: '#ffc107', display: 'inline-flex' }}>
            {Array.from({ length: fullStars }, (_, i) => (
                <span key={`full-${i}`}>★</span>
            ))}
            {hasHalfStar && <span key="half">&#189;</span>}
            {Array.from({ length: Math.max(0, emptyStars) }, (_, i) => (
                <span key={`empty-${i}`}>☆</span> 
            ))}
        </div>
    );
};

export default StarRating;
