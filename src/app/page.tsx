'use client'

import { CategoryIcon } from '@/components/category/CategoryIcon'
import { TreatmentCard } from '@/components/treatments/TreatmentCard'
import { ClinicCard } from '@/components/clinics/ClinicCard'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { Banner } from '@/components/home/Banner'
import { useRef, MouseEvent, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShortCard } from '@/components/shorts/ShortCard'

 // Start of Selection
const bodyParts = [
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=eye&backgroundColor=white', label: '눈', href: '/treatments/eye' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=nose&backgroundColor=white', label: '코', href: '/treatments/nose' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=face&backgroundColor=white', label: '얼굴윤곽', href: '/treatments/face' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=skin&backgroundColor=white', label: '피부', href: '/treatments/skin' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=body&backgroundColor=white', label: '체형', href: '/treatments/body' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=lip&backgroundColor=white', label: '입술', href: '/treatments/lip' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=cheek&backgroundColor=white', label: '볼', href: '/treatments/cheek' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=forehead&backgroundColor=white', label: '이마', href: '/treatments/forehead' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=chin&backgroundColor=white', label: '턱', href: '/treatments/chin' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=eyebrow&backgroundColor=white', label: '눈썹', href: '/treatments/eyebrow' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=ear&backgroundColor=white', label: '귀', href: '/treatments/ear' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=neck&backgroundColor=white', label: '목', href: '/treatments/neck' },
]

const treatmentMethods = [
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=dental&backgroundColor=white', label: '치아', href: '/treatments/dental' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=hair&backgroundColor=white', label: '모발이식', href: '/treatments/hair' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=anti&backgroundColor=white', label: '항노화', href: '/treatments/anti-aging' },
  { icon: 'https://api.dicebear.com/7.x/icons/svg?seed=etc&backgroundColor=white', label: '기타', href: '/treatments/etc' },
]

const popularTreatments = [
  {
    id: '1',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fd63eb6911fceb3ec8341be1df5c73b92%2Fbanner_img_1735796998.jpg&w=384&q=75',
    title: '듀얼픽스 광대축소',
    description: '안체적인 윤곽, 광대축소, 사각턱, 턱끝',
    clinic: 'DR.AD BEAUTY CLINIC',
    location: 'Hanoi - Thẩm mỹ viện Nana',
    originalPrice: 6000000,
    discountRate: 45,
    rating: 5.0,
    reviewCount: 12546,
    categories: ['nose', 'Bottom eyelid', 'Eyelid surgery'],
    likes: 128,
    isAd: true,
    isNew: true
  },
  {
    id: '2',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F27e2ccb0cf265a3cb18ce6eff35f4174%2Fbanner_img_1723540041.jpg&w=384&q=75',
    title: '눈매교정',
    description: '자연스러운 눈매 교정과 눈밑 지방 재배치로 생기있는 눈매를 만듭니다',
    clinic: '뷰티라인 성형외과',
    location: 'Hanoi - Thẩm mỹ viện Beauty',
    originalPrice: 3500000,
    discountRate: 30,
    rating: 4.8,
    reviewCount: 8234,
    categories: ['Eyelid surgery', 'Bottom eyelid'],
    likes: 95,
    isNew: true
  },
  {
    id: '3',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fc50a6cece7c2170e489c6582a13888c4%2Fbanner_img_1731635515.jpg&w=384&q=75',
    title: '이마 지방이식',
    description: '자연스러운 이마 라인과 탄력있는 피부를 동시에',
    clinic: '미소성형외과',
    location: 'Ho Chi Minh - Thẩm mỹ viện Smile',
    originalPrice: 4500000,
    discountRate: 35,
    rating: 4.9,
    reviewCount: 5632,
    categories: ['Forehead', 'Fat transfer'],
    likes: 76,
    isAd: true
  },
  {
    id: '4',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    title: '코끝 성형',
    description: '자연스러운 코 라인을 위한 맞춤 성형',
    clinic: '라인성형외과',
    location: 'Hanoi - Thẩm mỹ viện Line',
    originalPrice: 2800000,
    discountRate: 40,
    rating: 4.7,
    reviewCount: 3421,
    categories: ['Nose', 'Filler'],
    likes: 112
  },
  {
    id: '5',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fde8c515ffae8cc73a0b0593dde02a79d%2Fbanner_img_1693882962.jpg&w=384&q=75',
    title: '피부 재생',
    description: '울쎄라 리프팅과 피부재생 관리를 동시에',
    clinic: '뷰티클리닉',
    location: 'Da Nang - Thẩm mỹ viện Beauty',
    originalPrice: 3000000,
    discountRate: 25,
    rating: 4.6,
    reviewCount: 2876,
    categories: ['Lifting', 'Skin care'],
    likes: 85
  }
]

