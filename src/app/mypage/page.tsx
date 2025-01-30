'use client'

import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { Search, Heart, Activity, Pencil, User, Settings2, Edit3 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BlogCard } from '@/components/blog/BlogCard'
import { TreatmentCard } from '@/components/treatments/TreatmentCard'
import { ClinicCard } from '@/components/clinics/ClinicCard'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// 인터페이스 추가
interface CategoryData {
  id: number;
  label: string;
  icon?: string;
  name?: string;
}

interface ProfileData {
  id?: string;
  avatar_url?: string;
  nickname?: string;
  phone?: string;
  city_id?: number;
  email?: string;
}

// 더미 데이터 추가
const treatmentsList = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500',
    title: '자연스러운 쌍커풀',
    description: '자연스러운 라인의 쌍커풀 수술',
    clinic: '유진성형외과',
    location: '하노이',
    originalPrice: 2000000,
    discountRate: 20,
    rating: 4.8,
    reviewCount: 245,
    categories: ['눈성형', '쌍커풀']
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1512290923902-80bbd2d6fd0d?w=500',
    title: '코필러',
    description: '자연스러운 코 높임',
    clinic: '라포레성형외과',
    location: '호치민',
    originalPrice: 1500000,
    discountRate: 15,
    rating: 4.6,
    reviewCount: 189,
    categories: ['코성형', '필러']
  },
  // ... 더 많은 더미 데이터 추가 가능
]

// clinicsList 더미 데이터도 추가
const clinicsList = [
  {
    id: '1',
    title: '유진성형외과',
    name: '유진성형외과',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500',
    location: '하노이',
    rating: 4.8,
    reviewCount: 456,
    description: '20년 전통의 성형외과',
    categories: ['눈성형', '코성형', '안면윤곽'],
    consultCount: 1234,
    isVerified: true
  },
  {
    id: '2',
    title: '라포레성형외과',
    name: '라포레성형외과',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500',
    location: '호치민',
    rating: 4.7,
    reviewCount: 342,
    description: '최신 시설 완비',
    categories: ['피부과', '쁘띠성형', '레이저'],
    consultCount: 987,
    isVerified: true
  },
  // ... 더 많은 더미 데이터 추가 가능
]

// 리뷰 더미 데이터 추가
const reviewsList = [
  {
    id: '1',
    beforeImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
    afterImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
    additionalImagesCount: 2,
    rating: 4.8,
    content: '레이저 토닝 시술 후 피부톤이 많이 개선되었어요. 기미와 잡티가 옅어지고 전반적으로 피부가 밝아진 것 같아 만족스럽습니다.',
    author: '김지은',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    date: '2024.03.15',
    treatmentName: '레이저토닝',
    categories: ['레이저', '피부톤개선'],
    isAuthenticated: true,
    location: '하노이',
    clinicName: '유진피부과',
    commentCount: 8,
    viewCount: 234
  },
  {
    id: '2',
    beforeImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
    afterImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
    additionalImagesCount: 0,
    rating: 4.5,
    content: '자연스러운 쌍커풀 라인으로 수술했는데 회복도 빠르고 결과도 만족스러워요. 상담부터 수술, 사후관리까지 꼼꼼하게 봐주셨습니다.',
    author: '이수진',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    date: '2024.03.14',
    treatmentName: '쌍커풀',
    categories: ['눈성형', '쌍커풀'],
    isAuthenticated: true,
    location: '호치민',
    clinicName: '라포레성형외과',
    commentCount: 5,
    viewCount: 156
  }
]

