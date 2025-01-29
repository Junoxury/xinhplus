'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { TreatmentBanner } from '@/components/treatments/TreatmentBanner'
import { TreatmentFilter } from '@/components/treatments/TreatmentFilter'
import { TreatmentList } from '@/components/treatments/TreatmentList'

import { CategorySection } from '@/components/treatments/CategorySection'
import Link from 'next/link'
import { TreatmentCard } from '@/components/treatments/TreatmentCard'
import { useSearchParams } from 'next/navigation'

// 시술 데이터 타입 정의
interface Treatment {
  id: number
  hospital_id: number
  hospital_name: string
  title: string
  summary: string
  city_id: number
  city_name: string
  rating: number
  comment_count: number
  view_count: number
  like_count: number
  thumbnail_url: string
  detail_content: string
  is_advertised: boolean
  is_recommended: boolean
  is_discounted: boolean
  price: number
  discount_price: number
  discount_rate: number
  categories: {
    depth2_id: number
    depth2_name: string
    depth3_list: {
      id: number
      name: string
    }[]
  }[]
  created_at: string
  updated_at: string
}

// 필터 타입 정의 수정
interface TreatmentFilters {
  hospital_id?: number
  depth2_category_id?: number
  depth3_category_id?: number
  is_advertised?: boolean
  is_recommended?: boolean
  city_id?: number | null
  is_discounted?: boolean
  price_from?: number
  price_to?: number
  sort_by?: 'view_count' | 'like_count' | 'rating' | 'discount_price_asc' | 'discount_price_desc'
}

// CategorySection에서 전달하는 실제 파라미터 타입 정의
interface CategorySelectParams {
  categoryId: number | null;  // depth2 카테고리 ID
  isBodyPart: boolean;
  parentId?: number | null;   // depth1 카테고리 ID
  subCategoryId?: number | null;  // depth3 카테고리 ID
}

