'use client'

import { useState } from 'react'
import { Search, ChevronLeft, MessageCircle, Eye, Heart, Share2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BlogCard } from '@/components/blog/BlogCard'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
    title: '눈매교정 수술의 모든 것',
    content: '눈매교정 수술의 종류와 효과, 그리고 자연스러운 결과를 위한 핵심 포인트를 상세히 설명해드립니다.',
    thumbnail: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1000',
    author: {
      name: '이수진',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
    },
    date: '2024.03.14',
    tags: ['눈매교정', '눈성형', '성형후기'],
    likes: 189,
    comments: 42,
    views: 892
  },
  {
    id: '3',
    title: '쌍커풀 수술 후 회복과정 체험기',
    content: '수술 후 붓기 관리부터 완전한 회복까지, 제가 경험한 회복 과정을 상세히 공유합니다.',
    thumbnail: 'https://images.unsplash.com/photo-1578496781985-452d4a934d50?q=80&w=1000',
    author: {
      name: '박민서',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3'
    },
    date: '2024.03.13',
    tags: ['쌍커풀', '눈성형', '회복기간'],
    likes: 312,
    comments: 67,
    views: 1567
  },
  {
    id: '4',
    title: '눈성형 트렌드 2024',
    content: '2024년 가장 인기 있는 눈성형 시술과 최신 트렌드를 분석해드립니다.',
    thumbnail: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=1000',
    author: {
      name: '최지원',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4'
    },
    date: '2024.03.12',
    tags: ['눈성형', '성형트렌드', '쌍커풀'],
    likes: 276,
    comments: 48,
    views: 943
  },
  {
    id: '5',
    title: '눈성형 수술 전 상담 체크리스트',
    content: '성공적인 눈성형을 위해 상담 시 꼭 체크해야 할 포인트들을 정리했습니다.',
    thumbnail: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1000',
    author: {
      name: '정유진',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5'
    },
    date: '2024.03.11',
    tags: ['눈성형', '성형상담', '쌍커풀'],
    likes: 198,
    comments: 35,
    views: 823
  }
]

// 관련 글 데이터 - 같은 태그를 가진 다른 포스트들
const relatedPosts = blogPosts
  .filter(post => post.id !== blogPosts[0].id) // 현재 글 제외
  .filter(post => post.tags.some(tag => blogPosts[0].tags.includes(tag))) // 같은 태그를 가진 포스트만
  .slice(0, 4) // 4개만 선택

// 현재 글의 인덱스 찾기 (중간 글인 3번 글로 변경)
const currentIndex = blogPosts.findIndex(post => post.id === '3') // 3번 글을 현재 글로 설정

// 이전글과 다음글 가져오기
const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null
const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null

export default function PostDetailPage() {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blogPosts[currentIndex].title,
          text: blogPosts[currentIndex].content.slice(0, 100) + '...',
          url: window.location.href,
        })
      } catch (error) {
        console.log('공유하기 실패:', error)
      }
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* 뒤로가기 & 제목 */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="뒤로 가기"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Post 상세보기</h1>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
          {/* 제목과 액션 버튼 */}
          <div className="flex justify-between items-start gap-4 mb-4">
            <h2 className="text-3xl font-bold">
              {blogPosts[currentIndex].title}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="공유하기"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleLike}
                className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-600'
                }`}
                aria-label="좋아요"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <Image
                src={blogPosts[currentIndex].author.avatar}
                alt={blogPosts[currentIndex].author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">{blogPosts[currentIndex].author.name}</p>
                <p className="text-sm text-gray-500">{blogPosts[currentIndex].date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <span className="ml-1 text-gray-600">{blogPosts[currentIndex].comments}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-gray-400" />
                <span className="ml-1 text-gray-600">{blogPosts[currentIndex].views}</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-gray-400" />
                <span className="ml-1 text-gray-600">{blogPosts[currentIndex].likes}</span>
              </div>
            </div>
          </div>

          {/* 태그 목록 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {blogPosts[currentIndex].tags.map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 썸네일 이미지 */}
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={blogPosts[currentIndex].thumbnail}
              alt={blogPosts[currentIndex].title}
              fill
              className="object-cover"
            />
          </div>

          {/* 본문 내용 */}
          <div className="prose max-w-none mb-12">
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {blogPosts[currentIndex].content}
            </div>
          </div>

          {/* 이전글/다음글 네비게이션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-8">
            {/* 이전 글 */}
            {prevPost && (
              <div className="group cursor-pointer" onClick={() => router.push(`/posts/detail/${prevPost.id}`)}>
                <div className="text-sm text-gray-500 mb-2">이전 글</div>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={prevPost.thumbnail}
                      alt={prevPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
                    {prevPost.title}
                  </h3>
                </div>
              </div>
            )}

            {/* 다음 글 */}
            {nextPost && (
              <div 
                className="group cursor-pointer text-right md:border-l md:pl-4" 
                onClick={() => router.push(`/posts/detail/${nextPost.id}`)}
              >
                <div className="text-sm text-gray-500 mb-2">다음 글</div>
                <div className="flex items-center gap-4 justify-end">
                  <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
                    {nextPost.title}
                  </h3>
                  <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={nextPost.thumbnail}
                      alt={nextPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 관련 글 섹션 */}
        <div className="mt-16 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">관련 글</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 