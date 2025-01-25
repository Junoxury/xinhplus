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

// 정렬 옵션 상수
const SORT_OPTIONS = [
  { value: 'recommended', label: '추천순' },
  { value: 'views', label: '조회순' },
  { value: 'latest', label: '최신순' }
] as const

type SortOption = typeof SORT_OPTIONS[number]['value']

// 더미 병원 데이터
const clinics = [
  {
    id: 1,
    title: '뷰티라이프 병원',
    description: '20년 전통의 성형외과 전문병원',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 5.0,
    reviewCount: 12546,
    location: 'Hanoi',
    categories: ['눈성형', '코성형', '안면윤곽'],
    isNew: true,
    isAd: false
  },
  {
    id: 2,
    title: '아름다운 성형외과',
    description: '맞춤형 성형 전문병원',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.9,
    reviewCount: 8234,
    location: 'Hanoi',
    categories: ['안면윤곽', '지방이식', '보톡스'],
    isNew: false,
    isAd: true
  },
  {
    id: 3,
    title: '미소 성형외과',
    description: '자연스러운 아름다움을 추구하는 병원',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.8,
    reviewCount: 6789,
    location: 'Hochiminh',
    categories: ['눈성형', '코성형', '윤곽성형'],
    isNew: true,
    isAd: false
  },
  {
    id: 4,
    title: '라인 성형외과',
    description: '완벽한 라인을 만드는 전문병원',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.7,
    reviewCount: 5432,
    location: 'Danang',
    categories: ['안면윤곽', '지방흡입', '가슴성형'],
    isNew: false,
    isAd: true
  },
  {
    id: 5,
    title: '퍼펙트 성형외과',
    description: '최고의 의료진이 함께하는 병원',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.9,
    reviewCount: 4567,
    location: 'Hanoi',
    categories: ['눈성형', '코성형', '쁘띠성형'],
    isNew: true,
    isAd: false
  },
  {
    id: 6,
    title: '더마 클리닉',
    description: '피부 전문 클리닉',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.6,
    reviewCount: 3456,
    location: 'Hochiminh',
    categories: ['피부과', '레이저', '보톡스'],
    isNew: false,
    isAd: true
  },
  {
    id: 7,
    title: '뉴라인 성형외과',
    description: '최신 장비와 기술력의 만남',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.8,
    reviewCount: 2345,
    location: 'Hanoi',
    categories: ['안면윤곽', '눈성형', '코성형'],
    isNew: true,
    isAd: false
  },
  {
    id: 8,
    title: '벨라 클리닉',
    description: '자연스러운 아름다움을 추구',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.7,
    reviewCount: 1234,
    location: 'Danang',
    categories: ['피부과', '쁘띠성형', '레이저'],
    isNew: false,
    isAd: true
  },
  {
    id: 9,
    title: '리본 성형외과',
    description: '맞춤형 성형 디자인',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.5,
    reviewCount: 987,
    location: 'Hochiminh',
    categories: ['눈성형', '코성형', '윤곽성형'],
    isNew: true,
    isAd: false
  },
  {
    id: 10,
    title: '유스 클리닉',
    description: '젊음을 되찾아주는 병원',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.6,
    reviewCount: 876,
    location: 'Hanoi',
    categories: ['안티에이징', '피부과', '쁘띠성형'],
    isNew: false,
    isAd: true
  },
  {
    id: 11,
    title: '아트 성형외과',
    description: '예술적 감각의 성형 전문',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.7,
    reviewCount: 765,
    location: 'Danang',
    categories: ['눈성형', '코성형', '안면윤곽'],
    isNew: true,
    isAd: false
  },
  {
    id: 12,
    title: '뷰티메디 클리닉',
    description: '토탈 뷰티 케어',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    rating: 4.8,
    reviewCount: 654,
    location: 'Hochiminh',
    categories: ['피부과', '쁘띠성형', '레이저'],
    isNew: false,
    isAd: true
  }
]

// ClinicCard 컴포넌트에 전달할 props 타입 정의
export interface ClinicCardProps {
  id: number;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  categories: string[];
  treatmentCount: number;
  doctorCount: number;
  isNew?: boolean;
  isAd?: boolean;
}

// 병원 정보 페이지
export default function ClinicPage() {
  const [filters, setFilters] = useState({
    location: '',
    rating: 0,
    categories: []
  });

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const ITEMS_PER_PAGE = 6 // 한 번에 보여줄 아이템 수를 6개로 설정

  const currentClinics = clinics.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = currentClinics.length < clinics.length

  const handleLoadMore = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // 로딩 시뮬레이션
    setPage(prev => prev + 1)
    setLoading(false)
  }

  const handleCategorySelect = (selectedCategories: string[]) => {
    // 선택된 카테고리로 필터링 로직 구현
    console.log('Selected categories:', selectedCategories)
  }

  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('recommended')

  // 모달 열릴 때 body 스크롤 제어
  const toggleMobileFilter = (show: boolean) => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    setShowMobileFilter(show)
  }

  // 정렬 변경 핸들러
  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    // TODO: 정렬 로직 구현
  }

  // cleanup effect
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

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
        <div className="hidden md:flex gap-6">
          <div className="w-1/4">
            <TreatmentFilter 
              onFilterChange={setFilters} 
              showPriceFilter={false} 
            />
          </div>
          <div className="w-3/4">
            

            <ClinicList 
              clinics={currentClinics}
              totalCount={clinics.length}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          </div>
        </div>

        {/* 모바일 버전 */}
        <div className="block md:hidden">
          {/* 정렬 옵션 */}
          

          <ClinicList 
            clinics={currentClinics}
            totalCount={clinics.length}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            className="w-full"
            onFilterClick={() => toggleMobileFilter(true)}
          />

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
                  onFilterChange={setFilters}
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