const featuredClinics = [
  {
    id: '1',
    name: 'DR.AD BEAUTY CLINIC',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F38d62b3c8d715e4091438b05bf7cd223%2Fbanner_img_1718961017.jpg&w=384&q=75',
    description: '20년 전통의 성형외과 전문의',
    location: 'Hanoi',
    rating: 4.8,
    reviewCount: 1234,
    categories: ['Pore', 'Bottom eyelid', 'Eyelid surgery', 'Eyelid surgery', 'Eyelid surgery', '+8'],
    isRecommended: true,
    isAd: true,
    isMember: true
  },
  {
    id: '2',
    name: '뷰티라인 성형외과',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fd92aac925140c6a03aa0099e80362f55%2Fbanner_img_1736901184.jpg&w=384&q=75',
    description: '자연스러운 라인 교정 전문',
    location: 'Hanoi',
    rating: 4.7,
    reviewCount: 890,
    categories: ['Nose', 'Face contouring', 'Lifting'],
    isRecommended: true,
    isMember: true
  },
  {
    id: '3',
    name: '미소성형외과',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F25aacb6c5c5ffe729af9b47b4f2b0773%2Fbanner_img_1732092008.jpg&w=384&q=75',
    description: '맞춤형 성형 디자인',
    location: 'Ho Chi Minh',
    rating: 4.9,
    reviewCount: 756,
    categories: ['Eye', 'Nose', 'Face'],
    isAd: true
  },
  {
    id: '4',
    name: '라인성형외과',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fc72d8a826738d4b27a88c53797c3e6a4%2Fbanner_img_1720688591.jpg&w=384&q=75',
    description: '최신 장비 보유 전문의',
    location: 'Da Nang',
    rating: 4.6,
    reviewCount: 543,
    categories: ['Skin', 'Anti-aging', 'Lifting'],
    isRecommended: true
  },
  {
    id: '5',
    name: '뷰티클리닉',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F68f2c0df4eed8ca4376ffc27f879d925%2Fbanner_img_1732681027.jpg&w=384&q=75',
    description: '최신 장비 보유 전문의',
    location: 'Hanoi',
    rating: 4.6,
    reviewCount: 543,
    categories: ['Dental', 'Hair', 'Skin care'],
    isMember: true
  }
]

