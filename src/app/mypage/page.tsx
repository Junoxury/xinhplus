'use client'

import React from 'react'
import { useState } from 'react'
import { Search, Heart, Activity, Pencil, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BlogCard } from '@/components/blog/BlogCard'
import { TreatmentCard } from '@/components/treatments/TreatmentCard'
import { ClinicCard } from '@/components/clinics/ClinicCard'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import dynamic from 'next/dynamic'

// JSON 파일 import 방식 변경
const bodyPartsData = require('@/data/bodyParts.json')
const treatmentMethodsData = require('@/data/treatmentMethods.json')

// 인기 태그 데이터
const popularTags = [
  '쌍커풀', '코필러', '보톡스', '리프팅', '피부관리',
  '눈성형', '안면윤곽', '가슴성형', '지방이식', '턱성형'
]

// 블로그 포스트 더미 데이터
const blogPosts = [
  {
    id: '1',
    title: '자연스러운 쌍커풀 수술, 이것만은 꼭 체크하세요!',
    content: '쌍커풀 수술을 고민하시는 분들을 위해 준비했습니다. 수술 전 반드시 체크해야 할 사항들과 자연스러운 라인을 만들기 위한 핵심 포인트를 알려드립니다.',
    thumbnail: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500',
    author: {
      name: '김태희',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
    },
    date: '2024.03.15',
    tags: ['쌍커풀', '눈성형', '성형후기'],
    likes: 245,
    comments: 56,
    views: 1234
  },
  {
    id: '2',
    title: '코필러 시술 전 알아야 할 5가지',
    content: '코필러는 비수술적 코 성형의 대표적인 방법입니다. 시술 전 고려해야 할 사항들과 자연스러운 결과를 위한 팁을 공유합니다.',
    thumbnail: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500',
    author: {
      name: '이수진',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
    },
    date: '2024.03.14',
    tags: ['코필러', '코성형', '필러시술'],
    likes: 189,
    comments: 42,
    views: 892
  },
  {
    id: '3',
    title: '안면윤곽 수술의 모든 것',
    content: '안면윤곽 수술의 종류부터 회복기간까지, 수술을 고민하시는 분들을 위한 상세한 가이드를 준비했습니다.',
    thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500',
    author: {
      name: '박민서',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3'
    },
    date: '2024.03.13',
    tags: ['안면윤곽', '턱성형', '광대축소'],
    likes: 312,
    comments: 67,
    views: 1567
  },
  {
    id: '4',
    title: '지방이식 vs 필러, 무엇이 더 좋을까?',
    content: '얼굴 볼륨 개선을 위한 두 가지 방법의 장단점을 비교 분석해드립니다. 당신에게 맞는 시술은 무엇일까요?',
    thumbnail: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
    author: {
      name: '최지원',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4'
    },
    date: '2024.03.12',
    tags: ['지방이식', '필러', '볼륨시술'],
    likes: 276,
    comments: 48,
    views: 943
  },
  {
    id: '5',
    title: '울쎄라 리프팅의 진실과 오해',
    content: '울쎄라 리프팅에 대한 진실과 오해를 파헤칩니다. 효과적인 피부 리프팅을 위한 모든 정보를 담았습니다.',
    thumbnail: 'https://images.unsplash.com/photo-1614859324967-3df02391aa3f?w=500',
    author: {
      name: '정유진',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5'
    },
    date: '2024.03.11',
    tags: ['울쎄라', '리프팅', '피부관리'],
    likes: 198,
    comments: 35,
    views: 823
  },
  {
    id: '6',
    title: '눈밑 지방재배치 수술 체험기',
    content: '다크서클 개선을 위한 눈밑 지방재배치 수술 전후 과정과 회복기간 동안의 변화를 상세히 공유합니다.',
    thumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500',
    author: {
      name: '김민지',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6'
    },
    date: '2024.03.10',
    tags: ['눈밑수술', '다크서클', '지방재배치'],
    likes: 234,
    comments: 51,
    views: 1102
  },
  {
    id: '7',
    title: '레이저 토닝 시술 완벽 가이드',
    content: '피부 톤 개선을 위한 레이저 토닝의 A to Z. 효과적인 시술을 위한 준비사항과 관리법을 알려드립니다.',
    thumbnail: 'https://images.unsplash.com/photo-1523263685509-57c1d050d19b?w=500',
    author: {
      name: '이하은',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7'
    },
    date: '2024.03.09',
    tags: ['레이저토닝', '피부관리', '미백'],
    likes: 167,
    comments: 29,
    views: 756
  },
  {
    id: '8',
    title: '실리프팅 시술 전 필수 체크리스트',
    content: '실리프팅 시술의 효과를 최대화하기 위한 체크리스트와 주의사항을 정리했습니다.',
    thumbnail: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500',
    author: {
      name: '박서연',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8'
    },
    date: '2024.03.08',
    tags: ['실리프팅', '리프팅', '안티에이징'],
    likes: 223,
    comments: 44,
    views: 987
  }
]

