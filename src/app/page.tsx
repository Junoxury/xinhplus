'use client'

import { CategoryIcon } from '@/components/category/CategoryIcon'
import { TreatmentCard } from '@/components/treatments/TreatmentCard'
import { ClinicCard } from '@/components/clinics/ClinicCard'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { Banner } from '@/components/home/Banner'
import { useRef, MouseEvent, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShortCard } from '@/components/shorts/ShortCard'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// 기존 popularTreatments 배열 대신 상태로 관리
interface PopularTreatment {
  id: string;
  image: string;
  title: string;
  description: string;
  clinic: string;
  location: string;
  originalPrice: number;
  discountRate: number;
  rating: number;
  reviewCount: number;
  categories: string[];
  likes: number;
  isAd: boolean;
  isNew: boolean;
}

// 도시 타입 정의 추가
interface City {
  id: number;
  name_vi: string;
}

// 병원 타입 정의 추가
interface Hospital {
  id: number;
  name: string;
  description: string;
  thumbnail_url: string;
  city_name: string;
  rating: number;
  comment_count: number;
  categories: {
    depth2_id: number;
    depth2_name: string;
    depth3_list: {
      id: number;
      name: string;
    }[];
  }[];
  is_recommended: boolean;
  is_advertised: boolean;
  is_member: boolean;
}

// 리뷰 타입 정의
interface Review {
  id: number;
  before_image_url: string;
  after_image_url: string;
  rating: number;
  content: string;
  author_name: string;
  created_at: string;
  treatment_name: string;
  categories: string[];
  additional_images_count: number;
  is_locked: boolean;
  city_name: string;
  hospital_name: string;
  comment_count: number;
  view_count: number;
}

const featuredClinics = [
  {
    id: '1',
    title: 'DR.AD BEAUTY CLINIC',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F38d62b3c8d715e4091438b05bf7cd223%2Fbanner_img_1718961017.jpg&w=384&q=75',
    description: '20년 전통의 성형외과 전문의',
    location: 'Hanoi',
    rating: 4.8,
    reviewCount: 1234,
    categories: ['Pore', 'Bottom eyelid', 'Eyelid surgery', '+8'],
    isRecommended: true,
    isAd: true,
    isMember: true
  },
  {
    id: '2',
    title: '뷰티라인 성형외과',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fd92aac925140c6a03aa0099e80362f55%2Fbanner_img_1736901184.jpg&w=384&q=75',
    description: '자연스러운 라인 교정 전문',
    location: 'Hanoi',
    rating: 4.7,
    reviewCount: 890,
    categories: ['Nose', 'Face contouring', 'Lifting'],
    isRecommended: true,
    isMember: true
  },
  {
    id: '3',
    title: '미소성형외과',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F25aacb6c5c5ffe729af9b47b4f2b0773%2Fbanner_img_1732092008.jpg&w=384&q=75',
    description: '맞춤형 성형 디자인',
    location: 'Ho Chi Minh',
    rating: 4.9,
    reviewCount: 756,
    categories: ['Eye', 'Nose', 'Face'],
    isAd: true
  },
  {
    id: '4',
    title: '라인성형외과',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fc72d8a826738d4b27a88c53797c3e6a4%2Fbanner_img_1720688591.jpg&w=384&q=75',
    description: '최신 장비 보유 전문의',
    location: 'Da Nang',
    rating: 4.6,
    reviewCount: 543,
    categories: ['Skin', 'Anti-aging', 'Lifting'],
    isRecommended: true
  },
  {
    id: '5',
    title: '뷰티클리닉',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F68f2c0df4eed8ca4376ffc27f879d925%2Fbanner_img_1732681027.jpg&w=384&q=75',
    description: '최신 장비 보유 전문의',
    location: 'Hanoi',
    rating: 4.6,
    reviewCount: 543,
    categories: ['Dental', 'Hair', 'Skin care'],
    isMember: true
  }
]

