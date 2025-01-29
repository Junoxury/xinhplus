import Image from 'next/image'
import { Heart, MapPin, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/utils/format'
import Link from 'next/link'

interface TreatmentCardProps {
  id: number
  title: string
  summary: string
  hospital_name: string
  city_name: string
  thumbnail_url: string
  price: number
  discount_price: number
  discount_rate: number
  rating: number
  comment_count: number
  categories: {
    depth2_id: number
    depth2_name: string
    depth3_list: {
      id: number
      name: string
    }[]
  }[]
  is_advertised: boolean
  is_recommended: boolean
  disableLink?: boolean
}

export function TreatmentCard({
  id,
  title,
  summary,
  hospital_name,
  city_name,
  thumbnail_url,
  price,
  discount_price,
  discount_rate,
  rating,
  comment_count,
  categories,
  is_advertised,
  is_recommended,
  disableLink
}: TreatmentCardProps) {
  const CardContent = () => (
    <div className="w-full overflow-x-hidden">
      <div className="rounded-2xl overflow-hidden bg-white">
        <div className="md:block flex">
          {/* 이미지 섹션 */}
          <div className="relative md:w-full md:h-[200px] w-[120px] h-[120px] flex-shrink-0">
            <Image
              src={thumbnail_url || '/placeholder.jpg'}
              alt={title}
              fill
              sizes="(max-width: 768px) 120px, (max-width: 1200px) 50vw, 33vw"
              className="object-cover md:rounded-none rounded-2xl"
              priority
            />
            {/* Top badges */}
            <div className="absolute top-2 left-2 flex gap-1">
              {is_recommended && (
                <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  추천
                </div>
              )}
              {is_advertised && (
                <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  AD
                </div>
              )}
            </div>
            {/* Bookmark button - div로 변경 */}
            <div className="absolute top-2 right-2 md:p-2 p-1 md:bg-white/80 bg-transparent backdrop-blur-sm rounded-full">
              <Heart className="md:w-5 md:h-5 w-4 h-4" />
            </div>
          </div>

          {/* 컨텐츠 섹션 */}
          <div className="p-4 flex-1 md:pt-4 pt-0">
            {/* Title and description */}
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <p className="text-sm text-gray-600 md:line-clamp-2 line-clamp-1 mb-2">{summary}</p>

            {/* Location and clinic */}
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="line-clamp-1">{city_name} - {hospital_name}</span>
            </div>

            {/* PC 버전 Rating */}
            <div className="md:flex hidden items-center mb-3">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="font-bold mr-1">{rating.toFixed(1)}</span>
              <span className="text-gray-600">({comment_count})</span>
            </div>

            {/* 모바일 버전 Price + Rating 한 줄로 */}
            <div className="md:hidden flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">{discount_rate}%</span>
                <span className="font-bold">{formatPrice(discount_price)}</span>
                <span className="text-sm text-gray-400 line-through">{formatPrice(price)}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="font-bold mr-1">{rating.toFixed(1)}</span>
                <span className="text-gray-600">({comment_count})</span>
              </div>
            </div>

            {/* PC 버전 Price */}
            <div className="md:block hidden mb-3">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold text-lg">{discount_rate}%</span>
                <span className="font-bold text-lg">{formatPrice(discount_price)}</span>
              </div>
              <div>
                <span className="text-sm text-gray-400 line-through">{formatPrice(price)}</span>
              </div>
            </div>

            {/* Categories - PC에서만 표시 */}
            <div className="md:flex hidden flex-wrap gap-1">
              {categories?.map((category, index) => (
                <Badge 
                  key={index} 
                  className="rounded-full text-xs px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-800 border-0"
                >
                  {category.depth2_name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // 카드 전체를 감싸는 컨테이너
  const Container = disableLink 
    ? ({ children }: { children: React.ReactNode }) => <div>{children}</div>
    : ({ children }: { children: React.ReactNode }) => (
        <Link href={`/treatments/detail?id=${id}`} className="block">
          {children}
        </Link>
      );

  return (
    <Container>
      <CardContent />
    </Container>
  )
} 