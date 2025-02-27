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
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

// 기존 popularTreatments 배열 대신 상태로 관리
interface PopularTreatment {
  id: string;
  image: string;
  title: string;
  description: string;
  clinic: string;
  location: string;
  originalPrice: number;
  discountPrice: number;
  discountRate: number;
  rating: number;
  reviewCount: number;
  categories: string[];
  likes: number;
  isAd: boolean;
  isNew: boolean;
  is_liked: boolean;
}

// 도시 타입 정의 추가
interface City {
  id: number;
  name_vi: string;
}

// 병원 타입 정의 추가
interface Hospital {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  rating: number;
  viewCount: number;
  categories: {
    depth2_id: number;
    depth2_name: string;
    depth3_list: {
      id: number;
      name: string;
    }[];
  }[];
  is_recommended: boolean;
  isAd: boolean;
  isMember: boolean;
  isLiked: boolean;
}

// 리뷰 타입 정의
interface Review {
  id: number;
  beforeImage: string;
  afterImage: string;
  author_name: string;
  content: string;
  created_at: string;
  treatment_name: string;
  categories: string[];
  city_name: string;
  hospital_name: string;
  comment_count: number;
  view_count: number;
  rating: number;
  is_locked?: boolean;
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

// 카테고리 데이터 타입 정의
interface CategoryData {
  categories: any[];
  subCategories: any[];
}

export default function HomePage() {
  const [bodyPartsData, setBodyPartsData] = useState<CategoryData>({ categories: [], subCategories: [] })
  const [treatmentMethodsData, setTreatmentMethodsData] = useState<CategoryData>({ categories: [], subCategories: [] })
  const router = useRouter()
  const [popularTreatments, setPopularTreatments] = useState<PopularTreatment[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [localPopularTreatments, setLocalPopularTreatments] = useState<Record<number, any[]>>({})
  const [recommendedClinics, setRecommendedClinics] = useState<Hospital[]>([])
  const [latestReviews, setLatestReviews] = useState<Review[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [topCategories, setTopCategories] = useState<{
    category_id: number;
    category_name: string;
    total_views: number;
  }[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // 카테고리 데이터 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 신체 부위 카테고리 (parent_id = 1)
        const { data: bodyParts, error: bodyError } = await supabase
          .rpc('get_categories', { p_parent_depth1_id: 1 })

        if (bodyError) throw bodyError
        
        console.log('신체 부위 카테고리 데이터:', {
          원본데이터: bodyParts,
          카테고리: bodyParts?.categories,
          서브카테고리: bodyParts?.subCategories
        })
        
        setBodyPartsData(bodyParts || { categories: [], subCategories: [] })

        // 시술 방법 카테고리 (parent_id = 2)
        const { data: treatmentMethods, error: treatmentError } = await supabase
          .rpc('get_categories', { p_parent_depth1_id: 2 })

        if (treatmentError) throw treatmentError
        
        console.log('시술 방법 카테고리 데이터:', {
          원본데이터: treatmentMethods,
          카테고리: treatmentMethods?.categories,
          서브카테고리: treatmentMethods?.subCategories
        })
        
        setTreatmentMethodsData(treatmentMethods || { categories: [], subCategories: [] })

      } catch (error) {
        console.error('카테고리 데이터 로드 실패:', error)
      }
    }

    fetchCategories()
  }, [])

