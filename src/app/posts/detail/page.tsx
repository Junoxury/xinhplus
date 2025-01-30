'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronLeft, MessageCircle, Eye, Heart, Share2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BlogCard } from '@/components/blog/BlogCard'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"

interface PostDetail {
  id: number;
  title: string;
  content: string;
  thumbnail_url: string;
  created_at: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  author_name: string;
  author_avatar_url: string;
  tags: Array<{ id: number; name: string; slug: string; }>;
  prev_post: { id: number; title: string; thumbnail_url: string; } | null;
  next_post: { id: number; title: string; thumbnail_url: string; } | null;
}

interface RelatedPost {
  id: number;
  title: string;
  content: string;
  thumbnail_url: string;
  created_at: string;
  author_name: string;
  author_avatar_url: string;
  like_count: number;
  comment_count: number;
  view_count: number;
  tags: Array<{ id: number; name: string; slug: string; }>;
}

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

function stripMarkdownAndHtml(content: string): string {
  // 마크다운 이미지, 링크 제거
  const noMarkdown = content.replace(/!\[.*?\]\(.*?\)/g, '')
                           .replace(/\[.*?\]\(.*?\)/g, '')
                           .replace(/#{1,6}\s?/g, '')
                           .replace(/(\*\*|__)(.*?)\1/g, '$2')
                           .replace(/(\*|_)(.*?)\1/g, '$2');
  
  // HTML 태그 제거
  const noHtml = noMarkdown.replace(/<[^>]*>/g, '');
  
  // 연속된 공백 제거 및 앞뒤 공백 제거
  const cleanText = noHtml.replace(/\s+/g, ' ').trim();
  
  // 첫 100자만 반환하고 말줄임표 추가
  return cleanText.length > 100 ? cleanText.slice(0, 100) + '...' : cleanText;
}

export default function PostDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<PostDetail | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (postId) {
      fetchPostDetail(parseInt(postId));
    }
  }, [postId]);

  useEffect(() => {
    if (post) {
      fetchRelatedPosts(post.id);
      setLikeCount(post.like_count)
      checkIsLiked(post.id)
    }
  }, [post]);

  // 좋아요 상태 체크
  const checkIsLiked = async (postId: number) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return

    const { data, error } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', session.user.id)
      .single()

    if (data) {
      setIsLiked(true)
    }
  }

  const handleLike = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      toast({
        title: "로그인이 필요합니다",
        description: "좋아요를 누르려면 먼저 로그인해주세요",
        variant: "destructive",
      })
      router.push('/auth/signin')
      return
    }

    try {
      const { data, error } = await supabase.rpc('toggle_post_like', {
        p_post_id: post?.id,
        p_user_id: session.user.id
      })

      if (error) throw error

      if (data && data[0]) {
        setIsLiked(data[0].is_liked)
        setLikeCount(data[0].new_like_count)
        
        toast({
          title: data[0].is_liked ? "좋아요를 눌렀습니다" : "좋아요를 취소했습니다",
          variant: "default",
        })
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast({
        title: "오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "링크가 복사되었습니다.",
        variant: "default",
      });
    } catch (error) {
      console.log('공유하기 실패:', error);
      toast({
        title: "링크 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  }

  async function fetchPostDetail(id: number) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_post_detail', {
          p_post_id: id
        });

      if (error) {
        console.error('Error fetching post detail:', error);
        return;
      }

      console.log('Post detail data:', data); // 데이터 확인용 로그

      if (data && data.length > 0) {
        const postData = data[0];
        console.log('Post data to set:', postData); // 실제 설정되는 데이터 확인
        setPost(postData);
      } else {
        console.log('No post data found'); // 데이터가 없는 경우 확인
        router.push('/posts');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRelatedPosts(id: number) {
    try {
      // 현재 포스트의 태그 ID들 추출
      const tagIds = post?.tags?.map(tag => tag.id) || [];
      
      if (tagIds.length === 0) return;

      const { data, error } = await supabase
        .rpc('get_posts', {
          p_search: null,
          p_tag_ids: tagIds,
          p_order_by: 'view_count',
          p_limit: 8,
          p_offset: 0
        });

      if (error) {
        console.error('Error fetching related posts:', error);
        return;
      }

      if (data) {
        // 현재 포스트 제외하고 필터링
        const filteredPosts = data.filter(p => p.id !== id);
        setRelatedPosts(filteredPosts);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;
  }

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center">게시글을 찾을 수 없습니다.</div>;
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
              {post.title}
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
              <div className="flex items-center gap-3">
                <Image
                  src={post.author_avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'}
                  alt={`${post.author_name} 프로필 이미지`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">{post.author_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <span className="ml-1 text-gray-600">{post?.comment_count || 0}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-gray-400" />
                <span className="ml-1 text-gray-600">{post?.view_count || 0}</span>
              </div>
              <div className="flex items-center">
                <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                <span className="ml-1 text-gray-600">{likeCount}</span>
              </div>
            </div>
          </div>

          {/* 태그 목록 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs cursor-pointer"
              >
                #{tag.name}
              </Badge>
            ))}
          </div>

          {/* 썸네일 이미지 */}
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* 본문 내용 */}
          <div className="prose max-w-none mb-12">
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </div>

          {/* 이전글/다음글 네비게이션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-8">
            {/* 이전 글 */}
            {post.prev_post && (
              <div 
                className="group cursor-pointer" 
                onClick={() => router.push(`/posts/detail?id=${post.prev_post.id}`)}
              >
                <div className="text-sm text-gray-500 mb-2">이전 글</div>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={post.prev_post.thumbnail_url}
                      alt={post.prev_post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.prev_post.title}
                  </h3>
                </div>
              </div>
            )}

            {/* 다음 글 */}
            {post.next_post && (
              <div 
                className="group cursor-pointer text-right md:border-l md:pl-4" 
                onClick={() => router.push(`/posts/detail?id=${post.next_post.id}`)}
              >
                <div className="text-sm text-gray-500 mb-2">다음 글</div>
                <div className="flex items-center gap-4 justify-end">
                  <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.next_post.title}
                  </h3>
                  <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={post.next_post.thumbnail_url}
                      alt={post.next_post.title}
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
        {relatedPosts.length > 0 && (
          <div className="mt-16 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">관련 글</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  href={`/posts/detail?id=${relatedPost.id}`}
                  className="block hover:opacity-95 transition-opacity"
                >
                  <BlogCard 
                    id={relatedPost.id.toString()}
                    title={relatedPost.title}
                    content={stripMarkdownAndHtml(relatedPost.content)}
                    thumbnail={relatedPost.thumbnail_url}
                    author={{
                      name: relatedPost.author_name || 'Unknown',
                      avatar: relatedPost.author_avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
                    }}
                    date={new Date(relatedPost.created_at).toLocaleDateString()}
                    tags={relatedPost.tags?.map(t => t.name) || []}
                    likes={relatedPost.like_count || 0}
                    comments={relatedPost.comment_count || 0}
                    views={relatedPost.view_count || 0}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 