'use client'

import { TreatmentBanner } from '@/components/treatments/TreatmentBanner'
import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import Image from 'next/image'
import { Share2, Heart, Home, Facebook, Phone, MessageCircle, Mail, Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { TreatmentCard } from '@/components/treatments/TreatmentCard'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { GoogleMap } from '@/components/map/GoogleMap'
import { useToast } from "@/hooks/use-toast"

interface CategoryStructure {
  depth2_id: number;
  depth2_name: string;
  depth3_list: {
    id: number;
    name: string;
  }[];
}

interface Treatment {
  id: number;
  title: string;
  thumbnail_url: string;
  summary: string;
  rating: number;
  comment_count: number;
  price: number;
  discount_rate: number;
  discount_price: number;
  city_name: string;
  hospital_name: string;
  categories: CategoryStructure[];
  is_advertised: boolean;
  is_recommended: boolean;
}

// TreatmentCard 컴포넌트에 전달할 props 타입 정의
export interface TreatmentCardProps {
  id: number;
  title: string;
  thumbnail_url: string;
  summary: string;
  rating: number;
  comment_count: number;
  price: number;
  discount_rate: number;
  discount_price: number;
  city_name: string;
  hospital_name: string;
  categories: CategoryStructure[];
  is_advertised: boolean;
  is_recommended: boolean;
  disableLink?: boolean;
  onLikeToggle?: (treatmentId: number, newState: boolean) => Promise<void>;
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
  is_google?: boolean
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

// 상수 수정
const ITEMS_PER_PAGE = 8  // 한 페이지당 8개의 시술 표시

// 병원 상세 컴포넌트
const HospitalDetailContent = () => {
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

  // 상단에 상태 추가
  const [totalReviews, setTotalReviews] = useState(0)

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
        // 총 리뷰 개수 조회
        const { count: totalCount } = await supabase
          .from('reviews')
          .select('id', { count: 'exact' })
          .eq('hospital_id', hospital.id)

        setTotalReviews(totalCount || 0)

        // 기존 리뷰 데이터 조회 로직...
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

        if (error) throw error

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
            authorImage: review.author_image || null,
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

          let newReviews;
          if (reviewPage === 1) {
            newReviews = formattedReviews;
            setRecentReviews(formattedReviews)
          } else {
            newReviews = [...recentReviews, ...formattedReviews];
            setRecentReviews(newReviews)
          }
          
          // 더보기 버튼 표시 조건 수정 - 새로운 전체 리뷰 개수 사용
          setHasMoreReviews(newReviews.length < (totalCount ?? 0))
        }
      } catch (error) {
        console.error('리뷰 데이터 로드 실패:', error)
      } finally {
        setLoadingReviews(false)
      }
    }

    fetchReviews()
  }, [hospital?.id, reviewPage, reviewSortBy, isAuthenticated])

  // 더보기 버튼 핸들러
  const handleLoadMoreReviews = () => {
    setReviewPage(prev => prev + 1)
  }

  // 병원의 모든 시술 가져오기
  const fetchAllTreatments = useCallback(async (isLoadMore = false, currentPage = 0) => {
    if (!hospital?.id) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .rpc('get_treatments', { 
          p_city_id: null,
          p_depth2_category_id: null,
          p_depth3_category_id: null,
          p_hospital_id: hospital.id,
          p_is_advertised: null,
          p_is_discounted: null,
          p_is_recommended: null,
          p_limit: ITEMS_PER_PAGE,  // 8개로 수정
          p_offset: currentPage * ITEMS_PER_PAGE,  // 페이지 오프셋도 8개 단위로 계산
          p_price_from: null,
          p_price_to: null,
          p_sort_by: 'view_count',
          p_search_term: null,
          p_user_id: user?.id || null
        })

      if (error) {
        console.error('Error fetching all treatments:', error)
        return
      }

      if (data) {
        // 대표 시술 ID들을 제외한 시술만 필터링
        const filteredData = data.filter(
          (treatment: Treatment) => !featuredTreatments.some(
            featured => featured.id === treatment.id
          )
        )

        // 더보기일 때는 기존 데이터에 추가
        if (isLoadMore) {
          setAllTreatments(prev => [...prev, ...filteredData])
        } else {
          setAllTreatments(filteredData)
        }
        
        // 다음 페이지 존재 여부 확인 (정확히 8개가 있으면 더 있다는 의미)
        setHasMore(data.length === ITEMS_PER_PAGE)
      }

    } catch (error) {
      console.error('Error in fetchAllTreatments:', error)
    }
  }, [hospital?.id, featuredTreatments])

  // 초기 로드
  useEffect(() => {
    setPage(0)
    if (featuredTreatments.length > 0) {
      fetchAllTreatments(false, 0)  // 현재 페이지 번호 전달
    }
  }, [fetchAllTreatments])

  // 더보기 클릭 시
  const handleLoadMore = () => {
    console.log('더보기 클릭:', {
      currentPage: page,
      currentTreatmentsLength: allTreatments.length
    })
    
    const nextPage = page + 1
    setPage(nextPage)
    fetchAllTreatments(true, nextPage)
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

  // 시술 좋아요 토글 핸들러 추가
  const handleTreatmentLikeToggle = async (treatmentId: number, newState: boolean) => {
    setAllTreatments(prev => 
      prev.map(treatment => 
        treatment.id === treatmentId 
          ? { ...treatment, is_liked: newState }
          : treatment
      )
    )
  }

  // TreatmentDetailPage 컴포넌트 내부에 함수 추가
  const handleTreatmentClick = (treatmentId: number) => {
    // 필요한 처리 (예: 조회수 증가 등)
    console.log('Treatment clicked:', treatmentId)
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
                <div className="absolute top-2 left-2 flex gap-1">
                  {hospital?.is_advertised && (
                    <span className="px-2 py-1 bg-black/60 text-white text-xs font-medium rounded backdrop-blur-sm">
                      AD
                    </span>
                  )}
                  {hospital?.is_recommended && (
                    <span className="px-2 py-1 bg-black/60 text-white text-xs font-medium rounded backdrop-blur-sm">
                      추천
                    </span>
                  )}
                  {hospital?.is_member && (
                    <span className="px-2 py-1 bg-black/60 text-white text-xs font-medium rounded backdrop-blur-sm">
                      Member
                    </span>
                  )}
                </div>
                {/* Google 배지 */}
                {hospital?.is_google && (
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-1 bg-black/60 text-white text-xs font-medium rounded backdrop-blur-sm">
                      By Google
                    </span>
                  </div>
                )}
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
                <p className="leading-relaxed whitespace-pre-wrap">
                  {hospital?.description}
                </p>
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
                    
                    <span className="whitespace-pre-wrap">{hospital?.business_hours}</span>
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
                    <Link 
                      href={`/treatments/detail?id=${treatment.id}`}
                    >
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
              <Link 
                key={treatment.id}
                href={`/treatments/detail?id=${treatment.id}`}
                className="block"
              >
                <TreatmentCard 
                  {...treatment} 
                  disableLink 
                  onLikeToggle={handleTreatmentLikeToggle}
                />
              </Link>
            ))}
          </div>
          {/* 모바일 버전 */}
          <div className="md:hidden flex flex-col gap-4">
            {allTreatments.map((treatment) => (
              <Link 
                key={treatment.id}
                href={`/treatments/detail?id=${treatment.id}`}
                className="block"
              >
                <TreatmentCard 
                  {...treatment} 
                  disableLink 
                  onLikeToggle={handleTreatmentLikeToggle}
                />
              </Link>
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
            href={`/reviews/form?hospital_id=${hospital?.id}`}
            className="flex-1 px-4 py-3 bg-violet-500 text-white rounded-lg text-center font-medium hover:bg-violet-600 transition-colors text-sm md:text-base"
          >
            리뷰쓰기
          </Link>
          <Link 
            href={`/clinics/consult?hospital_id=${hospital?.id}`}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg text-center font-medium hover:bg-blue-600 transition-colors text-sm md:text-base"
          >
            상담신청
          </Link>
        </div>
      </div>
    </main>
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
      <HospitalDetailContent />
    </Suspense>
  )
} 