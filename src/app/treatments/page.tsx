'use client'

import { CategoryIcon } from '@/components/category/CategoryIcon'
import { TreatmentBanner } from '@/components/treatments/TreatmentBanner'
import { TreatmentFilter } from '@/components/treatments/TreatmentFilter'
import { TreatmentList } from '@/components/treatments/TreatmentList'
import { useState, useEffect } from 'react'
import bodyPartsData from '@/data/bodyParts.json'
import treatmentMethodsData from '@/data/treatmentMethods.json'
import { CategorySection } from '@/components/treatments/CategorySection'

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

// 시술 정보 페이지
export default function TreatmentPage() {
  const [filters, setFilters] = useState({
    priceRange: [0, 100000000],
    location: '',
    rating: 0,
    categories: []
  });

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const ITEMS_PER_PAGE = 10

  const currentTreatments = treatments.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = currentTreatments.length < treatments.length

  const handleLoadMore = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setPage(prev => prev + 1)
    setLoading(false)
  }

  const handleCategorySelect = (selectedCategories: string[]) => {
    // 선택된 카테고리로 필터링 로직 구현
    console.log('Selected categories:', selectedCategories)
  }

  const [showMobileFilter, setShowMobileFilter] = useState(false)

  // 모달 열릴 때 body 스크롤 제어
  const toggleMobileFilter = (show: boolean) => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    setShowMobileFilter(show)
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
        <h1 className="text-2xl font-bold text-center mb-8">Treatment Information</h1>
        
        <CategorySection 
          bodyParts={bodyPartsData.categories}
          treatmentMethods={treatmentMethodsData.categories}
          bodyPartSubs={bodyPartsData.subCategories}
          treatmentMethodSubs={treatmentMethodsData.subCategories}
          onCategorySelect={handleCategorySelect}
        />

        {/* PC 버전 */}
        <div className="hidden md:flex gap-6 mt-8">
          <div className="w-1/3">
            <TreatmentFilter onFilterChange={setFilters} />
          </div>
          <div className="w-2/3">
            <TreatmentList 
              treatments={currentTreatments}
              totalCount={treatments.length}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              className="w-full"
              onFilterClick={() => toggleMobileFilter(true)}
            />
          </div>
        </div>

        {/* 모바일 버전 */}
        <div className="block md:hidden">
          <TreatmentList 
            treatments={currentTreatments}
            totalCount={treatments.length}
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
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 