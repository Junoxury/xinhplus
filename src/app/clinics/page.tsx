'use client'

import { CategoryIcon } from '@/components/category/CategoryIcon'
import { TreatmentBanner } from '@/components/treatments/TreatmentBanner'
import { TreatmentFilter } from '@/components/treatments/TreatmentFilter'
import { ClinicList } from '@/components/clinics/ClinicList'
import { useState, useEffect } from 'react'
import bodyPartsData from '@/data/bodyParts.json'
import treatmentMethodsData from '@/data/treatmentMethods.json'
import { CategorySection } from '@/components/treatments/CategorySection'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from '@/lib/supabase'
import { SortOption } from '@/components/clinics/ClinicList'

// 정렬 옵션 상수
const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'views', label: '조회순' },
  { value: 'rating', label: '평점순' },
  { value: 'likes', label: '좋아요순' }
] as const

type SortOption = typeof SORT_OPTIONS[number]['value']

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
}

// 병원 정보 페이지
export default function ClinicPage() {
  const [filters, setFilters] = useState({
    cityId: null as number | null,
    options: {
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

  const handleLoadMore = async () => {
    setLoading(true)
    setPage(prev => prev + 1)
    setLoading(false)
  }

  const handleCategorySelect = (selectedCategories: string[]) => {
    console.log('Selected categories:', selectedCategories)
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

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .rpc('get_hospitals_list', {
            p_city_id: filters.cityId,
            p_depth2_category_id: null,
            p_depth3_category_id: null,
            p_is_advertised: filters.options.is_advertised ? true : null,
            p_is_recommended: null,
            p_is_member: filters.options.is_member ? true : null,
            p_has_discount: filters.options.has_discount ? true : null,
            p_page_size: ITEMS_PER_PAGE,
            p_page: page,
            p_ad_limit: 2,
            p_sort_by: sortBy
          })

        if (error) {
          throw error
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
        const formattedClinics = data.map(hospital => ({
          id: hospital.id,
          title: hospital.hospital_name,
          description: hospital.description || '',
          image: hospital.thumbnail_url,
          rating: hospital.average_rating || 0,
          reviewCount: hospital.review_count || 0,
          location: hospital.city_name,
          categories: Object.entries(hospital.categories || {}).map(
            ([categoryType, category]: [string, any]) => ({
              id: category.depth2?.id || 0,
              name: category.depth2?.name || '',
              key: `${hospital.id}-${categoryType}-${category.depth2?.id}`
            })
          ).filter(cat => cat.id !== 0),
          isNew: hospital.is_new || false,
          isAd: hospital.is_advertised || false
        }))

        if (page === 1) {
          setClinics(formattedClinics)
        } else {
          setClinics(prev => [...prev, ...formattedClinics])
        }
        
        setHasMore(data[0]?.has_next_page ?? false)
        console.log('다음 페이지 존재 여부:', data[0]?.has_next_page)

      } catch (error) {
        console.error('병원 목록 조회 실패:', error)
        setClinics([])
        setHasMore(false)
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchHospitals()
  }, [page, sortBy, filters])

  const handleFilterChange = (newFilters: any) => {
    setPage(1)
    setClinics([])
    setFilters(newFilters)
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
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 