  // 인기 시술 데이터 로드
  useEffect(() => {
    const fetchPopularTreatments = async () => {
      try {
        // 현재 로그인한 사용자 정보 가져오기
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase.rpc('get_treatments', {
          p_is_advertised: true,
          p_sort_by: 'view_count',
          p_limit: 8,
          p_offset: 0,
          p_search_term: null,
          p_user_id: user?.id || null  // 사용자 ID 추가
        })

        if (error) throw error

        // RPC 응답을 TreatmentCard props 형식으로 변환
        const formattedTreatments = data.map((item: any) => ({
          id: item.id,
          image: item.thumbnail_url,
          title: item.title,
          description: item.summary,
          clinic: item.hospital_name,
          location: item.city_name,
          originalPrice: item.price,
          discountPrice: item.discount_price,
          discountRate: item.discount_rate,
          rating: Number(item.rating),
          reviewCount: item.comment_count,
          categories: item.categories || [],
          isAd: item.is_advertised,
          isNew: item.is_recommended,
          is_liked: item.is_liked
        }))

        setPopularTreatments(formattedTreatments)

      } catch (error) {
        console.error('인기 시술 데이터 로드 실패:', error)
      }
    }

    fetchPopularTreatments()
  }, [])

  // 도시 데이터 로드
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('id, name_vi')
          .eq('is_active', true)
          .order('sort_order')

        if (error) throw error
        
