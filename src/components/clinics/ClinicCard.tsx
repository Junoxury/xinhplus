import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star, MapPin, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ClinicCardProps {
  id: string | number;
  title: string;
  description: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  viewCount?: number;
  categories: Array<string | {
    id: number;
    name: string;
    key?: string;
  }>;
  isRecommended?: boolean;
  isAd?: boolean;
  isMember?: boolean;
  isGoogle?: boolean;
  disableLink?: boolean;
}

export function ClinicCard({
  id,
  title,
  description,
  image,
  location,
  rating,
  reviewCount,
  viewCount = 0,
  categories,
  isRecommended,
  isAd,
  isMember,
  isGoogle,
  disableLink
}: ClinicCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    // TODO: 좋아요 API 호출
  };

  const CardContent = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <div className="relative aspect-[4/3]">
        <Image
          src={image || '/images/placeholder.png'}
          alt={`${title} - ${description || '병원 이미지'}`}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {isAd && (
            <Badge 
              variant="secondary" 
              className="bg-black/60 text-white backdrop-blur-sm border-0"
            >
              AD
            </Badge>
          )}
          {isRecommended && (
            <Badge 
              className="bg-black/60 text-white backdrop-blur-sm border-0"
            >
              추천
            </Badge>
          )}
          {isMember && (
            <Badge 
              className="bg-black/60 text-white backdrop-blur-sm border-0"
            >
              Member
            </Badge>
          )}
        </div>
        {isGoogle && (
          <div className="absolute bottom-2 right-2">
            <Badge 
              variant="secondary"
              className="bg-black/60 text-white backdrop-blur-sm border-0 text-xs"
            >
              By Google
            </Badge>
          </div>
        )}
        <button 
          onClick={handleLikeClick}
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white/90 transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {description}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <span>•</span>
          <div className="flex items-center">
            <Eye className="w-4 h-4 text-gray-400 mr-1" />
            <span>{viewCount.toLocaleString()}</span>
          </div>
          <span>•</span>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-gray-400 mr-1" />
            <span>{location}</span>
          </div>
        </div>

        {categories?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {categories.map((category, index) => {
              if (!category) return null;
              
              const categoryName = typeof category === 'string' ? category : category.name;
              const categoryKey = typeof category === 'string' ? category : category.id || category.name;
              
              return (
                <Badge 
                  key={`${categoryKey}-${index}`}
                  variant="outline"
                  className="text-xs px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-800 border-0"
                >
                  {categoryName}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const Container = disableLink 
    ? ({ children }: { children: React.ReactNode }) => <>{children}</>
    : ({ children }: { children: React.ReactNode }) => (
        <Link href={`/clinics/detail?id=${id}`} className="block">
          {children}
        </Link>
      );

  return (
    <Container>
      <CardContent />
    </Container>
  );
} 