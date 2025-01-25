'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BannerItem {
  image: string;
  title: string;
  description: string;
}

const banners: BannerItem[] = [
  {
    image: "/20ee6483edab484ea531ec20ae0c0cf3_ebe1b7ad-72bf-4be6-a1b2-328ba658569c.webp",
    title: "",
    description: ""
  },
  {
    image: "/1690247054567_c4c3090fd8894938af8d9c492dd59540.webp",
    title: "",
    description: ""
  },
  {
    image: "/1721896662007_2faa4ad965bd48dd8e5992c2a30aa2cf.webp",
    title: "",
    description: ""
  }
];

export const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalBanners = banners.length;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextBanner = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalBanners);
  };

  const prevBanner = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalBanners) % totalBanners);
  };

  useEffect(() => {
    intervalRef.current = setInterval(nextBanner, 3000); // 3초마다 다음 배너로 이동
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[150px] md:h-[300px] overflow-hidden">
      {banners.map((banner, index) => (
        <div key={index} className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
          <img 
            src={banner.image} 
            alt={`Banner ${index + 1}`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white">
            <h2 className="text-2xl font-bold">{banner.title}</h2>
            <p className="text-lg">{banner.description}</p>
          </div>
        </div>
      ))}
      
      {/* 네비게이션 버튼 */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
        <Button variant="ghost" size="icon" className="bg-white/50 hover:bg-white/75" onClick={prevBanner}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="bg-white/50 hover:bg-white/75" onClick={nextBanner}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* 배너 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <div key={index} className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-500'}`} />
        ))}
      </div>
    </div>
  )
}

export default Banner; 