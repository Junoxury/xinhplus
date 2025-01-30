'use client'

import { CategoryIcon } from '@/components/category/CategoryIcon'
import { TreatmentBanner } from '@/components/treatments/TreatmentBanner'
import { TreatmentFilter } from '@/components/treatments/TreatmentFilter'
import { TreatmentList } from '@/components/treatments/TreatmentList'
import { useState, useEffect, useRef, useCallback } from 'react'
import bodyPartsData from '@/data/bodyParts.json'
import treatmentMethodsData from '@/data/treatmentMethods.json'
import { CategorySection } from '@/components/treatments/CategorySection'
import Image from 'next/image'
import { Share2, Heart, Home, Facebook, Phone, MessageCircle, Mail, Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, ChevronLeft, ChevronUp } from 'lucide-react'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { TreatmentCard } from '@/components/treatments/TreatmentCard'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { GoogleMap } from '@/components/map/GoogleMap'
import { useToast } from "@/hooks/use-toast"
import { Toast } from "@/components/ui/toast"

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

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="group relative">
      {/* 좌우 화살표 */}
      <button
        onClick={() => handleScroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-x-1/2"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => handleScroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-1/2"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 스크롤 컨테이너 */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
      >
        {children}
      </div>
    </div>
  )
}

// 병원 정보 타입 정의
interface HospitalDetail {
  id: number
  hospital_name: string
  city_id: number
  business_hours: string
  address: string
  phone: string
  email: string
  website: string
  facebook_url: string
  youtube_url: string
  tiktok_url: string
  instagram_url: string
  zalo_id: string
  description: string
  thumbnail_url: string
  detail_content: string
  latitude: number
  longitude: number
  is_advertised: boolean
  is_recommended: boolean
  is_member: boolean
  has_discount: boolean
  view_count: number
  like_count: number
  average_rating: number
  city_name: string
  city_name_vi: string
  city_name_ko: string
  categories: {
    depth2: {
      id: number
      label: string
    }
    depth3: Array<{
      id: number
      label: string
      parent_id: number
    }>
  }[]
}

