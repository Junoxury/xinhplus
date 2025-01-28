'use client'

import React from 'react'
import { CategoryIcon } from '@/components/category/CategoryIcon'
import { TreatmentBanner } from '@/components/treatments/TreatmentBanner'
import { TreatmentFilter } from '@/components/treatments/TreatmentFilter'
import { TreatmentList } from '@/components/treatments/TreatmentList'
import { useState, useEffect, useRef } from 'react'
import bodyPartsData from '@/data/bodyParts.json'
import treatmentMethodsData from '@/data/treatmentMethods.json'
import { CategorySection } from '@/components/treatments/CategorySection'
import Image from 'next/image'
import { Share2, Heart, Home, Facebook, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { TreatmentCard } from '@/components/treatments/TreatmentCard'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// 더미 시술 데이터 수정
const treatments = [
  {
    id: 1,
    title: '눈매교정 3종',
    description: '자연스러운 눈매 교정과 눈밑 지방 재배치로 생기있는 눈매를 만듭니다',
    clinic: '뷰티라이프',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 5.0,
    reviewCount: 12546,
    originalPrice: 87000000,
    discountRate: 45,
    location: 'Hanoi - Thẩm mỹ viện Nana',
    categories: ['눈매교정', '쌍꺼풀', '눈성형'],
    isNew: true,
    isAd: false
  },
  {
    id: 2,
    title: '코 성형 패키지',
    description: '자연스러운 코 라인을 위한 맞춤 성형',
    clinic: '뷰티라이프',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.9,
    reviewCount: 8234,
    originalPrice: 95000000,
    discountRate: 35,
    location: 'Hanoi - Thẩm mỹ viện Nana',
    categories: ['코성형', '코필러'],
    isNew: false,
    isAd: true
  },
  {
    id: 3,
    title: '안면윤곽 패키지',
    description: '자연스러운 라인 교정으로 갸름한 얼굴형을 만듭니다',
    clinic: '뷰티라이프',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.8,
    reviewCount: 6789,
    originalPrice: 120000000,
    discountRate: 40,
    location: 'Hanoi - Thẩm mỹ viện Nana',
    categories: ['안면윤곽', '턱성형'],
    isNew: true,
    isAd: false
  },
  {
    id: 4,
    title: '이마 지방이식',
    description: '자연스러운 이마 라인과 탄력있는 피부를 동시에',
    clinic: '뷰티라이프',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.7,
    reviewCount: 5432,
    originalPrice: 75000000,
    discountRate: 30,
    location: 'Hanoi - Thẩm mỹ viện Nana',
    categories: ['이마', '지방이식'],
    isNew: true,
    isAd: true
  },
  {
    id: 5,
    title: '리프팅 패키지',
    description: '울쎄라 리프팅과 피부재생 관리를 동시에',
    clinic: '뷰티라이프',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.9,
    reviewCount: 4567,
    originalPrice: 65000000,
    discountRate: 25,
    location: 'Hanoi - Thẩm mỹ viện Nana',
    categories: ['리프팅', '피부관리'],
    isNew: false,
    isAd: false
  },
  {
    id: 6,
    title: '턱 필러',
    description: '자연스러운 턱 라인 교정으로 세련된 인상을 만듭니다',
    clinic: '뷰티라이프',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.6,
    reviewCount: 3456,
    originalPrice: 45000000,
    discountRate: 20,
    location: 'Hanoi - Thẩm mỹ viện Nana',
    categories: ['턱성형', '필러'],
    isNew: true,
    isAd: true
  },
  {
    id: 7,
    title: '눈밑 지방재배치',
    description: '자연스러운 눈밑 교정으로 피곤해 보이지 않는 인상을 만듭니다',
    clinic: '뷰티라이프',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.8,
    reviewCount: 2345,
    originalPrice: 55000000,
    discountRate: 35,
    location: 'Hanoi - Thẩm mỹ viện Nana',
    categories: ['눈성형', '지방이식'],
    isNew: false,
    isAd: false
  },
  {
    id: 8,
    title: '볼륨 필러',
    description: '자연스러운 볼륨감으로 어려보이는 얼굴을 만듭니다',
    clinic: '뷰티라이프',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.7,
    reviewCount: 1234,
    originalPrice: 35000000,
    discountRate: 30,
    location: 'Hanoi - Thẩm mỹ viện Nana',
    categories: ['필러', '볼륨'],
    isNew: true,
    isAd: false
  },
  {
    id: 9,
    title: '레이저 토닝',
    description: '피부 톤 개선과 모공 관리를 동시에',
    clinic: '뷰티라이프',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.5,
    reviewCount: 987,
    originalPrice: 25000000,
    discountRate: 15,
    location: 'Hanoi - Thẩm mỹ viện Nana',
    categories: ['레이저', '피부관리'],
    isNew: false,
    isAd: true
  },
  {
    id: 10,
    title: '실리프팅',
    description: '자연스러운 리프팅 효과로 탄력있는 피부를 만듭니다',
    clinic: '뷰티라이프',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.6,
    reviewCount: 876,
    originalPrice: 45000000,
    discountRate: 25,
    location: 'Hanoi - Thẩm mỹ viện Nana',
    categories: ['리프팅', '실리프팅'],
    isNew: true,
    isAd: false
  },
  {
    id: 11,
    title: '지방흡입',
    description: '부분 지방흡입으로 라인을 교정합니다',
    clinic: '뷰티라이프',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.7,
    reviewCount: 765,
    originalPrice: 85000000,
    discountRate: 40,
    location: 'Hanoi - Thẩm mỹ viện Nana',
    categories: ['지방흡입', '바디라인'],
    isNew: false,
    isAd: true
  },
  {
    id: 12,
    title: '보톡스',
    description: '자연스러운 주름 개선과 라인 교정',
    clinic: '뷰티라이프',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.8,
    reviewCount: 654,
    originalPrice: 15000000,
    discountRate: 20,
    location: 'Hanoi - Thẩm mỹ viện Nana',
    categories: ['보톡스', '주름개선'],
    isNew: true,
    isAd: false
  }
];

// TreatmentCard 컴포넌트에 전달할 props 타입 정의
export interface TreatmentCardProps {
  id: number;
  title: string;
  clinic: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  discount: number;
  location: string;
  tags: string[];
}

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

interface TreatmentDetail {
  id: number
  hospital_id: number
  hospital_name: string
  title: string
  summary: string
  detail_content: string
  city_id: number
  city_name: string
  thumbnail_url: string
  price: number
  discount_price: number
  discount_rate: number
  rating: number
  view_count: number
  like_count: number
  comment_count: number
  is_advertised: boolean
  is_recommended: boolean
  is_discounted: boolean
  categories: {
    depth2_id: number
    depth2_name: string
    depth3_list: {
      id: number
      name: string
    }[]
  }[]
  website?: string
  facebook_url?: string
  zalo_id?: string
  phone?: string
}

// 시술 정보 페이지
export default function TreatmentDetailPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [treatment, setTreatment] = useState<TreatmentDetail | null>(null)
  const [showFullImage, setShowFullImage] = useState(false)
  const [activeTab, setActiveTab] = useState('detail-section')
  const tabRef = useRef<HTMLDivElement>(null)
  const tabContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchTreatmentDetail = async () => {
      if (!id) return

      try {
        const { data, error } = await supabase
          .rpc('get_treatment_detail', { 
            p_treatment_id: Number(id) 
          })

        if (error) {
          console.error('Error fetching treatment detail:', error)
          return
        }

        if (data && data.length > 0) {
          setTreatment(data[0])
        }

      } catch (error) {
        console.error('Error in fetchTreatmentDetail:', error)
      }
    }

    fetchTreatmentDetail()
  }, [id])

  useEffect(() => {
    const handleScroll = () => {
      // 탭 고정 처리
      if (tabRef.current && tabContainerRef.current) {
        const tabPosition = tabContainerRef.current.getBoundingClientRect().top
        if (tabPosition <= 56) { // 헤더 높이
          tabRef.current.classList.add('fixed', 'top-[56px]', 'left-0', 'right-0', 'z-10', 'bg-white', 'shadow-sm')
          tabContainerRef.current.style.paddingTop = `${tabRef.current.offsetHeight}px`
        } else {
          tabRef.current.classList.remove('fixed', 'top-[56px]', 'left-0', 'right-0', 'z-10', 'bg-white', 'shadow-sm')
          tabContainerRef.current.style.paddingTop = '0'
        }

        // 활성 탭 변경
        const sections = ['detail-section', 'review-section', 'similar-section']
        for (const sectionId of sections) {
          const section = document.getElementById(sectionId)
          if (section) {
            const rect = section.getBoundingClientRect()
            if (rect.top <= 112 && rect.bottom >= 112) { // 헤더 높이 + 탭 높이
              setActiveTab(sectionId)
              break
            }
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    const headerHeight = 56 // 헤더 높이
    const tabHeight = 56 // 탭 높이
    const totalOffset = headerHeight + tabHeight // 총 오프셋

    if (element) {
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - totalOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // 리뷰 데이터
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
      clinicName: '뷰티클리닉',
      commentCount: 10,
      viewCount: 1234
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
      clinicName: '뷰티클리닉',
      commentCount: 5,
      viewCount: 856
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
      clinicName: '뷰티클리닉',
      commentCount: 7,
      viewCount: 2431
    }
  ]

  // 인기 시술 데이터
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
    }
  ]

  if (!treatment) return null

  return (
    <main className="min-h-screen bg-gray-50 pb-[72px] md:pb-[88px]">
      <TreatmentBanner />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* 좌측 이미지 - 2:1 비율 */}
            <div className="md:w-1/3 relative">
              <div className="aspect-[2/1]">
                <Image
                  src={treatment.thumbnail_url}
                  alt={treatment.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 우측 상세 정보 */}
            <div className="md:w-2/3 p-6">
              {/* 소셜 아이콘 */}
              <div className="flex justify-end items-center gap-1 mb-4">
                <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                {treatment.website && (
                  <a 
                    href={treatment.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Home className="w-5 h-5 text-gray-600" />
                  </a>
                )}
                {treatment.facebook_url && (
                  <a 
                    href={treatment.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-gray-600" />
                  </a>
                )}
                {treatment.zalo_id && (
                  <a 
                    href={`https://zalo.me/${treatment.zalo_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Image
                      src="/images/zalo.svg"
                      width={20}
                      height={20}
                      alt="Zalo"
                      className="w-5 h-5"
                    />
                  </a>
                )}
              </div>

              {/* 제목 */}
              <h1 className="text-2xl font-bold mb-4">{treatment.title}</h1>

              {/* 위치, 평점 */}
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <span>{treatment.city_name} - {treatment.hospital_name}</span>
                <span>•</span>
                <span className="flex items-center">
                  ⭐️ {treatment.rating.toFixed(1)}
                  <span className="text-gray-400 ml-1">({treatment.comment_count})</span>
                </span>
              </div>

              {/* 요약 설명 */}
              <div className="mb-6 text-gray-600">
                <p className="leading-relaxed">{treatment.summary}</p>
              </div>

              {/* 카테고리 태그 */}
              <div className="space-y-3">
                {treatment.categories?.map((category) => (
                  <div key={category.depth2_id} className="flex flex-wrap items-center gap-2">
                    {/* Depth2 카테고리 */}
                    <span className="px-3 py-1.5 rounded-full bg-pink-500 text-white text-sm">
                      {category.depth2_name}
                    </span>

                    {/* Depth3 카테고리들 */}
                    <div className="flex flex-wrap gap-2">
                      {category.depth3_list?.map((depth3) => (
                        <span 
                          key={depth3.id}
                          className="px-3 py-1.5 rounded-full bg-pink-100 text-pink-500 text-sm"
                        >
                          {depth3.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 가격 정보 */}
              <div className="flex items-baseline justify-end gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-bold text-xl">
                    {treatment.discount_rate}%
                  </span>
                  <span className="text-gray-400 line-through">
                    {treatment.price.toLocaleString()} VND
                  </span>
                </div>
                <span className="text-black text-3xl font-bold">
                  {treatment.discount_price.toLocaleString()} VND
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* 탭 메뉴 컨테이너 */}
        <div ref={tabContainerRef} className="sticky top-[56px] bg-white z-[100]">
          {/* 탭 메뉴 */}
          <div ref={tabRef} className="container mx-auto px-4">
            <div className="flex w-full border border-gray-300">
              <div 
                onClick={() => scrollToSection('detail-section')}
                className={`flex-1 text-center py-4 cursor-pointer border-r border-gray-300 hover:bg-blue-600 transition-colors
                  ${activeTab === 'detail-section' ? 'bg-blue-500 text-white' : 'text-gray-800 hover:bg-gray-100'}`}
              >
                상세설명
              </div>
              <div 
                onClick={() => scrollToSection('review-section')}
                className={`flex-1 text-center py-4 cursor-pointer border-r border-gray-300 hover:bg-blue-600 transition-colors
                  ${activeTab === 'review-section' ? 'bg-blue-500 text-white' : 'text-gray-800 hover:bg-gray-100'}`}
              >
                후기
              </div>
              <div 
                onClick={() => scrollToSection('similar-section')}
                className={`flex-1 text-center py-4 cursor-pointer hover:bg-blue-600 transition-colors
                  ${activeTab === 'similar-section' ? 'bg-blue-500 text-white' : 'text-gray-800 hover:bg-gray-100'}`}
              >
                같은 종류 시술
              </div>
            </div>
          </div>
        </div>
        {/* 상세 설명 섹션 */}
        <div id="detail-section" className="bg-white rounded-2xl shadow-sm overflow-hidden scroll-mt-[112px]">
          <div className="flex flex-col md:flex-row">
            {/* 좌측 상세 설명 HTML */}
            <div className="md:w-2/3 relative">
              <div className={`relative ${!showFullImage ? 'h-[800px]' : ''} overflow-hidden`}>
                <div 
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: treatment.detail_content }}
                />
                {!showFullImage && (
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
                )}
              </div>
              {!showFullImage && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <Button
                    onClick={() => setShowFullImage(true)}
                    variant="outline"
                    className="bg-white shadow-md"
                  >
                    더보기 <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* 우측 관련 시술 카드 */}
            <div className="md:w-1/3 p-6 border-l">
              <h2 className="text-lg font-bold mb-4">병원의 다른 시술</h2>
              <div className="space-y-4">
                {treatments.slice(0, 3).map((treatment) => (
                  <div
                    key={treatment.id}
                    className="p-4 border rounded-lg hover:border-pink-500 transition-colors cursor-pointer"
                  >
                    <div className="aspect-[2/1] relative mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={treatment.image}
                        alt={treatment.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-medium mb-2">{treatment.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{treatment.clinic}</span>
                      <div className="flex items-center gap-1">
                        <span>⭐️ {treatment.rating}</span>
                        <span className="text-gray-400">({treatment.reviewCount})</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-baseline justify-end gap-2">
                      <span className="text-red-500 font-bold">{treatment.discountRate}%</span>
                      <span className="text-gray-400 line-through">
                        {treatment.originalPrice.toLocaleString()} VND
                      </span>
                      <span className="text-black font-bold">
                        {(treatment.originalPrice * (1 - treatment.discountRate / 100)).toLocaleString()} VND
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 섹션 */}
        <div id="review-section" className="bg-white rounded-2xl shadow-sm overflow-hidden p-6 scroll-mt-[112px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">실시간 후기</h2>
            <Button variant="ghost" className="text-sm text-muted-foreground h-8 gap-1" asChild>
              <Link href="/reviews">
                전체보기
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <HorizontalScroll>
            <div className="flex gap-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="w-[85vw] md:w-[600px] flex-shrink-0 relative z-[1]">
                  <ReviewCard {...review} />
                </div>
              ))}
            </div>
          </HorizontalScroll>
        </div>

        {/* 인기 시술 섹션 */}
        <div id="similar-section" className="bg-white rounded-2xl shadow-sm overflow-hidden p-6 scroll-mt-[112px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">같은 종류 시술</h2>
            <Button variant="ghost" className="text-sm text-muted-foreground h-8 gap-1" asChild>
              <Link href="/treatments">
                전체보기
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
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
          <div className="md:hidden flex flex-col gap-4">
            {popularTreatments.map((treatment) => (
              <div key={treatment.id}>
                <TreatmentCard {...treatment} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 플로팅 아이콘 */}
      <div className="fixed right-4 bottom-[140px] md:bottom-24 flex flex-col gap-3 z-[100]">
        {/* 상담신청 아이콘 */}
        <button 
          className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
        </button>

        {/* Zalo 아이콘 */}
        <a 
          href="#" 
          className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
        >
          <Image
            src="/images/zalo.svg"
            width={24}
            height={24}
            alt="Zalo"
            className="w-6 h-6"
          />
        </a>

        {/* 전화 아이콘 - 모바일에서만 표시 */}
        <a 
          href="tel:+84123456789" 
          className="md:hidden w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 bg-white border-t z-[100] safe-area-bottom">
        <div className="container mx-auto px-4 py-3 flex gap-2">
          <Link 
            href="#" 
            className="flex-1 px-4 py-3 bg-pink-500 text-white rounded-lg text-center font-medium hover:bg-pink-600 transition-colors text-sm md:text-base"
          >
            병원 바로가기
          </Link>
          <Link 
            href="#" 
            className="flex-1 px-4 py-3 bg-violet-500 text-white rounded-lg text-center font-medium hover:bg-violet-600 transition-colors text-sm md:text-base"
          >
            리뷰쓰기
          </Link>
          <button 
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg text-center font-medium hover:bg-blue-600 transition-colors text-sm md:text-base"
          >
            상담신청
          </button>
        </div>
      </div>
    </main>
  )
} 