const recentReviews = [
  {
    id: '1',
    beforeImage: 'https://images.babitalk.com/reviews/761e1935f7c55175f7c5d542fa5eb0fb/small/0d5b1c4c7f720f698946c7f6ab08f687/0.jpg',
    afterImage: 'https://images.babitalk.com/reviews/761e1935f7c55175f7c5d542fa5eb0fb/small/0d5b1c4c7f720f698946c7f6ab08f687/0.jpg',
    rating: 5,
    content: '정말 만족스러운 결과였습니다. 자연스러운 라인으로 잘 수정해주셨어요. 처음에는 걱정이 많았는데, 상담부터 수술까지 정말 꼼꼼하게 설명해주시고 케어해주셔서 안심하고 진행할 수 있었습니다. 특히 수술 후 관리도 철저히 해주셔서 회복도 빠르게 됐어요. 주변 지인들도 자연스러워 보인다고 칭찬해주셔서 정말 기분이 좋습니다. 고민하시는 분들께 적극 추천드립니다! 앞으로도 꾸준히 관리 받으러 올 예정입니다.',
    author: '김**',
    date: '2024.03.15',
    treatmentName: '듀얼픽스 광대축소',
    categories: ['Pore', 'Bottom eyelid', 'Eyelid surgery'],
    additionalImagesCount: 4,
    isLocked: true,
    location: '강남구',
    clinicName: '뷰티클리닉',
    commentCount: 10,
    viewCount: 1234
  },
  {
    id: '2',
    beforeImage: 'https://images.babitalk.com/reviews/11f7cd5a760501fb579c71c8568dec16/small/0d5b1c4c7f720f698946c7f6ab08f687/0.jpg',
    afterImage: 'https://images.babitalk.com/reviews/11f7cd5a760501fb579c71c8568dec16/small/0d5b1c4c7f720f698946c7f6ab08f687/0.jpg',
    rating: 4,
    content: '상담부터 수술까지 친절하게 설명해주시고 결과도 좋았습니다. 눈매교정과 눈밑지방 재배치를 동시에 진행했는데, 자연스러운 라인으로 잘 수정해주셨어요. 수술 후 붓기가 걱정됐는데 회복 기간도 생각보다 빨랐고, 지금은 완전히 자연스러워졌습니다. 특히 눈밑 지방 재배치 후에 눈밑 다크서클이 개선되어서 화장 없이도 좋아 보여요. 수술 전후 관리도 꼼꼼히 해주셔서 감사합니다.',
    author: '이**',
    date: '2024.03.14',
    treatmentName: '눈매교정',
    categories: ['Eyelid surgery', 'Bottom eyelid'],
    additionalImagesCount: 2,
    location: '강남구',
    clinicName: '뷰티클리닉',
    commentCount: 5,
    viewCount: 856
  },
  {
    id: '3',
    beforeImage: 'https://images.babitalk.com/reviews/a6d4fcd97737723d01a6af30c8d10407/small/0d5b1c4c7f720f698946c7f6ab08f687/0.jpg',
    afterImage: 'https://images.babitalk.com/reviews/a6d4fcd97737723d01a6af30c8d10407/small/0d5b1c4c7f720f698946c7f6ab08f687/0.jpg',
    rating: 4,
    content: '20대 후반부터 눈가 주름이 신경쓰여서 고민하다가 방문했는데, 정말 만족스러운 결과를 얻었습니다. 선생님께서 제 얼굴형과 특징을 고려해서 자연스러운 눈매를 만들어주셨어요. 수술 과정도 생각보다 편안했고, 회복도 빨랐습니다. 수술 후 붓기 관리부터 실밥 제거까지 꼼꼼하게 챙겨주셔서 감사했어요. 이제는 거울을 볼 때마다 기분이 좋아집니다. 다른 시술도 이곳에서 받고 싶어요!',
    author: '이**',
    date: '2024.03.14',
    treatmentName: '눈매교정',
    categories: ['Eyelid surgery', 'Bottom eyelid'],
    additionalImagesCount: 3,
    isLocked: true,
    location: '강남구',
    clinicName: '뷰티클리닉',
    commentCount: 7,
    viewCount: 2431
  }
]