// 시술 정보 페이지
export default function TreatmentDetailPage() {
  const [showFullImage, setShowFullImage] = useState(false)
  const [activeTab, setActiveTab] = useState('detail-section')
  const tabRef = useRef<HTMLDivElement>(null)
  const tabContainerRef = useRef<HTMLDivElement>(null)
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null)

  const searchParams = useSearchParams()
  const hospitalId = searchParams.get('id')
  const [hospital, setHospital] = useState<HospitalDetail | null>(null)
  const { toast } = useToast()

  // 대표 시술 상태 추가
  const [featuredTreatments, setFeaturedTreatments] = useState<Treatment[]>([])

  // 병원의 모든 시술 상태 추가
  const [allTreatments, setAllTreatments] = useState<Treatment[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const ITEMS_PER_PAGE = 8

  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)

  // 리뷰 관련 상태들
  const [recentReviews, setRecentReviews] = useState<any[]>([])
  const [reviewPage, setReviewPage] = useState(1)
  const [hasMoreReviews, setHasMoreReviews] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(false)
  const REVIEWS_PER_PAGE = 6

  // 상태 추가
  const [reviewSortBy, setReviewSortBy] = useState('latest')

  // 인증 상태 추가
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 인증 상태 확인을 위한 useEffect 추가
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchHospital = async () => {
      if (!hospitalId) return

      const { data, error } = await supabase
        .rpc('get_hospital_detail', {
          p_hospital_id: Number(hospitalId)
        })

      if (error) {
        console.error('Error fetching hospital detail:', error)
        return
      }

      if (data && data[0]) {
        setHospital(data[0])
        console.log('Hospital data:', data[0])
      }
    }

    fetchHospital()
  }, [hospitalId])

  useEffect(() => {
    let isScrolling: NodeJS.Timeout

    const handleScroll = () => {
      if (tabRef.current && tabContainerRef.current) {
        // 탭 고정 처리만 수행
        const tabPosition = tabContainerRef.current.getBoundingClientRect().top
        if (tabPosition <= 56) {
          if (!tabRef.current.classList.contains('fixed')) {
            tabRef.current.classList.add('fixed', 'top-[56px]', 'left-0', 'right-0', 'z-10', 'bg-white', 'shadow-sm')
            tabContainerRef.current.style.paddingTop = `${tabRef.current.offsetHeight}px`
          }
        } else {
          if (tabRef.current.classList.contains('fixed')) {
            tabRef.current.classList.remove('fixed', 'top-[56px]', 'left-0', 'right-0', 'z-10', 'bg-white', 'shadow-sm')
            tabContainerRef.current.style.paddingTop = '0'
          }
        }

        // 디바운스된 탭 활성화 처리
        clearTimeout(isScrolling)
        isScrolling = setTimeout(() => {
          const sections = ['detail-section', 'review-section', 'similar-section']
          for (const sectionId of sections) {
            const section = document.getElementById(sectionId)
            if (section) {
              const rect = section.getBoundingClientRect()
              if (rect.top <= 120 && rect.bottom > 120) {
                setActiveTab(sectionId)
                break
              }
            }
          }
        }, 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(isScrolling)
    }
  }, [])

  // 탭 클릭 시 스크롤 처리
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      setActiveTab(sectionId)
      const offset = element.offsetTop - 112
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      })
    }
  }

  // 더보기 버튼 클릭 핸들러
  const handleShowMore = () => {
    setShowFullImage(true)
    
    // DOM 업데이트 후 스크롤 위치 조정
    requestAnimationFrame(() => {
      const detailSection = document.getElementById('detail-section')
      if (detailSection) {
        const currentScrollPosition = window.scrollY
        const sectionTop = detailSection.offsetTop
        const headerHeight = 56
        const tabHeight = 56
        
        // 현재 스크롤 위치가 섹션 내부인 경우에만 스크롤 조정
        if (currentScrollPosition > sectionTop - (headerHeight + tabHeight)) {
          window.scrollTo({
            top: sectionTop - (headerHeight + tabHeight),
            behavior: 'smooth'
          })
        }
      }
    })
  }

  const handleShare = async () => {
    try {
      // 현재 URL 복사
      await navigator.clipboard.writeText(window.location.href)
      
      // 토스트 메시지 표시
      toast({
        description: "URL이 클립보드에 복사되었습니다.",
        duration: 2000, // 2초 후 자동으로 사라짐
      })
    } catch (error) {
      console.error('URL 복사 실패:', error)
      toast({
        variant: "destructive",
        description: "URL 복사에 실패했습니다.",
        duration: 2000,
      })
    }
  }

  // 리뷰 데이터 로드 함수에서 정렬 기준 적용
  useEffect(() => {
    const fetchReviews = async () => {
      if (!hospital?.id) return
      setLoadingReviews(true)

      try {
        const { data, error } = await supabase.rpc('get_reviews', {
          p_treatment_id: null,
          p_hospital_id: hospital.id,
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
          p_sort_by: reviewSortBy,  // 정렬 기준 적용
          p_limit: REVIEWS_PER_PAGE,
          p_offset: (reviewPage - 1) * REVIEWS_PER_PAGE
        })

        if (error) {
          console.error('리뷰 데이터 로드 에러:', error)
          throw error
        }

        console.log('받아온 리뷰 데이터:', data) // 데이터 확인용 로그

        if (data && Array.isArray(data)) {
          const formattedReviews = data.map(review => ({
            id: review.id,
            beforeImage: review.before_image || '',
            afterImage: review.after_image || '',
            additionalImagesCount: review.additional_images_count || 0,
            rating: review.rating || 0,
            content: review.content || '',
            author: review.author_name || '익명',
            authorImage: review.author_image || '/images/default-avatar.png',
            date: new Date(review.created_at).toLocaleDateString(),
            treatmentName: review.treatment_name || '',
            categories: review.categories ? [review.categories.depth2?.name, review.categories.depth3?.name].filter(Boolean) : [],
            isAuthenticated: isAuthenticated,  // 인증 상태 전달
            is_locked: !isAuthenticated,  // 로그인 상태에 따라 잠금 여부 결정
            location: review.location || '위치 정보 없음',
            clinicName: review.hospital_name || '',
            commentCount: review.comment_count || 0,
            viewCount: review.view_count || 0,
            isGoogle: review.is_google || false,
            likeCount: review.like_count || 0
          }))

          console.log('변환된 리뷰 데이터:', formattedReviews) // 변환된 데이터 확인용 로그

          if (reviewPage === 1) {
            setRecentReviews(formattedReviews)
          } else {
            setRecentReviews(prev => [...prev, ...formattedReviews])
          }
          
          setHasMoreReviews(data.length === REVIEWS_PER_PAGE)
        }
      } catch (error) {
        console.error('리뷰 데이터 로드 실패:', error)
      } finally {
        setLoadingReviews(false)
      }
    }

    fetchReviews()
  }, [hospital?.id, reviewPage, reviewSortBy, isAuthenticated])  // reviewSortBy 의존성 추가

  // 더보기 버튼 핸들러
  const handleLoadMoreReviews = () => {
    setReviewPage(prev => prev + 1)
  }

  // 병원의 모든 시술 가져오기
  const fetchAllTreatments = useCallback(async (isLoadMore = false) => {
    if (!hospital?.id) return

    try {
      const { data, error } = await supabase
        .rpc('get_treatments', { 
          p_city_id: null,
          p_depth2_category_id: null,
          p_depth3_category_id: null,
          p_hospital_id: hospital.id,
          p_is_advertised: null,
          p_is_discounted: null,
          p_is_recommended: null,
          p_limit: ITEMS_PER_PAGE,
          p_offset: page * ITEMS_PER_PAGE,
          p_price_from: null,
          p_price_to: null,
          p_sort_by: 'view_count'
        })

      if (error) {
        console.error('Error fetching all treatments:', error)
        return
      }

      if (data) {
        // 대표 시술 ID들을 제외한 시술만 필터링
        const filteredData = data.filter(
          treatment => !featuredTreatments.some(
            featured => featured.id === treatment.id
          )
        )

        if (isLoadMore) {
          setAllTreatments(prev => [...prev, ...filteredData])
        } else {
          setAllTreatments(filteredData)
        }
        setHasMore(data.length === ITEMS_PER_PAGE)
      }

    } catch (error) {
      console.error('Error in fetchAllTreatments:', error)
    }
  }, [hospital?.id, page, featuredTreatments])

  // 초기 로드
  useEffect(() => {
    setPage(0)
    if (featuredTreatments.length > 0) {
      fetchAllTreatments()
    }
  }, [fetchAllTreatments])

  // 더보기 클릭 시
  const handleLoadMore = () => {
    setPage(prev => prev + 1)
    fetchAllTreatments(true)
  }

  // 대표 시술 가져오기
  useEffect(() => {
    const fetchFeaturedTreatments = async () => {
      if (!hospital?.id) return

      try {
        const { data, error } = await supabase
          .rpc('get_treatments', { 
            p_city_id: null,
            p_depth2_category_id: null,
            p_depth3_category_id: null,
            p_hospital_id: hospital.id,
            p_is_advertised: null,
            p_is_discounted: null,
            p_is_recommended: null,
            p_limit: 3,  // 3개만 가져오기
            p_offset: 0,
            p_price_from: null,
            p_price_to: null,
            p_sort_by: 'view_count'  // 조회수 순으로 정렬
          })

        if (error) {
          console.error('Error fetching featured treatments:', error)
          return
        }

        if (data) {
          setFeaturedTreatments(data)
        }

      } catch (error) {
        console.error('Error in fetchFeaturedTreatments:', error)
      }
    }

    fetchFeaturedTreatments()
  }, [hospital?.id])

  // 좋아요 상태 확인
  useEffect(() => {
    const checkLikeStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user || !hospitalId) return
      
      const { data, error } = await supabase
        .rpc('check_hospital_like', {
          p_hospital_id: Number(hospitalId),
          p_user_id: session.user.id
        })

      if (!error && data) {
        setIsLiked(data)
      }
    }

    checkLikeStatus()
  }, [hospitalId])

  // 좋아요 토글 함수
  const handleLike = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      router.push('/login')
      return
    }

    try {
      const { data, error } = await supabase
        .rpc('toggle_hospital_like', {
          p_hospital_id: Number(hospitalId),
          p_user_id: session.user.id
        })

      if (error) throw error

      if (data && data[0]) {
        setIsLiked(data[0].is_liked)
        setHospital(prev => prev ? {
          ...prev,
          like_count: data[0].like_count
        } : null)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast({
        variant: "destructive",
        description: "오류가 발생했습니다. 다시 시도해주세요.",
        duration: 2000,
      })
    }
  }

  // 정렬 변경 핸들러
  const handleReviewSortChange = (value: string) => {
    setReviewSortBy(value)
    setReviewPage(1)  // 정렬 변경 시 페이지 초기화
    setRecentReviews([])  // 리뷰 목록 초기화
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-[72px] md:pb-[88px]">
      <TreatmentBanner />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          병원/클리닉 소개
        </h1>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* 좌측 이미지 */}
            <div className="md:w-1/3 relative overflow-hidden">
              <div className="aspect-[2/1] md:aspect-[4/3] relative">
                <Image
                  src={hospital?.thumbnail_url || "https://via.placeholder.com/800x400"}
                  alt={hospital?.hospital_name || "Hospital"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* 배지 */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {hospital?.is_advertised && (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                      AD
                    </span>
                  )}
                  {hospital?.is_member && (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                      Member
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 우측 상세 정보 */}
            <div className="md:w-2/3 p-6">
              {/* 소셜 아이콘 */}
              <div className="flex justify-end items-center gap-1 mb-4">
                <button 
                  onClick={handleShare}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
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
                {hospital?.website && (
                  <Link 
                    href={hospital.website} 
                    target="_blank" 
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Home className="w-5 h-5 text-gray-600" />
                  </Link>
                )}
                {hospital?.facebook_url && (
                  <Link 
                    href={hospital.facebook_url} 
                    target="_blank" 
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-gray-600" />
                  </Link>
                )}
                {hospital?.zalo_id && (
                  <Link 
                    href={`https://zalo.me/${hospital.zalo_id}`}
                    target="_blank" 
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Image
                      src="/images/zalo.svg"
                      width={20}
                      height={20}
                      alt="Zalo"
                      className="w-5 h-5"
                    />
                  </Link>
                )}
              </div>

              {/* 제목 */}
              <h1 className="text-2xl font-bold mb-2 -mt-1">
                {hospital?.hospital_name}
              </h1>

              {/* 위치, 평점 */}
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <span>{hospital?.city_name}</span>
                <span>•</span>
                <span className="flex items-center">
                  ⭐️ {hospital?.average_rating.toFixed(1)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {hospital?.view_count.toLocaleString()}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Heart 
                    className={`w-4 h-4 cursor-pointer ${isLiked ? 'fill-current text-red-500' : ''}`}
                    onClick={handleLike}
                  />
                  {hospital?.like_count?.toLocaleString() || 0}
                </span>
              </div>

              {/* 요약 설명 */}
              <div className="mb-6 text-gray-600">
                <p className="leading-relaxed">{hospital?.description}</p>
              </div>

              {/* 카테고리 태그 */}
              <div className="space-y-3">
                {hospital?.categories?.map((category, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2">
                    {/* Depth2 카테고리 */}
                    <span className="px-4 py-2 rounded-full bg-pink-500 text-white text-sm font-medium">
                      {category.depth2.label}
                    </span>

                    {/* Depth3 카테고리들 */}
                    <div className="flex flex-wrap gap-2">
                      {category.depth3.map((depth3, idx) => (
                        <span 
                          key={idx}
                          className="px-4 py-2 rounded-full bg-pink-100 text-pink-500 text-sm"
                        >
                          {depth3.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* 탭 메뉴 컨테이너 */}
        <div ref={tabContainerRef} className="sticky top-[56px] bg-white z-[100]">
          {/* 탭 메뉴 */}
          <div ref={tabRef} className="container mx-auto px-4">
            <div className="flex w-full border border-gray-300">
              <button 
                onClick={() => scrollToSection('detail-section')}
                className={`flex-1 text-center py-4 cursor-pointer border-r border-gray-300 transition-colors
                  ${activeTab === 'detail-section' ? 'bg-blue-500 text-white' : 'text-gray-800 hover:bg-gray-100'}`}
              >
                병원정보
              </button>
              <button 
                onClick={() => scrollToSection('review-section')}
                className={`flex-1 text-center py-4 cursor-pointer border-r border-gray-300 transition-colors
                  ${activeTab === 'review-section' ? 'bg-blue-500 text-white' : 'text-gray-800 hover:bg-gray-100'}`}
              >
                후기
              </button>
              <button 
                onClick={() => scrollToSection('similar-section')}
                className={`flex-1 text-center py-4 cursor-pointer transition-colors
                  ${activeTab === 'similar-section' ? 'bg-blue-500 text-white' : 'text-gray-800 hover:bg-gray-100'}`}
              >
                병원의 다른 시술
              </button>
            </div>
          </div>
        </div>
        {/* 병원 상세 정보 및 지도 섹션 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 좌측: 병원 상세 정보 */}
            <div className="md:w-1/2 space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-3">진료 시간</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>평일</span>
                    <span>{hospital?.business_hours}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">주소</h3>
                <p className="text-gray-600">
                  {hospital?.address}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">연락처</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{hospital?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{hospital?.email}</span>
                  </div>
                  {hospital?.zalo_id && (
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/zalo.svg"
                        width={16}
                        height={16}
                        alt="Zalo"
                        className="w-4 h-4"
                      />
                      <span>Zalo: {hospital.zalo_id}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3">온라인 채널</h3>
                <div className="space-y-2 text-gray-600">
                  {hospital?.website && (
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      <Link href={hospital.website} target="_blank" className="hover:text-blue-500">
                        {hospital.website}
                      </Link>
                    </div>
                  )}
                  {hospital?.facebook_url && (
                    <div className="flex items-center gap-2">
                      <Facebook className="w-4 h-4" />
                      <Link href={hospital.facebook_url} target="_blank" className="hover:text-blue-500">
                        {hospital.facebook_url}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 우측: 구글 지도 */}
            <div className="md:w-1/2">
              {hospital?.latitude && hospital?.longitude && (
                <GoogleMap 
                  latitude={hospital.latitude}
                  longitude={hospital.longitude}
                  zoom={15}
                />
              )}
            </div>
          </div>
        </div>
        {/* 상세 설명 섹션 */}
        <div id="detail-section" className="bg-white rounded-2xl shadow-sm overflow-hidden scroll-mt-[112px]">
          <div className="flex flex-col md:flex-row">
            {/* 좌측 상세 설명 */}
            <div className="md:w-2/3">
              <div className={`relative ${!showFullImage ? 'max-h-[800px]' : ''} overflow-hidden`}>
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-4">상세 설명</h2>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: hospital?.detail_content || '' 
                    }} 
                  />
                </div>
                {!showFullImage && (
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>
              {!showFullImage && (
                <div className="p-6 pt-0 text-center">
                  <Button
                    onClick={handleShowMore}
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
              <h2 className="text-lg font-bold mb-4">대표 시술</h2>
              <div className="space-y-4">
                {featuredTreatments.map((treatment) => (
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
                      <h3 className="font-medium mb-2 hover:text-pink-500 transition-colors line-clamp-2">
                        {treatment.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {treatment.summary}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span>⭐️ {treatment.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({treatment.comment_count})</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 mb-2 line-clamp-1">
                      {treatment.city_name} - {treatment.hospital_name}
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
                ))}
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

        {/* 인기 시술 섹션 */}
        <div id="similar-section" className="bg-white rounded-2xl shadow-sm overflow-hidden p-6 scroll-mt-[112px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{hospital?.hospital_name}의 다른 시술</h2>
          </div>
          {/* PC 버전 - 4열 그리드로 변경 */}
          <div className="hidden md:grid grid-cols-4 gap-4">
            {allTreatments.map((treatment) => (
              <div key={treatment.id}>
                <TreatmentCard {...treatment} />
              </div>
            ))}
          </div>
          {/* 모바일 버전은 그대로 유지 */}
          <div className="md:hidden flex flex-col gap-4">
            {allTreatments.map((treatment) => (
              <div key={treatment.id}>
                <TreatmentCard {...treatment} />
              </div>
            ))}
          </div>

          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                className="w-full max-w-[200px]"
              >
                더보기
              </Button>
            </div>
          )}
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