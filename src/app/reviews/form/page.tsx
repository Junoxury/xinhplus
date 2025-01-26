'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { X, Upload, ChevronLeft, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Rating } from '@/components/Rating'
import bodyPartsData from '@/data/bodyParts.json'
import treatmentMethodsData from '@/data/treatmentMethods.json'
import { CategoryIcon } from '@/components/category/CategoryIcon'
import { useDropzone } from 'react-dropzone'

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

export default function ReviewFormPage() {
  const router = useRouter()
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
    const totalCurrentImages = beforeImages.length + afterImages.length;
    const remainingSlots = MAX_TOTAL_IMAGES - totalCurrentImages;
    
    if (remainingSlots <= 0) {
      alert('최대 6장까지만 업로드 가능합니다.');
      return;
    }

    const allowedFiles = files.slice(0, remainingSlots);
    const urls = allowedFiles.map(file => URL.createObjectURL(file));
    setBeforeImages(prev => [...prev, ...urls]);
  }, [beforeImages, afterImages]);

  const handleAfterImageUpload = useCallback((files: File[]) => {
    const totalCurrentImages = beforeImages.length + afterImages.length;
    const remainingSlots = MAX_TOTAL_IMAGES - totalCurrentImages;
    
    if (remainingSlots <= 0) {
      alert('최대 6장까지만 업로드 가능합니다.');
      return;
    }

    const allowedFiles = files.slice(0, remainingSlots);
    const urls = allowedFiles.map(file => URL.createObjectURL(file));
    setAfterImages(prev => [...prev, ...urls]);
  }, [beforeImages, afterImages]);

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
        <form className="space-y-6">
          {/* 병원 선택 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">병원 이름</label>
            <select className="w-full px-3 py-2 border rounded-md">
              <option value="">병원 선택하기</option>
            </select>
          </div>

          {/* 시술 선택 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">시술 내역</label>
            <select className="w-full px-3 py-2 border rounded-md">
              <option value="">시술 선택하기</option>
            </select>
          </div>

          {/* 시술 비용과 날짜 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">시술 비용(VND)</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border rounded-md" 
                placeholder="비용을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">시술 날짜</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border rounded-md" 
              />
            </div>
          </div>

          {/* 별점 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">How do you rate it?</label>
            <Rating value={rating} onChange={setRating} />
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">제목</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="제목을 입력해주세요"
            />
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">후기내용</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border rounded-md resize-none"
              placeholder="시술 후기를 자세히 들려주세요"
            />
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
              className="flex-1 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 