// shorts 데이터 추가
const popularShorts = [
  {
    id: 's1',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fd63eb6911fceb3ec8341be1df5c73b92%2Fbanner_img_1735796998.jpg&w=384&q=75',
    title: '실제 수술 현장 - 자연스러운 눈매교정 LIVE',
    location: 'Hanoi',
    clinic: 'DR.AD BEAUTY CLINIC',
    categories: ['Eye', 'Bottom eyelid', 'Eyelid surgery']
  },
  {
    id: 's2',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F27e2ccb0cf265a3cb18ce6eff35f4174%2Fbanner_img_1723540041.jpg&w=384&q=75',
    title: '코필러 시술 전후 비교 - 10분 만에 달라진 코라인',
    location: 'Ho Chi Minh',
    clinic: '뷰티라인 성형외과',
    categories: ['Nose', 'Filler']
  },
  {
    id: 's3',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fc50a6cece7c2170e489c6582a13888c4%2Fbanner_img_1731635515.jpg&w=384&q=75',
    title: '울쎄라 리프팅 시술 과정 - 피부 탄력 개선',
    location: 'Da Nang',
    clinic: '미소성형외과',
    categories: ['Lifting', 'Skin care', 'Anti-aging']
  },
  {
    id: 's4',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2F89de9f71c6e88351e0f8f02db5cad770%2Fbanner_img_1724718171.jpg&w=384&q=75',
    title: '실제 광대축소 수술 - 수술실 LIVE',
    location: 'Hanoi',
    clinic: '라인성형외과',
    categories: ['Face', 'Jaw', 'Face contouring']
  },
  {
    id: 's5',
    image: 'https://web.babitalk.com/_next/image?url=https%3A%2F%2Fimages.babitalk.com%2Fimages%2Fde8c515ffae8cc73a0b0593dde02a79d%2Fbanner_img_1693882962.jpg&w=384&q=75',
    title: '눈밑지방 재배치 수술 과정 - 다크서클 개선',
    location: 'Ho Chi Minh',
    clinic: '뷰티클리닉',
    categories: ['Eye', 'Bottom eyelid', 'Dark circle']
  }
]

// TOP5 데이터 추가
const topSearches = [
  "1. 듀얼픽스 광대축소",
  "2. 눈매교정",
  "3. 이마 지방이식",
  "4. 코끝 성형",
  "5. 피부 재생"
];

function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e: MouseEvent) => {
    isDown.current = true
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grabbing'
      startX.current = e.pageX - scrollRef.current.offsetLeft
      scrollLeft.current = scrollRef.current.scrollLeft
    }
  }

  const onMouseLeave = () => {
    isDown.current = false
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'
    }
  }

  const onMouseUp = () => {
    isDown.current = false
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'
    }
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!isDown.current) return
    e.preventDefault()
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft
      const walk = (x - startX.current) * 2
      scrollRef.current.scrollLeft = scrollLeft.current - walk
    }
  }

  const scrollTo = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="group relative">
      {/* 좌우 화살표 */}
      <button
        onClick={() => scrollTo('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-x-1/2"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => scrollTo('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-1/2"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 스크롤 컨테이너 */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide horizontal-scroll -mx-4 px-4"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {children}
      </div>
    </div>
  )
}

// 카테고리 데이터 타입 정의
interface CategoryData {
  categories: any[];
  subCategories: any[];
}

