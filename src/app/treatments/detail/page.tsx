'use client'

import React, { Suspense } from 'react'
import { CategoryIcon } from '@/components/category/CategoryIcon'
import { TreatmentBanner } from '@/components/treatments/TreatmentBanner'
import { TreatmentFilter } from '@/components/treatments/TreatmentFilter'
import { TreatmentList } from '@/components/treatments/TreatmentList'
import { useState, useEffect, useRef } from 'react'
import bodyPartsData from '@/data/bodyParts.json'
import treatmentMethodsData from '@/data/treatmentMethods.json'
import { CategorySection } from '@/components/treatments/CategorySection'
import Image from 'next/image'
import { Share2, Heart, Home, Facebook, Phone, MessageCircle, Eye, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { TreatmentCard } from '@/components/treatments/TreatmentCard'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

interface Category {
  depth2_id: number;
  depth2_name: string;
  depth3_list: {
    id: number;
    name: string;
  }[];
}

interface Treatment {
  id: number;
  hospital_id: number;
  hospital_name: string;
  title: string;
  summary: string;
  thumbnail_url: string;
  price: number;
  discount_price: number;
  discount_rate: number;
  rating: number;
  comment_count: number;
  view_count: number;
  like_count: number;
  is_advertised: boolean;
  is_recommended: boolean;
  is_discounted: boolean;
  is_liked: boolean;
  city_id: number;
  city_name: string;
  categories: Category[];
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
const TreatmentDetailContent = () => {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [treatment, setTreatment] = useState<TreatmentDetail | null>(null)
  const [otherTreatments, setOtherTreatments] = useState<Treatment[]>([])  // 타입 지정
  const [showFullImage, setShowFullImage] = useState(false)
  const [activeTab, setActiveTab] = useState('detail-section')
  const tabRef = useRef<HTMLDivElement>(null)
  const tabContainerRef = useRef<HTMLDivElement>(null)
  const [selectedDepth2Id, setSelectedDepth2Id] = useState<number | null>(null)
  const [similarTreatments, setSimilarTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState(false)
  const isFirstRender = useRef(true)
  const [recentReviews, setRecentReviews] = useState<any[]>([])
  const [reviewPage, setReviewPage] = useState(1)
  const [hasMoreReviews, setHasMoreReviews] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [reviewSortBy, setReviewSortBy] = useState('latest')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const REVIEWS_PER_PAGE = 6
  const router = useRouter()
  const [totalReviews, setTotalReviews] = useState(0)
  const [isContentExpanded, setIsContentExpanded] = useState(false)

  // 페이지 데이터 fetch 함수
  const fetchTreatmentDetail = async (treatmentId: string) => {
    if (!treatmentId) return
    if (loading) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .rpc('get_treatment_detail', { 
          p_treatment_id: Number(treatmentId) 
        })

      if (error) {
        console.error('Error fetching treatment detail:', error)
        return
      }

      if (data && data.length > 0) {
        setTreatment(data[0])
        // 페이지 최상단으로 스크롤
        window.scrollTo(0, 0)
      }

    } catch (error) {
      console.error('Error in fetchTreatmentDetail:', error)
    } finally {
      setLoading(false)
    }
  }

  // id가 변경될 때마다 데이터 다시 불러오기
  useEffect(() => {
    if (id) {
      fetchTreatmentDetail(id)
    }
  }, [id])

  // 같은 종류 시술 클릭 핸들러
  const handleTreatmentClick = (treatmentId: number) => {
    fetchTreatmentDetail(treatmentId.toString())
  }

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

  // 병원의 다른 시술 가져오기
  const fetchOtherTreatments = async () => {
    if (!treatment?.hospital_id) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .rpc('get_treatments', { 
          p_city_id: null,
          p_depth2_category_id: null,
          p_depth3_category_id: null,
          p_hospital_id: treatment.hospital_id,
          p_is_advertised: null,
          p_is_discounted: null,
          p_is_recommended: null,
          p_limit: 3,
          p_offset: 0,
          p_price_from: null,
          p_price_to: null,
          p_sort_by: 'view_count',
          p_search_term: null,
          p_user_id: user?.id || null
        })

      if (error) {
        console.error('Error fetching other treatments:', error)
        return
      }

      if (data) {
        const formattedTreatments = data
          .filter((t: Treatment) => t.id !== treatment.id)
          .map((item: Treatment) => ({
            ...item,
            rating: Number(item.rating || 0),
            comment_count: item.comment_count || 0,
            view_count: item.view_count || 0,
            like_count: item.like_count || 0,
            categories: item.categories || [],
            is_advertised: Boolean(item.is_advertised),
            is_recommended: Boolean(item.is_recommended),
            is_discounted: Boolean(item.is_discounted),
            is_liked: Boolean(item.is_liked)
          }))

        setOtherTreatments(formattedTreatments)
      }

    } catch (error) {
      console.error('Error in fetchOtherTreatments:', error)
    }
  }

  useEffect(() => {
    fetchOtherTreatments()
  }, [treatment?.hospital_id])

  useEffect(() => {
    // 첫 번째 depth2 카테고리 ID로 초기화
    if (treatment?.categories && treatment.categories.length > 0) {
      setSelectedDepth2Id(treatment.categories[0].depth2_id)
    }
  }, [treatment])

  // 비슷한 시술 가져오기
  const fetchSimilarTreatments = async () => {
    if (!selectedDepth2Id) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .rpc('get_treatments', { 
          p_city_id: null,
          p_depth2_category_id: selectedDepth2Id,
          p_depth3_category_id: null,
          p_hospital_id: null,
          p_is_advertised: null,
          p_is_discounted: null,
          p_is_recommended: null,
          p_limit: 5,
          p_offset: 0,
          p_price_from: null,
          p_price_to: null,
          p_sort_by: 'view_count',
          p_search_term: null,
          p_user_id: user?.id || null
        })

      if (error) {
        console.error('Error fetching similar treatments:', error)
        return
      }

      if (data) {
        const formattedTreatments = data
          .filter((t: Treatment) => t.id !== treatment?.id)
          .map((item: Treatment) => ({
            ...item,
            rating: Number(item.rating || 0),
            comment_count: item.comment_count || 0,
            view_count: item.view_count || 0,
            like_count: item.like_count || 0,
            categories: item.categories || [],
            is_advertised: Boolean(item.is_advertised),
            is_recommended: Boolean(item.is_recommended),
            is_discounted: Boolean(item.is_discounted),
            is_liked: Boolean(item.is_liked)
          }))

        setSimilarTreatments(formattedTreatments)
      }

    } catch (error) {
      console.error('Error in fetchSimilarTreatments:', error)
    }
  }

  useEffect(() => {
    fetchSimilarTreatments()
  }, [selectedDepth2Id, treatment?.id])

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

  // 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // 리뷰 데이터 로드
  useEffect(() => {
    const fetchReviews = async () => {
      if (!treatment?.id) return
      setLoadingReviews(true)

      try {
        // 총 리뷰 개수 조회
        const { count: totalCount } = await supabase
          .from('reviews')
          .select('id', { count: 'exact' })
          .eq('treatment_id', treatment.id)

        setTotalReviews(totalCount || 0)

        const { data, error } = await supabase.rpc('get_reviews', {
          p_treatment_id: treatment.id,  // 시술 ID로 필터링
          p_hospital_id: null,
          p_depth2_id: null,
          p_depth2_treatment_id: null,
          p_depth3_id: null,
          p_depth3_treatment_id: null,
          p_is_recommended: false,
          p_has_discount: false,
          p_is_member: false,
          p_is_ad: false,
          p_location: null,
          p_min_price: 0,
          p_max_price: 1000000000,
          p_best_count: null,
          p_sort_by: reviewSortBy,
          p_limit: REVIEWS_PER_PAGE,
          p_offset: (reviewPage - 1) * REVIEWS_PER_PAGE
        })

        if (error) throw error

        if (data && Array.isArray(data)) {
          const formattedReviews = data.map(review => ({
            id: review.id,
            beforeImage: review.before_image || '',
            afterImage: review.after_image || '',
            additionalImagesCount: review.additional_images_count || 0,
            rating: review.rating || 0,
            content: review.content || '',
            author: review.author_name || '익명',
            authorImage: review.author_image || null,
            date: new Date(review.created_at).toLocaleDateString(),
            treatmentName: review.treatment_name || '',
            categories: review.categories ? [review.categories.depth2?.name, review.categories.depth3?.name].filter(Boolean) : [],
            isAuthenticated: isAuthenticated,
            is_locked: !isAuthenticated,
            location: review.location || '위치 정보 없음',
            clinicName: review.hospital_name || '',
            commentCount: review.comment_count || 0,
            viewCount: review.view_count || 0,
            isGoogle: review.is_google || false,
            likeCount: review.like_count || 0
          }))

          let newReviews;
          if (reviewPage === 1) {
            newReviews = formattedReviews;
            setRecentReviews(formattedReviews)
          } else {
            newReviews = [...recentReviews, ...formattedReviews];
            setRecentReviews(newReviews)
          }
          
          // 더보기 버튼 표시 조건 수정
          setHasMoreReviews(newReviews.length < (totalCount || 0))
        }
      } catch (error) {
        console.error('리뷰 데이터 로드 실패:', error)
      } finally {
        setLoadingReviews(false)
      }
    }

    fetchReviews()
  }, [treatment?.id, reviewPage, reviewSortBy, isAuthenticated])

  // 더보기 버튼 핸들러
  const handleLoadMoreReviews = () => {
    setReviewPage(prev => prev + 1)
  }

  // 정렬 변경 핸들러
  const handleReviewSortChange = (value: string) => {
    setReviewSortBy(value)
    setReviewPage(1)
    setRecentReviews([])
  }

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

  // 좋아요 상태 확인
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user || !treatment?.id) {
          setIsLiked(false)  // 로그인하지 않은 경우 false로 설정
          return
        }
        
        // 실제 좋아요 상태 확인
        const { data, error } = await supabase
          .rpc('check_treatment_like', {
            p_treatment_id: treatment.id,
            p_user_id: session.user.id
          })

        if (error) {
          console.error('Error checking like status:', error)
          setIsLiked(false)
          return
        }

        console.log('Like status checked:', data)  // 디버깅용
        setIsLiked(Boolean(data))
      } catch (error) {
        console.error('Error in checkLikeStatus:', error)
        setIsLiked(false)
      }
    }

    checkLikeStatus()
  }, [treatment?.id])  // treatment?.id가 변경될 때마다 실행

  // 좋아요 토글 함수에도 상태 체크 추가
  const handleLike = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      router.push('/login')
      return
    }

    try {
      const { data, error } = await supabase
        .rpc('toggle_treatment_like', {
          p_treatment_id: treatment?.id,
          p_user_id: session.user.id
        })

      if (error) throw error

      if (data && data[0]) {
        const newLikeStatus = data[0].is_liked
        console.log('New like status:', newLikeStatus)  // 디버깅용
        
        // 모든 관련 상태 동시에 업데이트
        setIsLiked(newLikeStatus)
        setTreatment(prev => prev ? {
          ...prev,
          like_count: data[0].like_count,
          is_liked: newLikeStatus
        } : null)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  // 좋아요 토글 핸들러 추가
  const handleLikeToggle = async (treatmentId: number, newState: boolean) => {
    // 다른 시술 업데이트
    setOtherTreatments(prev => 
      prev.map(treatment => 
        treatment.id === treatmentId 
          ? { ...treatment, is_liked: newState }
          : treatment
      )
    )

    // 비슷한 시술 업데이트
    setSimilarTreatments(prev => 
      prev.map(treatment => 
        treatment.id === treatmentId 
          ? { ...treatment, is_liked: newState }
          : treatment
      )
    )
  }

  if (!treatment) return null

  return (
    <div key={id}>
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
                  <button 
                    onClick={handleLike}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Heart 
                      className={`w-5 h-5 ${isLiked ? 'fill-current text-red-500' : 'text-gray-600'}`} 
                    />
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
                  <div className="flex items-center gap-3">
                    <span className="flex items-center">
                      ⭐️ {treatment.rating.toFixed(1)}
                    </span>
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{treatment.comment_count.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{treatment.view_count.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart 
                          className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current text-red-500' : 'text-gray-500'}`}
                        />
                        <span>{treatment.like_count.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
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
              <div className="md:w-2/3">
                <div className="p-6">
                  <div 
                    className={`w-full prose max-w-none relative ${!isContentExpanded ? 'max-h-[800px] overflow-hidden' : ''}`}
                  >
                    <div
                      className="w-full"
                      dangerouslySetInnerHTML={{ __html: treatment.detail_content }}
                    />
                    {!isContentExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                    )}
                  </div>
                  {!isContentExpanded && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        onClick={() => setIsContentExpanded(true)}
                        className="px-8"
                      >
                        <ChevronDown className="w-4 h-4 mr-2" />
                        더보기
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* 우측 관련 시술 카드 */}
              <div className="md:w-1/3 p-6 border-l">
                <h2 className="text-lg font-bold mb-4">병원의 다른 시술</h2>
                <div className="space-y-4">
                  {otherTreatments.length > 0 ? (
                    otherTreatments.map((treatment) => (
                      <div
                        key={treatment.id}
                        className="p-4 border rounded-lg hover:border-pink-500 transition-colors"
                      >
                        <Link href={`/treatments/detail?id=${treatment.id}`}>
                          <div className="aspect-[2/1] relative mb-3 rounded-lg overflow-hidden">
                            <Image
                              src={treatment.thumbnail_url}
                              alt={treatment.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <h3 className="font-medium mb-2 hover:text-pink-500 transition-colors">
                            {treatment.title}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{treatment.hospital_name}</span>
                          <div className="flex items-center gap-1">
                            <span>⭐️ {treatment.rating.toFixed(1)}</span>
                            <span className="text-gray-400">({treatment.comment_count})</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-end gap-2">
                          <span className="text-red-500 font-bold">{treatment.discount_rate}%</span>
                          <span className="text-gray-400 line-through">
                            {treatment.price.toLocaleString()} VND
                          </span>
                          <span className="text-black font-bold">
                            {treatment.discount_price.toLocaleString()} VND
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="mb-4 text-gray-500">
                        아직 등록된 Beauty가 없어요.
                        <br />
                        먼저 등록하세요!
                      </div>
                      <Button 
                        variant="default"
                        className="bg-pink-500 hover:bg-pink-600 text-white gap-2"
                        asChild
                      >
                        <Link href="/contact">
                          <MessageCircle className="w-4 h-4" />
                          Contact Us
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 리뷰 섹션 */}
          <div id="review-section" className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">실시간 후기</h2>
              <select 
                className="h-9 px-3 text-sm border rounded-md bg-background"
                value={reviewSortBy}
                onChange={(e) => handleReviewSortChange(e.target.value)}
              >
                <option value="latest">최신순</option>
                <option value="view_count">조회순</option>
                <option value="like_count">좋아요순</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="relative z-[1]">
                  <ReviewCard {...review} initialIsAuthenticated={isAuthenticated} />
                </div>
              ))}
            </div>
            {hasMoreReviews && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={handleLoadMoreReviews}
                  disabled={loadingReviews}
                  className="w-full md:w-[200px]"
                >
                  {loadingReviews ? '로딩중...' : '더보기'}
                </Button>
              </div>
            )}
          </div>

          {/* 같은 종류 시술 섹션 */}
          <div id="similar-section" className="bg-white rounded-2xl shadow-sm overflow-hidden p-6 scroll-mt-[112px]">
            <div className="flex flex-col space-y-6">
              {/* 헤더 */}
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">같은 종류 시술</h2>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {treatment.categories?.map((category) => (
                    <button
                      key={category.depth2_id}
                      onClick={() => setSelectedDepth2Id(category.depth2_id)}
                      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors
                        ${selectedDepth2Id === category.depth2_id 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {category.depth2_name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 시술 목록 */}
              <div className="hidden md:block">
                <HorizontalScroll>
                  <div className="flex gap-4">
                    {similarTreatments.map((treatment) => (
                      <div key={treatment.id} className="w-[300px] flex-shrink-0">
                        <TreatmentCard 
                          {...treatment} 
                          onLikeToggle={handleLikeToggle}
                          is_liked={treatment.is_liked}
                        />
                      </div>
                    ))}
                  </div>
                </HorizontalScroll>
              </div>
              <div className="md:hidden flex flex-col gap-4">
                {similarTreatments.map((treatment) => (
                  <div key={treatment.id}>
                    <TreatmentCard 
                      {...treatment} 
                      onLikeToggle={handleLikeToggle}
                      is_liked={treatment.is_liked}
                    />
                  </div>
                ))}
              </div>
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
              href={`/clinics/detail?id=${treatment?.hospital_id}`}
              className="flex-1 px-4 py-3 bg-pink-500 text-white rounded-lg text-center font-medium hover:bg-pink-600 transition-colors text-sm md:text-base"
            >
              병원 바로가기
            </Link>
            <Link 
              href={`/reviews/form?hospital_id=${treatment?.hospital_id}&treatment_id=${treatment?.id}`}
              className="flex-1 px-4 py-3 bg-violet-500 text-white rounded-lg text-center font-medium hover:bg-violet-600 transition-colors text-sm md:text-base"
            >
              리뷰쓰기
            </Link>
            <Link 
              href={`/treatments/consult?treatment_id=${treatment?.id}`}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg text-center font-medium hover:bg-blue-600 transition-colors text-sm md:text-base"
            >
              상담신청
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

// 메인 페이지 컴포넌트
export default function TreatmentDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <TreatmentDetailContent />
    </Suspense>
  )
} 