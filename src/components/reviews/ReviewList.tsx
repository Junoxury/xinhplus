import { ReviewCard } from './ReviewCard'

interface ReviewListProps {
  reviews: {
    id: string
    beforeImage: string
    afterImage: string
    additionalImagesCount?: number
    rating: number
    content: string
    author: string
    authorImage?: string
    date: string
    treatmentName: string
    categories: string[]
    isLocked?: boolean
    location: string
    clinicName: string
    commentCount: number
    viewCount: number
  }[]
  layout?: 'grid' | 'vertical'
}

export function ReviewList({ 
  reviews,
  layout = 'grid'
}: ReviewListProps) {
  return (
    <div className={`
      grid gap-6
      ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}
    `}>
      {reviews.map((review) => (
        <div key={review.id}>
          <ReviewCard {...review} />
        </div>
      ))}
    </div>
  )
} 