export default function TreatmentPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState<TreatmentFilters>({
    sort_by: 'view_count'
  })
  const ITEMS_PER_PAGE = 6

  // 카테고리 데이터를 위한 상태 추가
  const [bodyPartsData, setBodyPartsData] = useState({ categories: [], subCategories: [] })
  const [treatmentMethodsData, setTreatmentMethodsData] = useState({ categories: [], subCategories: [] })

  const searchParams = useSearchParams()
  
  // URL에서 depth2 파라미터 가져오기
  useEffect(() => {
    const depth2Id = searchParams.get('depth2')
    if (!depth2Id) return
    
    // 카테고리 데이터가 로드되기 전에는 실행하지 않음
    if (bodyPartsData.categories.length === 0 || treatmentMethodsData.categories.length === 0) return
    
    const numericDepth2Id = Number(depth2Id)
    
    // depth2Id가 bodyParts에 속하는지 treatmentMethods에 속하는지 확인
    const isBodyPart = bodyPartsData.categories.some(
      category => category.id === numericDepth2Id
    )
    
    const isTreatmentMethod = treatmentMethodsData.categories.some(
      category => category.id === numericDepth2Id
    )
    
    // 필터 업데이트
    if (isBodyPart || isTreatmentMethod) {
      setFilters(prev => ({
        ...prev,
        depth2_category_id: numericDepth2Id
      }))
      
      // CategorySection의 initialSelection 업데이트
      setCategorySelection({
        bodyPartId: isBodyPart ? numericDepth2Id : null,
        treatmentId: isTreatmentMethod ? numericDepth2Id : null,
        bodyPartSubId: null,
        treatmentSubId: null
      })
    }
  }, [searchParams, bodyPartsData.categories, treatmentMethodsData.categories])

  // CategorySection의 initialSelection을 위한 상태 추가
  const [categorySelection, setCategorySelection] = useState(() => {
    const depth2Id = searchParams.get('depth2')
    if (!depth2Id) return {
      bodyPartId: null,
      treatmentId: null,
      bodyPartSubId: null,
      treatmentSubId: null
    }

    const numericDepth2Id = Number(depth2Id)
    return {
      bodyPartId: null,  // 초기에는 null로 설정, 카테고리 로드 후 업데이트
      treatmentId: null,
      bodyPartSubId: null,
      treatmentSubId: null
    }
  })

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

  // 시술 데이터 fetch 함수
  const fetchTreatments = async (page: number, filters: TreatmentFilters, isLoadMore: boolean = false) => {
    try {
      setLoading(true)
      
      const rpcParams = {
        p_hospital_id: filters.hospital_id ?? null,
        p_depth2_category_id: filters.depth2_category_id ?? null,
        p_depth3_category_id: filters.depth3_category_id ?? null,
        p_is_advertised: filters.is_advertised ?? null,
        p_is_recommended: filters.is_recommended,
        p_city_id: filters.city_id ?? null,
        p_is_discounted: filters.is_discounted ?? null,
        p_price_from: filters.price_from,
        p_price_to: filters.price_to,
        p_sort_by: filters.sort_by ?? 'view_count',
        p_limit: ITEMS_PER_PAGE,
        p_offset: (page - 1) * ITEMS_PER_PAGE
      }
      
      console.log('Calling RPC with params:', rpcParams)

      const { data, error } = await supabase.rpc('get_treatments', rpcParams)

      if (error) {
        console.error('Supabase RPC Error:', error)
        throw error
      }

      // 데이터가 있는 경우
      if (data && data.length > 0) {
        setTotalCount(data[0].total_count)
        setHasMore(data[0].has_next)
        const formattedTreatments = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          hospital_name: item.hospital_name,
          city_name: item.city_name,
          thumbnail_url: item.thumbnail_url || '/images/placeholder.png',
          price: item.price,
          discount_price: item.discount_price,
          discount_rate: item.discount_rate,
          rating: Number(item.rating || 0),
          comment_count: item.comment_count || 0,
          categories: item.categories || [],
          is_advertised: Boolean(item.is_advertised),
          is_recommended: Boolean(item.is_recommended),
          disableLink: true  // 링크 비활성화
        }))
        setTreatments(formattedTreatments)
      } 
      // 데이터가 없는 경우
      else {
        setTreatments([])
        setHasMore(false)
        setTotalCount(0)  // 총 개수를 0으로 설정
      }

    } catch (error) {
      console.error('Error fetching treatments:', error)
      // 에러 발생 시에도 상태 초기화
      setTreatments([])
      setHasMore(false)
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  // 필터 변경시 데이터 새로 fetch
  useEffect(() => {
    console.log('Filters changed, fetching with:', {
      ...filters,
      depth2_id: filters.depth2_category_id,
      depth3_id: filters.depth3_category_id
    })
    
    setPage(1)  // 페이지 초기화
    fetchTreatments(1, filters, false)  // 새로운 데이터로 교체
  }, [
    filters.depth2_category_id, 
    filters.depth3_category_id,
    filters.city_id,
    filters.is_recommended,
    filters.is_discounted,
    filters.price_from,
    filters.price_to,
    filters.sort_by
  ])

  const handleLoadMore = async () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      await fetchTreatments(nextPage, filters, true)  // 더보기는 true로 설정
      setPage(nextPage)
    }
  }

  const handleFilterChange = (newFilters: any) => {
    let updatedFilters = { ...filters }

    // 도시 ID 처리
    if ('cityId' in newFilters) {
      updatedFilters.city_id = newFilters.cityId ? Number(newFilters.cityId) : null
    }

    // 옵션 처리
    if (newFilters.options) {
      updatedFilters = {
        ...updatedFilters,
        is_recommended: newFilters.options.is_recommended || null,
        is_discounted: newFilters.options.has_discount || null,
        is_advertised: newFilters.options.is_advertised || null
      }
    }

    // 가격 범위 처리
    if (newFilters.priceRange) {
      const [from, to] = newFilters.priceRange
      console.log('Processing price range:', { from, to })  // 디버깅 로그 추가
      
      // 가격이 기본값과 다른 경우에만 필터 적용
      updatedFilters = {
        ...updatedFilters,
        price_from: from === 0 ? null : from,
        price_to: to === 100000000 ? null : to
      }
    }

    console.log('Updated filters with price:', updatedFilters)  // 디버깅 로그 추가
    setFilters(updatedFilters)
  }

  const handleCategorySelect = (categoryId: number | null, isBodyPart: boolean, parentId?: number) => {
    console.log('Category selected:', { categoryId, isBodyPart, parentId })
    
    const numericCategoryId = categoryId ? Number(categoryId) : null
    
    // filters 업데이트
    setFilters(prev => ({
      ...prev,
      depth2_category_id: numericCategoryId,
      depth3_category_id: null
    }))

    // categorySelection 상태 업데이트
    setCategorySelection({
      bodyPartId: isBodyPart ? numericCategoryId : null,
      treatmentId: !isBodyPart ? numericCategoryId : null,
      bodyPartSubId: null,
      treatmentSubId: null
    })
  }

  const handleSubCategorySelect = (subCategoryId: number | null, isBodyPart: boolean) => {
    console.log('SubCategory selected:', { subCategoryId, isBodyPart })
    
    // filters 업데이트
    setFilters(prev => ({
      ...prev,
      depth3_category_id: subCategoryId
    }))

    // categorySelection 상태 업데이트
    setCategorySelection(prev => ({
      ...prev,
      bodyPartSubId: isBodyPart ? subCategoryId : null,
      treatmentSubId: !isBodyPart ? subCategoryId : null
    }))
  }

  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const toggleMobileFilter = (show: boolean) => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    setShowMobileFilter(show)
  }

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const handleSortChange = (sortBy: 'view_count' | 'like_count' | 'rating' | 'discount_price_asc' | 'discount_price_desc') => {
    setFilters(prev => ({
      ...prev,
      sort_by: sortBy
    }))
    // 정렬 변경 시 페이지 초기화는 useEffect에서 처리됨
  }

  return (
    <main className="min-h-screen">
      <TreatmentBanner />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Treatment Information</h1>
        
        <CategorySection 
          bodyParts={bodyPartsData.categories}
          treatmentMethods={treatmentMethodsData.categories}
          bodyPartSubs={bodyPartsData.subCategories}
          treatmentMethodSubs={treatmentMethodsData.subCategories}
          onCategorySelect={handleCategorySelect}
          onSubCategorySelect={handleSubCategorySelect}
          // categorySelection 상태를 initialSelection으로 전달
          initialSelection={categorySelection}
        />

        {/* PC 버전 */}
        <div className="hidden md:flex gap-6 mt-8">
          <div className="w-1/3">
            <TreatmentFilter 
              onFilterChange={handleFilterChange}
              hideMemberOption={true}
              initialFilters={{
                cityId: filters.city_id,
                options: {
                  is_recommended: filters.is_recommended || false,
                  has_discount: filters.is_discounted || false,
                  is_member: false,
                  is_advertised: filters.is_advertised || false
                },
                priceRange: [filters.price_from || 0, filters.price_to || 100000000]
              }}
            />
          </div>
          <div className="w-2/3">
            <TreatmentList 
              treatments={treatments}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              className="w-full"
              onFilterClick={() => toggleMobileFilter(true)}
              onSortChange={handleSortChange}
              totalCount={totalCount}
              renderItem={(treatment) => (
                <Link 
                  key={treatment.id}
                  href={`/treatments/detail?id=${treatment.id}`}
                  className="block"
                >
                  <TreatmentCard {...treatment} disableLink />
                </Link>
              )}
            />
          </div>
        </div>

        {/* 모바일 버전 */}
        <div className="block md:hidden">
          <TreatmentList 
            treatments={treatments}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            className="w-full"
            onFilterClick={() => toggleMobileFilter(true)}
            onSortChange={handleSortChange}
            totalCount={totalCount}
            renderItem={(treatment) => (
              <Link 
                key={treatment.id}
                href={`/treatments/detail?id=${treatment.id}`}
                className="block"
              >
                <TreatmentCard {...treatment} disableLink />
              </Link>
            )}
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
                  hideMemberOption={true}
                  initialFilters={{
                    cityId: filters.city_id,
                    options: {
                      is_recommended: filters.is_recommended || false,
                      has_discount: filters.is_discounted || false,
                      is_member: false,
                      is_advertised: filters.is_advertised || false
                    },
                    priceRange: [filters.price_from || 0, filters.price_to || 100000000]
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