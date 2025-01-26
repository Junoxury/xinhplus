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
import { ReviewList } from '@/components/reviews/ReviewList'

// 더미 리뷰 데이터
const reviews = [
  {
    id: '1',
    beforeImage: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=1000',
    afterImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000',
    rating: 4.5,
    content: '자연스러운 라인의 쌍커풀 수술 과정과 결과가 매우 만족스러웠습니다. 수술 후 붓기가 빠르게 가라앉았고, 회복 기간도 예상보다 짧았어요.',
    author: '김지은',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    date: '2024-03-15',
    treatmentName: '자연스러운 쌍커풀 수술 후기',
    categories: ['눈성형', '쌍커풀'],
    location: 'Hanoi',
    clinicName: 'Thẩm mỹ viện Nana',
    commentCount: 45,
    viewCount: 1234,
  },
  {
    id: '2',
    beforeImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1000',
    afterImage: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000',
    rating: 5.0,
    content: '코필러 시술 받은 지 2주 되었어요. 자연스러운 라인으로 높아진 코가 정말 마음에 듭니다. 통증도 적고 회복도 빨랐어요.',
    author: '이하나',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    date: '2024-03-14',
    treatmentName: '코필러 시술 후기',
    categories: ['코성형', '필러'],
    location: 'Hochiminh',
    clinicName: 'Thẩm mỹ viện Bella',
    commentCount: 32,
    viewCount: 892,
  },
  {
    id: '3',
    beforeImage: 'https://images.unsplash.com/photo-1578496781985-452d4a934d50?q=80&w=1000',
    afterImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000',
    rating: 4.8,
    content: 'V라인 리프팅 시술 받았어요. 턱선이 날카로워지고 얼굴이 한층 갸름해졌네요. 시술 과정도 편안했습니다.',
    author: '박서연',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    date: '2024-03-13',
    treatmentName: 'V라인 리프팅 시술 후기',
    categories: ['안면윤곽', '리프팅'],
    location: 'Hanoi',
    clinicName: 'Thẩm mỹ viện Luna',
    commentCount: 67,
    viewCount: 1567,
  },
  {
    id: '4',
    beforeImage: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=1000',
    afterImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1000',
    rating: 4.7,
    content: '지방이식으로 볼륨감 있는 얼굴로 변신했어요. 자연스러운 결과물에 매우 만족합니다.',
    author: '최유진',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    date: '2024-03-12',
    treatmentName: '볼 지방이식 후기',
    categories: ['지방이식', '볼륨'],
    location: 'Danang',
    clinicName: 'Thẩm mỹ viện Stella',
    commentCount: 28,
    viewCount: 743,
  },
  {
    id: '5',
    beforeImage: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1000',
    afterImage: 'https://images.unsplash.com/photo-1608501947097-86951ad73fea?q=80&w=1000',
    rating: 4.9,
    content: '울쎄라 리프팅으로 탄력 있는 피부를 되찾았어요. 즉각적인 리프팅 효과가 놀라웠습니다.',
    author: '정다인',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    date: '2024-03-11',
    treatmentName: '울쎄라 리프팅 후기',
    categories: ['리프팅', '피부관리'],
    location: 'Hochiminh',
    clinicName: 'Thẩm mỹ viện Venus',
    commentCount: 52,
    viewCount: 1123,
  },
  {
    id: '6',
    beforeImage: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000',
    afterImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000',
    rating: 4.6,
    content: '눈밑 지방재배치 수술로 다크서클이 확실히 개선되었어요. 자연스러운 결과물이 정말 마음에 듭니다.',
    author: '김수현',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    date: '2024-03-10',
    treatmentName: '눈밑 지방재배치 후기',
    categories: ['눈성형', '지방이식'],
    location: 'Hanoi',
    clinicName: 'Thẩm mỹ viện Derma',
    commentCount: 41,
    viewCount: 987,
  },
  {
    id: '7',
    beforeImage: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=1000',
    afterImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000',
    rating: 4.4,
    content: '레이저 토닝으로 피부톤이 확실히 개선되었어요. 잡티가 옅어지고 피부결도 매끈해졌습니다.',
    author: '이미나',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    date: '2024-03-09',
    treatmentName: '레이저 토닝 후기',
    categories: ['피부과', '레이저'],
    location: 'Hochiminh',
    clinicName: 'Thẩm mỹ viện Crystal',
    commentCount: 35,
    viewCount: 856,
  },
  {
    id: '8',
    beforeImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1000',
    afterImage: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000',
    rating: 4.7,
    content: '실리프팅으로 처진 피부를 개선했어요. 자연스러운 리프팅 효과가 오래 지속되네요.',
    author: '박지현',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
    date: '2024-03-08',
    treatmentName: '실리프팅 시술 후기',
    categories: ['리프팅', '실리프팅'],
    location: 'Danang',
    clinicName: 'Thẩm mỹ viện Aurora',
    commentCount: 48,
    viewCount: 1034,
  },
  {
    id: '9',
    beforeImage: 'https://images.unsplash.com/photo-1578496781985-452d4a934d50?q=80&w=1000',
    afterImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000',
    rating: 4.8,
    content: '보톡스로 자연스러운 주름 개선 효과를 봤어요. 표정은 자연스럽게 유지되면서 주름만 개선되었습니다.',
    author: '최예린',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
    date: '2024-03-07',
    treatmentName: '보톡스 시술 후기',
    categories: ['보톡스', '주름개선'],
    location: 'Hanoi',
    clinicName: 'Thẩm mỹ viện Medi',
    commentCount: 39,
    viewCount: 912,
  },
  {
    id: '10',
    beforeImage: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=1000',
    afterImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1000',
    rating: 4.6,
    content: '입술 필러로 자연스러운 볼륨감을 만들었어요. 과하지 않고 예쁜 입술라인이 만들어졌네요.',
    author: '김다희',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
    date: '2024-03-06',
    treatmentName: '입술 필러 시술 후기',
    categories: ['필러', '입술성형'],
    location: 'Hochiminh',
    clinicName: 'Thẩm mỹ viện Beauty',
    commentCount: 43,
    viewCount: 967,
  }
];

export default function ReviewPage() {
  const [filters, setFilters] = useState({
    location: '',
    rating: 0,
    categories: []
  });

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('recommended')
  const ITEMS_PER_PAGE = 8 // 한 번에 8개씩 표시

  const currentReviews = reviews.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = currentReviews.length < reviews.length

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
                  총 <span className="font-semibold">{reviews.length}</span>개
                </div>
              </div>

              <select className="h-9 px-3 text-sm border rounded-md bg-background">
                <option value="recommended">추천순</option>
                <option value="views">조회순</option>
                <option value="latest">최신순</option>
              </select>
            </div>

            {/* 리뷰 목록 */}
            <ReviewList reviews={currentReviews} layout="grid" />

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
                총 <span className="font-semibold">{reviews.length}</span>개
              </div>
            </div>

            <select className="h-9 px-3 text-sm border rounded-md bg-background">
              <option value="recommended">추천순</option>
              <option value="views">조회순</option>
              <option value="latest">최신순</option>
            </select>
          </div>

          {/* 리뷰 목록 */}
          <ReviewList reviews={currentReviews} layout="vertical" />

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