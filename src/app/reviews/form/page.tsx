'use client'

import { useState, useCallback, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { X, Upload, ChevronLeft, Plus, ChevronDown, ChevronUp, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Rating } from '@/components/Rating'
import bodyPartsData from '@/data/bodyParts.json'
import treatmentMethodsData from '@/data/treatmentMethods.json'
import { CategoryIcon } from '@/components/category/CategoryIcon'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'

// 1depth 카테고리 데이터 가공
const beautyCategories = [
  ...bodyPartsData.categories.map(cat => ({ 
    id: cat.id, 
    label: cat.label 
  })),
  ...treatmentMethodsData.categories.map(cat => ({ 
    id: cat.id, 
    label: cat.label 
  }))
]

// 상단에 MAX_TOTAL_IMAGES 상수 추가
const MAX_TOTAL_IMAGES = 6;

// ReviewFormContent 컴포넌트로 기존 내용을 이동
const ReviewFormContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedHospitalId = searchParams.get('hospital_id')
  const preSelectedTreatmentId = searchParams.get('treatment_id')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [rating, setRating] = useState<number>(0)
  const [beforeImages, setBeforeImages] = useState<string[]>([])
  const [afterImages, setAfterImages] = useState<string[]>([])
  const [agreements, setAgreements] = useState({
    all: false,
    service: false,
    privacy: false,
    marketing: false
  })
  const [expandedItems, setExpandedItems] = useState({
    service: false,
    privacy: false
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{id: string, name: string}>>([])
  const [selectedHospital, setSelectedHospital] = useState<{id: string, name: string} | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [treatments, setTreatments] = useState<Array<{id: string, title: string}>>([])
  const [selectedTreatment, setSelectedTreatment] = useState<{id: string, title: string} | null>(null)
  const [isTreatmentFocused, setIsTreatmentFocused] = useState(false)
  const [isTreatmentDropdownOpen, setIsTreatmentDropdownOpen] = useState(false)
  const [formErrors, setFormErrors] = useState<{
    hospital?: string;
    treatment?: string;
    rating?: string;
    title?: string;
    content?: string;
    agreements?: string;
    general?: string;
  }>({})
  const [beforeImageFiles, setBeforeImageFiles] = useState<File[]>([])
  const [afterImageFiles, setAfterImageFiles] = useState<File[]>([])

  // 로그인 체크
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth error:', error)
          router.push('/login?redirect=/reviews/form')
          return
        }

        if (!session?.user) {
          router.push('/login?redirect=/reviews/form')
          return
        }

        // 세션이 있으면 사용자 정보 로깅 (디버깅용)
        console.log('Current session:', session)
      } catch (error) {
        console.error('Session check error:', error)
        router.push('/login?redirect=/reviews/form')
      }
    }

    checkAuth()
  }, [router])

  // URL 파라미터 가져오기
  useEffect(() => {
    const loadPreSelectedData = async () => {
      if (preSelectedHospitalId) {
        // 병원 정보 가져오기
        const { data: hospitalData } = await supabase
          .from('hospitals')
          .select('id, name')
          .eq('id', preSelectedHospitalId)
          .single()

        if (hospitalData) {
          setSelectedHospital(hospitalData)
          
          // 시술 목록 가져오기
          const { data: treatments } = await supabase
            .from('treatments')
            .select('id, title')
            .eq('hospital_id', preSelectedHospitalId)

          if (treatments) {
            setTreatments(treatments)
            
            // 미리 선택된 시술이 있다면 설정 - 숫자 타입으로 변환하여 비교
            if (preSelectedTreatmentId) {
              const selectedTreatment = treatments.find(
                t => t.id === parseInt(preSelectedTreatmentId)
              )
              if (selectedTreatment) {
                setSelectedTreatment(selectedTreatment)
              }
            }
          }
        }
      }
    }

    loadPreSelectedData()
  }, [preSelectedHospitalId, preSelectedTreatmentId])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  })

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const handleBeforeImageUpload = useCallback((files: File[]) => {
    const totalCurrentImages = beforeImageFiles.length + afterImageFiles.length;
    const remainingSlots = MAX_TOTAL_IMAGES - totalCurrentImages;
    
    if (remainingSlots <= 0) {
      alert('최대 6장까지만 업로드 가능합니다.');
      return;
    }

    const allowedFiles = files.slice(0, remainingSlots);
    const urls = allowedFiles.map(file => URL.createObjectURL(file));
    setBeforeImages(prev => [...prev, ...urls]);
    setBeforeImageFiles(prev => [...prev, ...allowedFiles]);
  }, [beforeImageFiles, afterImageFiles]);

  const handleAfterImageUpload = useCallback((files: File[]) => {
    const totalCurrentImages = beforeImageFiles.length + afterImageFiles.length;
    const remainingSlots = MAX_TOTAL_IMAGES - totalCurrentImages;
    
    if (remainingSlots <= 0) {
      alert('최대 6장까지만 업로드 가능합니다.');
      return;
    }

    const allowedFiles = files.slice(0, remainingSlots);
    const urls = allowedFiles.map(file => URL.createObjectURL(file));
    setAfterImages(prev => [...prev, ...urls]);
    setAfterImageFiles(prev => [...prev, ...allowedFiles]);
  }, [beforeImageFiles, afterImageFiles]);

  // 전체 동의 처리 함수
  const handleAllAgreement = (checked: boolean) => {
    setAgreements({
      all: checked,
      service: checked,
      privacy: checked,
      marketing: checked
    })
  }

  // 개별 동의 처리 함수
  const handleSingleAgreement = (key: keyof typeof agreements, checked: boolean) => {
    const newAgreements = {
      ...agreements,
      [key]: checked
    }
    
    // 모든 항목이 체크되었는지 확인
    const allChecked = ['service', 'privacy', 'marketing']
      .every(k => newAgreements[k as keyof typeof agreements])
    
    setAgreements({
      ...newAgreements,
      all: allChecked
    })
  }

  // 펼침 토글 함수
  const toggleExpand = (key: keyof typeof expandedItems) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const { getRootProps: getBeforeRootProps, getInputProps: getBeforeInputProps } = useDropzone({
    onDrop: handleBeforeImageUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true
  });

  const { getRootProps: getAfterRootProps, getInputProps: getAfterInputProps } = useDropzone({
    onDrop: handleAfterImageUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true
  });

  // 검색 함수 추가
  const searchHospitals = useCallback(async (term: string) => {
    if (term.length < 2) {
      setSearchResults([])
      return
    }
    
    setIsSearching(true)
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('id, name')
        .ilike('name', `%${term}%`)
        .limit(10)

      if (error) throw error
      
      setSearchResults(data || [])
    } catch (error) {
      console.error('병원 검색 중 오류 발생:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // debounce 함수 추가
  useEffect(() => {
    const timer = setTimeout(() => {
      searchHospitals(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, searchHospitals])

  // 병원 선택시 treatments 가져오는 함수 추가
  const fetchTreatments = useCallback(async (hospitalId: string) => {
    try {
      const { data, error } = await supabase
        .from('treatments')
        .select('id, title')
        .eq('hospital_id', hospitalId)
        .order('title')

      if (error) throw error
      
      setTreatments(data || [])
    } catch (error) {
      console.error('시술 목록 조회 중 오류 발생:', error)
      setTreatments([])
    }
  }, [])

  // hospital 선택 핸들러 수정
  const handleHospitalSelect = (hospital: {id: string, name: string}) => {
    setSelectedHospital(hospital)
    setSearchTerm('')
    setSearchResults([])
    setSelectedTreatment(null)
    fetchTreatments(hospital.id)
    // 자동으로 시술 드롭다운 열기
    setIsTreatmentDropdownOpen(true)
  }

  // 이미지 업로드 함수 수정
  const uploadImage = async (file: File, type: 'before' | 'after') => {
    try {
      // 1. 파일명 생성 (고유한 이름으로)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${type}/${fileName}`

      // 2. Storage에 업로드
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // 3. 공개 URL 생성
      const {
        data: { publicUrl },
      } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      return publicUrl

    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      throw error
    }
  }

  // 폼 제출 핸들러 수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // 현재 로그인한 사용자 정보 가져오기
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError) {
        console.error('Auth error:', authError)
        router.push('/login?redirect=/reviews/form')
        return
      }

      if (!session?.user) {
        router.push('/login?redirect=/reviews/form')
        return
      }

      // 에러 초기화
      setFormErrors({})
      const errors: typeof formErrors = {}

      // 필수 항목 검사
      if (!selectedHospital) {
        errors.hospital = '병원을 선택해주세요'
      }
      if (!selectedTreatment) {
        errors.treatment = '시술을 선택해주세요'
      }
      if (rating === 0) {
        errors.rating = '별점을 선택해주세요'
      }

      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      
      const title = formData.get('title') as string
      const content = formData.get('content') as string
      const treatmentCost = formData.get('treatment_cost') as string
      const treatmentDate = formData.get('treatment_date') as string

      if (!title?.trim()) {
        errors.title = '제목을 입력해주세요'
      }
      if (!content?.trim()) {
        errors.content = '후기 내용을 입력해주세요'
      }

      // 필수 동의 항목 검사
      if (!agreements.service || !agreements.privacy || !agreements.marketing) {
        errors.agreements = '필수 약관에 모두 동의해주세요'
      }

      // 에러가 있으면 제출 중단
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        const firstError = document.querySelector('[data-error]')
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        return
      }

      // 1. 리뷰 데이터 저장 - author_id를 현재 로그인한 사용자 ID로 설정
      const reviewData = {
        title: title.trim(),
        content: content.trim(),
        rating,
        treatment_cost: treatmentCost ? parseInt(treatmentCost) : null,
        treatment_date: treatmentDate || null,
        author_id: session.user.id, // 현재 로그인한 사용자의 ID
        treatment_id: selectedTreatment?.id,
        hospital_id: selectedHospital?.id,
        status: 'published'
      }

      console.log('리뷰 데이터:', reviewData) // 데이터 확인용 로그

      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single()

      if (reviewError) {
        console.error('리뷰 저장 에러:', reviewError)
        throw reviewError
      }

      console.log('저장된 리뷰:', review) // 저장된 데이터 확인용 로그

      // 2. 이미지 업로드 및 review_images 테이블에 저장
      let imageData = []

      if (beforeImageFiles.length > 0 || afterImageFiles.length > 0) {
        const imagePromises = [
          ...beforeImageFiles.map(async (file, index) => {
            const publicUrl = await uploadImage(file, 'before')
            return {
              review_id: review.id,
              image_url: publicUrl,
              image_type: 'before',
              display_order: index
            }
          }),
          ...afterImageFiles.map(async (file, index) => {
            const publicUrl = await uploadImage(file, 'after')
            return {
              review_id: review.id,
              image_url: publicUrl,
              image_type: 'after',
              display_order: index + beforeImageFiles.length
            }
          })
        ]

        imageData = await Promise.all(imagePromises)
      } else {
        // 이미지가 없는 경우 before, after 각각 기본 이미지 추가
        imageData = [
          {
            review_id: review.id,
            image_url: '/images/noimage.png',
            image_type: 'before',
            display_order: 0
          },
          {
            review_id: review.id,
            image_url: '/images/noimage.png',
            image_type: 'after',
            display_order: 1
          }
        ]
      }

      // 이미지 데이터 저장
      const { error: imagesError } = await supabase
        .from('review_images')
        .insert(imageData)

      if (imagesError) {
        console.error('이미지 저장 에러:', imagesError)
        throw imagesError
      }

      // 리뷰가 성공적으로 저장된 후 통계 업데이트
      if (review) {
        // 1. treatments 테이블 업데이트
        const { error: treatmentUpdateError } = await supabase.rpc('update_treatment_stats', {
          p_treatment_id: selectedTreatment?.id
        })

        if (treatmentUpdateError) {
          console.error('시술 통계 업데이트 에러:', treatmentUpdateError)
        }

        // 2. hospitals 테이블 업데이트
        const { error: hospitalUpdateError } = await supabase.rpc('update_hospital_stats', {
          p_hospital_id: selectedHospital?.id
        })

        if (hospitalUpdateError) {
          console.error('병원 통계 업데이트 에러:', hospitalUpdateError)
        }
      }

      // 성공 메시지 표시 및 페이지 이동
      if (window.confirm('리뷰가 성공적으로 등록되었습니다.')) {
        router.push('/reviews')
      }

    } catch (error) {
      console.error('리뷰 등록 에러:', error)
      setFormErrors({
        general: '리뷰 등록 중 오류가 발생했습니다. 다시 시도해주세요.'
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-1">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-medium">Review 작성하기</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 병원 검색 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              병원 검색
              <span className="text-red-500 ml-1">*</span>
            </label>
            {formErrors.hospital && (
              <p className="text-sm text-red-500 mt-1" data-error>
                {formErrors.hospital}
              </p>
            )}
            <div className="relative">
              <div className={`flex items-center gap-2 w-full px-3 py-2 border rounded-md ${selectedHospital ? 'bg-gray-50' : ''}`}>
                {selectedHospital ? (
                  <div className="flex items-center gap-2 bg-pink-100 px-2 py-1 rounded-md">
                    <span className="text-sm text-pink-700">{selectedHospital.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedHospital(null)
                        setSearchTerm('')
                      }}
                      className="text-pink-700 hover:text-pink-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="병원 검색하기"
                  />
                )}
                <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
              </div>

              {/* 검색 결과 드롭다운 */}
              {searchTerm && !selectedHospital && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">검색중...</div>
                  ) : searchResults.length > 0 ? (
                    <ul className="py-1">
                      {searchResults.map((hospital) => (
                        <li key={hospital.id}>
                          <button
                            type="button"
                            onClick={() => handleHospitalSelect(hospital)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
                          >
                            {hospital.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      검색 결과가 없습니다
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 시술 선택 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              시술 내역
              <span className="text-red-500 ml-1">*</span>
            </label>
            {formErrors.treatment && (
              <p className="text-sm text-red-500 mt-1" data-error>
                {formErrors.treatment}
              </p>
            )}
            <div className="relative">
              <button
                type="button"
                onClick={() => selectedHospital && setIsTreatmentDropdownOpen(!isTreatmentDropdownOpen)}
                className={`w-full px-3 py-2 border rounded-md text-left flex items-center justify-between ${
                  !selectedHospital ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-pink-500'
                }`}
                disabled={!selectedHospital}
              >
                <span className={!selectedTreatment ? 'text-gray-500' : ''}>
                  {selectedTreatment ? selectedTreatment.title : '시술 선택하기'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 ${isTreatmentDropdownOpen ? 'rotate-180' : ''} transition-transform`} />
              </button>

              {/* 시술 선택 드롭다운 */}
              {isTreatmentDropdownOpen && selectedHospital && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {treatments.length > 0 ? (
                    <ul className="py-1">
                      {treatments.map((treatment) => (
                        <li key={treatment.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTreatment(treatment)
                              setIsTreatmentDropdownOpen(false)
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                              selectedTreatment?.id === treatment.id ? 'bg-pink-50 text-pink-700' : ''
                            }`}
                          >
                            {treatment.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      등록된 시술이 없습니다
                    </div>
                  )}
                </div>
              )}

              {!selectedHospital && (
                <p className="text-sm text-gray-500 mt-1">
                  병원을 먼저 선택해주세요
                </p>
              )}
            </div>
          </div>

          {/* 시술 비용과 날짜 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">시술 비용(VND)</label>
              <input 
                name="treatment_cost"
                type="number" 
                className="w-full px-3 py-2 border rounded-md" 
                placeholder="비용을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">시술 날짜</label>
              <input 
                name="treatment_date"
                type="date" 
                className="w-full px-3 py-2 border rounded-md" 
              />
            </div>
          </div>

          {/* 별점 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              How do you rate it?
              <span className="text-red-500 ml-1">*</span>
            </label>
            {formErrors.rating && (
              <p className="text-sm text-red-500 mt-1" data-error>
                {formErrors.rating}
              </p>
            )}
            <Rating value={rating} onChange={setRating} />
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              제목
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              name="title"
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${
                formErrors.title ? 'border-red-500' : ''
              }`}
              placeholder="제목을 입력해주세요"
            />
            {formErrors.title && (
              <p className="text-sm text-red-500 mt-1" data-error>
                {formErrors.title}
              </p>
            )}
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              후기내용
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              name="content"
              rows={4}
              className={`w-full px-3 py-2 border rounded-md resize-none ${
                formErrors.content ? 'border-red-500' : ''
              }`}
              placeholder="시술 후기를 자세히 들려주세요"
            />
            {formErrors.content && (
              <p className="text-sm text-red-500 mt-1" data-error>
                {formErrors.content}
              </p>
            )}
          </div>

          {/* Before 이미지 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Before</label>
            <div {...getBeforeRootProps()} className="cursor-pointer">
              <div className="border-2 border-dashed rounded-lg p-4 hover:border-pink-500 transition-colors">
                <input {...getBeforeInputProps()} />
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Upload className="w-8 h-8" />
                  <p className="text-sm text-center">
                    클릭하여 이미지 선택 또는 드래그하여 업로드
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, JPEG 파일 지원
                  </p>
                  <p className="text-xs text-gray-400 md:hidden">
                    📸 갤러리에서 선택
                  </p>
                </div>
              </div>
            </div>
            {beforeImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {beforeImages.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={url}
                      alt={`Before ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(url)
                        setBeforeImages(prev => prev.filter((_, i) => i !== index))
                      }}
                      className="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* After 이미지 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">After</label>
            <div {...getAfterRootProps()} className="cursor-pointer">
              <div className="border-2 border-dashed rounded-lg p-4 hover:border-pink-500 transition-colors">
                <input {...getAfterInputProps()} />
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Upload className="w-8 h-8" />
                  <p className="text-sm text-center">
                    클릭하여 이미지 선택 또는 드래그하여 업로드
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, JPEG 파일 지원
                  </p>
                  <p className="text-xs text-gray-400 md:hidden">
                    📸 갤러리에서 선택
                  </p>
                </div>
              </div>
            </div>
            {afterImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {afterImages.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={url}
                      alt={`After ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(url)
                        setAfterImages(prev => prev.filter((_, i) => i !== index))
                      }}
                      className="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500">
              Before/After 이미지 총 {beforeImages.length + afterImages.length}/{MAX_TOTAL_IMAGES}
            </p>
          </div>

          {/* 개인정보 동의 */}
          <div className="space-y-4 border rounded-lg p-4">
            {/* 전체 동의 */}
            <label className="flex items-center gap-2 pb-4 border-b">
              <input 
                type="checkbox"
                checked={agreements.all}
                onChange={(e) => handleAllAgreement(e.target.checked)}
                className="rounded text-pink-500 w-5 h-5" 
              />
              <span className="text-base font-medium">전체 동의</span>
            </label>

            {/* 서비스 이용 약관 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={agreements.service}
                    onChange={(e) => handleSingleAgreement('service', e.target.checked)}
                    className="rounded text-pink-500 w-4 h-4" 
                  />
                  <span className="text-sm text-gray-900">[필수] 서비스 이용 약관</span>
                </label>
                <button 
                  type="button"
                  onClick={() => toggleExpand('service')}
                  className="p-1"
                >
                  {expandedItems.service ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              {expandedItems.service && (
                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                  Lorem ipsum dolor sit amet consectetur... {/* 서비스 이용 약관 내용 */}
                </div>
              )}
            </div>

            {/* 개인정보 수집 이용 동의 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={(e) => handleSingleAgreement('privacy', e.target.checked)}
                    className="rounded text-pink-500 w-4 h-4" 
                  />
                  <span className="text-sm text-gray-900">[필수] 개인정보 수집이용 동의</span>
                </label>
                <button 
                  type="button"
                  onClick={() => toggleExpand('privacy')}
                  className="p-1"
                >
                  {expandedItems.privacy ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              {expandedItems.privacy && (
                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                  Lorem ipsum dolor sit amet consectetur... {/* 개인정보 수집 이용 동의 내용 */}
                </div>
              )}
            </div>

            {/* 민감정보 수집 이용 동의 */}
            <div>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={agreements.marketing}
                  onChange={(e) => handleSingleAgreement('marketing', e.target.checked)}
                  className="rounded text-pink-500 w-4 h-4" 
                />
                <span className="text-sm text-gray-900">[필수] 민감정보 수집이용 동의</span>
              </label>
            </div>
          </div>

          {/* 동의 항목 에러 표시 */}
          {formErrors.agreements && (
            <p className="text-sm text-red-500 mt-1" data-error>
              {formErrors.agreements}
            </p>
          )}

          {/* 버튼 */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 border rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:bg-gray-300"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 메인 페이지 컴포넌트
export default function ReviewFormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <ReviewFormContent />
    </Suspense>
  )
} 