const recentReviews = [
  {
    id: '1',
    beforeImage: 'https://images.babitalk.com/reviews/761e1935f7c55175f7c5d542fa5eb0fb/small/0d5b1c4c7f720f698946c7f6ab08f687/0.jpg',
    afterImage: 'https://images.babitalk.com/reviews/761e1935f7c55175f7c5d542fa5eb0fb/small/0d5b1c4c7f720f698946c7f6ab08f687/0.jpg',
    rating: 5,
    content: '정말 만족스러운 결과였습니다. 자연스러운 라인으로 잘 수정해주셨어요. 처음에는 걱정이 많았는데, 상담부터 수술까지 정말 꼼꼼하게 설명해주시고 케어해주셔서 안심하고 진행할 수 있었습니다. 특히 수술 후 관리도 철저히 해주셔서 회복도 빠르게 됐어요. 주변 지인들도 자연스러워 보인다고 칭찬해주셔서 정말 기분이 좋습니다. 고민하시는 분들께 적극 추천드립니다! 앞으로도 꾸준히 관리 받으러 올 예정입니다.',
    author: '김**',
    date: '2024.03.15',
    treatmentName: '듀얼픽스 광대축소',
    categories: ['Pore', 'Bottom eyelid', 'Eyelid surgery'],
    additionalImagesCount: 4,
    isLocked: true,
    location: '강남구',
    clinicName: '뷰티클리닉'
  },
  {
    id: '2',
    beforeImage: 'https://images.babitalk.com/reviews/11f7cd5a760501fb579c71c8568dec16/small/0d5b1c4c7f720f698946c7f6ab08f687/0.jpg',
    afterImage: 'https://images.babitalk.com/reviews/11f7cd5a760501fb579c71c8568dec16/small/0d5b1c4c7f720f698946c7f6ab08f687/0.jpg',
    rating: 4,
    content: '상담부터 수술까지 친절하게 설명해주시고 결과도 좋았습니다. 눈매교정과 눈밑지방 재배치를 동시에 진행했는데, 자연스러운 라인으로 잘 수정해주셨어요. 수술 후 붓기가 걱정됐는데 회복 기간도 생각보다 빨랐고, 지금은 완전히 자연스러워졌습니다. 특히 눈밑 지방 재배치 후에 눈밑 다크서클이 개선되어서 화장 없이도 좋아 보여요. 수술 전후 관리도 꼼꼼히 해주셔서 감사합니다.',
    author: '이**',
    date: '2024.03.14',
    treatmentName: '눈매교정',
    categories: ['Eyelid surgery', 'Bottom eyelid'],
    additionalImagesCount: 2,
    location: '강남구',
    clinicName: '뷰티클리닉'
  },
  {
    id: '3',
    beforeImage: 'https://images.babitalk.com/reviews/a6d4fcd97737723d01a6af30c8d10407/small/0d5b1c4c7f720f698946c7f6ab08f687/0.jpg',
    afterImage: 'https://images.babitalk.com/reviews/a6d4fcd97737723d01a6af30c8d10407/small/0d5b1c4c7f720f698946c7f6ab08f687/0.jpg',
    rating: 4,
    content: '20대 후반부터 눈가 주름이 신경쓰여서 고민하다가 방문했는데, 정말 만족스러운 결과를 얻었습니다. 선생님께서 제 얼굴형과 특징을 고려해서 자연스러운 눈매를 만들어주셨어요. 수술 과정도 생각보다 편안했고, 회복도 빨랐습니다. 수술 후 붓기 관리부터 실밥 제거까지 꼼꼼하게 챙겨주셔서 감사했어요. 이제는 거울을 볼 때마다 기분이 좋아집니다. 다른 시술도 이곳에서 받고 싶어요!',
    author: '이**',
    date: '2024.03.14',
    treatmentName: '눈매교정',
    categories: ['Eyelid surgery', 'Bottom eyelid'],
    additionalImagesCount: 3,
    isLocked: true,
    location: '강남구',
    clinicName: '뷰티클리닉'
  }
]

