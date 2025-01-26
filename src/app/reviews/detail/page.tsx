'use client'

import { TreatmentBanner } from '@/components/treatments/TreatmentBanner'
import { ChevronLeft, Star, MessageCircle, Eye, MapPin, Clock, Phone, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// 임시 데이터
const reviewData = {
  id: '1',
  title: '자연스러운 라인의 쌍커풀 수술 후기',
  author: '김지은',
  authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  date: '2024-03-15',
  rating: 4.5,
  commentCount: 45,
  viewCount: 1234,
  images: [
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000',
    'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=1000',
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1000',
    'https://images.unsplash.com/photo-1578496781985-452d4a934d50?q=80&w=1000',
  ],
  content: '자연스러운 라인의 쌍커풀 수술 과정과 결과가 매우 만족스러웠습니다. 수술 후 붓기가 빠르게 가라앉았고, 회복 기간도 예상보다 짧았어요. 의사선생님의 섬세한 시술과 친절한 설명 덕분에 안심하고 수술을 받을 수 있었습니다. 특히 자연스러운 라인을 원했는데 정말 제가 원하던 대로 결과가 나와서 너무 만족스럽습니다.',
  clinic: {
    name: 'Thẩm mỹ viện Nana',
    address: '123 Nguyen Hue, District 1, Ho Chi Minh City',
    phone: '+84 123-456-789',
    operatingHours: '09:00 - 18:00',
    rating: 4.8,
    reviewCount: 234
  },
  treatment: {
    name: '자연스러운 쌍커풀',
    category: '눈성형',
    subCategory: '쌍커풀',
    price: '3,000,000원',
    duration: '1시간',
    recovery: '7일',
    description: '자연스러운 라인의 쌍커풀 수술로 눈의 균형과 조화를 맞춥니다.'
  }
}

// 댓글 더미 데이터 수정
const comments = [
  {
    id: 1,
    author: '박지영',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11',
    content: '저도 이 병원에서 수술했는데 정말 만족스러웠어요! 의사선생님이 너무 친절하시고 결과도 자연스러워서 좋았습니다.',
    date: '2024-03-14',
    likes: 5,
    replies: [
      {
        id: 101,
        author: '김지은',
        authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        content: '네 맞아요~ 의사선생님이 정말 꼼꼼하게 설명해주시더라구요!',
        date: '2024-03-14',
        likes: 2,
      },
      {
        id: 102,
        author: '이하나',
        authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=15',
        content: '저도 다음주에 예약했는데 더 기대되네요 😊',
        date: '2024-03-14',
        likes: 1,
      }
    ]
  },
  {
    id: 2,
    author: '김수현',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12',
    content: '수술 후 붓기는 얼마나 지속되었나요? 저도 이번주에 예약했거든요 😊',
    date: '2024-03-13',
    likes: 3,
  },
  {
    id: 3,
    author: '이미나',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=13',
    content: '후기 잘 보고 갑니다~ 정말 자연스럽게 잘 된 것 같아요!',
    date: '2024-03-12',
    likes: 2,
  },
]

// 상수 추가
const HEADER_HEIGHT = 64; // 헤더 높이

export default function ReviewPage() {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null)
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [commentRating, setCommentRating] = useState(0)

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
          {/* 제목과 작성자 정보 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">
              {reviewData.title}
            </h2>
            <div className="flex items-center gap-3 ml-auto">
              <Image
                src={reviewData.authorImage}
                alt={reviewData.author}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">{reviewData.author}</p>
                <p className="text-sm text-gray-500">{reviewData.date}</p>
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
                <span className="ml-1 text-gray-600">{reviewData.commentCount}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-gray-400" />
                <span className="ml-1 text-gray-600">{reviewData.viewCount}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              powered by Google
            </div>
          </div>

          {/* 이미지 갤러리 */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
            {reviewData.images.map((image, index) => (
              <div 
                key={index} 
                className="relative aspect-[4/3] cursor-pointer"
                onClick={() => setSelectedImage({ src: image, alt: `Review image ${index + 1}` })}
              >
                <Image
                  src={image}
                  alt={`Review image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-sm text-xs">
                  {index < 3 ? 'After' : 'Before'}
                </span>
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
            <Card className="p-4">
              <div className="flex gap-4">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1000"
                    alt={reviewData.clinic.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{reviewData.clinic.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{reviewData.clinic.rating}</span>
                      <span className="text-sm text-gray-500">
                        ({reviewData.clinic.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <p className="text-sm text-gray-600">{reviewData.clinic.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600">{reviewData.clinic.phone}</p>
                    </div>
                    
                  </div>
                </div>
              </div>
            </Card>

            {/* 시술 정보 카드 */}
            <Card className="p-4">
              <div className="flex gap-4">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={reviewData.images[0]}
                    alt={reviewData.treatment.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{reviewData.treatment.name}</h3>
                  <div className="space-y-3">
                    {/* 카테고리 */}
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-pink-50 text-pink-600 rounded-md text-sm">
                        {reviewData.treatment.category}
                      </span>
                      <span className="px-2 py-1 bg-pink-50 text-pink-600 rounded-md text-sm">
                        {reviewData.treatment.subCategory}
                      </span>
                    </div>

                    {/* 평점, 댓글, 조회수 */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{reviewData.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                        <span className="ml-1 text-sm">{reviewData.commentCount}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="ml-1 text-sm">{reviewData.viewCount}</span>
                      </div>
                    </div>

                    {/* 가격 정보 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-red-50 text-red-500 rounded text-sm font-semibold">
                          30%
                        </span>
                        <span className="font-bold text-lg">
                          {reviewData.treatment.price}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 line-through">
                        4,000,000원
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 댓글 섹션 */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">댓글 {comments.length}개</h3>
            
            {/* 댓글 작성 폼 */}
            <div className="flex gap-3 mb-6">
              <Image
                src={reviewData.authorImage}
                alt="My Avatar"
                width={40}
                height={40}
                className="rounded-full flex-shrink-0"
              />
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
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  <div className="flex gap-3">
                    <Image
                      src={comment.authorImage}
                      alt={comment.author}
                      width={40}
                      height={40}
                      className="rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-sm text-gray-500">{comment.date}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>{comment.likes}</span>
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
                    <div className="pl-[52px] space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <Image
                            src={reply.authorImage}
                            alt={reply.author}
                            width={32}
                            height={32}
                            className="rounded-full flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{reply.author}</span>
                              <span className="text-sm text-gray-500">{reply.date}</span>
                            </div>
                            <p className="text-gray-700 mb-2">{reply.content}</p>
                            <div className="flex items-center gap-4">
                              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                <span>{reply.likes}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 답글 입력 폼 */}
                  {replyTo === comment.id && (
                    <div className="flex gap-3 pl-[52px]">
                      <Image
                        src={reviewData.authorImage}
                        alt="My Avatar"
                        width={32}
                        height={32}
                        className="rounded-full flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-500">
                            <span className="font-semibold text-gray-700">{comment.author}</span>
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