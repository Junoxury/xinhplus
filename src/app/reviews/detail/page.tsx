'use client'

import { TreatmentBanner } from '@/components/treatments/TreatmentBanner'
import { ChevronLeft, Star, MessageCircle, Eye, MapPin, Clock, Phone, X, Heart, Share2, Lock } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from '@/lib/supabase'

interface ReviewDetail {
  id: number
  title: string
  content: string
  rating: number
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  is_best: boolean
  is_google: boolean
  author_id: string
  author_name: string
  author_image: string
  hospital_id: number
  hospital_name: string
  hospital_address: string
  hospital_phone: string
  hospital_rating: number
  hospital_review_count: number
  hospital_image: string
  treatment_id: number
  treatment_name: string
  treatment_price: number
  treatment_discount_rate: number
  treatment_discount_price: number
  treatment_summary: string
  categories: {
    depth2: { id: number; name: string }
    depth3: { id: number; name: string }
  }
  images: Array<{
    id: number
    url: string
    type: 'before' | 'after'
    order: number
  }>
  comments: Array<{
    id: number
    content: string
    author_id: string
    author_name: string
    author_image: string
    like_count: number
    created_at: string
    replies?: Array<{
      id: number
      content: string
      author_id: string
      author_name: string
      author_image: string
      like_count: number
      created_at: string
    }>
  }>
}

// 상수 추가
const HEADER_HEIGHT = 64; // 헤더 높이

