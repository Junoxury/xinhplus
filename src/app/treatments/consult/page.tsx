'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'

import { useDropzone } from 'react-dropzone'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// 시술 카테고리 데이터
const beautyCategories = [
  { id: 'eyes', label: '눈성형', selected: true },
  { id: 'nose', label: '코성형', selected: true },
  { id: 'face', label: '안면윤곽', selected: true },
]

export default function ConsultPage() {
  const searchParams = useSearchParams()
  const treatment_id = searchParams.get('treatment_id')
  const [treatmentInfo, setTreatmentInfo] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [hospital_id, setHospitalId] = useState<string | null>(null)
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  })
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    description?: string;
    general?: string;
  }>({})

  // 로그인 체크 및 사용자 정보 설정
  useEffect(() => {
    const checkAuth = async () => {
      console.log("=== Auth Check Start ===")
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        // 에러가 있거나 user가 없을 때만 로그인 페이지로 이동
        if (error || !user) {
          console.log("Auth error or no user:", error)
          console.log("User data:", user)
          router.push('/login?redirect=/treatments/consult')
          return
        }

        // 사용자 정보로 폼 데이터 초기화
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
          phone: user.user_metadata.profile?.phone || '',
          name: user.user_metadata.profile?.nickname || ''
        }))

        console.log("User logged in:", user)
        console.log("=== Auth Check End ===")

      } catch (error) {
        console.log("Try-catch error:", error)
        router.push('/login?redirect=/treatments/consult')
      }
    }

    checkAuth()
  }, [router])

  // 시술 정보 가져오기
  useEffect(() => {
    const fetchTreatmentInfo = async () => {
      if (!treatment_id) {
        setFormErrors({
          general: '시술 정보가 없습니다. 시술을 선택해주세요.'
        })
        return
      }

      try {
        // 시술 정보 가져오기
        const { data: treatment, error: treatmentError } = await supabase
          .from('treatments')
          .select(`
            id,
            title,
            hospital_id,
            hospitals (
              id,
              name
            )
          `)
          .eq('id', treatment_id)
          .single()

        if (treatmentError) {
          setFormErrors({
            general: '시술 정보를 불러오는데 실패했습니다.'
          })
          throw treatmentError
        }
        
        // hospital_id 설정
        if (!treatment?.hospital_id) {
          setFormErrors({
            general: '병원 정보가 없습니다. 다시 시도해주세요.'
          })
          return
        }
        setHospitalId(treatment.hospital_id.toString())

        // 시술의 카테고리 정보 가져오기
        const { data: treatmentCategories, error: categoriesError } = await supabase
          .from('treatment_categories')
          .select(`
            depth2_category_id,
            categories!treatment_categories_depth2_category_id_fkey (
              id,
              name,
              depth
            )
          `)
          .eq('treatment_id', treatment_id)
          .eq('categories.depth', 2)

        if (categoriesError) throw categoriesError

        // 중복 제거: id를 기준으로 unique한 카테고리만 추출
        const uniqueCategories = treatmentCategories.reduce((acc: any[], curr) => {
          const exists = acc.find(item => item.id === curr.categories.id)
          if (!exists) {
            acc.push(curr.categories)
          }
          return acc
        }, [])

        setTreatmentInfo(treatment)
        setCategories(uniqueCategories)

      } catch (error) {
        console.error('Error fetching treatment info:', error)
        setFormErrors({
          general: '정보를 불러오는데 실패했습니다. 다시 시도해주세요.'
        })
      }
    }

    fetchTreatmentInfo()
  }, [treatment_id])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles])
    
    const newPreviewUrls = acceptedFiles.map(file => URL.createObjectURL(file))
    setPreviewUrls(prev => [...prev, ...newPreviewUrls])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true
  })

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    
    URL.revokeObjectURL(previewUrls[index])
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 에러 메시지 초기화
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 폼 유효성 검사
    const errors: typeof formErrors = {}
    if (!formData.name) errors.name = '이름을 입력해주세요'
    if (!formData.email) errors.email = '이메일을 입력해주세요'
    if (!formData.phone) errors.phone = '전화번호를 입력해주세요'
    if (!formData.description) errors.description = '상담 내용을 입력해주세요'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    if (!hospital_id || !treatment_id) {
      setFormErrors({
        name: '시술 또는 병원 정보를 불러오는데 실패했습니다. 다시 시도해주세요.'
      })
      return
    }

    try {
      setIsSubmitting(true)

      // 현재 사용자 정보 가져오기
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        console.log("Submit - No user found")
        return
      }

      // 1. 상담 데이터 저장
      const { data: consultation, error: consultationError } = await supabase
        .from('consultations')
        .insert({
          user_id: user.id,
          hospital_id: parseInt(hospital_id),
          treatment_id: parseInt(treatment_id),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          description: formData.description,
          status: 1
        })
        .select()
        .single()

      if (consultationError) throw consultationError

      // 2. 카테고리 저장 (현재 선택된 카테고리들)
      if (categories.length > 0) {
        const { error: categoryError } = await supabase
          .from('consultation_categories')
          .insert(
            categories.map(category => ({
              consultation_id: consultation.id,
              category_id: category.id
            }))
          )

        if (categoryError) throw categoryError
      }

      // 3. 이미지 저장 (이미지가 있는 경우)
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const timestamp = Date.now()
          const fileExt = file.name.split('.').pop()
          const filePath = `consultations/${consultation.id}/${timestamp}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file)

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath)

          const { error: imageError } = await supabase
            .from('consultation_images')
            .insert({
              consultation_id: consultation.id,
              image_url: publicUrl
            })

          if (imageError) throw imageError
        }
      }

      // 성공 메시지 표시
      if (window.confirm('상담 신청이 완료되었습니다.')) {
        router.back()
      }

    } catch (error) {
      console.error('상담 신청 에러:', error)
      setFormErrors({
        general: '상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-2xl font-bold mb-8">상담 신청</h1>

        {/* 일반 에러 메시지 표시 */}
        {formErrors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-500 rounded-md">
            <p className="text-red-500">{formErrors.general}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* 시술 정보 */}
          <div className="space-y-2">
            <label className="block text-sm after:content-['*'] after:text-red-500 after:ml-1">
              Treatment
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-700">
              {treatmentInfo?.title}
            </div>
          </div>

          {/* 병원 정보 */}
          <div className="space-y-2">
            <label className="block text-sm after:content-['*'] after:text-red-500 after:ml-1">
              Hospital
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-700">
              {treatmentInfo?.hospitals?.name}
            </div>
          </div>

          {/* 시술 카테고리 */}
          <div className="space-y-2">
            <label className="block text-sm after:content-['*'] after:text-red-500 after:ml-1">
              Categories
            </label>
            <div className="flex gap-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="px-4 py-1 rounded-full text-sm bg-pink-500 text-white"
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>

          {/* 이름 입력 */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm after:content-['*'] after:text-red-500 after:ml-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                formErrors.name ? 'border-red-500' : ''
              }`}
              placeholder="Name"
            />
            {formErrors.name && (
              <p className="text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          {/* 이메일 입력 */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm after:content-['*'] after:text-red-500 after:ml-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                formErrors.email ? 'border-red-500' : ''
              }`}
              placeholder="abc@gmail.com"
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          {/* 전화번호 입력 */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm after:content-['*'] after:text-red-500 after:ml-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                formErrors.phone ? 'border-red-500' : ''
              }`}
              placeholder="Phone number"
            />
            {formErrors.phone && (
              <p className="text-sm text-red-500">{formErrors.phone}</p>
            )}
          </div>

          {/* 프로필 이미지 업로드 */}
          <div className="space-y-2">
            <label className="block text-sm">
              Images
            </label>
            <div {...getRootProps()} className="relative">
              <div className={`
                border-2 border-dashed rounded-lg p-4 transition-colors
                ${isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}
                hover:border-pink-500 cursor-pointer
              `}>
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Upload className="w-8 h-8" />
                  {isDragActive ? (
                    <p className="text-sm text-center">이미지를 여기에 놓아주세요</p>
                  ) : (
                    <>
                      <p className="text-sm text-center">
                        클릭하여 이미지 선택 또는 드래그하여 업로드
                      </p>
                      <p className="text-xs text-gray-400">
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                      <p className="text-xs text-gray-400 md:hidden">
                        📸 사진 촬영 또는 갤러리에서 선택
                      </p>
                    </>
                  )}
                </div>
              </div>

              {previewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={200}
                        className="rounded-lg w-full h-auto"
                        objectFit="cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFile(index)
                        }}
                        className="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 설명 입력 */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm after:content-['*'] after:text-red-500 after:ml-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md resize-none ${
                formErrors.description ? 'border-red-500' : ''
              }`}
              placeholder="상담하고 싶은 내용을 입력하세요."
            />
            {formErrors.description && (
              <p className="text-sm text-red-500">{formErrors.description}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 py-3 border rounded-md hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:bg-pink-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
} 