// 시술 더미 데이터
const treatmentsList = [
  {
    id: '1',
    title: '울쎄라 리프팅',
    description: '울쎄라 리프팅으로 자연스러운 얼굴 리프팅 효과를 경험해보세요.',
    clinic: '라포레성형외과',
    image: 'https://plus.unsplash.com/premium_photo-1661766718556-13c2efac1388?w=500',
    rating: 4.8,
    reviewCount: 128,
    originalPrice: 890000,
    discountRate: 35,
    location: '강남구',
    categories: ['리프팅', '안티에이징']
  },
  {
    id: '2',
    title: '보톡스',
    clinic: '미소성형외과',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500',
    rating: 4.9,
    reviewCount: 256,
    originalPrice: 450000,
    discountedPrice: 315000,
    discountRate: 30,
    location: '서초구',
    tags: ['보톡스', '주름개선'],
    categories: ['보톡스', '주름개선']
  },
  {
    id: '3',
    title: '필러',
    clinic: '청담성형외과',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500',
    rating: 4.7,
    reviewCount: 189,
    originalPrice: 550000,
    discountedPrice: 385000,
    discountRate: 30,
    location: '강남구',
    tags: ['필러', '볼륨'],
    categories: ['필러', '볼륨']
  },
  {
    id: '4',
    title: '레이저토닝',
    clinic: '유진피부과',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
    rating: 4.6,
    reviewCount: 145,
    originalPrice: 330000,
    discountedPrice: 231000,
    discountRate: 30,
    location: '강남구',
    tags: ['레이저', '피부톤'],
    categories: ['레이저', '피부톤']
  },
  {
    id: '5',
    title: '리프팅 실',
    clinic: '뷰티라인의원',
    image: 'https://images.unsplash.com/photo-1614859324967-3df02391aa3f?w=500',
    rating: 4.8,
    reviewCount: 167,
    originalPrice: 790000,
    discountedPrice: 553000,
    discountRate: 30,
    location: '강남구',
    tags: ['실리프팅', '탄력'],
    categories: ['실리프팅', '탄력']
  },
  {
    id: '6',
    title: '눈밑 지방이식',
    clinic: '아름다운의원',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500',
    rating: 4.9,
    reviewCount: 134,
    originalPrice: 1200000,
    discountedPrice: 840000,
    discountRate: 30,
    location: '강남구',
    tags: ['지방이식', '눈밑'],
    categories: ['지방이식', '눈밑']
  },
  {
    id: '7',
    title: '턱보톡스',
    clinic: '라온성형외과',
    image: 'https://images.unsplash.com/photo-1523263685509-57c1d050d19b?w=500',
    rating: 4.7,
    reviewCount: 198,
    originalPrice: 420000,
    discountedPrice: 294000,
    discountRate: 30,
    location: '강남구',
    tags: ['보톡스', '턱라인'],
    categories: ['보톡스', '턱라인']
  },
  {
    id: '8',
    title: '물광주사',
    clinic: '클리닉뷰티',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500',
    rating: 4.8,
    reviewCount: 223,
    originalPrice: 280000,
    discountedPrice: 196000,
    discountRate: 30,
    location: '강남구',
    tags: ['물광', '피부광채'],
    categories: ['물광', '피부광채']
  }
]

