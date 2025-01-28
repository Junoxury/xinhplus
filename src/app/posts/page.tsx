'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BlogCard } from '@/components/blog/BlogCard'
import { supabase } from "@/lib/supabase";
import Link from 'next/link'

interface Tag {
  id: number;
  name: string;
  slug: string;
  post_count: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  thumbnail_url: string;
  created_at: string;
  author_name: string;
  author_avatar_url: string;
  tags: any[];
  like_count: number;
  comment_count: number;
  view_count: number;
  total_count: number;
  has_more: boolean;
}

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

export default function PostsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('view_count')
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const ITEMS_PER_PAGE = 8

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    setPage(1);
    setPosts([]);
    fetchPosts();
  }, [sortBy, searchTerm, selectedTagIds]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts();
    }
  }, [page]);

  async function fetchTags() {
    const { data, error } = await supabase
      .rpc('get_tags', {
        p_limit: 10,
        p_order_by: 'post_count'
      });

    if (error) {
      console.error('Error fetching tags:', error);
      return;
    }

    setTags(data);
  }

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .rpc('get_posts', {
        p_search: searchTerm || null,
        p_tag_ids: selectedTagIds.length > 0 ? selectedTagIds : null,
        p_order_by: sortBy,
        p_limit: ITEMS_PER_PAGE,
        p_offset: (page - 1) * ITEMS_PER_PAGE
      });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    setPosts(prev => page === 1 ? data : [...prev, ...data]);
    if (data && data.length > 0) {
      setTotalPosts(data[0].total_count);
      setHasMore(data[0].has_more);
    } else {
      setTotalPosts(0);
      setHasMore(false);
    }
    setLoading(false);
  }

  const handleTagClick = (tagId: number) => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const handleLoadMore = async () => {
    setPage(prev => prev + 1);
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
          {tags.map((tag) => (
            <Button
              key={tag.id}
              variant="outline"
              size="sm"
              className={`rounded-full transition-colors ${
                selectedTagIds.includes(tag.id)
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'hover:bg-blue-50'
              }`}
              onClick={() => handleTagClick(tag.id)}
            >
              #{tag.name}
            </Button>
          ))}
        </div>

        {/* 정렬 옵션 */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            총 <span className="font-semibold">{totalPosts}</span>개 Posts
          </div>
          <select
            className="h-9 px-3 text-sm border rounded-md bg-background"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="view_count">조회순</option>
            <option value="like_count">좋아요순</option>
            <option value="comment_count">댓글순</option>
          </select>
        </div>

        {/* 블로그 포스트 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link 
                key={post.id}
                href={`/posts/detail?id=${post.id}`}
                className="block hover:opacity-95 transition-opacity"
              >
                <BlogCard 
                  id={post.id.toString()}
                  title={post.title}
                  content={stripMarkdownAndHtml(post.content)}
                  thumbnail={post.thumbnail_url}
                  author={{
                    name: post.author_name || 'Unknown',
                    avatar: post.author_avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
                  }}
                  date={new Date(post.created_at).toLocaleDateString()}
                  tags={post.tags.map(t => t.name)}
                  likes={post.like_count}
                  comments={post.comment_count}
                  views={post.view_count}
                />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              조건에 맞는 Post가 없습니다.
            </div>
          )}
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
      </div>
    </main>
  )
} 