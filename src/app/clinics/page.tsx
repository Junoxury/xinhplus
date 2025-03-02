'use client'

import { TreatmentBanner } from '@/components/treatments/TreatmentBanner'
import { TreatmentFilter } from '@/components/treatments/TreatmentFilter'
import { ClinicList } from '@/components/clinics/ClinicList'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

import { CategorySection } from '@/components/treatments/CategorySection'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

// 정렬 옵션 상수

// 로컬에서 타입 정의
type SortOption = 'latest' | 'views' | 'rating' | 'likes'

// ClinicCard 컴포넌트에 전달할 props 타입 정의
export interface ClinicCardProps {
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
  isGoogle?: boolean;
  isLiked?: boolean;
  likeCount: number;
}

interface CategoryData {
  depth2?: {
    id: number;
    name: string;
  };
}

interface ProcessedCategory {
  id?: number;
  name?: string;
}

// 파일 상단에 타입 정의 추가
interface Clinic {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  rating: number;
  viewCount: number;
  categories: Array<{
    id?: number;
    name?: string;
  }>;
  isRecommended: boolean;
  isAd: boolean;
  isMember: boolean;
  isGoogle: boolean;
  isLiked: boolean;
  likeCount: number;
}

// ClinicContent 컴포넌트로 기존 내용을 이동
const ClinicContent = () => {
  const searchParams = useSearchParams()
  
  // 초기 상태 설정
  const [filters, setFilters] = useState({
    cityId: null as number | null,
    bodyPartId: searchParams.get('bodyPartId') ? Number(searchParams.get('bodyPartId')) : null,
    treatmentId: searchParams.get('treatmentId') ? Number(searchParams.get('treatmentId')) : null,
    bodyPartSubId: searchParams.get('bodyPartSubId') ? Number(searchParams.get('bodyPartSubId')) : null,
    treatmentSubId: searchParams.get('treatmentSubId') ? Number(searchParams.get('treatmentSubId')) : null,
    options: {
      is_recommended: false,
      is_advertised: false,
      has_discount: false,
      is_member: false
    },
    priceRange: [0, 100000000]
  });

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const ITEMS_PER_PAGE = 6
  const [clinics, setClinics] = useState<ClinicCardProps[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const handleLoadMore = async () => {
    setLoading(true)
    setPage(prev => prev + 1)
    setLoading(false)
  }

  const handleCategorySelect = (categoryId: number | null, isBodyPart: boolean) => {
    setPage(1)
    setClinics([])
    setFilters(prev => ({
      ...prev,
      bodyPartId: isBodyPart ? categoryId : prev.bodyPartId,
      treatmentId: isBodyPart ? prev.treatmentId : categoryId,
      // depth3 선택이 해제되면 null로 설정
      bodyPartSubId: isBodyPart ? null : prev.bodyPartSubId,
      treatmentSubId: isBodyPart ? prev.treatmentSubId : null
    }))
  }

  const handleSubCategorySelect = (subCategoryId: number | null, isBodyPart: boolean) => {
    setPage(1)
    setClinics([])
    setFilters(prev => ({
      ...prev,
      bodyPartSubId: isBodyPart ? subCategoryId : prev.bodyPartSubId,
      treatmentSubId: isBodyPart ? prev.treatmentSubId : subCategoryId
    }))
  }

  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('latest')

  const toggleMobileFilter = (show: boolean) => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    setShowMobileFilter(show)
  }

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    setPage(1)
    setClinics([])
  }

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  // 카테고리 데이터를 위한 상태 추가
  const [bodyPartsData, setBodyPartsData] = useState({ categories: [], subCategories: [] })
  const [treatmentMethodsData, setTreatmentMethodsData] = useState({ categories: [], subCategories: [] })

  // 카테고리 데이터 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 신체 부위 카테고리 (parent_id = 1)
        const { data: bodyParts, error: bodyError } = await supabase
          .rpc('get_categories', { p_parent_depth1_id: 1 })

        if (bodyError) throw bodyError
        
        // 데이터 로깅 추가
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
        
        // 시술 방법 데이터도 로깅
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

  // URL 파라미터에 따른 초기 선택 상태 설정
  useEffect(() => {
    const initializeFromUrl = async () => {
      const bodyPartId = searchParams.get('bodyPartId')
      const treatmentId = searchParams.get('treatmentId')
      const bodyPartSubId = searchParams.get('bodyPartSubId')
      const treatmentSubId = searchParams.get('treatmentSubId')

      // CategorySection에 초기 선택 상태 전달을 위한 prop 추가
      if (bodyPartId) {
        handleCategorySelect(Number(bodyPartId), true)
      }
      if (treatmentId) {
        handleCategorySelect(Number(treatmentId), false)
      }
      if (bodyPartSubId) {
        handleSubCategorySelect(Number(bodyPartSubId), true)
      }
      if (treatmentSubId) {
        handleSubCategorySelect(Number(treatmentSubId), false)
      }
    }

    initializeFromUrl()
  }, [searchParams])

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

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true)
        
        const { data, error } = await supabase
          .rpc('get_hospitals_list', {
            p_city_id: filters.cityId,
            p_depth2_body_category_id: filters.bodyPartId,
            p_depth2_treatment_category_id: filters.treatmentId,
            p_depth3_body_category_id: filters.bodyPartSubId,
            p_depth3_treatment_category_id: filters.treatmentSubId,
            p_is_advertised: filters.options.is_advertised ? true : null,
            p_is_recommended: null,
            p_is_member: filters.options.is_member ? true : null,
            p_has_discount: filters.options.has_discount ? true : null,
            p_page_size: ITEMS_PER_PAGE,
            p_page: page,
            p_ad_limit: 2,
            p_sort_by: sortBy,
            p_user_id: currentUser?.id || null
          })

        if (error) {
          console.error('RPC 에러:', error)
          throw error
        }

        if (!data) {
          console.error('데이터가 없습니다')
          throw new Error('No data returned')
        }

        // 서버에서 받은 원본 데이터 출력
        console.log('서버 응답 데이터:', data)
        
        // categories 구조 확인을 위한 출력
        console.log('첫 번째 병원의 카테고리:', data?.[0]?.categories)

        const total = data?.[0]?.total_count ?? 0
        console.log('전체 병원 수:', total)
        setTotalCount(total)

        if (!data?.length) {
          setClinics([])
          setHasMore(false)
          return
        }

        // 데이터 변환
        const formattedClinics = data.map((item: any) => {
          // 원본 데이터 로깅 추가
          console.log('병원 아이템 원본 데이터:', {
            id: item.id,
            hospital_name: item.hospital_name,
            is_liked: item.is_liked,  // is_liked 값 확인
          });

          // categories 데이터 처리 - depth2의 name과 id 추출
          let processedCategories = [];
          try {
            if (item.categories) {
              // 객체인 경우 배열로 변환
              const categoriesArray = Array.isArray(item.categories) 
                ? item.categories 
                : Object.values(item.categories);

              processedCategories = categoriesArray.map((cat: CategoryData) => ({
                id: cat.depth2?.id,
                name: cat.depth2?.name
              })).filter((cat: ProcessedCategory) => cat.id && cat.name);  // 유효한 데이터만 필터
            }
          } catch (error) {
            console.error('카테고리 처리 중 오류:', error);
          }

          console.log('처리된 카테고리:', processedCategories);

          return {
            id: item.id,
            title: item.hospital_name || item.name,
            description: item.description || '',
            image: item.thumbnail_url || '/images/placeholder.png',
            location: item.city_name || '',
            rating: Number(item.average_rating || item.rating || 0),
            viewCount: item.view_count || 0,
            categories: processedCategories,
            isRecommended: Boolean(item.is_recommended),
            isAd: Boolean(item.is_advertised),
            isMember: Boolean(item.is_member),
            isGoogle: Boolean(item.is_google),
            isLiked: Boolean(item.is_liked),
            likeCount: item.like_count || 0
          }
        })

        // 변환된 데이터 로깅
        console.log('변환된 병원 데이터:', formattedClinics.map((clinic: ClinicCardProps) => ({
          id: clinic.id,
          title: clinic.title,
          isLiked: clinic.isLiked
        })));

        if (page === 1) {
          setClinics(formattedClinics)
        } else {
          setClinics(prev => [...prev, ...formattedClinics])
        }
        
        setHasMore(data[0]?.has_next_page ?? false)
        console.log('다음 페이지 존재 여부:', data[0]?.has_next_page)

      } catch (error) {
        console.error('병원 목록 조회 실패:', error)
        if (error instanceof Error) {
          console.error('에러 메시지:', error.message)
        }
        setClinics([])
        setHasMore(false)
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchHospitals()
  }, [page, sortBy, filters, currentUser?.id])

  const handleFilterChange = (newFilters: any) => {
    setPage(1)
    setClinics([])
    setFilters(prev => ({
      ...prev,
      cityId: newFilters.cityId,
      options: {
        is_recommended: newFilters.options.is_recommended,
        is_advertised: newFilters.options.is_advertised,
        has_discount: newFilters.options.has_discount,
        is_member: newFilters.options.is_member
      },
      priceRange: newFilters.priceRange
    }))
  }

  const handleLikeToggle = async (clinicId: number) => {
    if (!currentUser) {
      // TODO: 로그인이 필요하다는 메시지 표시
      return
    }

    try {
      // 먼저 UI를 즉시 업데이트
      setClinics(prev => prev.map(clinic => 
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
        setClinics(prev => prev.map(clinic => 
          clinic.id === clinicId 
            ? { 
                ...clinic, 
                isLiked: !clinic.isLiked  // 다시 원래 상태로
              }
            : clinic
        ))
        throw error
      }

      // 서버 응답 확인을 위한 로그
      console.log('토글 응답:', data)

      // 서버 응답이 있는 경우에만 최종 상태 업데이트
      if (data && data[0]) {  // 배열의 첫 번째 항목 확인
        setClinics(prev => prev.map(clinic => 
          clinic.id === clinicId 
            ? { 
                ...clinic, 
                isLiked: data[0].is_liked,  // 배열의 첫 번째 항목에서 is_liked 값 사용
                likeCount: data[0].like_count 
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
      <TreatmentBanner />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Clinic Information</h1>
        
        <CategorySection 
          bodyParts={bodyPartsData.categories}
          treatmentMethods={treatmentMethodsData.categories}
          bodyPartSubs={bodyPartsData.subCategories}
          treatmentMethodSubs={treatmentMethodsData.subCategories}
          onCategorySelect={handleCategorySelect}
          onSubCategorySelect={handleSubCategorySelect}
          initialSelection={{
            bodyPartId: filters.bodyPartId,
            treatmentId: filters.treatmentId,
            bodyPartSubId: filters.bodyPartSubId,
            treatmentSubId: filters.treatmentSubId
          }}
        />

        {/* PC 버전 */}
        <div className="hidden md:flex gap-6 mt-8">
          <div className="w-1/4">
            <TreatmentFilter 
              onFilterChange={handleFilterChange} 
              showPriceFilter={false} 
            />
          </div>
          <div className="w-3/4">
            

            <ClinicList 
              clinics={clinics}
              totalCount={totalCount}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              onSortChange={handleSortChange}
              sortBy={sortBy}
              onLikeToggle={handleLikeToggle}
            />
          </div>
        </div>

        {/* 모바일 버전 */}
        <div className="block md:hidden">
          <ClinicList 
            clinics={clinics}
            totalCount={totalCount}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onSortChange={handleSortChange}
            sortBy={sortBy}
            className="w-full"
            onFilterClick={() => toggleMobileFilter(true)}
            onLikeToggle={handleLikeToggle}
          />

          {showMobileFilter && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => toggleMobileFilter(false)}
            >
              <div 
                className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl h-[70vh] flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <TreatmentFilter 
                  onFilterChange={handleFilterChange}
                  onClose={() => toggleMobileFilter(false)}
                  isMobile={true}
                  showPriceFilter={false}
                  initialFilters={{
                    cityId: filters.cityId,
                    bodyPartId: filters.bodyPartId,
                    treatmentId: filters.treatmentId,
                    bodyPartSubId: filters.bodyPartSubId,
                    treatmentSubId: filters.treatmentSubId,
                    options: {
                      is_recommended: filters.options.is_recommended,
                      is_advertised: filters.options.is_advertised,
                      has_discount: filters.options.has_discount,
                      is_member: filters.options.is_member
                    },
                    priceRange: filters.priceRange
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

// 메인 페이지 컴포넌트
export default function ClinicPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <ClinicContent />
    </Suspense>
  )
} 