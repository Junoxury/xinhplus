import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ClinicCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  categories: Array<{
    id: number;
    name: string;
    key?: string;
  }>;
  isNew?: boolean;
  isAd?: boolean;
}

export function ClinicCard({
  id,
  title,
  description,
  image,
  rating,
  reviewCount,
  location,
  categories,
  isNew,
  isAd
}: ClinicCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <Link href={`/clinics/detail?id=${id}`}>
        <div className="relative aspect-[4/3]">
          <Image
            src={image || '/images/placeholder.png'}
            alt={title}
            fill
            className="object-cover"
          />
          {isAd && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              AD
            </Badge>
          )}
          {isNew && (
            <Badge className="absolute top-2 right-2 bg-primary">
              NEW
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/clinics/detail?id=${id}`} className="block">
          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <span>•</span>
          <span>리뷰 {reviewCount}</span>
          <span>•</span>
          <span>{location}</span>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {categories.map((category) => (
              <Badge 
                key={category.key || category.id} 
                variant="outline"
                className="text-xs"
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 