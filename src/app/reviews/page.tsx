'use client'

import { TreatmentBanner } from '@/components/treatments/TreatmentBanner'
import { TreatmentFilter } from '@/components/treatments/TreatmentFilter'
import { useState, useEffect } from 'react'
import { CategorySection } from '@/components/treatments/CategorySection'
import { Button } from '@/components/ui/button'
import { Filter, X } from 'lucide-react'
import { ReviewList } from '@/components/reviews/ReviewList'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'

interface Category {
  id: number
  name: string
  icon: string
  label: string
  href: string
}

interface SubCategory {
  id: number
  label: string
  parentId?: number
}

interface Filters {
  cityId: number | null;  // location 대신 cityId 사용
  rating: number;
  categories: string[];
  priceRange: [number, number];  // [min, max] 형태의 가격 범위 추가
  options: {
    is_recommended: boolean;
    has_discount: boolean;
    is_member: boolean;
    is_advertised: boolean;
  };
}

export default function ReviewPage() {
  const [filters, setFilters] = useState<Filters>({
    cityId: null,
    rating: 0,
    categories: [],
    priceRange: [0, 100000000],  // 기본 가격 범위 설정
    options: {
      is_recommended: false,
      has_discount: false,
      is_member: false,
      is_advertised: false,
    }
  });

  const [reviews, setReviews] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('latest')
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const ITEMS_PER_PAGE = 8

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
        setBodyPartsData(bodyParts || { categories: [], subCategories: [] })

        // 시술 방법 카테고리 (parent_id = 2)
        const { data: treatmentMethods, error: treatmentError } = await supabase
          .rpc('get_categories', { p_parent_depth1_id: 2 })

        if (treatmentError) throw treatmentError
        setTreatmentMethodsData(treatmentMethods || { categories: [], subCategories: [] })

      } catch (error) {
        console.error('카테고리 데이터 로드 실패:', error)
      }
    }

    fetchCategories()
  }, [])

  const [selectedFilters, setSelectedFilters] = useState({
    bodyPartId: null,
    treatmentId: null,
    bodyPartSubId: null,
    treatmentSubId: null
  })

  const handleCategorySelect = (categoryId: number | null, isBodyPart: boolean) => {
    console.log('Category selected:', { categoryId, isBodyPart });  // 로깅 추가
    
    setSelectedFilters(prev => {
      const newFilters = {
        ...prev,
        bodyPartId: isBodyPart ? categoryId : prev.bodyPartId,
        treatmentId: isBodyPart ? prev.treatmentId : categoryId,
        // depth3 선택이 해제되면 null로 설정
        bodyPartSubId: isBodyPart ? null : prev.bodyPartSubId,
        treatmentSubId: isBodyPart ? prev.treatmentSubId : null
      };
      console.log('New selected filters:', newFilters);  // 로깅 추가
      return newFilters;
    });

    // 필터 변경 시 페이지 초기화
    setPage(1);
    setReviews([]);
  }

  const handleSubCategorySelect = (subCategoryId: number | null, isBodyPart: boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      bodyPartSubId: isBodyPart ? subCategoryId : prev.bodyPartSubId,
      treatmentSubId: isBodyPart ? prev.treatmentSubId : subCategoryId
    }))
  }

  // 필터 변경 핸들러 수정
  const handleFilterChange = (newFilters: Filters) => {
    console.log('Filter changed:', newFilters);  // 필터 변경 로깅
    
    // cityId를 location으로 사용
    const updatedFilters = {
      ...newFilters,
      cityId: newFilters.cityId ? Number(newFilters.cityId) : null  // cityId를 location으로 사용
    };
    
    console.log('Updated filters:', updatedFilters);  // 변환된 필터 로깅
    setFilters(updatedFilters);
    setPage(1);
    setReviews([]);
  };

  // 리뷰 데이터 로드
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        console.log('Selected filters:', selectedFilters);  // 선택된 필터 로깅

        const { data, error } = await supabase.rpc('get_reviews', {
          p_treatment_id: selectedFilters.treatmentId,
          p_hospital_id: null,
          p_depth2_id: selectedFilters.bodyPartId,        // 신체 부위 depth2
          p_depth2_treatment_id: selectedFilters.treatmentId,  // 시술 방법 depth2
          p_depth3_id: selectedFilters.bodyPartSubId,     // 신체 부위 depth3
          p_depth3_treatment_id: selectedFilters.treatmentSubId,  // 시술 방법 depth3
          p_is_recommended: filters.options.is_recommended,
          p_has_discount: filters.options.has_discount,
          p_is_member: filters.options.is_member,
          p_is_ad: filters.options.is_advertised,
          p_location: filters.cityId,
          p_min_price: filters.priceRange[0],
          p_max_price: filters.priceRange[1],
          p_best_count: 5,
          p_sort_by: sortBy,
          p_limit: ITEMS_PER_PAGE,
          p_offset: (page - 1) * ITEMS_PER_PAGE
        })

        if (error) {
          console.error('RPC error:', error);  // RPC 에러 로깅
          throw error;
        }

        // 상세 로깅 추가
        console.log('Raw review data:', data)

        if (data) {
          const formattedReviews = data.map(review => {
            // categories 처리 수정
            const categoryNames = [];
            if (review.categories?.depth2?.name) {
              categoryNames.push(review.categories.depth2.name);
            }
            if (review.categories?.depth3?.name) {
              categoryNames.push(review.categories.depth3.name);
            }

            return {
              id: review.id,
              beforeImage: review.before_image || '',
              afterImage: review.after_image || '',
              additionalImagesCount: 0,
              rating: review.rating || 0,
              content: review.content || '',
              author: review.author_name || '익명',
              authorImage: review.author_image || '/images/default-avatar.png',
              date: new Date(review.created_at).toLocaleDateString(),
              treatmentName: review.treatment_name || '',
              categories: categoryNames,  // 배열로 변환된 카테고리 이름들
              isAuthenticated: false,
              location: review.location || '위치 정보 없음',
              clinicName: review.hospital_name || '',
              commentCount: review.comment_count || 0,
              viewCount: review.view_count || 0,
              isGoogle: review.is_google || false,
              likeCount: review.like_count || 0
            }
          })

          // 변환된 데이터 로깅
          console.log('Formatted reviews:', formattedReviews)

          if (page === 1) {
            setReviews(formattedReviews)
          } else {
            setReviews(prev => [...prev, ...formattedReviews])
          }
          
          setTotalCount(data[0]?.total_count || 0)
          setHasMore((data[0]?.total_count || 0) > ((page) * ITEMS_PER_PAGE))
        }
      } catch (error) {
        console.error('리뷰 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [page, sortBy, selectedFilters, filters])

  const handleLoadMore = async () => {
    setPage(prev => prev + 1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setPage(1)
    setReviews([])
  }

  return (
    <main className="min-h-screen">
      <TreatmentBanner />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="hidden">Reviews/Posting</h1>
        <div className="flex justify-center mb-8">
          <a href="/reviews" className="w-1/2 py-2 text-center bg-blue-500 text-white font-bold rounded-l-md">
            Reviews
          </a>
          <a href="/posts" className="w-1/2 py-2 text-center bg-gray-200 text-gray-800 font-bold rounded-r-md">
            Posts
          </a>
        </div>
        
        <CategorySection
          bodyParts={bodyPartsData.categories}
          treatmentMethods={treatmentMethodsData.categories}
          bodyPartSubs={bodyPartsData.subCategories}
          treatmentMethodSubs={treatmentMethodsData.subCategories}
          onCategorySelect={handleCategorySelect}
          onSubCategorySelect={handleSubCategorySelect}
          initialSelection={selectedFilters}
        />

        {/* 모바일 선택된 depth3 배지 표시 */}
        <div className="block md:hidden -mt-2">
          <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto scrollbar-hide">
            {selectedFilters.bodyPartSubId && 
              bodyPartsData.subCategories
                .filter(sub => sub.id === selectedFilters.bodyPartSubId)
                .map(sub => (
                  <Badge 
                    key={sub.id}
                    variant="secondary"
                    className="flex-shrink-0 flex items-center gap-1 whitespace-nowrap"
                  >
                    {sub.label}
                    <X 
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleSubCategorySelect(null, true)}
                    />
                  </Badge>
                ))}
            {selectedFilters.treatmentSubId && 
              treatmentMethodsData.subCategories
                .filter(sub => sub.id === selectedFilters.treatmentSubId)
                .map(sub => (
                  <Badge 
                    key={sub.id}
                    variant="secondary"
                    className="flex-shrink-0 flex items-center gap-1 whitespace-nowrap"
                  >
                    {sub.label}
                    <X 
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleSubCategorySelect(null, false)}
                    />
                  </Badge>
                ))}
          </div>
        </div>

        {/* PC 버전 */}
        <div className="hidden md:flex gap-6 mt-8">
          <div className="w-1/4">
            <TreatmentFilter 
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>
          <div className="w-3/4">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">
                  총 <span className="font-semibold">{totalCount}</span>개
                </div>
              </div>

              <select 
                className="h-9 px-3 text-sm border rounded-md bg-background"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="latest">최신순</option>
                <option value="view_count">조회순</option>
                <option value="like_count">좋아요순</option>
              </select>
            </div>

            {/* 리뷰 목록 */}
            <ReviewList reviews={reviews} layout="grid" />

            {/* 더보기 버튼 */}
            {hasMore && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="w-full md:w-[200px]"
                >
                  {loading ? '로딩중...' : '더보기'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 모바일 버전 */}
        <div className="block md:hidden">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleMobileFilter(true)}
                className="md:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                필터
              </Button>
              <div className="text-sm text-gray-600">
                총 <span className="font-semibold">{totalCount}</span>개
              </div>
            </div>

            <select 
              className="h-9 px-3 text-sm border rounded-md bg-background"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="latest">최신순</option>
              <option value="view_count">조회순</option>
              <option value="like_count">좋아요순</option>
            </select>
          </div>

          {/* 리뷰 목록 */}
          <ReviewList reviews={reviews} layout="vertical" />

          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loading}
                className="w-full md:w-[200px]"
              >
                {loading ? '로딩중...' : '더보기'}
              </Button>
            </div>
          )}

          {/* 모바일 필터 오버레이 */}
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
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 