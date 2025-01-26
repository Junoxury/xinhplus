'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BlogCard } from '@/components/blog/BlogCard'

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
    thumbnail: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=1000',
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
    thumbnail: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1000',
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
    thumbnail: 'https://images.unsplash.com/photo-1578496781985-452d4a934d50?q=80&w=1000',
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
    thumbnail: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=1000',
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
    thumbnail: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1000',
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
    thumbnail: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000',
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
    thumbnail: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=1000',
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
    thumbnail: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1000',
    author: {
      name: '박서연',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8'
    },
    date: '2024.03.08',
    tags: ['실리프팅', '리프팅', '안티에이징'],
    likes: 223,
    comments: 44,
    views: 987
  },
  {
    id: '9',
    title: '보톡스 시술의 새로운 트렌드',
    content: '보톡스 시술의 최신 트렌드와 자연스러운 표정을 위한 시술 포인트를 소개합니다.',
    thumbnail: 'https://images.unsplash.com/photo-1578496781985-452d4a934d50?q=80&w=1000',
    author: {
      name: '최예린',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9'
    },
    date: '2024.03.07',
    tags: ['보톡스', '주름개선', '안티에이징'],
    likes: 289,
    comments: 62,
    views: 1345
  },
  {
    id: '10',
    title: '입술필러 시술 전후 관리법',
    content: '자연스럽고 매력적인 입술을 위한 필러 시술의 모든 것. 시술 전후 관리 방법을 상세히 설명합니다.',
    thumbnail: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=1000',
    author: {
      name: '김다희',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10'
    },
    date: '2024.03.06',
    tags: ['입술필러', '필러', '입술성형'],
    likes: 201,
    comments: 38,
    views: 867
  }
]

export default function PostsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('recommended')
  
  const ITEMS_PER_PAGE = 8
  const currentPosts = blogPosts.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = currentPosts.length < blogPosts.length

  const handleLoadMore = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setPage(prev => prev + 1)
    setLoading(false)
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* 상단 탭 */}
        <div className="flex justify-center mb-8">
          <a href="/reviews" className="w-1/2 py-2 text-center bg-gray-200 text-gray-800 font-bold rounded-l-md">
            Reviews
          </a>
          <a href="/posts" className="w-1/2 py-2 text-center bg-blue-500 text-white font-bold rounded-r-md">
            Posts
          </a>
        </div>

        {/* 검색창 */}
        <div className="relative mb-6">
          <Input
            type="search"
            placeholder="검색어를 입력하세요"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* 인기 태그 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {popularTags.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-blue-50"
            >
              #{tag}
            </Button>
          ))}
        </div>

        {/* 정렬 옵션 */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            총 <span className="font-semibold">{blogPosts.length}</span>개 Posts
          </div>
          <select
            className="h-9 px-3 text-sm border rounded-md bg-background"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recommended">추천순</option>
            <option value="views">조회순</option>
            <option value="rating">평점순</option>
          </select>
        </div>

        {/* 블로그 포스트 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>

        {/* 더보기 버튼 - 8개씩 로드된 후에 표시 */}
        {hasMore && currentPosts.length % ITEMS_PER_PAGE === 0 && (
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
    </main>
  )
} 