"use client";

"use client";

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
  className?: string;
}

export default function StarRating({
  rating,
  onRatingChange,
  readOnly = false,
  size = 20,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((index) => {
        const currentRating = hoverRating || rating;
        return (
          <Star
            key={index}
            size={size}
            className={cn(
              'cursor-pointer transition-colors',
              currentRating >= index ? 'text-accent fill-accent' : 'text-muted-foreground',
              readOnly && 'cursor-default',
              !readOnly && 'hover:text-accent/80'
            )}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            aria-label={`Rate ${index} star${index > 1 ? 's' : ''}`}
          />
        );
      })}
    </div>
  );
}