export default function HomePage() {
  const [bodyPartsData, setBodyPartsData] = useState<CategoryData>({ categories: [], subCategories: [] })
  const [treatmentMethodsData, setTreatmentMethodsData] = useState<CategoryData>({ categories: [], subCategories: [] })
  const router = useRouter()
  const [popularTreatments, setPopularTreatments] = useState<PopularTreatment[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)  // 이것만 유지
  const [localPopularTreatments, setLocalPopularTreatments] = useState<Record<number, any[]>>({})
  const [recommendedClinics, setRecommendedClinics] = useState<Hospital[]>([])
  const [latestReviews, setLatestReviews] = useState<Review[]>([])

  // 카테고리 데이터 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 신체 부위 카테고리 (parent_id = 1)
        const { data: bodyParts, error: bodyError } = await supabase
          .rpc('get_categories', { p_parent_depth1_id: 1 })

        if (bodyError) throw bodyError
        
        console.log('신체 부위 카테고리 데이터:', {
          원본데이터: bodyParts,
          카테고리: bodyParts?.categories,
          서브카테고리: bodyParts?.subCategories
        })
        
        setBodyPartsData(bodyParts || { categories: [], subCategories: [] })

        // 시술 방법 카테고리 (parent_id = 2)
        const { data: treatmentMethods, error: treatmentError } = await supabase
          .rpc('get_categories', { p_parent_depth1_id: 2 })

        if (treatmentError) throw treatmentError
        
        console.log('시술 방법 카테고리 데이터:', {
          원본데이터: treatmentMethods,
          카테고리: treatmentMethods?.categories,
          서브카테고리: treatmentMethods?.subCategories
        })
        
        setTreatmentMethodsData(treatmentMethods || { categories: [], subCategories: [] })

      } catch (error) {
        console.error('카테고리 데이터 로드 실패:', error)
      }
    }

    fetchCategories()
  }, [])

  // 인기 시술 데이터 로드
  useEffect(() => {
    const fetchPopularTreatments = async () => {
      try {
        const { data, error } = await supabase.rpc('get_treatments', {
          p_is_advertised: true,
          p_sort_by: 'view_count',
          p_limit: 8,
          p_offset: 0
        })

        if (error) throw error

        // RPC 응답을 TreatmentCard props 형식으로 변환
        const formattedTreatments = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          hospital_name: item.hospital_name,
          city_name: item.city_name,
          thumbnail_url: item.thumbnail_url,
          price: item.price,
          discount_price: item.discount_price,
          discount_rate: item.discount_rate,
          rating: Number(item.rating),
          comment_count: item.comment_count,
          categories: item.categories || [],
          is_advertised: item.is_advertised,
          is_recommended: item.is_recommended
        }))

        setPopularTreatments(formattedTreatments)

      } catch (error) {
        console.error('인기 시술 데이터 로드 실패:', error)
      }
    }

    fetchPopularTreatments()
  }, [])

  // 도시 데이터 로드
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('id, name_vi')
          .eq('is_active', true)
          .order('sort_order')

        if (error) throw error
        
        setCities(data || [])
      } catch (error) {
        console.error('도시 데이터 로드 실패:', error)
      }
    }

    fetchCities()
  }, [])

  // 지역별 인기 시술 데이터 로드
  useEffect(() => {
    const fetchLocalTreatments = async () => {
      try {
        const { data, error } = await supabase.rpc('get_treatments', {
          p_city_id: selectedLocation,  // null이면 모든 도시의 데이터를 가져옴
          p_limit: 8,
          p_offset: 0
        })

        if (error) throw error

        const formattedTreatments = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          hospital_name: item.hospital_name,
          city_name: item.city_name,
          thumbnail_url: item.thumbnail_url,
          price: item.price,
          discount_price: item.discount_price,
          discount_rate: item.discount_rate,
          rating: Number(item.rating),
          comment_count: item.comment_count,
          categories: item.categories || [],
          is_advertised: item.is_advertised,
          is_recommended: item.is_recommended
        }))

        if (selectedLocation === null) {
          // 선택된 도시가 없을 때는 전체 데이터를 저장
          setLocalPopularTreatments({ 0: formattedTreatments })
        } else {
          // 특정 도시가 선택됐을 때
          setLocalPopularTreatments(prev => ({
            ...prev,
            [selectedLocation]: formattedTreatments
          }))
        }

      } catch (error) {
        console.error('지역별 인기 시술 데이터 로드 실패:', error)
      }
    }

    fetchLocalTreatments()
  }, [selectedLocation])

  // 지역별 인기 시술 섹션 렌더링 조건부 처리
  const selectedTreatments = selectedLocation !== null 
    ? localPopularTreatments[selectedLocation] 
    : localPopularTreatments[0] || []  // 선택된 도시가 없을 때는 전체 데이터 사용

  const handleCategoryClick = (item: any) => {
    router.push(`/treatments?depth2=${item.id}`)
  }

  // 추천 병원 데이터 로드
  useEffect(() => {
    const fetchRecommendedClinics = async () => {
      try {
        const { data, error } = await supabase.rpc('get_hospitals_list', {
          p_city_id: null,
          p_depth2_body_category_id: null,
          p_depth2_treatment_category_id: null,
          p_depth3_body_category_id: null,
          p_depth3_treatment_category_id: null,
          p_is_advertised: null,
          p_is_recommended: true,
          p_is_member: null,
          p_sort_by: 'views',
          p_page_size: 8,
          p_page: 1
        })

        if (error) throw error

        // RPC 응답을 ClinicCard props 형식으로 변환
        const formattedClinics = data.map((item: any) => {
          // categories 데이터 구조 확인
          console.log('원본 병원 데이터:', {
            id: item.id,
            name: item.hospital_name,
            categories: item.categories,
            type: typeof item.categories,
            isArray: Array.isArray(item.categories)
          });

          // categories 데이터 처리 - depth2의 name과 id 추출
          let processedCategories = [];
          try {
            if (item.categories) {
              // 객체인 경우 배열로 변환
              const categoriesArray = Array.isArray(item.categories) 
                ? item.categories 
                : Object.values(item.categories);

              processedCategories = categoriesArray.map(cat => ({
                id: cat.depth2?.id,
                name: cat.depth2?.name
              })).filter(cat => cat.id && cat.name);  // 유효한 데이터만 필터
            }
          } catch (error) {
            console.error('카테고리 처리 중 오류:', error);
          }

          console.log('처리된 카테고리:', processedCategories);

          return {
            id: item.id,
            title: item.hospital_name,
            description: item.description || '',
            image: item.thumbnail_url || '/images/placeholder.png',
            location: item.city_name,
            rating: Number(item.average_rating || 0),
            viewCount: item.view_count || 0,
            categories: processedCategories,
            isRecommended: Boolean(item.is_recommended),
            isAd: Boolean(item.is_advertised),
            isMember: Boolean(item.is_member)
          }
        })

        console.log('변환된 병원 데이터:', formattedClinics);
        setRecommendedClinics(formattedClinics)

      } catch (error) {
        console.error('추천 병원 데이터 로드 실패:', error)
      }
    }

    fetchRecommendedClinics()
  }, [])

  // 실시간 후기 데이터 로드
  useEffect(() => {
    const fetchLatestReviews = async () => {
      try {
        const { data, error } = await supabase.rpc('get_reviews', {
          p_limit: 6,
          p_offset: 0,
          p_sort_by: 'view_count'
        });

        if (error) throw error;

        // RPC 응답을 기존 ReviewCard 형식에 맞게 변환
        const formattedReviews = data.map((item: any) => ({
          id: item.id,
          beforeImage: item.before_image || '/images/placeholder.png',
          afterImage: item.after_image || '/images/placeholder.png',
          rating: Number(item.rating || 0),
          content: item.content || '',
          author: item.author_name || '익명',
          date: new Date(item.created_at).toLocaleDateString(),
          treatmentName: item.title || '',
          categories: Array.isArray(item.categories) ? item.categories : [],
          additionalImagesCount: Number(item.additional_images_count || 0),

          location: item.location || '',
          clinicName: item.hospital_name || '',
          commentCount: Number(item.comment_count || 0),
          viewCount: Number(item.view_count || 0)
        }));

        setLatestReviews(formattedReviews);

      } catch (error) {
        console.error('실시간 후기 데이터 로드 실패:', error);
      }
    };

    fetchLatestReviews();
  }, []);

  return (
    <main className="min-h-screen">
      <Banner />
      
      {/* 카테고리 섹션 */}
      <section className="section-category py-4 md:py-12">
        <div className="container">
          {/* 모바일 뷰 */}
          <div className="md:hidden">
            <HorizontalScroll>
              {[...bodyPartsData.categories, ...treatmentMethodsData.categories].map((item) => (
                <Link 
                  key={`${item.id}-${item.label}`}
                  href={`/treatments?depth2=${item.id}`}
                  className="w-[60px] flex-shrink-0"
                >
                  <CategoryIcon 
                    icon="/images/placeholdericon.png"
                    label={item.label}
                    isSelected={false}
                  />
                </Link>
              ))}
            </HorizontalScroll>
          </div>

          {/* PC 뷰 */}
          <div className="hidden md:flex space-x-8 w-full">
            {/* 첫 번째 영역: 부위 아이콘 (50%) */}
            <div className="flex flex-col w-1/2">
              <h2 className="text-lg font-bold mb-4">부위</h2>
              <div className="grid grid-cols-6 gap-2">
                {bodyPartsData.categories.map((category) => (
                  <Link 
                    key={`body-${category.id}`}
                    href={`/treatments?depth2=${category.id}`}
                  >
                    <CategoryIcon 
                      icon="/images/placeholdericon.png"
                      label={category.label}
                      isSelected={false}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* 두 번째 영역: 시술 아이콘 (25%) */}
            <div className="flex flex-col w-1/4">
              <h2 className="text-lg font-bold mb-4">시술</h2>
              <div className="grid grid-cols-4 gap-2">
                {treatmentMethodsData.categories.map((method) => (
                  <Link 
                    key={`treatment-${method.id}`}
                    href={`/treatments?depth2=${method.id}`}
                  >
                    <CategoryIcon 
                      icon="/images/placeholdericon.png"
                      label={method.label}
                      isSelected={false}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* 세 번째 영역: TOP 5 (25%) */}
            <div className="flex flex-col w-1/4">
              <h2 className="text-lg font-bold mb-4">시술 조회수 TOP 5</h2>
              <ul className="space-y-2">
                {popularTreatments.slice(0, 5).map((treatment) => (
                  <li key={treatment.id} className="flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white font-bold rounded-full mr-2">
                      {popularTreatments.indexOf(treatment) + 1}
                    </span>
                    <span className="text-md font-medium">{treatment.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 모바일 TOP5 섹션 */}
      <section className="md:hidden py-3 bg-gray-50">
        <div className="container">
          <div className="-mx-4 px-4 overflow-hidden">
            <div className="animate-scrollText whitespace-nowrap flex gap-6">
              {[...topSearches, ...topSearches].map((item, index) => {
                const [rank, title] = item.split('. ');
                return (
                  <span 
                    key={`search-${index}-${item}`}
                    className="text-sm inline-flex items-center gap-1.5"
                  >
                    <span className="font-bold text-purple-600">{rank}.</span>
                    <span className="text-gray-600">{title}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 인기 시술 섹션 */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">인기 시술</h2>
            <Link 
              href="/treatments" 
              className="text-sm text-muted-foreground h-8 gap-1 inline-flex items-center hover:text-foreground"
            >
                전체보기
                <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {/* PC 버전 - 슬라이드 */}
          <div className="hidden md:block">
            <HorizontalScroll>
              <div className="flex gap-4">
                {popularTreatments.map((treatment) => (
                  <Link 
                    key={treatment.id}
                    href={`/treatments/detail?id=${treatment.id}`}
                    className="w-[300px] flex-shrink-0"
                  >
                    <TreatmentCard {...treatment} disableLink />
                  </Link>
                ))}
              </div>
            </HorizontalScroll>
          </div>
          {/* 모바일 버전 - 세로 리스트 */}
          <div className="md:hidden flex flex-col gap-4">
            {popularTreatments.map((treatment) => (
              <Link 
                key={treatment.id}
                href={`/treatments/detail?id=${treatment.id}`}
              >
                <TreatmentCard {...treatment} disableLink />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 지역별 인기 시술 섹션 */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container">
          {/* 헤더 영역 - 모바일에서는 세로 배치 */}
          <div className="flex md:flex-row flex-col md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold">나의 지역</h2>
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-1">
                {cities.map((city) => (
                <Button 
                    key={city.id}
                    variant={selectedLocation === city.id ? 'default' : 'outline'}
                    onClick={() => setSelectedLocation(city.id)}
                  className="min-w-[70px] h-8 text-sm"
                >
                    {city.name_vi}
                </Button>
                ))}
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* PC 버전 - 슬라이드 */}
          <div className="hidden md:block">
            <HorizontalScroll>
              <div className="flex gap-4">
                {selectedTreatments?.map((treatment) => (
                  <Link 
                    key={treatment.id}
                    href={`/treatments/detail?id=${treatment.id}`}
                    className="w-[300px] flex-shrink-0"
                  >
                    <TreatmentCard {...treatment} disableLink />
                  </Link>
                ))}
              </div>
            </HorizontalScroll>
          </div>

          {/* 모바일 버전 - 세로 리스트 */}
          <div className="md:hidden flex flex-col gap-4">
            {selectedTreatments?.map((treatment) => (
              <Link 
                key={treatment.id}
                href={`/treatments/detail?id=${treatment.id}`}
              >
                <TreatmentCard {...treatment} disableLink />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 추천 병원 섹션 */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#F5F0FF' }}>
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">추천 병원</h2>
            <Link 
              href="/clinics" 
              className="text-sm text-muted-foreground h-8 gap-1 inline-flex items-center hover:text-foreground"
            >
                전체보기
                <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <HorizontalScroll>
            <div className="flex gap-4">
              {recommendedClinics.map((clinic) => (
                <Link 
                  key={clinic.id}
                  href={`/clinics/detail?id=${clinic.id}`}
                  className="w-[calc(50vw-2rem)] md:w-[300px] flex-shrink-0"
                >
                  <ClinicCard {...clinic} disableLink />
                </Link>
              ))}
            </div>
          </HorizontalScroll>
        </div>
      </section>
      {/* 인기 Shorts 섹션 */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">인기 Shorts</h2>
            <Button variant="ghost" className="text-sm text-muted-foreground h-8 gap-1" asChild>
              <a href="/shorts">
                전체보기
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* PC 버전 - 슬라이드 */}
          <div className="hidden md:block">
            <HorizontalScroll>
              <div className="flex gap-4">
                {popularShorts.map((short) => (
                  <div key={short.id} className="w-[240px] flex-shrink-0">
                    <ShortCard {...short} />
                  </div>
                ))}
              </div>
            </HorizontalScroll>
          </div>

          {/* 모바일 버전 - 한 줄에 2개씩 + 다음 카드 살짝 보이기 */}
          <div className="md:hidden -mx-4 px-4">
            <HorizontalScroll>
              <div className="flex gap-4">
                {popularShorts.map((short) => (
                  <div key={short.id} className="w-[42vw] flex-shrink-0">
                    <ShortCard {...short} />
                  </div>
                ))}
              </div>
            </HorizontalScroll>
          </div>
        </div>
      </section>
      
      {/* 실시간 후기 섹션 */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#F8F9FC' }}>
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">실시간 후기</h2>
            <Button variant="ghost" className="text-sm text-muted-foreground h-8 gap-1" asChild>
              <a href="/reviews">
                전체보기
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="-mx-4 px-4">
            <HorizontalScroll>
              <div className="flex gap-4">
                {latestReviews.map((review) => (
                  <div key={review.id} className="w-[85vw] md:w-[600px] flex-shrink-0">
                    <ReviewCard {...review} />
                  </div>
                ))}
              </div>
            </HorizontalScroll>
          </div>
        </div>
      </section>

      
    </main>
  )
}