// 클리닉 더미 데이터
const clinicsList = [
  {
    id: '1',
    title: '20년 전통의 강남 대표 성형외과',
    name: '라포레성형외과',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500',
    location: '강남구',
    rating: 4.8,
    reviewCount: 1285,
    description: '20년 전통의 강남 대표 성형외과',
    categories: ['눈성형', '코성형', '안면윤곽'],
    consultCount: 2840,
    isVerified: true
  },
  {
    id: '2',
    title: '자연스러운 변화를 추구하는 성형외과',
    name: '미소성형외과',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=500',
    location: '서초구',
    rating: 4.9,
    reviewCount: 2156,
    description: '자연스러운 변화를 추구하는 성형외과',
    categories: ['가슴성형', '지방흡입', '안티에이징'],
    consultCount: 3150,
    isVerified: true
  },
  {
    id: '3',
    title: '맞춤형 성형을 제안하는 전문의',
    name: '청담유성형외과',
    image: 'https://images.unsplash.com/photo-1629907588959-b8527f37d17b?w=500',
    location: '강남구',
    rating: 4.7,
    reviewCount: 1893,
    description: '맞춤형 성형을 제안하는 전문의',
    categories: ['눈성형', '코성형', '윤곽성형'],
    consultCount: 2460,
    isVerified: true
  },
  {
    id: '4',
    title: '피부 치료 전문 클리닉',
    name: '유진피부과',
    image: 'https://images.unsplash.com/photo-1629907588959-b8527f37d17b?w=500',
    location: '강남구',
    rating: 4.6,
    reviewCount: 945,
    description: '피부 치료 전문 클리닉',
    categories: ['레이저', '보톡스', '필러'],
    consultCount: 1840,
    isVerified: true
  }
]

// 리뷰 더미 데이터
const reviewsList = [
  {
    id: '1',
    beforeImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500',
    afterImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500',
    additionalImagesCount: 3,
    rating: 4.8,
    content: '정말 만족스러운 시술이었습니다. 자연스러운 결과물에 대만족하고 있어요. 시술 전 상담부터 시술 후 관리까지 꼼꼼하게 신경써주셔서 감사합니다. 특히 원장님의 섬세한 시술 실력에 크게 감동받았어요.',
    author: '김지은',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    date: '2024.03.15',
    treatmentName: '울쎄라 리프팅',
    categories: ['리프팅', 'SMAS'],
    isAuthenticated: true,
    location: '강남구',
    clinicName: '라포레성형외과',
    commentCount: 15,
    viewCount: 234
  },
  {
    id: '2',
    beforeImage: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500',
    afterImage: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500',
    additionalImagesCount: 2,
    rating: 4.9,
    content: '보톡스 시술 받은 지 2주 정도 지났는데 자연스러운 주름 개선 효과를 볼 수 있어서 너무 좋아요. 시술 시간도 짧고 통증도 적어서 부담 없이 받을 수 있었습니다.',
    author: '이미라',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    date: '2024.03.14',
    treatmentName: '보톡스',
    categories: ['보톡스', '주름개선'],
    isAuthenticated: true,
    location: '서초구',
    clinicName: '미소성형외과',
    commentCount: 8,
    viewCount: 156
  },
  {
    id: '3',
    beforeImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500',
    afterImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500',
    additionalImagesCount: 4,
    rating: 4.7,
    content: '필러 시술 후 자연스러운 볼륨감이 생겨서 너무 만족스러워요. 원장님께서 얼굴의 밸런스를 잘 고려해서 시술해주셔서 더욱 좋은 결과가 나온 것 같아요.',
    author: '박수진',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    date: '2024.03.13',
    treatmentName: '필러',
    categories: ['필러', '볼륨'],
    isAuthenticated: true,
    location: '강남구',
    clinicName: '청담성형외과',
    commentCount: 12,
    viewCount: 189
  },
  {
    id: '4',
    beforeImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
    afterImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
    additionalImagesCount: 1,
    rating: 4.6,
    content: '레이저 토닝 시술 후 피부톤이 많이 개선되었어요. 기미와 잡티가 옅어지고 전반적으로 피부가 밝아진 것 같아 만족스럽습니다.',
    author: '최유나',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    date: '2024.03.12',
    treatmentName: '레이저토닝',
    categories: ['레이저', '피부톤'],
    isAuthenticated: true,
    location: '강남구',
    clinicName: '유진피부과',
    commentCount: 6,
    viewCount: 145
  }
]

// 파일 상단에 인터페이스 추가
interface Category {
  id: string;
  name: string;
}

