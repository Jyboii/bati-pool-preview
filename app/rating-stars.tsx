import { Star } from "lucide-react";

export default function RatingStars({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <span className="review-stars" role="img" aria-label={`${rating} étoiles sur 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={size} fill={index < rating ? "currentColor" : "none"} aria-hidden="true" />
      ))}
    </span>
  );
}