// 지역별 인기 시술 데이터 추가
const localPopularTreatments = {
  hanoi: [
    {
      id: 'h1',
      image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F27e2ccb0cf265a3cb18ce6eff35f4174%2Fbanner_img_1723540041.jpg&w=384&q=75',
      title: '하노이 인기 눈매교정',
      description: '하노이 현지 의료진의 섬세한 눈매교정',
      clinic: '하노이뷰티클리닉',
      location: 'Hanoi - Thẩm mỹ viện Nana',
      originalPrice: 5500000,
      discountRate: 40,
      rating: 4.9,
      reviewCount: 3456,
      categories: ['Eye', 'Bottom eyelid'],
      likes: 234,
      isAd: true,
      isNew: true
    },
    {
      id: 'h2',
      image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fd63eb6911fceb3ec8341be1df5c73b92%2Fbanner_img_1735796998.jpg&w=384&q=75',
      title: '하노이 광대축소',
      description: '하노이 최다 시술 광대축소 프로그램',
      clinic: '하노이라인클리닉',
      location: 'Hanoi - Thẩm mỹ viện Line',
      originalPrice: 8500000,
      discountRate: 35,
      rating: 4.8,
      reviewCount: 2891,
      categories: ['Face', 'Jaw'],
      likes: 178,
      isAd: true
    },
    {
      id: 'h3',
      image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
      title: '하노이 코필러',
      description: '하노이 인증 의료진의 코필러 시술',
      clinic: '하노이미소클리닉',
      location: 'Hanoi - Thẩm mỹ viện Smile',
      originalPrice: 3200000,
      discountRate: 45,
      rating: 4.7,
      reviewCount: 1567,
      categories: ['Nose', 'Filler'],
      likes: 145,
      isNew: true
    },
    {
      id: 'h4',
      image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fc50a6cece7c2170e489c6582a13888c4%2Fbanner_img_1731635515.jpg&w=384&q=75',
      title: '하노이 안면윤곽',
      description: '하노이 맞춤형 안면윤곽 패키지',
      clinic: '하노이뷰티라인',
      location: 'Hanoi - Thẩm mỹ viện Beauty Line',
      originalPrice: 12000000,
      discountRate: 30,
      rating: 4.9,
      reviewCount: 892,
      categories: ['Face', 'Jaw', 'Chin'],
      likes: 167,
      isAd: true
    },
    {
      id: 'h5',
      image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fde8c515ffae8cc73a0b0593dde02a79d%2Fbanner_img_1693882962.jpg&w=384&q=75',
      title: '하노이 리프팅',
      description: '하노이 울쎄라 리프팅 프리미엄',
      clinic: '하노이엘리트클리닉',
      location: 'Hanoi - Thẩm mỹ viện Elite',
      originalPrice: 6800000,
      discountRate: 25,
      rating: 4.8,
      reviewCount: 734,
      categories: ['Lifting', 'Skin'],
      likes: 123,
      isNew: true
    }
  ],
  hochiminh: [
    {
      id: 'hcm1',
      image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fc50a6cece7c2170e489c6582a13888c4%2Fbanner_img_1731635515.jpg&w=384&q=75',
      title: '호치민 특화 안면윤곽',
      description: '호치민 1위 안면윤곽 전문의',
      clinic: '호치민성형외과',
      location: 'Ho Chi Minh - Thẩm mỹ viện Beauty',
      originalPrice: 7500000,
      discountRate: 35,
      rating: 4.8,
      reviewCount: 2789,
      categories: ['Face', 'Jaw'],
      likes: 189,
      isAd: true
    },
    // ... 더 많은 호치민 시술 데이터
  ],
  danang: [
    {
      id: 'd1',
      image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
      title: '다낭 인기 코성형',
      description: '다낭 대표 코성형 패키지',
      clinic: '다낭뷰티',
      location: 'Da Nang - Thẩm mỹ viện Line',
      originalPrice: 4800000,
      discountRate: 30,
      rating: 4.7,
      reviewCount: 1567,
      categories: ['Nose', 'Face'],
      likes: 156,
      isNew: true
    },
    // ... 더 많은 다낭 시술 데이터
  ]
}

// shorts 데이터 추가
const popularShorts = [
  {
    id: 's1',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fd63eb6911fceb3ec8341be1df5c73b92%2Fbanner_img_1735796998.jpg&w=384&q=75',
    title: '실제 수술 현장 - 자연스러운 눈매교정 LIVE',
    location: 'Hanoi',
    clinic: 'DR.AD BEAUTY CLINIC',
    categories: ['Eye', 'Bottom eyelid', 'Eyelid surgery']
  },
  {
    id: 's2',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F27e2ccb0cf265a3cb18ce6eff35f4174%2Fbanner_img_1723540041.jpg&w=384&q=75',
    title: '코필러 시술 전후 비교 - 10분 만에 달라진 코라인',
    location: 'Ho Chi Minh',
    clinic: '뷰티라인 성형외과',
    categories: ['Nose', 'Filler']
  },
  {
    id: 's3',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fc50a6cece7c2170e489c6582a13888c4%2Fbanner_img_1731635515.jpg&w=384&q=75',
    title: '울쎄라 리프팅 시술 과정 - 피부 탄력 개선',
    location: 'Da Nang',
    clinic: '미소성형외과',
    categories: ['Lifting', 'Skin care', 'Anti-aging']
  },
  {
    id: 's4',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    title: '실제 광대축소 수술 - 수술실 LIVE',
    location: 'Hanoi',
    clinic: '라인성형외과',
    categories: ['Face', 'Jaw', 'Face contouring']
  },
  {
    id: 's5',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fde8c515ffae8cc73a0b0593dde02a79d%2Fbanner_img_1693882962.jpg&w=384&q=75',
    title: '눈밑지방 재배치 수술 과정 - 다크서클 개선',
    location: 'Ho Chi Minh',
    clinic: '뷰티클리닉',
    categories: ['Eye', 'Bottom eyelid', 'Dark circle']
  }
]