export default function MyPage() {
  const [wishlistTab, setWishlistTab] = useState('Beauty')
  const [activityTab, setActivityTab] = useState('Reviews')  // 내 활동 탭 상태 추가
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])

  const ITEMS_PER_PAGE = 8
  const currentTreatments = treatmentsList.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = currentTreatments.length < treatmentsList.length

  const handleLoadMore = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setPage(prev => prev + 1)
    setLoading(false)
  }

  const handleCategorySelect = (category: Category) => {
    if (selectedCategories.find(c => c.id === category.id)) {
      setSelectedCategories(selectedCategories.filter(c => c.id !== category.id))
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  // 탭에 따른 컨텐츠 렌더링
  const renderContent = () => {
    switch (wishlistTab) {
      case 'Beauty':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">찜한 시술 {currentTreatments.length}개</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentTreatments?.map((treatment) => (
                <TreatmentCard
                  key={treatment.id}
                  image={treatment.image}
                  title={treatment.title}
                  description={treatment.description}
                  clinic={treatment.clinic}
                  location={treatment.location}
                  originalPrice={treatment.originalPrice}
                  discountRate={treatment.discountRate}
                  rating={treatment.rating}
                  reviewCount={treatment.reviewCount}
                  categories={treatment.categories}
                />
              ))}
            </div>

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
          </>
        )
      
      case 'Clinics':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">찜한 클리닉 {clinicsList.length}개</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {clinicsList.map((clinic) => (
                <ClinicCard
                  key={clinic.id}
                  title={clinic.title}
                  name={clinic.name}
                  image={clinic.image}
                  location={clinic.location}
                  rating={clinic.rating}
                  reviewCount={clinic.reviewCount}
                  description={clinic.description}
                  categories={clinic.categories}
                  consultCount={clinic.consultCount}
                  isVerified={clinic.isVerified}
                />
              ))}
            </div>
          </>
        )

      case 'Reviews':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">찜한 리뷰 {reviewsList.length}개</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviewsList.map((review) => (
                <ReviewCard
                  key={review.id}
                  beforeImage={review.beforeImage}
                  afterImage={review.afterImage}
                  additionalImagesCount={review.additionalImagesCount}
                  rating={review.rating}
                  content={review.content}
                  author={review.author}
                  authorImage={review.authorImage}
                  date={review.date}
                  treatmentName={review.treatmentName}
                  categories={review.categories}
                  isAuthenticated={review.isAuthenticated}
                  location={review.location}
                  clinicName={review.clinicName}
                  commentCount={review.commentCount}
                  viewCount={review.viewCount}
                />
              ))}
            </div>
          </>
        )

      case 'Posts':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">찜한 게시글 {blogPosts.length}개</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {blogPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  thumbnail={post.thumbnail}
                  author={post.author}
                  date={post.date}
                  tags={post.tags}
                  likes={post.likes}
                  comments={post.comments}
                  views={post.views}
                />
              ))}
            </div>
          </>
        )

      // 다른 탭들의 컨텐츠는 나중에 구현
      default:
        return null
    }
  }

  // 내 활동 컨텐츠 렌더링
  const renderActivityContent = () => {
    switch (activityTab) {
      case 'Reviews':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">내가 쓴 후기 {reviewsList.length}개</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviewsList.map((review) => (
                <ReviewCard
                  key={review.id}
                  beforeImage={review.beforeImage}
                  afterImage={review.afterImage}
                  additionalImagesCount={review.additionalImagesCount}
                  rating={review.rating}
                  content={review.content}
                  author={review.author}
                  authorImage={review.authorImage}
                  date={review.date}
                  treatmentName={review.treatmentName}
                  categories={review.categories}
                  isAuthenticated={review.isAuthenticated}
                  location={review.location}
                  clinicName={review.clinicName}
                  commentCount={review.commentCount}
                  viewCount={review.viewCount}
                />
              ))}
            </div>
          </>
        )

      case 'Comments':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">내가 쓴 댓글 12개</h3>
            <div className="space-y-4">
              {/* 댓글 카드 */}
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-500" /> {/* 카테고리 표시 */}
                      <span className="text-sm font-medium text-pink-500">시술후기</span>
                    </div>
                    <span className="text-sm text-gray-500">2024.03.15</span>
                  </div>
                  <h4 className="text-base font-medium mb-2 hover:text-blue-500 cursor-pointer">
                    자연스러운 쌍커풀 수술, 이것만은 꼭 체크하세요!
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">정말 유익한 정보 감사합니다. 저도 이 시술 받아보고 싶네요!</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>좋아요 5</span>
                      <span>·</span>
                      <span>답글 2</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs text-gray-500 hover:text-blue-500">수정</button>
                      <button className="text-xs text-gray-500 hover:text-red-500">삭제</button>
                    </div>
                  </div>
                </div>
                {/* 답글이 있는 경우 표시 */}
                <div className="px-4 py-2 bg-gray-50 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="text-blue-500">@원장님</span>
                    <span>답글이 달렸습니다</span>
                  </div>
                </div>
              </div>

              {/* 다른 유형의 댓글 카드 */}
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-sm font-medium text-purple-500">클리닉</span>
                    </div>
                    <span className="text-sm text-gray-500">2024.03.14</span>
                  </div>
                  <h4 className="text-base font-medium mb-2 hover:text-blue-500 cursor-pointer">
                    라포레성형외과 상담 후기
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">상담 시간을 잘 지켜주셔서 좋았습니다. 설명도 자세히 해주셨어요.</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>좋아요 3</span>
                      <span>·</span>
                      <span>답글 1</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs text-gray-500 hover:text-blue-500">수정</button>
                      <button className="text-xs text-gray-500 hover:text-red-500">삭제</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 필터 및 정렬 옵션 */}
            <div className="flex justify-between items-center mt-6">
              <select className="text-sm border rounded-md px-3 py-1">
                <option>전체 카테고리</option>
                <option>시술후기</option>
                <option>클리닉</option>
                <option>커뮤니티</option>
              </select>
              <select className="text-sm border rounded-md px-3 py-1">
                <option>최신순</option>
                <option>좋아요순</option>
                <option>답글순</option>
              </select>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <h1 className="text-2xl font-bold mb-6">My Page</h1>

        {/* 내 정보 섹션 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-700" />
            내 정보
          </h2>
          <div className="space-y-6">
            {/* 프로필 및 기본 정보 */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=1"
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover border-2 border-gray-200"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center cursor-pointer">
                  <Pencil className="w-3 h-3 text-gray-500" />
                </div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <label className="text-sm text-gray-500 mb-1 block">E-mail</label>
                    <div className="flex items-center">
                      <input
                        type="email"
                        value="email@google.com"
                        disabled
                        className="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-700"
                      />
                      <button className="absolute right-3 top-[30px]">
                        <Pencil className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-sm text-gray-500 mb-1 block">Nick Name</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value="Xinhplus_Master"
                        disabled
                        className="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-700"
                      />
                      <button className="absolute right-3 top-[30px]">
                        <Pencil className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-sm text-gray-500 mb-1 block">Phone Number</label>
                    <div className="flex items-center">
                      <input
                        type="tel"
                        value="0888.888.888"
                        disabled
                        className="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-700"
                      />
                      <button className="absolute right-3 top-[30px]">
                        <Pencil className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 관심 부위 및 시술방법 설정 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-base font-medium mb-4">관심 부위 및 시술방법 설정 (총 5개까지 선택 가능)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">부위</p>
                  <div className="flex flex-wrap gap-2">
                    {bodyPartsData.categories.map((category: Category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full border 
                          ${selectedCategories.find(c => c.id === category.id)
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50'
                          } text-sm`}
                        disabled={selectedCategories.length >= 5 && !selectedCategories.find(c => c.id === category.id)}
                      >
                        <div className={`w-4 h-4 rounded-full border ${
                          selectedCategories.find(c => c.id === category.id)
                            ? 'border-pink-500 bg-pink-500'
                            : 'border-gray-300'
                        }`} />
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">시술방법</p>
                  <div className="flex flex-wrap gap-2">
                    {treatmentMethodsData.categories.map((category: Category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full border 
                          ${selectedCategories.find(c => c.id === category.id)
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50'
                          } text-sm`}
                        disabled={selectedCategories.length >= 5 && !selectedCategories.find(c => c.id === category.id)}
                      >
                        <div className={`w-4 h-4 rounded-full border ${
                          selectedCategories.find(c => c.id === category.id)
                            ? 'border-pink-500 bg-pink-500'
                            : 'border-gray-300'
                        }`} />
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">선택된 항목 ({selectedCategories.length}/5)</p>
              </div>
            </div>

            {/* 관심 지역 설정 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-base font-medium mb-4">관심 지역 설정 (3개까지 선택 가능)</h3>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <button className="px-4 py-2 bg-white rounded-md border border-gray-200 text-sm hover:border-blue-500 focus:outline-none">
                    지역 선택
                  </button>
                  {/* 선택된 지역 표시 */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['Hanoi', 'Hải Phòng', 'Nha Trang'].map((city) => (
                      <div
                        key={city}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {city}
                        <button className="text-blue-500 hover:text-blue-700">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 찜목록 섹션 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            찜목록
          </h2>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {['Beauty', 'Clinics', 'Reviews', 'Posts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setWishlistTab(tab)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors focus:outline-none
                  ${wishlistTab === tab 
                    ? 'bg-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-6">
            {renderContent()}
          </div>
        </div>

        {/* 내 활동 섹션 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            내 활동
          </h2>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {[
              { id: 'Reviews', label: '내가 쓴 후기' },
              { id: 'Comments', label: '내가 쓴 댓글' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivityTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors focus:outline-none
                  ${activityTab === tab.id 
                    ? 'bg-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-6">
            {renderActivityContent()}
          </div>
        </div>
      </div>
    </main>
  )
} 