        setCities(data || [])
      } catch (error) {
        console.error('도시 데이터 로드 실패:', error)
      }
    }

    fetchCities()
  }, [])

  // 로그인한 사용자의 city_id 가져오기
  useEffect(() => {
    const getUserCity = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        console.log('🏙️ User metadata:', user?.user_metadata)  // 디버깅용
        
        if (user?.user_metadata?.city_id) {
          const cityId = Number(user.user_metadata.city_id)  // 숫자로 변환
          console.log('🌆 Setting selected location to:', cityId)
          setSelectedLocation(cityId)
        } else {
          console.log('🏘️ No city_id found in user metadata')
          setSelectedLocation(null)
        }
      } catch (error) {
        console.error('Error getting user city:', error)
      }
    }

    getUserCity()

    // 로그인 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('👤 Auth state changed. User metadata:', session?.user?.user_metadata)
      
      if (session?.user?.user_metadata?.city_id) {
        const cityId = Number(session.user.user_metadata.city_id)  // 숫자로 변환
        console.log('🌆 Setting selected location from auth change to:', cityId)
        setSelectedLocation(cityId)
      } else {
        console.log('🏘️ No city_id found in session metadata')
        setSelectedLocation(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // 지역별 인기 시술 데이터 로드
  useEffect(() => {
    const fetchLocalTreatments = async () => {
      if (selectedLocation === null) return

      try {
        // 현재 로그인한 사용자 정보 가져오기
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase.rpc('get_treatments', {
          p_city_id: selectedLocation,
          p_limit: 8,
          p_offset: 0,
          p_search_term: null,
          p_user_id: user?.id || null  // 사용자 ID 추가
        })

        if (error) throw error

        const formattedTreatments = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          hospital_name: item.hospital_name,
          city_name: item.city_name,
          thumbnail_url: item.thumbnail_url,
          price: item.price,
          discount_price: item.discount_price,
          discount_rate: item.discount_rate,
          rating: Number(item.rating),
          comment_count: item.comment_count,
          categories: item.categories || [],
          is_advertised: item.is_advertised,
          is_recommended: item.is_recommended,
          is_liked: item.is_liked  // 좋아요 상태 추가
        }))

        setLocalPopularTreatments(prev => ({
          ...prev,
          [selectedLocation]: formattedTreatments
        }))

      } catch (error) {
        console.error('지역별 인기 시술 데이터 로드 실패:', error)
      }
    }

    fetchLocalTreatments()
  }, [selectedLocation])

  // 지역별 인기 시술 섹션 렌더링 조건부 처리
  const selectedTreatments = selectedLocation !== null 
    ? localPopularTreatments[selectedLocation] 
    : localPopularTreatments[0] || []  // 선택된 도시가 없을 때는 전체 데이터 사용


  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }

    getCurrentUser()

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // 추천 병원 데이터 로드
  useEffect(() => {
    const fetchRecommendedClinics = async () => {
      try {
        // 현재 사용자 정보 로깅
        console.log('현재 로그인 상태:', {
          currentUser,
          userId: currentUser?.id,
          isLoggedIn: !!currentUser
        })

        const params = {
          p_city_id: null,
          p_depth2_body_category_id: null,
          p_depth2_treatment_category_id: null,
          p_depth3_body_category_id: null,
          p_depth3_treatment_category_id: null,
          p_is_advertised: null,
          p_is_recommended: true,
          p_is_member: null,
          p_sort_by: 'views',
          p_page_size: 8,
          p_page: 1,
          p_user_id: currentUser?.id || null
        }

        console.log('RPC 호출 파라미터:', {
          현재유저: currentUser,
          유저ID: currentUser?.id,
          전체파라미터: params
        })

        const { data, error } = await supabase.rpc('get_hospitals_list', params)

        if (error) {
          console.error('RPC 에러:', error)
          throw error
        }

        // 서버 응답 데이터 자세히 로깅
        console.log('RPC 응답 전체 데이터:', {
          데이터길이: data?.length,
          첫번째항목: data?.[0],
          전체데이터: data
        })

        // is_liked 값만 따로 확인
        console.log('각 병원의 is_liked 값:', data?.map((item: any) => ({
          id: item.id,
          hospital_name: item.hospital_name,
          is_liked: item.is_liked,
          user_id: currentUser?.id
        })))

        const formattedClinics = data.map((item: any) => {
          let processedCategories = [];
          try {
            if (item.categories) {
              const categoriesArray = Array.isArray(item.categories) 
                ? item.categories 
                : Object.values(item.categories);

              processedCategories = categoriesArray.map((cat: any) => ({
                id: cat.depth2?.id,
                name: cat.depth2?.name
              })).filter((cat: any) => cat.id && cat.name);
            }
          } catch (error) {
            console.error('카테고리 처리 중 오류:', error);
          }

          return {
            id: Number(item.id),
            title: item.hospital_name,
            description: item.description || '',
            image: item.thumbnail_url,
            location: item.city_name,
            rating: Number(item.average_rating || 0),
            viewCount: item.view_count || 0,
            categories: processedCategories,
            isRecommended: Boolean(item.is_recommended),
            isAd: Boolean(item.is_advertised),
            isMember: Boolean(item.is_member),
            isLiked: Boolean(item.is_liked)
          }
        })

        // 변환된 데이터의 isLiked 값 확인
        console.log('변환된 isLiked 값:', formattedClinics.map((clinic: any) => ({
          id: clinic.id,
          title: clinic.title,
          isLiked: clinic.isLiked
        })));

        setRecommendedClinics(formattedClinics)
      } catch (error) {
        console.error('추천 병원 데이터 로드 실패:', error)
      }
    }

    fetchRecommendedClinics()
  }, [currentUser?.id])

  // 실시간 후기 데이터 로드
  useEffect(() => {
    const fetchLatestReviews = async () => {
      try {
        const { data, error } = await supabase.rpc('get_reviews', {
          p_limit: 6,
          p_offset: 0,
          p_sort_by: 'view_count'
        });

        if (error) throw error;

        // 1. RPC 응답 데이터 확인
        console.log('1. RPC 원본 데이터:', {
          전체: data,
          첫번째리뷰: data[0],
          이미지필드: {
             beforeImage: data[0]?.before_image,
             afterImage: data[0]?.after_image
           }
        });

        const formattedReviews = data.map((item: any) => {
          // 2. 각 아이템 변환 전 확인
          console.log('2. 변환 전 아이템:', {
            id: item.id,
            before_image: item.before_image,
            after_image: item.after_image
          });

          const formatted = {
            id: item.id,
            beforeImage: item.before_image,    // before_image를 beforeImage로 변환
            afterImage: item.after_image,      // after_image를 afterImage로 변환
            author_name: item.author_name,
            content: item.content,
            created_at: item.created_at,
            treatment_name: item.title || '',
            categories: item.categories ? [item.categories.depth2.name] : [],
            city_name: item.city_name,
            hospital_name: item.hospital_name,
            comment_count: Number(item.comment_count || 0),
            view_count: Number(item.view_count || 0),
            rating: item.rating
          };

          // 3. 변환 후 확인
          console.log('3. 변환 후 데이터:', formatted);
          return formatted;
        });

        // 4. 최종 데이터 확인
        console.log('4. ReviewCard에 전달될 데이터:', formattedReviews[0]);

        setLatestReviews(formattedReviews);
      } catch (error) {
        console.error('실시간 후기 데이터 로드 실패:', error);
      }
    };

    fetchLatestReviews();
  }, []);

  // 인증 상태 확인을 위한 useEffect 추가
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  // TOP5 카테고리 데이터 로드를 위한 useEffect
  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        console.log('TOP5 카테고리 데이터 로드 시작');
        
        const { data, error } = await supabase.rpc('get_top_categories', {
          p_limit: 5
        });

        if (error) {
          console.error('TOP5 카테고리 RPC 에러:', error);
          throw error;
        }

        console.log('받은 데이터:', data);
        
        if (!data) {
          console.error('데이터가 없습니다');
          return;
        }

        setTopCategories(data);
        
      } catch (error) {
        console.error('TOP5 카테고리 데이터 로드 실패:', {
          error,
          message: error instanceof Error ? error.message : '알 수 없는 에러'
        });
      }
    };

    fetchTopCategories();
  }, []);

  // 좋아요 토글 핸들러
  const handleLikeToggle = (treatmentId: number, newState: boolean) => {
    console.log('Toggling like:', { treatmentId, newState })  // 디버깅 로그

    // 인기 시술 업데이트
    setPopularTreatments(prev => {
      const updated = prev.map(treatment => 
        Number(treatment.id) === treatmentId  // id를 Number로 변환하여 비교
          ? { ...treatment, is_liked: newState }
          : treatment
      )
      console.log('Updated popular treatments:', updated)  // 디버깅 로그
      return updated
    })

    // 지역별 시술 업데이트
    setLocalPopularTreatments(prev => {
      const newLocalState = { ...prev }
      Object.keys(newLocalState).forEach(cityId => {
        newLocalState[Number(cityId)] = newLocalState[Number(cityId)].map((treatment: any) => 
          Number(treatment.id) === treatmentId 
            ? { ...treatment, is_liked: newState }
            : treatment
        )
      })
      console.log('Updated local treatments:', newLocalState)  // 디버깅 로그
      return newLocalState
    })
  }

  // 병원 좋아요 토글 핸들러 추가
  const handleClinicLikeToggle = async (clinicId: number) => {
    if (!currentUser) {
      return
    }

    try {
      // 먼저 UI를 즉시 업데이트
      setRecommendedClinics(prev => prev.map(clinic => 
        clinic.id === clinicId 
          ? { 
              ...clinic, 
              isLiked: !clinic.isLiked  // 현재 상태를 반전
            }
          : clinic
      ))

      // 서버에 요청
      const { data, error } = await supabase
        .rpc('toggle_hospital_like', {
          p_hospital_id: clinicId,
          p_user_id: currentUser.id
        })

      if (error) {
        // 에러 발생 시 원래 상태로 되돌림
        setRecommendedClinics(prev => prev.map(clinic => 
          clinic.id === clinicId 
            ? { 
                ...clinic, 
                isLiked: !clinic.isLiked  // 다시 원래 상태로
              }
            : clinic
        ))
        throw error
      }

      // 서버 응답이 있는 경우에만 최종 상태 업데이트
      if (data && data[0]) {
        setRecommendedClinics(prev => prev.map(clinic => 
          clinic.id === clinicId 
            ? { 
                ...clinic, 
                is_liked: data[0].is_liked
              }
            : clinic
        ))
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error)
    }
  }

  return (
    <main className="min-h-screen">
      <Banner />
      
      {/* 카테고리 섹션 */}
      <section className="section-category py-4 md:py-12">
        <div className="container">
          {/* 모바일 뷰 */}
          <div className="md:hidden">
            <HorizontalScroll>
              {[...bodyPartsData.categories, ...treatmentMethodsData.categories].map((item) => (
                <Link 
                  key={`${item.id}-${item.label}`}
                  href={`/treatments?depth2=${item.id}`}
                  className="w-[60px] flex-shrink-0"
                >
                  <CategoryIcon 
                    icon="/images/placeholdericon.png"
                    label={item.label}
                    isSelected={false}
                  />
                </Link>
              ))}
            </HorizontalScroll>
          </div>

          {/* PC 뷰 */}
          <div className="hidden md:flex space-x-8 w-full">
            {/* 첫 번째 영역: 부위 아이콘 (50%) */}
            <div className="flex flex-col w-1/2">
              <h2 className="text-lg font-bold mb-4">부위</h2>
              <div className="grid grid-cols-6 gap-2">
                {bodyPartsData.categories.map((category) => (
                  <Link 
                    key={`body-${category.id}`}
                    href={`/treatments?depth2=${category.id}`}
                  >
                    <CategoryIcon 
                      icon="/images/placeholdericon.png"
                      label={category.label}
                      isSelected={false}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* 두 번째 영역: 시술 방법 아이콘 (25%) */}
            <div className="flex flex-col w-1/4">
              <h2 className="text-lg font-bold mb-4">시술 방법</h2>
              <div className="grid grid-cols-4 gap-2">
                {treatmentMethodsData.categories.map((method) => (
                  <Link 
                    key={`treatment-${method.id}`}
                    href={`/treatments?depth2=${method.id}`}
                  >
                    <CategoryIcon 
                      icon="/images/placeholdericon.png"
                      label={method.label}
                      isSelected={false}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* 세 번째 영역: 인기 카테고리 TOP 5 (25%) */}
            <div className="flex flex-col w-1/4">
              <h2 className="text-lg font-bold mb-4">인기 카테고리 TOP5</h2>
              <ul className="space-y-2">
                {topCategories.map((category, index) => (
                  <li key={category.category_id} className="flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white font-bold rounded-full mr-2">
                      {index + 1}
                    </span>
                    <Link 
                      href={`/treatments?depth2=${category.category_id}`}
                      className="text-md font-medium hover:text-purple-600"
                    >
                      {category.category_name}
                      <span className="text-sm text-gray-500 ml-1">
                        ({category.total_views.toLocaleString()}회)
                      </span>
                    </Link>
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
              {[...topCategories, ...topCategories].map((category, index) => (
                <Link 
                  key={`search-${index}-${category.category_id}`}
                  href={`/treatments?depth2=${category.category_id}`}
                  className="text-sm inline-flex items-center gap-1.5"
                >
                  <span className="font-bold text-purple-600">{index % topCategories.length + 1}.</span>
                  <span className="text-gray-600">
                    {category.category_name}
                    <span className="text-gray-500 ml-1">
                      ({category.total_views.toLocaleString()}회)
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 인기 시술 섹션 */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">인기 시술</h2>
            <Link 
              href="/treatments" 
              className="text-sm text-muted-foreground h-8 gap-1 inline-flex items-center hover:text-foreground"
            >
                전체보기
                <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {/* PC 버전 - 슬라이드 */}
          <div className="hidden md:block">
            <HorizontalScroll>
              <div className="flex gap-4">
                {popularTreatments.map((treatment) => (
                  <Link 
                    key={treatment.id}
                    href={`/treatments/detail?id=${treatment.id}`}
                    className="w-[300px] flex-shrink-0"
                  >
                    <TreatmentCard 
                      id={Number(treatment.id)}
                      thumbnail_url={treatment.image}
                      title={treatment.title}
                      summary={treatment.description}
                      hospital_name={treatment.clinic}
                      city_name={treatment.location}
                      price={treatment.originalPrice}
                      discount_rate={treatment.discountRate}
                      rating={treatment.rating}
                      comment_count={treatment.reviewCount}
                      categories={(treatment.categories as unknown as Array<{ id: number; name: string; depth3_list?: { id: number; name: string; }[] }>).map((cat) => ({
                        depth2_id: cat.id,
                        depth2_name: cat.name,
                        depth3_list: cat.depth3_list || []
                      }))}
                      is_liked={treatment.is_liked}
                      discount_price={treatment.discountPrice || 0}
                      is_advertised={treatment.isAd || false}
                      is_recommended={treatment.isNew || false}
                      disableLink 
                      onLikeToggle={handleLikeToggle}
                    />
                  </Link>
                ))}
              </div>
            </HorizontalScroll>
          </div>
          {/* 모바일 버전 - 세로 리스트 */}
          <div className="md:hidden flex flex-col gap-4">
            {popularTreatments.map((treatment) => (
              <Link 
                key={treatment.id}
                href={`/treatments/detail?id=${treatment.id}`}
              >
                <TreatmentCard 
                  id={Number(treatment.id)}
                  thumbnail_url={treatment.image}
                  title={treatment.title}
                  summary={treatment.description}
                  hospital_name={treatment.clinic}
                  city_name={treatment.location}
                  price={treatment.originalPrice}
                  discount_rate={treatment.discountRate}
                  rating={treatment.rating}
                  comment_count={treatment.reviewCount}
                  categories={(treatment.categories as unknown as Array<{ id: number; name: string; depth3_list?: { id: number; name: string; }[] }>).map((cat) => ({
                    depth2_id: cat.id,
                    depth2_name: cat.name,
                    depth3_list: cat.depth3_list || []
                  }))}
                  is_liked={treatment.is_liked}
                  discount_price={treatment.discountPrice || 0}
                  is_advertised={treatment.isAd || false}
                  is_recommended={treatment.isNew || false}
                  disableLink 
                  onLikeToggle={handleLikeToggle}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 지역별 인기 시술 섹션 */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container">
          {/* 헤더 영역 - 모바일에서는 세로 배치 */}
          <div className="flex md:flex-row flex-col md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold">나의 지역</h2>
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-1">
                {cities.map((city) => (
                  <Button 
                    key={city.id}
                    variant={selectedLocation === city.id ? 'default' : 'outline'}
                    onClick={() => setSelectedLocation(city.id)}
                    className={`min-w-[70px] h-8 text-sm ${
                      selectedLocation === city.id ? 'bg-pink-500 hover:bg-pink-600' : ''
                    }`}
                    disabled={!isAuthenticated}
                  >
                    {city.name_vi}
                  </Button>
                ))}
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                disabled={!isAuthenticated}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 로그인하지 않은 경우 보여줄 안내 메시지 */}
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg text-gray-600 mb-4">
                Login을 하시면, 해당 지역의 인기 Beauty를 볼 수 있어요.
              </p>
              <Link href="/login">
                <Button className="min-w-[120px]">
                  Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* PC 버전 - 슬라이드 */}
              <div className="hidden md:block">
                <HorizontalScroll>
                  <div className="flex gap-4">
                    {selectedTreatments?.map((treatment) => (
                      <Link 
                        key={treatment.id}
                        href={`/treatments/detail?id=${treatment.id}`}
                        className="w-[300px] flex-shrink-0"
                      >
                        <TreatmentCard 
                          id={Number(treatment.id)}
                          thumbnail_url={treatment.thumbnail_url}
                          title={treatment.title}
                          summary={treatment.summary}
                          hospital_name={treatment.hospital_name}
                          city_name={treatment.city_name}
                          price={treatment.price}
                          discount_rate={treatment.discount_rate}
                          rating={treatment.rating}
                          comment_count={treatment.comment_count}
                          categories={(treatment.categories as unknown as Array<{ id: number; name: string; depth3_list?: { id: number; name: string; }[] }>).map((cat) => ({
                            depth2_id: cat.id,
                            depth2_name: cat.name,
                            depth3_list: cat.depth3_list || []
                          }))}
                          is_liked={treatment.is_liked}
                          discount_price={treatment.discount_price || 0}
                          is_advertised={treatment.is_advertised || false}
                          is_recommended={treatment.is_recommended || false}
                          disableLink 
                          onLikeToggle={handleLikeToggle}
                        />
                      </Link>
                    ))}
                  </div>
                </HorizontalScroll>
              </div>

              {/* 모바일 버전 - 세로 리스트 */}
              <div className="md:hidden flex flex-col gap-4">
                {selectedTreatments?.map((treatment) => (
                  <Link 
                    key={treatment.id}
                    href={`/treatments/detail?id=${treatment.id}`}
                  >
                    <TreatmentCard 
                      id={Number(treatment.id)}
                      thumbnail_url={treatment.thumbnail_url}
                      title={treatment.title}
                      summary={treatment.summary}
                      hospital_name={treatment.hospital_name}
                      city_name={treatment.city_name}
                      price={treatment.price}
                      discount_rate={treatment.discount_rate}
                      rating={treatment.rating}
                      comment_count={treatment.comment_count}
                      categories={(treatment.categories as unknown as Array<{ id: number; name: string; depth3_list?: { id: number; name: string; }[] }>).map((cat) => ({
                        depth2_id: cat.id,
                        depth2_name: cat.name,
                        depth3_list: cat.depth3_list || []
                      }))}
                      is_liked={treatment.is_liked}
                      discount_price={treatment.discount_price || 0}
                      is_advertised={treatment.is_advertised || false}
                      is_recommended={treatment.is_recommended || false}
                      disableLink 
                      onLikeToggle={handleLikeToggle}
                    />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 추천 병원 섹션 */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#F5F0FF' }}>
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">추천 병원</h2>
            <Link 
              href="/clinics" 
              className="text-sm text-muted-foreground h-8 gap-1 inline-flex items-center hover:text-foreground"
            >
                전체보기
                <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <HorizontalScroll>
            <div className="flex gap-4">
              {recommendedClinics.map((clinic) => (
                <Link 
                  key={clinic.id}
                  href={`/clinics/detail?id=${clinic.id}`}
                  className="w-[calc(50vw-2rem)] md:w-[300px] flex-shrink-0"
                >
                  <ClinicCard 
                    id={clinic.id}
                    title={clinic.title}
                    description={clinic.description}
                    image={clinic.image}
                    location={clinic.location}
                    reviewCount={clinic.viewCount}
                    rating={clinic.rating}
                    categories={clinic.categories.map(cat => ({
                      id: cat.depth2_id,
                      name: cat.depth2_name
                    }))}
                    isRecommended={clinic.is_recommended}
                    isAd={clinic.isAd}
                    isMember={clinic.isMember}
                    isLiked={clinic.isLiked}
                    disableLink 
                    onLikeToggle={handleClinicLikeToggle}
                  />
                </Link>
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
      
      {/* 실시간 후기 섹션 */}
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
                {latestReviews.map((review) => (
                  <div key={review.id} className="w-[85vw] md:w-[600px] flex-shrink-0">
                    <ReviewCard 
                      id={review.id}
                      beforeImage={review.beforeImage}
                      afterImage={review.afterImage}
                      rating={review.rating}
                      content={review.content}
                      author={review.author_name}
                      date={new Date(review.created_at).toLocaleDateString()}
                      treatmentName={review.treatment_name}
                      categories={review.categories}
                      location={review.city_name}
                      clinicName={review.hospital_name}
                      commentCount={review.comment_count}
                      viewCount={review.view_count}
                      additionalImagesCount={0}
                      likeCount={0}
                      is_locked={review.is_locked}
                      initialIsAuthenticated={isAuthenticated}
                    />
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