export default function MyPage() {
  const router = useRouter()
  const [wishlistTab, setWishlistTab] = useState('Beauty')
  const [activityTab, setActivityTab] = useState('Reviews')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<CategoryData[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [userPhone, setUserPhone] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [bodyParts, setBodyParts] = useState<CategoryData[]>([])
  const [treatmentMethods, setTreatmentMethods] = useState<CategoryData[]>([])
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [editingNickname, setEditingNickname] = useState('')
  const [editingPhone, setEditingPhone] = useState('')
  const [userNickname, setUserNickname] = useState('')
  const [nicknameError, setNicknameError] = useState<string>('')
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [likedTreatments, setLikedTreatments] = useState<any[]>([])
  const [hasMoreLiked, setHasMoreLiked] = useState(false)
  const [likedPage, setLikedPage] = useState(0)
  const [isLoadingLiked, setIsLoadingLiked] = useState(false)
  const [likedHospitals, setLikedHospitals] = useState<ClinicCard[]>([])
  const [hasMoreHospitals, setHasMoreHospitals] = useState(false)
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false)
  const [likedReviews, setLikedReviews] = useState<any[]>([])
  const [hasMoreReviews, setHasMoreReviews] = useState(false)
  const [reviewPage, setReviewPage] = useState(1)
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)
  const [likedPosts, setLikedPosts] = useState<any[]>([])
  const [hasMorePosts, setHasMorePosts] = useState(false)
  const [postPage, setPostPage] = useState(1)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [myReviews, setMyReviews] = useState<any[]>([])
  const [hasMoreMyReviews, setHasMoreMyReviews] = useState(false)
  const [myReviewPage, setMyReviewPage] = useState(1)
  const [isLoadingMyReviews, setIsLoadingMyReviews] = useState(false)
  const [myComments, setMyComments] = useState<any[]>([])
  const [hasMoreComments, setHasMoreComments] = useState(false)
  const [commentPage, setCommentPage] = useState(1)
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  const ITEMS_PER_PAGE = 8
  const currentTreatments = treatmentsList.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = currentTreatments.length < treatmentsList.length

  const handleLoadMore = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setPage(prev => prev + 1)
    setLoading(false)
  }

  const handleCategorySelect = (category: CategoryData) => {
    if (selectedCategories.find(c => c.id === category.id)) {
      setSelectedCategories(selectedCategories.filter(c => c.id !== category.id))
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  // cities 데이터 가져오기
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('id, name, name_vi, name_ko, is_active')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
        
        if (error) throw error
        
        if (data) {
          setCities(data)
        }
      } catch (error) {
        console.error('도시 데이터 로딩 중 에러:', error)
      }
    }

    fetchCities()
  }, [])

  // 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 부위 카테고리 가져오기 (depth1_id = 1)
        const { data: bodyPartsData, error: bodyPartsError } = await supabase
          .rpc('get_categories', { p_parent_depth1_id: 1 })

        console.log("부위 카테고리 원본 데이터:", bodyPartsData)
        
        if (bodyPartsError) throw bodyPartsError
        if (bodyPartsData) {
          console.log("부위 카테고리 categories:", bodyPartsData.categories)
          setBodyParts(bodyPartsData.categories)
        }

        // 시술방법 카테고리 가져오기 (depth1_id = 2)
        const { data: methodsData, error: methodsError } = await supabase
          .rpc('get_categories', { p_parent_depth1_id: 2 })

        console.log("시술방법 원본 데이터:", methodsData)
        
        if (methodsError) throw methodsError
        if (methodsData) {
          console.log("시술방법 categories:", methodsData.categories)
          setTreatmentMethods(methodsData.categories)
        }

        // 선택된 카테고리 확인
        console.log("현재 선택된 카테고리:", selectedCategories)
      } catch (error) {
        console.error('카테고리 데이터 로딩 중 에러:', error)
      }
    }

    fetchCategories()
  }, [])

  // 인증 체크 로직 수정
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session?.user) {
          console.log("인증 에러 또는 세션 없음:", error)
          router.push('/login?redirect=/mypage')
          return
        }

        // 이메일 설정
        setUserEmail(session.user.email || '')
        
        // 닉네임 설정 (세션 메타데이터에서)
        const nickname = session.user.user_metadata?.profile?.nickname
        if (nickname) {
          setUserNickname(nickname)
          setEditingNickname(nickname)
        }

        // user_profile에서 프로필 데이터 가져오기
        const { data, error: profileError } = await supabase
          .from('user_profiles')
          .select('city_id, phone, nickname, avatar_url')  // avatar_url 추가
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('프로필 데이터 로딩 중 에러:', profileError)
        } else {
          // 프로필 데이터 설정
          setProfileData(data)
          
          // 프로필의 닉네임이 있으면 이를 우선 사용
          if (data?.nickname) {
            setUserNickname(data.nickname)
            setEditingNickname(data.nickname)
          }
          
          // 전화번호 설정
          if (data?.phone) {
            setUserPhone(data.phone)
            setEditingPhone(data.phone)
          }
          
          // 도시 설정
          if (data?.city_id) {
            const selectedCityData = cities.find(city => city.id === data.city_id)
            if (selectedCityData) {
              setSelectedCity(selectedCityData)
            }
          }
        }

        // 선호 카테고리 설정
        const preferredCategories = session.user.user_metadata.preferred_categories || []
        
        // bodyParts와 treatmentMethods에서 선택된 카테고리 찾기
        const selectedCats = [
          ...bodyParts,
          ...treatmentMethods
        ].filter(category => preferredCategories.includes(Number(category.id)))
          .map(cat => ({
            id: String(cat.id),
            name: cat.label  // label을 name으로 사용
          }))

        setSelectedCategories(selectedCats)

      } catch (error) {
        console.log("인증 체크 중 에러 발생:", error)
        router.push('/login?redirect=/mypage')
      }
    }

    checkAuth()
  }, [router, cities, bodyParts, treatmentMethods])

  // 도시 선택 핸들러 수정
  const handleCitySelect = async (city: City) => {
    const newSelectedCity = selectedCity?.id === city.id ? null : city
    setSelectedCity(newSelectedCity)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      // user_profiles 테이블 업데이트
      const { error } = await supabase
        .from('user_profiles')
        .update({ city_id: newSelectedCity?.id || null })
        .eq('id', session.user.id)  // 'user_id'를 'id'로 수정

      if (error) {
        console.error('도시 선택 업데이트 중 에러:', error)
      }
    } catch (error) {
      console.error('도시 선택 처리 중 에러:', error)
    }
  }

  // 닉네임 수정 핸들러 수정
  const handleNicknameEdit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) return

        // 닉네임 중복 체크
        const { data: existingUser, error: checkError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('nickname', editingNickname)
          .neq('id', session.user.id)  // 자신의 현재 닉네임은 제외
          .single()

        if (checkError && checkError.code !== 'PGRST116') {  // PGRST116는 결과가 없는 경우
          console.error('닉네임 중복 체크 중 에러:', checkError)
          return
        }

        if (existingUser) {
          setNicknameError('이미 사용 중인 닉네임입니다')
          return
        }

        // 닉네임 업데이트
        const { error } = await supabase
          .from('user_profiles')
          .update({ 
            nickname: editingNickname,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.user.id)

        if (error) {
          console.error('닉네임 업데이트 중 에러:', error)
          return
        }

        setUserNickname(editingNickname)
        setIsEditingNickname(false)
        setNicknameError('')  // 에러 메시지 초기화
      } catch (error) {
        console.error('닉네임 업데이트 중 에러:', error)
      }
    }
  }

  // 전화번호 수정 핸들러
  const handlePhoneEdit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!vietnamPhoneRegex.test(editingPhone)) {
        alert('올바른 베트남 전화번호 형식이 아닙니다.')
        return
      }

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) return

        // user_profiles 테이블 업데이트
        const { error } = await supabase
          .from('user_profiles')
          .update({ 
            phone: editingPhone,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.user.id)

        if (error) {
          console.error('전화번호 업데이트 중 에러:', error)
          return
        }

        setUserPhone(editingPhone)
        setIsEditingPhone(false)
      } catch (error) {
        console.error('전화번호 업데이트 중 에러:', error)
      }
    }
  }

  // 이미지 업로드 핸들러 수정
  const handleAvatarUpload = async (file: File) => {
    try {
      setIsUploading(true)

      // 이미지 파일 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.')
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.')
        return
      }

      // 파일 이름 생성 (타임스탬프 + 확장자)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `avatars/${session.user.id}/${fileName}`

      // Storage에 이미지 업로드
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 업로드된 이미지의 public URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      // user_profiles 테이블 업데이트
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id)

      if (updateError) throw updateError

      // 프로필 데이터 상태 업데이트
      setProfileData(prev => prev ? { ...prev, avatar_url: publicUrl } : null)

    } catch (error) {
      console.error('아바타 업로드 중 에러:', error)
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleAvatarUpload(file)
    }
  }

  // 찜한 시술 목록 가져오기
  const fetchLikedTreatments = async (pageNumber: number) => {
    try {
      setIsLoadingLiked(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data, error } = await supabase
        .rpc('get_liked_treatments', {
          p_user_id: session.user.id,
          p_sort_by: 'created_at',
          p_limit: ITEMS_PER_PAGE,
          p_offset: pageNumber * ITEMS_PER_PAGE
        })

      if (error) throw error

      if (data) {
        console.log('Fetched treatments:', data)  // 데이터 확인
        console.log('Categories example:', data[0]?.categories)  // categories 확인

        if (pageNumber === 0) {
          setLikedTreatments(data)
        } else {
          setLikedTreatments(prev => [...prev, ...data])
        }
        setHasMoreLiked(data.length > 0 && data[0]?.has_next)
      }
    } catch (error) {
      console.error('찜한 시술 목록 로딩 중 에러:', error)
    } finally {
      setIsLoadingLiked(false)
    }
  }

  // 찜한 병원 목록 가져오기
  const fetchLikedHospitals = async (pageNumber: number) => {
    try {
      setIsLoadingHospitals(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data, error } = await supabase
        .rpc('get_liked_hospitals', {
          p_user_id: session.user.id,
          p_sort_by: 'created_at',
          p_page_size: 8,
          p_page: pageNumber
        })

      if (error) throw error

      if (data && data.length > 0) {
        // 데이터를 ClinicCard props 타입에 맞게 변환
        const formattedData = data.map(hospital => ({
          id: hospital.id,
          title: hospital.hospital_name,
          description: hospital.description,
          image: hospital.thumbnail_url,
          location: hospital.city_name,
          rating: Number(hospital.average_rating),
          reviewCount: Number(hospital.like_count),
          viewCount: Number(hospital.view_count),
          categories: Array.isArray(hospital.categories) 
            ? hospital.categories 
            : Object.keys(hospital.categories || {}),
          isRecommended: hospital.is_recommended,
          isAd: hospital.is_advertised,
          isMember: hospital.is_member,
          disableLink: false,
          total_count: hospital.total_count  // total_count 추가
        }))

        if (pageNumber === 1) {
          setLikedHospitals(formattedData)
        } else {
          setLikedHospitals(prev => [...prev, ...formattedData])
        }
        setHasMoreHospitals(data[0]?.has_next_page || false)
      }
    } catch (error) {
      console.error('찜한 병원 목록 로딩 중 에러:', error)
    } finally {
      setIsLoadingHospitals(false)
    }
  }

  // 찜한 리뷰 목록 가져오기
  const fetchLikedReviews = async (pageNumber: number) => {
    try {
      setIsLoadingReviews(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data, error } = await supabase
        .rpc('get_liked_reviews', {
          p_user_id: session.user.id,
          p_sort_by: 'created_at',
          p_page_size: 8,
          p_page: pageNumber
        })

      console.log('RPC 리뷰 데이터:', data) // 데이터 확인

      if (error) throw error

      if (data) {
        // categories 데이터 변환
        const formattedData = data.map(review => {
          // categories 데이터 변환
          const formattedCategories = review.categories 
            ? (Array.isArray(review.categories) 
                ? review.categories.map(cat => cat.depth2_name) 
                : [])
            : [];

          return {
            id: review.id,
            beforeImage: review.before_image || '',
            afterImage: review.after_image || '',
            rating: Number(review.rating) || 0,
            content: review.content || '',
            author: review.author_name || '',
            authorImage: review.author_image || '',
            date: review.created_at,
            treatmentName: review.treatment_name || '',
            categories: formattedCategories,  // 변환된 categories 사용
            isAuthenticated: true,
            location: review.location || '',
            clinicName: review.hospital_name || '',
            commentCount: Number(review.comment_count) || 0,
            viewCount: Number(review.view_count) || 0,
            total_count: review.total_count
          }
        })

        console.log('변환된 리뷰 데이터:', formattedData) // 변환된 데이터 확인

        if (pageNumber === 1) {
          setLikedReviews(formattedData)
        } else {
          setLikedReviews(prev => [...prev, ...formattedData])
        }
        setHasMoreReviews(data[0]?.has_next_page || false)
      }
    } catch (error) {
      console.error('찜한 리뷰 목록 로딩 중 에러:', error)
    } finally {
      setIsLoadingReviews(false)
    }
  }

  // 찜한 게시물 목록 가져오기
  const fetchLikedPosts = async (pageNumber: number) => {
    try {
      console.log('fetchLikedPosts 호출됨, 페이지:', pageNumber)
      setIsLoadingPosts(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        console.log('세션 없음')
        return
      }

      console.log('RPC 호출 전, user_id:', session.user.id)
      const { data, error } = await supabase
        .rpc('get_liked_posts', {
          p_user_id: session.user.id,
          p_sort_by: 'created_at',
          p_page_size: 8,
          p_page: pageNumber
        })

      console.log('RPC 응답:', { data, error })

      if (error) {
        console.error('RPC 에러:', error)
        throw error
      }

      if (data) {
        console.log('받은 데이터:', data)
        if (pageNumber === 1) {
          setLikedPosts(data)
        } else {
          setLikedPosts(prev => [...prev, ...data])
        }
        setHasMorePosts(data[0]?.has_next_page || false)
        console.log('상태 업데이트 완료')
      }
    } catch (error) {
      console.error('찜한 게시물 목록 로딩 중 에러:', error)
    } finally {
      setIsLoadingPosts(false)
    }
  }

  // 초기 데이터 로딩
  useEffect(() => {
    if (wishlistTab === 'Beauty') {
      fetchLikedTreatments(0)
    } else if (wishlistTab === 'Clinics') {
      fetchLikedHospitals(1)
    } else if (wishlistTab === 'Reviews') {
      fetchLikedReviews(1)
    } else if (wishlistTab === 'Posts') {
      fetchLikedPosts(1)
    }
  }, [wishlistTab])

  // 더보기 핸들러 추가
  const handleLoadMoreHospitals = async () => {
    const nextPage = hospitalPage + 1
    await fetchLikedHospitals(nextPage)
    setHospitalPage(nextPage)
  }

  // 더보기 핸들러 추가
  const handleLoadMoreReviews = async () => {
    const nextPage = reviewPage + 1
    await fetchLikedReviews(nextPage)
    setReviewPage(nextPage)
  }

  // 더보기 핸들러 추가
  const handleLoadMorePosts = async () => {
    const nextPage = postPage + 1
    await fetchLikedPosts(nextPage)
    setPostPage(nextPage)
  }

  // 탭에 따른 컨텐츠 렌더링
  const renderContent = () => {
    switch (wishlistTab) {
      case 'Beauty':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">
              찜한 시술 {likedTreatments[0]?.total_count || 0}개
            </h3>
            {likedTreatments && likedTreatments.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {likedTreatments.map((treatment) => (
                    <TreatmentCard
                      key={treatment.id}
                      id={treatment.id}
                      title={treatment.title}
                      summary={treatment.summary}
                      hospital_name={treatment.hospital_name}
                      city_name={treatment.city_name}
                      thumbnail_url={treatment.thumbnail_url}
                      price={treatment.price}
                      discount_price={treatment.discount_price}
                      discount_rate={treatment.discount_rate}
                      rating={treatment.rating}
                      comment_count={treatment.comment_count}
                      categories={treatment.categories}
                      is_advertised={treatment.is_advertised}
                      is_recommended={treatment.is_recommended}
                    />
                  ))}
                </div>

                {/* 더보기 버튼 */}
                {hasMoreLiked && (
                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      onClick={handleLoadMoreLiked}
                      disabled={isLoadingLiked}
                      className="w-full md:w-[200px]"
                    >
                      {isLoadingLiked ? '로딩중...' : '더보기'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 text-gray-500">아직 좋아요를 한 Beauty가 없어요</div>
                <Button 
                  onClick={() => router.push('/treatments')}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Beauty 바로가기
                </Button>
              </div>
            )}
          </>
        )
        
        case 'Clinics':
          return (
            <>
              <h3 className="text-lg font-medium mb-4">
                찜한 병원 {likedHospitals[0]?.total_count || 0}개
              </h3>
              {likedHospitals && likedHospitals.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {likedHospitals.map((hospital) => (
                      <ClinicCard
                        key={hospital.id}
                        id={hospital.id}
                        title={hospital.title}
                        description={hospital.description}
                        image={hospital.image}
                        location={hospital.location}
                        rating={hospital.rating}
                        reviewCount={hospital.reviewCount}
                        viewCount={hospital.viewCount}
                        categories={hospital.categories}
                        isRecommended={hospital.isRecommended}
                        isAd={hospital.isAd}
                        isMember={hospital.isMember}
                        disableLink={false}
                      />
                    ))}
                  </div>

                  {/* 더보기 버튼 */}
                  {hasMoreHospitals && (
                    <div className="mt-8 text-center">
                      <Button
                        variant="outline"
                        onClick={handleLoadMoreHospitals}
                        disabled={isLoadingHospitals}
                        className="w-full md:w-[200px]"
                      >
                        {isLoadingHospitals ? '로딩중...' : '더보기'}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4 text-gray-500">아직 좋아요를 한 병원이 없어요</div>
                  <Button 
                    onClick={() => router.push('/clinics')}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    병원찾기 바로가기
                  </Button>
                </div>
              )}
            </>
          )

        case 'Reviews':
          return (
            <>
              <h3 className="text-lg font-medium mb-4">
                찜한 리뷰 {likedReviews[0]?.total_count || 0}개
              </h3>
              {likedReviews && likedReviews.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {likedReviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        id={review.id}
                        beforeImage={review.beforeImage}
                        afterImage={review.afterImage}
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

                  {/* 더보기 버튼 */}
                  {hasMoreReviews && (
                    <div className="mt-8 text-center">
                      <Button
                        variant="outline"
                        onClick={handleLoadMoreReviews}
                        disabled={isLoadingReviews}
                        className="w-full md:w-[200px]"
                      >
                        {isLoadingReviews ? '로딩중...' : '더보기'}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4 text-gray-500">아직 좋아요를 한 후기가 없어요</div>
                  <Button 
                    onClick={() => router.push('/reviews')}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    후기 보러가기
                  </Button>
                </div>
              )}
            </>
          )

        case 'Posts':
          console.log('Posts 탭 렌더링, 데이터:', likedPosts)
          return (
            <>
              <h3 className="text-lg font-medium mb-4">
                찜한 게시물 {likedPosts[0]?.total_count || 0}개
              </h3>
              {likedPosts && likedPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-6">
                    {likedPosts.map((post) => (
                      <BlogCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        content={post.content}
                        thumbnailUrl={post.thumbnail_url}
                        authorName={post.author_name}
                        authorImage={post.author_avatar_url}
                        date={post.created_at}
                        viewCount={post.view_count}
                        likeCount={post.like_count}
                        commentCount={post.comment_count}
                        tags={post.tags}
                        slug={post.slug}
                      />
                    ))}
                  </div>

                  {/* 더보기 버튼 */}
                  {hasMorePosts && (
                    <div className="mt-8 text-center">
                      <Button
                        variant="outline"
                        onClick={handleLoadMorePosts}
                        disabled={isLoadingPosts}
                        className="w-full md:w-[200px]"
                      >
                        {isLoadingPosts ? '로딩중...' : '더보기'}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4 text-gray-500">아직 좋아요를 한 게시물이 없어요</div>
                  <Button 
                    onClick={() => router.push('/posts')}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    게시물 보러가기
                  </Button>
                </div>
              )}
            </>
          )

        // 다른 탭들의 컨텐츠는 나중에 구현
        default:
          return null
    }
  }

  // 내가 쓴 후기 목록 가져오기
  const fetchMyReviews = async (pageNumber: number) => {
    try {
      setIsLoadingMyReviews(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data, error } = await supabase
        .rpc('get_my_reviews', {
          p_user_id: session.user.id,
          p_page_size: 4,
          p_page: pageNumber
        })

      console.log('내 리뷰 데이터:', data)

      if (error) throw error

      if (data) {
        const formattedData = data.map(review => ({
          id: review.id,
          beforeImage: review.before_image || '',
          afterImage: review.after_image || '',
          rating: Number(review.rating) || 0,
          content: review.content || '',
          author: review.author_name || '',
          authorImage: review.author_image || '',
          date: review.created_at,
          treatmentName: review.treatment_name || '',
          categories: review.categories?.map(cat => cat.depth2_name) || [],
          isAuthenticated: true,
          location: review.location || '',
          clinicName: review.hospital_name || '',
          commentCount: Number(review.comment_count) || 0,
          viewCount: Number(review.view_count) || 0
        }))

        if (pageNumber === 1) {
          setMyReviews(formattedData)
        } else {
          setMyReviews(prev => [...prev, ...formattedData])
        }
        setHasMoreMyReviews(data[0]?.has_next_page || false)
      }
    } catch (error) {
      console.error('내 리뷰 목록 로딩 중 에러:', error)
    } finally {
      setIsLoadingMyReviews(false)
    }
  }

  // 더보기 핸들러
  const handleLoadMoreMyReviews = async () => {
    const nextPage = myReviewPage + 1
    await fetchMyReviews(nextPage)
    setMyReviewPage(nextPage)
  }

  // 내가 쓴 댓글 목록 가져오기
  const fetchMyComments = async (pageNumber: number) => {
    try {
      setIsLoadingComments(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data, error } = await supabase
        .rpc('get_my_comments', {
          p_user_id: session.user.id,
          p_page_size: 4,
          p_page: pageNumber
        })

      console.log('내 댓글 데이터:', data)

      if (error) throw error

      if (data) {
        if (pageNumber === 1) {
          setMyComments(data)
        } else {
          setMyComments(prev => [...prev, ...data])
        }
        setHasMoreComments(data[0]?.has_next_page || false)
      }
    } catch (error) {
      console.error('내 댓글 목록 로딩 중 에러:', error)
    } finally {
      setIsLoadingComments(false)
    }
  }

  // 더보기 핸들러
  const handleLoadMoreComments = async () => {
    const nextPage = commentPage + 1
    await fetchMyComments(nextPage)
    setCommentPage(nextPage)
  }

  // 내 활동 탭 변경시 데이터 로딩
  useEffect(() => {
    if (activityTab === 'Reviews') {
      fetchMyReviews(1)
    } else if (activityTab === 'Comments') {
      fetchMyComments(1)
    }
  }, [activityTab])

  // 베트남 전화번호 정규식
  const vietnamPhoneRegex = /^(\+84|84|0)?[1-9][0-9]{8}$/

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
                {isUploading ? (
                  <div className="rounded-full w-full h-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                  </div>
                ) : (
                  <>
                    {profileData?.avatar_url ? (
                      <img
                        src={profileData.avatar_url}
                        alt="Profile"
                        className="rounded-full w-full h-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="rounded-full w-full h-full border-2 border-gray-200 bg-blue-100 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-blue-600">
                          {userNickname 
                            ? userNickname.charAt(0).toUpperCase()
                            : userEmail.charAt(0).toUpperCase()
                          }
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                      capture="environment"
                    />
                    <button 
                      className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Pencil className="w-3 h-3 text-gray-500" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <label className="text-sm text-gray-500 mb-1 block">E-mail</label>
                    <div className="flex items-center">
                      <input
                        type="email"
                        value={userEmail}
                        disabled
                        className="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-700"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-sm text-gray-500 mb-1 block">Nick Name</label>
                    <div className="flex items-center relative">
                      {isEditingNickname ? (
                        <div className="w-full">
                          <input
                            type="text"
                            value={editingNickname}
                            onChange={(e) => {
                              setEditingNickname(e.target.value)
                              setNicknameError('')  // 입력 시 에러 메시지 초기화
                            }}
                            onKeyDown={handleNicknameEdit}
                            onBlur={() => {
                              if (!nicknameError) {  // 에러가 없을 때만 편집 모드 종료
                                setIsEditingNickname(false)
                              }
                            }}
                            className={`w-full px-3 py-2 bg-white border rounded-md text-gray-700 
                              ${nicknameError ? 'border-red-500' : 'border-gray-200'}`}
                            autoFocus
                          />
                          {nicknameError && (
                            <p className="text-red-500 text-xs mt-1">{nicknameError}</p>
                          )}
                        </div>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={userNickname}
                            disabled
                            className="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-700"
                            placeholder="닉네임을 설정해주세요"
                          />
                          <button 
                            className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-100 p-1 rounded-full transition-colors"
                            onClick={() => setIsEditingNickname(true)}
                          >
                            <Edit3 className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-sm text-gray-500 mb-1 block">Phone Number</label>
                    <div className="flex items-center relative">
                      {isEditingPhone ? (
                        <input
                          type="tel"
                          value={editingPhone}
                          onChange={(e) => setEditingPhone(e.target.value)}
                          onKeyDown={handlePhoneEdit}
                          onBlur={() => setIsEditingPhone(false)}
                          className="w-full px-3 py-2 bg-white border rounded-md text-gray-700"
                          autoFocus
                        />
                      ) : (
                        <>
                          <input
                            type="tel"
                            value={userPhone}
                            disabled
                            className="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-700"
                          />
                          <button 
                            className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-100 p-1 rounded-full transition-colors"
                            onClick={() => setIsEditingPhone(true)}
                          >
                            <Edit3 className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                          </button>
                        </>
                      )}
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
                    {bodyParts.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect({
                          id: Number(category.id),
                          label: category.label || '',
                          name: category.label || ''
                        })}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full border 
                          ${selectedCategories.find(c => c.id === String(category.id))
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50'
                          } text-sm`}
                        disabled={selectedCategories.length >= 5 && !selectedCategories.find(c => c.id === String(category.id))}
                      >
                        <div className={`w-4 h-4 rounded-full border ${
                          selectedCategories.find(c => c.id === String(category.id))
                            ? 'border-pink-500 bg-pink-500'
                            : 'border-gray-300'
                        }`} />
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">시술방법</p>
                  <div className="flex flex-wrap gap-2">
                    {treatmentMethods.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect({
                          id: Number(category.id),
                          label: category.label || '',
                          name: category.label || ''
                        })}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full border 
                          ${selectedCategories.find(c => c.id === String(category.id))
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50'
                          } text-sm`}
                        disabled={selectedCategories.length >= 5 && !selectedCategories.find(c => c.id === String(category.id))}
                      >
                        <div className={`w-4 h-4 rounded-full border ${
                          selectedCategories.find(c => c.id === String(category.id))
                            ? 'border-pink-500 bg-pink-500'
                            : 'border-gray-300'
                        }`} />
                        {category.label}
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
              <h3 className="text-base font-medium mb-4">관심 지역 설정</h3>
              <div className="flex flex-wrap gap-2">
                <div className="w-full">
                  {/* 도시 선택 버튼들 */}
                  <div className="flex flex-wrap gap-2">
                    {cities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelect(city)}
                        className={`px-4 py-2 rounded-md text-sm transition-colors
                          ${selectedCity?.id === city.id
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white border border-gray-200 hover:border-blue-500'
                          }`}
                      >
                        {city.name_vi}
                      </button>
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
            {activityTab === 'Reviews' ? (
              <>
                <h3 className="text-lg font-medium mb-4">
                  내가 쓴 후기 {myReviews[0]?.total_count || 0}개
                </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myReviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        id={review.id}
                        beforeImage={review.beforeImage}
                        afterImage={review.afterImage}
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

                  {/* 더보기 버튼 */}
                  {hasMoreMyReviews && (
                    <div className="mt-8 text-center">
                      <Button
                        variant="outline"
                        onClick={handleLoadMoreMyReviews}
                        disabled={isLoadingMyReviews}
                        className="w-full md:w-[200px]"
                      >
                        {isLoadingMyReviews ? '로딩중...' : '더보기'}
                      </Button>
                    </div>
                  )}
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-4">
                  내가 쓴 댓글 {myComments[0]?.total_count || 0}개
                </h3>
                <div className="space-y-4">
                  {myComments.map((comment) => (
                    <div key={comment.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                      <div className="p-4 border-b">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-pink-500" />
                            <span className="text-sm font-medium text-pink-500">시술후기</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 
                          className="text-base font-medium mb-2 hover:text-blue-500 cursor-pointer"
                          onClick={() => router.push(`/reviews/detail?id=${comment.review_id}`)}
                        >
                          {comment.review_title || '제목 없음'}
                        </h4>
                        <div className="text-sm text-gray-600 mb-2">
                          <div className="text-gray-500 mb-1">{comment.treatment_title}</div>
                          <p>{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 더보기 버튼 */}
                  {hasMoreComments && (
                    <div className="mt-8 text-center">
                      <Button
                        variant="outline"
                        onClick={handleLoadMoreComments}
                        disabled={isLoadingComments}
                        className="w-full md:w-[200px]"
                      >
                        {isLoadingComments ? '로딩중...' : '더보기'}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 