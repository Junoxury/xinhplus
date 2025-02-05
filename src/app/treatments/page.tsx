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
  is_liked: boolean
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
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const ITEMS_PER_PAGE = 6
  const searchParams = useSearchParams()
  
  // filters 초기값 설정을 URL 파라미터를 포함하도록 수정
  const [filters, setFilters] = useState<TreatmentFilters>(() => {
    const depth2Id = searchParams.get('depth2')
    return {
      sort_by: 'view_count',
      depth2_category_id: depth2Id ? Number(depth2Id) : null
    }
  })

  // CategorySection의 initialSelection도 URL 파라미터 기반으로 초기화
  const [categorySelection, setCategorySelection] = useState(() => {
    const depth2Id = searchParams.get('depth2')
    return {
      bodyPartId: null,
      treatmentId: null,
      bodyPartSubId: null,
      treatmentSubId: null
    }
  })

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

  // 카테고리 데이터 로드 후 카테고리 선택 상태 업데이트
  useEffect(() => {
    const depth2Id = searchParams.get('depth2')
    if (!depth2Id) return
    
    if (bodyPartsData.categories.length === 0 && treatmentMethodsData.categories.length === 0) return
    
    const numericDepth2Id = Number(depth2Id)
    
    const isBodyPart = bodyPartsData.categories.some(
      category => category.id === numericDepth2Id
    )
    
    const isTreatmentMethod = treatmentMethodsData.categories.some(
      category => category.id === numericDepth2Id
    )
    
    // CategorySection의 선택 상태 업데이트
    setCategorySelection({
      bodyPartId: isBodyPart ? numericDepth2Id : null,
      treatmentId: isTreatmentMethod ? numericDepth2Id : null,
      bodyPartSubId: null,
      treatmentSubId: null
    })

    // 모바일 필터에서 선택 상태 업데이트
    if (showMobileFilter) {
      setCategorySelection(prev => ({
        ...prev,
        bodyPartId: isBodyPart ? numericDepth2Id : prev.bodyPartId,
        treatmentId: isTreatmentMethod ? numericDepth2Id : prev.treatmentId,
      }))
    }
  }, [searchParams, bodyPartsData.categories, treatmentMethodsData.categories, showMobileFilter])

  // 단일 useEffect로 데이터 fetch
  useEffect(() => {
    console.log('Fetching treatments with filters:', filters)
    setPage(1)
    fetchTreatments(1, filters, false)
  }, [filters])

  // 시술 데이터 fetch 함수
  const fetchTreatments = async (page: number, filters: TreatmentFilters, isLoadMore: boolean = false) => {
    try {
      setLoading(true)
      
      // 현재 로그인한 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser()
      console.log('🔑 Current user:', user?.id || 'Not logged in')
      
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
        p_offset: (page - 1) * ITEMS_PER_PAGE,
        p_user_id: user?.id || null
      }
      
      console.log('📡 RPC Parameters:', JSON.stringify(rpcParams, null, 2))

      const { data, error } = await supabase.rpc('get_treatments', rpcParams)

      if (error) {
        console.error('❌ Supabase RPC Error:', error)
        throw error
      }

      console.log('✅ RPC Response:', {
        totalCount: data?.[0]?.total_count || 0,
        hasNext: data?.[0]?.has_next || false,
        itemCount: data?.length || 0,
        firstItem: data?.[0] || null,
        isLikedSample: data?.[0]?.is_liked
      })

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
          disableLink: true,
          is_liked: item.is_liked
        }))

        // 더보기인 경우 기존 데이터에 추가
        if (isLoadMore) {
          setTreatments(prev => [...prev, ...formattedTreatments])
        } else {
          // 초기 로드인 경우 데이터 새로 설정
          setTreatments(formattedTreatments)
        }
      } 
      // 데이터가 없는 경우
      else {
        if (!isLoadMore) {
          setTreatments([])
        }
        setHasMore(false)
        setTotalCount(0)
      }

    } catch (error) {
      console.error('❌ Error in fetchTreatments:', error)
      if (!isLoadMore) {
        setTreatments([])
      }
      setHasMore(false)
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

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
        // false면 null로 변경하여 전달
        is_recommended: newFilters.options.is_recommended || null,
        is_discounted: newFilters.options.has_discount || null,
        is_advertised: newFilters.options.is_advertised || null
      }
    }

    // 가격 범위가 명시적으로 전달된 경우에만 업데이트
    if (newFilters.priceRange) {
      updatedFilters = {
        ...updatedFilters,
        price_from: newFilters.priceRange[0],
        price_to: newFilters.priceRange[1]
      }
    }

    console.log('Updated filters:', updatedFilters)
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
                  <TreatmentCard 
                    {...treatment} 
                    disableLink 
                    is_liked={treatment.is_liked}
                  />
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
                <TreatmentCard 
                  {...treatment} 
                  disableLink 
                  is_liked={treatment.is_liked}
                />
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