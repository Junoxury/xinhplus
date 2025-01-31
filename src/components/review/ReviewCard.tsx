import { Card } from "@/components/ui/card"
import { Star, MessageCircle, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ReviewCardProps {
  review: {
    id: number;
    title: string;
    content: string;
    author: string;        // 이메일 또는 닉네임
    authorImage?: string;  // 아바타 URL
    date: string;
    rating: number;
    commentCount: number;
    viewCount: number;
    images: { url: string; type: string }[];
    categories?: { name: string }[];
    hospitalName?: string;
    treatmentName?: string;
  };
  layout?: 'grid' | 'vertical';
  initialIsAuthenticated?: boolean;
}

function formatAuthorName(name: string) {
  console.log('Formatting author name:', name);
  if (name.includes('@')) {
    // 이메일인 경우: @ 앞부분을 최대 5글자까지만 표시
    const localPart = name.split('@')[0];
    const formatted = localPart.length > 5 
      ? localPart.substring(0, 5) + '...' 
      : localPart;
    console.log('Formatted result:', formatted);
    return formatted;
  }
  return name; // 닉네임인 경우 그대로 표시
}

export function ReviewCard({ review, layout = 'grid', initialIsAuthenticated = false }: ReviewCardProps) {
  const isGrid = layout === 'grid';
  console.log('Review author:', review.author);

  return (
    <Link href={`/reviews/detail?id=${review.id}`}>
      <Card className={`overflow-hidden hover:shadow-md transition-shadow ${isGrid ? '' : 'flex'}`}>
        {/* 이미지 섹션 */}
        <div className={`relative ${isGrid ? 'aspect-[4/3]' : 'w-32 h-32'}`}>
          <Image
            src={review.images[0]?.url || '/images/default-review.png'}
            alt={review.title}
            fill
            className={`object-cover ${
              review.images[0]?.type === 'before' && !initialIsAuthenticated ? 'brightness-[0.2] blur-[1.5px]' : ''
            }`}
          />
          {/* 이미지 타입 라벨 */}
          {review.images[0]?.type && (
            <span className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-sm text-xs">
              {review.images[0].type === 'after' ? 'After' : 'Before'}
            </span>
          )}
        </div>

        {/* 컨텐츠 섹션 */}
        <div className={`p-4 ${isGrid ? '' : 'flex-1'}`}>
          {/* 작성자 정보 */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`${isGrid ? 'w-10 h-10' : 'w-8 h-8'} rounded-full bg-pink-100 flex items-center justify-center overflow-hidden`}>
              {review.authorImage ? (
                <img 
                  src={review.authorImage} 
                  alt={review.author}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-pink-600 font-medium">
                  {review.author.split('@')[0].charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className={`${isGrid ? 'text-base' : 'text-sm'} font-semibold`}>
                {review.author ? formatAuthorName(review.author) : '익명'}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* 제목 & 내용 */}
          <h3 className={`font-bold mb-2 ${isGrid ? 'text-lg' : 'text-base'}`}>
            {review.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {review.content}
          </p>

          {/* 카테고리 태그 */}
          {review.categories && review.categories.length > 0 && (
            <div className="flex gap-2 mb-3">
              {review.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-pink-50 text-pink-600 rounded-md text-sm"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* 병원 & 시술 정보 */}
          {(review.hospitalName || review.treatmentName) && (
            <div className="text-sm text-gray-500 mb-3">
              {review.hospitalName && <p>{review.hospitalName}</p>}
              {review.treatmentName && <p>{review.treatmentName}</p>}
            </div>
          )}

          {/* 통계 정보 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm">{review.rating}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 text-gray-400" />
              <span className="ml-1 text-sm">{review.commentCount}</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="ml-1 text-sm">{review.viewCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
} 