// TOP5 데이터 추가
const topSearches = [
  "1. 듀얼픽스 광대축소",
  "2. 눈매교정",
  "3. 이마 지방이식",
  "4. 코끝 성형",
  "5. 피부 재생"
];

function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e: MouseEvent) => {
    isDown.current = true
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grabbing'
      startX.current = e.pageX - scrollRef.current.offsetLeft
      scrollLeft.current = scrollRef.current.scrollLeft
    }
  }

  const onMouseLeave = () => {
    isDown.current = false
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'
    }
  }

  const onMouseUp = () => {
    isDown.current = false
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'
    }
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!isDown.current) return
    e.preventDefault()
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft
      const walk = (x - startX.current) * 2
      scrollRef.current.scrollLeft = scrollLeft.current - walk
    }
  }

  const scrollTo = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="group relative">
      {/* 좌우 화살표 */}
      <button
        onClick={() => scrollTo('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-x-1/2"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => scrollTo('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-1/2"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 스크롤 컨테이너 */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide horizontal-scroll -mx-4 px-4"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {children}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<'hanoi' | 'hochiminh' | 'danang'>('hanoi')

  return (
    <main className="min-h-screen">
      <Banner />
      
      {/* 카테고리 섹션 */}
      <section className="section-category py-4 md:py-12">
        <div className="container">
          {/* 모바일 뷰 */}
          <div className="md:hidden">
            <HorizontalScroll>
              <div className="flex gap-1">
                {[...bodyParts, ...treatmentMethods].map((item) => (
                  <div key={item.href} className="w-[60px] flex-shrink-0">
                    <CategoryIcon {...item} />
                  </div>
                ))}
              </div>
            </HorizontalScroll>
          </div>

          {/* PC 뷰 */}
          <div className="hidden md:flex space-x-8 w-full">
            {/* 첫 번째 영역: 부위 아이콘 (50%) */}
            <div className="flex flex-col w-1/2">
              <h2 className="text-lg font-bold mb-4">부위</h2>
              <div className="grid grid-cols-6 gap-2">
                {bodyParts.map((category) => (
                  <CategoryIcon key={category.href} {...category} />
                ))}
              </div>
            </div>

            {/* 두 번째 영역: 시술 아이콘 (25%) */}
            <div className="flex flex-col w-1/4">
              <h2 className="text-lg font-bold mb-4">시술</h2>
              <div className="grid grid-cols-4 gap-2">
                {treatmentMethods.map((method) => (
                  <CategoryIcon key={method.href} {...method} />
                ))}
              </div>
            </div>

            {/* 세 번째 영역: TOP 5 (25%) */}
            <div className="flex flex-col w-1/4">
              <h2 className="text-lg font-bold mb-4">시술 조회수 TOP 5</h2>
              <ul className="space-y-2">
                {popularTreatments.map((treatment, index) => (
                  <li key={index} className="flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white font-bold rounded-full mr-2">{index + 1}</span>
                    <span className="text-md font-medium">{treatment.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 모바일 TOP5 섹션 */}
      <section className="md:hidden py-3 bg-gray-50">
        <div className="container">
          <div className="-mx-4 px-4 overflow-hidden">
            <div className="animate-scrollText whitespace-nowrap flex gap-6">
              {[...topSearches, ...topSearches].map((item, index) => {
                const [rank, title] = item.split('. ');
                return (
                  <span 
                    key={index} 
                    className="text-sm inline-flex items-center gap-1.5"
                  >
                    <span className="font-bold text-purple-600">{rank}.</span>
                    <span className="text-gray-600">{title}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 인기 시술 섹션 */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">인기 시술</h2>
            <Button variant="ghost" className="text-sm text-muted-foreground h-8 gap-1" asChild>
              <a href="/treatments">
                전체보기
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
          {/* PC 버전 - 슬라이드 */}
          <div className="hidden md:block">
            <HorizontalScroll>
              <div className="flex gap-4">
                {popularTreatments.map((treatment) => (
                  <div key={treatment.id} className="w-[300px] flex-shrink-0">
                    <TreatmentCard {...treatment} />
                  </div>
                ))}
              </div>
            </HorizontalScroll>
          </div>
          {/* 모바일 버전 - 세로 리스트 */}
          <div className="md:hidden flex flex-col gap-4">
            {popularTreatments.map((treatment) => (
              <TreatmentCard
                key={treatment.id}
                {...treatment}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 지역별 인기 시술 섹션 */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">나의 지역</h2>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <Button 
                  variant={selectedLocation === 'hanoi' ? 'default' : 'outline'}
                  onClick={() => setSelectedLocation('hanoi')}
                  className="min-w-[70px] h-8 text-sm"
                >
                  하노이
                </Button>
                <Button 
                  variant={selectedLocation === 'hochiminh' ? 'default' : 'outline'}
                  onClick={() => setSelectedLocation('hochiminh')}
                  className="min-w-[70px] h-8 text-sm"
                >
                  호치민
                </Button>
                <Button 
                  variant={selectedLocation === 'danang' ? 'default' : 'outline'}
                  onClick={() => setSelectedLocation('danang')}
                  className="min-w-[70px] h-8 text-sm"
                >
                  다낭
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* PC 버전 - 슬라이드 */}
          <div className="hidden md:block">
            <HorizontalScroll>
              <div className="flex gap-4">
                {localPopularTreatments[selectedLocation].map((treatment) => (
                  <div key={treatment.id} className="w-[300px] flex-shrink-0">
                    <TreatmentCard {...treatment} />
                  </div>
                ))}
              </div>
            </HorizontalScroll>
          </div>

          {/* 모바일 버전 - 세로 리스트 */}
          <div className="md:hidden flex flex-col gap-4">
            {localPopularTreatments[selectedLocation].map((treatment) => (
              <TreatmentCard
                key={treatment.id}
                {...treatment}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 추천 병원 섹션 */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#F5F0FF' }}>
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">추천 병원</h2>
            <Button variant="ghost" className="text-sm text-muted-foreground h-8 gap-1" asChild>
              <a href="/clinics">
                전체보기
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <HorizontalScroll>
            <div className="flex gap-4">
              {featuredClinics.map((clinic) => (
                <div key={clinic.id} className="w-[calc(50vw-2rem)] md:w-[300px] flex-shrink-0">
                  <ClinicCard {...clinic} />
                </div>
              ))}
            </div>
          </HorizontalScroll>
        </div>
      </section>
      {/* 인기 Shorts 섹션 */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">인기 Shorts</h2>
            <Button variant="ghost" className="text-sm text-muted-foreground h-8 gap-1" asChild>
              <a href="/shorts">
                전체보기
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* PC 버전 - 슬라이드 */}
          <div className="hidden md:block">
            <HorizontalScroll>
              <div className="flex gap-4">
                {popularShorts.map((short) => (
                  <div key={short.id} className="w-[240px] flex-shrink-0">
                    <ShortCard {...short} />
                  </div>
                ))}
              </div>
            </HorizontalScroll>
          </div>

          {/* 모바일 버전 - 한 줄에 2개씩 + 다음 카드 살짝 보이기 */}
          <div className="md:hidden -mx-4 px-4">
            <HorizontalScroll>
              <div className="flex gap-4">
                {popularShorts.map((short) => (
                  <div key={short.id} className="w-[42vw] flex-shrink-0">
                    <ShortCard {...short} />
                  </div>
                ))}
              </div>
            </HorizontalScroll>
          </div>
        </div>
      </section>
      
      {/* 후기 섹션 - 배경색 변경 */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#F8F9FC' }}>
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">실시간 후기</h2>
            <Button variant="ghost" className="text-sm text-muted-foreground h-8 gap-1" asChild>
              <a href="/reviews">
                전체보기
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="-mx-4 px-4">
            <HorizontalScroll>
              <div className="flex gap-4">
                {recentReviews.map((review, index) => (
                  <div key={index} className="w-[85vw] md:w-[600px] flex-shrink-0">
                    <ReviewCard {...review} />
                  </div>
                ))}
              </div>
            </HorizontalScroll>
          </div>
        </div>
      </section>

      
    </main>
  )
}
