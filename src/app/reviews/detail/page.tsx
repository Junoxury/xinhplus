'use client'

import { TreatmentBanner } from '@/components/treatments/TreatmentBanner'
import { ChevronLeft, Star, MessageCircle, Eye, MapPin, Clock, Phone, X, Heart, Share2, Lock, Trash2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from '@/lib/supabase'
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
    type: 'before' | 'after' | 'google'
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
  is_liked?: boolean;
}

// 상수 추가
const HEADER_HEIGHT = 64; // 헤더 높이

export default function ReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null)
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [reviewData, setReviewData] = useState<ReviewDetail | null>(null)
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast()
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<{
    avatar_url?: string;
    nickname?: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const fetchReviewDetail = async () => {
      const reviewId = searchParams.get('id')
      if (!reviewId) return

      try {
        // 현재 세션 가져오기
        const { data: { session } } = await supabase.auth.getSession()
        
        const { data, error } = await supabase
          .rpc('get_review_detail', {
            p_review_id: parseInt(reviewId),
            p_user_id: session?.user?.id || null
          })

        if (error) throw error
        
        // data가 이제 직접 객체로 반환됨 (배열이 아님)
        if (data) {
          setReviewData(data)
        }
      } catch (error) {
        console.error('리뷰 상세 정보 조회 실패:', error)
      }
    }

    fetchReviewDetail()
  }, [searchParams])

  // 좋아요 상태 초기화
  useEffect(() => {
    if (reviewData) {
      setIsLiked(reviewData.is_liked || false);
      setLikeCount(reviewData.like_count);
    }
  }, [reviewData]);

  // 로그인 상태 체크 추가
  useEffect(() => {
    const checkLoginStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setCurrentUserId(session?.user?.id || null);
      
      // 현재 사용자 프로필 정보 설정
      if (session?.user) {
        setCurrentUserProfile({
          avatar_url: session.user.user_metadata?.profile?.avatar_url,
          nickname: session.user.user_metadata?.profile?.nickname,
          email: session.user.email || ''
        });
      } else {
        setCurrentUserProfile(null);
      }
    };

    checkLoginStatus();
  }, []);

  // JWT 만료 체크 함수
  const checkJWTExpired = (error: any) => {
    if (error.code === 'PGRST301' || error.message === 'JWT expired') {
      // 로그인 상태 초기화
      setIsLoggedIn(false);
      setCurrentUserId(null);
      // 로그인 페이지로 리다이렉트
      router.push('/login');
      return true;
    }
    return false;
  };

  // 좋아요 처리 함수
  const handleLike = async () => {
    const session = await supabase.auth.getSession();
    
    if (!session.data.session) {
      router.push('/login');
      return;
    }

    try {
      const { data: likeData, error } = await supabase.rpc('toggle_review_like', {
        p_review_id: parseInt(searchParams.get('id')!),
        p_user_id: session.data.session.user.id
      });

      if (error) {
        if (checkJWTExpired(error)) return;
        throw error;
      }

      // 결과값 확인을 위한 로그
      console.log('Toggle result:', likeData);

      // 좋아요 상태 및 카운트 업데이트
      if (likeData && Array.isArray(likeData) && likeData[0]) {
        const result = likeData[0];
        setIsLiked(result.is_liked);
        setLikeCount(result.like_count);
        
        // reviewData 업데이트
        setReviewData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            like_count: result.like_count,
            is_liked: result.is_liked
          };
        });
      }

    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  // 공유하기 처리 함수
  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      
      toast({
        description: "링크가 클립보드에 복사되었습니다.",
        duration: 2000, // 2초 후 자동으로 사라짐
      });
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
      toast({
        variant: "destructive",
        description: "링크 복사에 실패했습니다.",
        duration: 2000,
      });
    }
  };

  // 댓글 작성 시도 시 로그인 체크
  const handleCommentClick = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
  };

  // 댓글 작성 처리
  const handleCommentSubmit = async () => {
    if (!isLoggedIn || !commentContent.trim()) return;

    try {
      const { data, error } = await supabase.rpc('add_review_comment', {
        p_review_id: reviewData?.id,
        p_user_id: currentUserId,
        p_content: commentContent.trim(),
        p_parent_id: null,
        p_hospital_id: reviewData?.hospital_id,
        p_treatment_id: reviewData?.treatment_id
      });

      if (error) {
        if (checkJWTExpired(error)) return;
        throw error;
      }

      // 댓글 목록 업데이트 - 새 댓글을 맨 앞에 추가
      if (data && reviewData) {
        // 현재 사용자의 프로필 정보를 포함한 새 댓글 객체 생성
        const newComment = {
          ...data,
          author_name: currentUserProfile?.nickname || currentUserProfile?.email || '',
          author_image: currentUserProfile?.avatar_url || null,
          replies: []
        };

        setReviewData({
          ...reviewData,
          comments: [newComment, ...reviewData.comments],
          comment_count: reviewData.comment_count + 1
        });
        
        setCommentContent('');
        
        toast({
          description: "댓글이 작성되었습니다.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      toast({
        variant: "destructive",
        description: "댓글 작성에 실패했습니다.",
        duration: 2000,
      });
    }
  };

  // 댓글 삭제 처리
  const handleCommentDelete = async (commentId: number) => {
    try {
      // 삭제할 댓글이 메인 댓글인지 확인
      const isMainComment = reviewData?.comments.some(c => c.id === commentId);
      
      const { data, error } = await supabase.rpc('delete_review_comment', {
        p_comment_id: commentId,
        p_user_id: currentUserId,
        p_hospital_id: reviewData?.hospital_id,
        p_treatment_id: reviewData?.treatment_id
      });

      if (error) throw error;

      if (data && reviewData) {
        // 메인 댓글 삭제인 경우
        if (isMainComment) {
          setReviewData({
            ...reviewData,
            comments: reviewData.comments.filter(c => c.id !== commentId),
            comment_count: reviewData.comment_count - 1
          });
        } else {
          // 답글 삭제인 경우
          const updatedComments = reviewData.comments.map(comment => ({
            ...comment,
            replies: comment.replies?.filter(r => r.id !== commentId)
          }));

          setReviewData({
            ...reviewData,
            comments: updatedComments,
            comment_count: reviewData.comment_count - 1
          });
        }

        toast({
          description: "댓글이 삭제되었습니다.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      toast({
        variant: "destructive",
        description: "댓글 삭제에 실패했습니다.",
        duration: 2000,
      });
    }
  };

  // 답글 작성 처리
  const handleReplySubmit = async (parentCommentId: number) => {
    if (!isLoggedIn || !replyContent.trim()) return;

    try {
      const { data, error } = await supabase.rpc('add_review_comment', {
        p_review_id: reviewData?.id,
        p_user_id: currentUserId,
        p_content: replyContent.trim(),
        p_parent_id: parentCommentId,
        p_hospital_id: reviewData?.hospital_id,
        p_treatment_id: reviewData?.treatment_id
      });

      if (error) {
        if (checkJWTExpired(error)) return;
        throw error;
      }

      // 댓글 목록 업데이트
      if (data && reviewData) {
        // 현재 사용자의 프로필 정보를 포함한 새 답글 객체 생성
        const newReply = {
          ...data,
          author_name: currentUserProfile?.nickname || currentUserProfile?.email || '',
          author_image: currentUserProfile?.avatar_url || null
        };

        const updatedComments = reviewData.comments.map(comment => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          }
          return comment;
        });

        setReviewData({
          ...reviewData,
          comments: updatedComments,
          comment_count: reviewData.comment_count + 1
        });
        
        setReplyContent('');
        setReplyTo(null);
        
        toast({
          description: "답글이 작성되었습니다.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('답글 작성 실패:', error);
      toast({
        variant: "destructive",
        description: "답글 작성에 실패했습니다.",
        duration: 2000,
      });
    }
  };

  // 리뷰 삭제 처리 함수 수정
  const handleReviewDelete = async () => {
    try {
      const { data, error } = await supabase.rpc('delete_review', {
        p_review_id: reviewData?.id,
        p_user_id: currentUserId
      });

      if (error) {
        if (checkJWTExpired(error)) return;
        throw error;
      }

      if (data) {
        // 삭제 성공 AlertDialog를 표시하기 위한 상태 업데이트
        setShowDeleteSuccess(true);
      }
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      toast({
        variant: "destructive",
        description: "리뷰 삭제에 실패했습니다.",
        duration: 2000,
      });
    }
  };

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
    <>
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
            {/* 공유하기와 좋아요 버튼 수정 */}
            <div className="flex justify-end gap-2 mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5 mr-1" />
                공유하기
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLike}
              >
                <Heart 
                  className={`w-5 h-5 mr-1 ${
                    isLiked ? 'fill-current text-red-500' : ''
                  }`} 
                />
                좋아요
              </Button>
              {/* 작성자인 경우에만 삭제 버튼 표시 */}
              {currentUserId === reviewData.author_id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-5 h-5 mr-1" />
                  삭제
                </Button>
              )}
            </div>

            {/* 제목과 작성자 정보 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">
                {reviewData.title}
              </h2>
              <div className="flex items-center gap-4 ml-auto">
                <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden">
                  {reviewData.author_image ? (
                    <img 
                      src={reviewData.author_image} 
                      alt={reviewData.author_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-pink-600 font-medium">
                      {reviewData.author_name.split('@')[0].charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{reviewData.author_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(reviewData.created_at).toLocaleDateString()}
                  </p>
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
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={handleLike}
                >
                  <Heart 
                    className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                  />
                  <span className="ml-1 text-gray-600">{likeCount}</span>
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
                  {/* 이미지 */}
                  <Image
                    src={image.url}
                    alt={`Review image ${index + 1}`}
                    fill
                    className={`object-cover rounded-lg ${
                      image.type === 'before' && !isLoggedIn ? 'brightness-[0.2] blur-[1.5px]' : ''
                    }`}
                  />

                  {/* 오버레이 */}
                  <div className="absolute inset-0">
                    {/* Before/After 라벨 또는 Google 배지 */}
                    {image.type === 'google' ? (
                      <div className="absolute top-2 left-2">
                        <Image
                          src="https://www.google.com/images/poweredby_transparent/poweredby_000000.gif"
                          alt="Powered by Google"
                          width={40}
                          height={40}
                        />
                      </div>
                    ) : (
                      <span className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-sm text-xs">
                        {image.type === 'after' ? 'After' : 'Before'}
                      </span>
                    )}

                    {/* 자물쇠 오버레이 (before 이미지이며 로그인하지 않았을 때만) */}
                    {image.type === 'before' && !isLoggedIn && (
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
                    <h3 className="text-lg font-bold mb-1">{reviewData.hospital_name}</h3>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{reviewData.hospital_rating}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                        <span className="ml-1 text-sm">{reviewData.hospital_review_count}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{reviewData.hospital_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone className="w-4 h-4" />
                      <span>{reviewData.hospital_phone}</span>
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
              <h3 className="text-lg font-bold mb-4">
                댓글 {reviewData.comment_count}개
              </h3>
              
              {/* 댓글 작성 폼 */}
              <div className="flex gap-4 mb-6">
                <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden">
                  {currentUserProfile?.avatar_url ? (
                    <img 
                      src={currentUserProfile.avatar_url} 
                      alt={currentUserProfile.nickname || currentUserProfile.email}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-pink-600 font-medium">
                      {(currentUserProfile?.nickname || currentUserProfile?.email || '')
                        .split('@')[0].charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <Textarea
                    placeholder="댓글을 입력하세요..."
                    className="min-h-[80px] mb-2"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    onClick={handleCommentClick}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleCommentSubmit}>댓글 작성</Button>
                  </div>
                </div>
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-6">
                {reviewData.comments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <div className="flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden">
                        {comment.author_image ? (
                          <img 
                            src={comment.author_image} 
                            alt={comment.author_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-pink-600 font-medium">
                            {comment.author_name.split('@')[0].charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{comment.author_name}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {currentUserId === comment.author_id && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    이 댓글을 삭제하시겠습니까?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>취소</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleCommentDelete(comment.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    삭제
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <button 
                            className="text-sm text-gray-500 hover:text-gray-700"
                            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                          >
                            답글 달기
                          </button>
                        </div>

                        {/* 답글 작성 폼 */}
                        {replyTo === comment.id && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-200">
                            <div className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden">
                                {currentUserProfile?.avatar_url ? (
                                  <img 
                                    src={currentUserProfile.avatar_url} 
                                    alt={currentUserProfile.nickname || currentUserProfile.email}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-pink-600 font-medium text-sm">
                                    {(currentUserProfile?.nickname || currentUserProfile?.email || '')
                                      .split('@')[0].charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1">
                                <Textarea
                                  placeholder="답글을 입력하세요..."
                                  className="min-h-[80px] mb-2"
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  onClick={handleCommentClick}
                                />
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => {
                                      setReplyTo(null);
                                      setReplyContent('');
                                    }}
                                  >
                                    취소
                                  </Button>
                                  <Button onClick={() => handleReplySubmit(comment.id)}>
                                    답글 작성
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 답글 목록 */}
                        {comment.replies?.length > 0 && (
                          <div className="mt-4 pl-8 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden">
                                  {reply.author_image ? (
                                    <img 
                                      src={reply.author_image} 
                                      alt={reply.author_name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-pink-600 font-medium text-sm">
                                      {reply.author_name.split('@')[0].charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold">{reply.author_name}</span>
                                      <span className="text-sm text-gray-500">
                                        {new Date(reply.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                    {currentUserId === reply.author_id && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                          >
                                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>답글 삭제</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              이 답글을 삭제하시겠습니까?
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>취소</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleCommentDelete(reply.id)}
                                              className="bg-red-500 hover:bg-red-600"
                                            >
                                              삭제
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}
                                  </div>
                                  <p className="text-gray-700">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
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

      {/* AlertDialog들을 메인 컨텐츠 밖으로 이동 */}
      {currentUserId === reviewData.author_id && (
        <>
          {/* 삭제 확인 AlertDialog */}
          <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>리뷰 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  이 리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReviewDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* 삭제 완료 AlertDialog */}
          <AlertDialog open={showDeleteSuccess} onOpenChange={setShowDeleteSuccess}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>삭제 완료</AlertDialogTitle>
                <AlertDialogDescription>
                  리뷰가 삭제되었습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => {
                    setShowDeleteSuccess(false);
                    router.back();
                  }}
                >
                  확인
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  )
} 