export default function ReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null)
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [commentRating, setCommentRating] = useState(0)
  const [reviewData, setReviewData] = useState<ReviewDetail | null>(null)

  useEffect(() => {
    const fetchReviewDetail = async () => {
      const reviewId = searchParams.get('id')
      if (!reviewId) return

      try {
        const { data, error } = await supabase
          .rpc('get_review_detail', {
            p_review_id: parseInt(reviewId)
          })

        if (error) throw error
        if (data && data[0]) {
          setReviewData(data[0])
        }
      } catch (error) {
        console.error('리뷰 상세 정보 조회 실패:', error)
      }
    }

    fetchReviewDetail()
  }, [searchParams])

  if (!reviewData) return null

  // 이미지 정렬: after 먼저, before 나중에
  const sortedImages = reviewData.images
    ? [...reviewData.images].sort((a, b) => {
        if (a.type === 'after' && b.type === 'before') return -1
        if (a.type === 'before' && b.type === 'after') return 1
        return a.order - b.order
      })
    : []

  return (
    <main className="min-h-screen bg-gray-50">
      <TreatmentBanner />
      
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
          <h1 className="text-2xl font-bold">리뷰 상세보기</h1>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* 공유하기와 좋아요 버튼 추가 */}
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="ghost" size="sm">
              <Share2 className="w-5 h-5 mr-1" />
              공유하기
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="w-5 h-5 mr-1" />
              좋아요
            </Button>
          </div>

          {/* 제목과 작성자 정보 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">
              {reviewData.title}
            </h2>
            <div className="flex items-center gap-4 ml-auto">
              <div className="w-9 h-9 relative flex-shrink-0">
                <Image
                  src={reviewData.author_image || '/images/default-avatar.png'}
                  alt={`${reviewData.author_name} 프로필`}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">{reviewData.author_name}</p>
                <p className="text-sm text-gray-500">{new Date(reviewData.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* 평점 & 통계 */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold">{reviewData.rating}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <span className="ml-1 text-gray-600">{reviewData.comment_count}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-gray-400" />
                <span className="ml-1 text-gray-600">{reviewData.view_count}</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-gray-400" />
                <span className="ml-1 text-gray-600">{reviewData.like_count}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-1">Powered by</span>
              <Image
                src="https://www.google.com/images/poweredby_transparent/poweredby_000000.gif"
                alt="Powered by Google"
                width={48}
                height={48}
                style={{ marginTop: '0.4em' }}
              />
            </div>
          </div>

          {/* 이미지 갤러리 */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
            {sortedImages.map((image, index) => (
              <div 
                key={image.id} 
                className="relative aspect-[4/3] cursor-pointer group"
                onClick={() => setSelectedImage({ src: image.url, alt: `Review image ${index + 1}` })}
              >
                {/* 이미지를 먼저 렌더링 */}
                <Image
                  src={image.url}
                  alt={`Review image ${index + 1}`}
                  fill
                  className={`object-cover rounded-lg ${
                    image.type === 'before' ? 'brightness-[0.2] blur-[1.5px]' : ''
                  }`}
                />

                {/* 오버레이들은 이미지 뒤에 렌더링 */}
                <div className="absolute inset-0">
                  {/* Before/After 라벨 */}
                  <span className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-sm text-xs">
                    {image.type === 'after' ? 'After' : 'Before'}
                  </span>

                  {/* 자물쇠 오버레이 (before 이미지일 때) */}
                  {image.type === 'before' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center bg-black/60 px-4 py-3 rounded-lg backdrop-blur-sm">
                        <Lock className="w-5 h-5 text-white" />
                        <span className="text-white text-xs font-medium mt-1">Sign-in</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 후기 내용 */}
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {reviewData.content}
            </p>
          </div>

          {/* 병원 & 시술 정보 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 병원 정보 카드 */}
            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/clinics/detail?id=${reviewData.hospital_id}`)}
            >
              <div className="flex gap-4">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={reviewData.hospital_image || '/images/default-hospital.png'}
                    alt={`${reviewData.hospital_name} 병원 이미지`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{reviewData.hospital_name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{reviewData.hospital_rating}</span>
                      <span className="text-sm text-gray-500">
                        ({reviewData.hospital_review_count})
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <p className="text-sm text-gray-600">{reviewData.hospital_address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600">{reviewData.hospital_phone}</p>
                    </div>
                    
                  </div>
                </div>
              </div>
            </Card>

            {/* 시술 정보 카드 */}
            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/treatments/detail?id=${reviewData.treatment_id}`)}
            >
              <div className="flex gap-4">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={sortedImages[0]?.url || '/images/default-treatment.png'}
                    alt={`${reviewData.treatment_name} 시술 이미지`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{reviewData.treatment_name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {reviewData.treatment_summary}
                  </p>
                  <div className="space-y-3">
                    {/* 카테고리 - depth2만 표시 */}
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-pink-50 text-pink-600 rounded-md text-sm">
                        {reviewData.categories.depth2.name}
                      </span>
                    </div>

                    {/* 평점, 댓글, 조회수 */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{reviewData.treatment_rating}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                        <span className="ml-1 text-sm">{reviewData.hospital_review_count}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="ml-1 text-sm">{reviewData.view_count}</span>
                      </div>
                    </div>

                    {/* 가격 정보 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-red-50 text-red-500 rounded text-sm font-semibold">
                          {reviewData.treatment_discount_rate}%
                        </span>
                        <span className="font-bold text-lg">
                          {reviewData.treatment_discount_price.toLocaleString()}원
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 line-through">
                        {reviewData.treatment_price.toLocaleString()}원
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 댓글 섹션 */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">댓글 {reviewData.comments.length}개</h3>
            
            {/* 댓글 작성 폼 */}
            <div className="flex gap-4 mb-6">
              <div className="w-9 h-9 relative flex-shrink-0">
                <Image
                  src={reviewData.author_image || '/images/default-avatar.png'}
                  alt={`${reviewData.author_name} 프로필`}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                {/* 평점 입력 UI */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-500">평점</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setCommentRating(rating)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            rating <= commentRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {commentRating > 0 && (
                    <span className="text-sm text-gray-500">
                      {commentRating.toFixed(1)}점
                    </span>
                  )}
                </div>

                <Textarea
                  placeholder="댓글을 입력하세요..."
                  className="min-h-[80px] mb-2"
                />
                <div className="flex justify-end">
                  <Button>댓글 작성</Button>
                </div>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-6">
              {reviewData.comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  <div className="flex gap-4">
                    <div className="w-9 h-9 relative flex-shrink-0">
                      <Image
                        src={comment.author_image || '/images/default-avatar.png'}
                        alt={`${comment.author_name} 프로필`}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{comment.author_name}</span>
                        <span className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>{comment.like_count}</span>
                        </button>
                        <button 
                          className="text-sm text-gray-500 hover:text-gray-700"
                          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                        >
                          답글 달기
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 답글 목록 */}
                  {comment.replies?.length > 0 && (
                    <div className="pl-[52px] space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-4">
                          <div className="w-9 h-9 relative flex-shrink-0">
                            <Image
                              src={reply.author_image || '/images/default-avatar.png'}
                              alt={`${reply.author_name} 프로필`}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{reply.author_name}</span>
                              <span className="text-sm text-gray-500">{new Date(reply.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-700 mb-2">{reply.content}</p>
                            <div className="flex items-center gap-4">
                              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                <span>{reply.like_count}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 답글 입력 폼 */}
                  {replyTo === comment.id && (
                    <div className="flex gap-4 pl-[52px]">
                      <div className="w-9 h-9 relative flex-shrink-0">
                        <Image
                          src={reviewData.author_image || '/images/default-avatar.png'}
                          alt={`${reviewData.author_name} 프로필`}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-500">
                            <span className="font-semibold text-gray-700">{comment.author_name}</span>
                            님에게 답글 작성
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="답글을 입력하세요..."
                          className="w-full px-3 py-2 border rounded-md text-sm mb-2"
                        />
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setReplyTo(null)}
                          >
                            취소
                          </Button>
                          <Button size="sm">
                            답글 작성
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 이미지 확대 모달 */}
        {selectedImage && (
          <div 
            className="fixed left-0 right-0 bg-black bg-opacity-90 z-50"
            style={{ 
              top: `${HEADER_HEIGHT}px`,
              height: `calc(100vh - ${HEADER_HEIGHT}px)`
            }}
          >
            {/* 닫기 버튼 */}
            <button 
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* 이미지 컨테이너 */}
            <div 
              className="w-full h-full flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div 
                className="relative w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={1200}
                  height={800}
                  className="object-contain w-full"
                  priority
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 