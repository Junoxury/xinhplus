'use client'

import { CategoryIcon } from '@/components/category/CategoryIcon'
import { TreatmentBanner } from '@/components/treatments/TreatmentBanner'
import { TreatmentFilter } from '@/components/treatments/TreatmentFilter'
import { useState, useEffect } from 'react'
import bodyPartsData from '@/data/bodyParts.json'
import treatmentMethodsData from '@/data/treatmentMethods.json'
import { CategorySection } from '@/components/treatments/CategorySection'
import { ShortList } from '@/components/shorts/ShortList'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'

// 더미 쇼츠 데이터
const shorts = [
  {
    id: '1',
    title: '자연스러운 쌍커풀 수술 전후 비교',
    description: '자연스러운 라인의 쌍커풀 수술 과정',
    image: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=1000',
    location: 'Hanoi',
    clinic: 'Thẩm mỹ viện Nana',
    categories: ['눈성형', '쌍커풀'],
  },
  {
    id: '2',
    title: '코 필러 시술 과정 공개',
    description: '15분 만에 완성하는 코 높이기',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000',
    location: 'Hochiminh',
    clinic: 'Thẩm mỹ viện Bella',
    categories: ['코성형', '필러'],
  },
  {
    id: '3',
    title: '안전한 안면윤곽 수술 VLOG',
    description: '자연스러운 V라인 만들기',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1000',
    location: 'Hanoi',
    clinic: 'Thẩm mỹ viện Luna',
    categories: ['안면윤곽', '턱성형'],
  },
  {
    id: '4',
    title: '실제 지방이식 수술 현장',
    description: '자연스러운 볼륨감 만들기',
    image: 'https://images.unsplash.com/photo-1578496781985-452d4a934d50?q=80&w=1000',
    location: 'Danang',
    clinic: 'Thẩm mỹ viện Stella',
    categories: ['지방이식', '볼륨'],
  },
  {
    id: '5',
    title: '울쎄라 리프팅 시술 과정',
    description: '피부 탄력 개선 프로그램',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000',
    location: 'Hochiminh',
    clinic: 'Thẩm mỹ viện Venus',
    categories: ['리프팅', '피부관리'],
  },
  {
    id: '6',
    title: '눈밑 지방 재배치 수술기',
    description: '다크서클 개선 프로그램',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000',
    location: 'Hanoi',
    clinic: 'Thẩm mỹ viện Derma',
    categories: ['눈성형', '지방이식'],
  },
  {
    id: '7',
    title: '레이저 토닝 시술 현장',
    description: '피부 톤 개선 프로그램',
    image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=1000',
    location: 'Hochiminh',
    clinic: 'Thẩm mỹ viện Crystal',
    categories: ['피부과', '레이저'],
  },
  {
    id: '8',
    title: '실리프팅 시술 전후 비교',
    description: '자연스러운 리프팅 효과',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1000',
    location: 'Danang',
    clinic: 'Thẩm mỹ viện Aurora',
    categories: ['리프팅', '실리프팅'],
  },
  {
    id: '9',
    title: '보톡스 시술 라이브',
    description: '주름 개선 프로그램',
    image: 'https://images.unsplash.com/photo-1608501947097-86951ad73fea?q=80&w=1000',
    location: 'Hanoi',
    clinic: 'Thẩm mỹ viện Medi',
    categories: ['보톡스', '주름개선'],
  },
  {
    id: '10',
    title: '입술 필러 시술 과정',
    description: '자연스러운 입술 라인',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1000',
    location: 'Hochiminh',
    clinic: 'Thẩm mỹ viện Beauty',
    categories: ['필러', '입술성형'],
  }
];

export default function ShortVideoPage() {
  const [filters, setFilters] = useState({
    location: '',
    rating: 0,
    categories: []
  });

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('recommended')
  const ITEMS_PER_PAGE = 8 // 한 번에 8개씩 표시

  const currentShorts = shorts.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = currentShorts.length < shorts.length

  const handleLoadMore = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setPage(prev => prev + 1)
    setLoading(false)
  }

  const handleCategorySelect = (selectedCategories: string[]) => {
    console.log('Selected categories:', selectedCategories)
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

  return (
    <main className="min-h-screen">
      <TreatmentBanner />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Xinh+ Videos</h1>
        
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
              onFilterChange={setFilters} 
              showPriceFilter={false} 
            />
          </div>
          <div className="w-3/4">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">
                  총 <span className="font-semibold">{shorts.length}</span>개
                </div>
              </div>

              <select className="h-9 px-3 text-sm border rounded-md bg-background">
                <option value="recommended">추천순</option>
                <option value="views">조회순</option>
                <option value="latest">최신순</option>
              </select>
            </div>

            {/* 쇼츠 목록 */}
            <ShortList shorts={currentShorts} />

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
                총 <span className="font-semibold">{shorts.length}</span>개
              </div>
            </div>

            <select className="h-9 px-3 text-sm border rounded-md bg-background">
              <option value="recommended">추천순</option>
              <option value="views">조회순</option>
              <option value="latest">최신순</option>
            </select>
          </div>

          {/* 쇼츠 목록 */}
          <ShortList shorts={currentShorts} />

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