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
    isGoogle?: boolean
    likeCount: number
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
          <ReviewCard
            id={review.id}
            beforeImage={review.beforeImage}
            afterImage={review.afterImage}
            rating={review.rating}
            content={review.content}
            author={review.author}
            authorImage={review.authorImage}
            date={review.date}
            treatmentName={review.treatmentName}
            categories={review.categories}
            location={review.location}
            clinicName={review.clinicName}
            commentCount={review.commentCount}
            viewCount={review.viewCount}
            isGoogle={review.isGoogle}
            likeCount={review.likeCount}
            layout={layout}
          />
        </div>
      ))}
    </div>
  )
} 