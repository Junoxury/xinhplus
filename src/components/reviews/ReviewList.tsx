import { ReviewCard } from './ReviewCard'

interface ReviewListProps {
  reviews: any[];
  layout?: string;
  initialIsAuthenticated?: boolean;
}

export function ReviewList({ 
  reviews, 
  layout = "grid",
  initialIsAuthenticated = false
}: ReviewListProps) {
  return (
    <div className={`grid ${layout === "grid" ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
      {reviews.map((review) => (
        <ReviewCard 
          key={review.id} 
          {...review} 
          initialIsAuthenticated={initialIsAuthenticated}
        />
      ))}
    </div>
  )
} 