'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'

import { useDropzone } from 'react-dropzone'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'


export default function ConsultPage() {
  const searchParams = useSearchParams()
  const hospital_id = searchParams.get('hospital_id')
  const [hospitalInfo, setHospitalInfo] = useState<any>(null)
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
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

  // 로그인 체크
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.log("Auth error or no user:", error)
          router.push('/login?redirect=/clinics/consult')
          return
        }

        // 사용자 정보로 폼 데이터 초기화
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
          phone: user.user_metadata.profile?.phone || '',
          name: user.user_metadata.profile?.nickname || ''
        }))

      } catch (error) {
        console.log("Try-catch error:", error)
        router.push('/login?redirect=/clinics/consult')
      }
    }

    checkAuth()
  }, [router])

  // 병원 정보 가져오기
  useEffect(() => {
    const fetchHospitalInfo = async () => {
      if (!hospital_id) {
        setFormErrors({
          general: '병원 정보가 없습니다. 병원을 선택해주세요.'
        })
        return
      }

      try {
        const { data: hospital, error: hospitalError } = await supabase
          .from('hospitals')
          .select('id, name')
          .eq('id', hospital_id)
          .single()

        if (hospitalError) {
          setFormErrors({
            general: '병원 정보를 불러오는데 실패했습니다.'
          })
          throw hospitalError
        }

        setHospitalInfo(hospital)

      } catch (error) {
        console.error('Error fetching hospital info:', error)
        setFormErrors({
          general: '정보를 불러오는데 실패했습니다. 다시 시도해주세요.'
        })
      }
    }

    fetchHospitalInfo()
  }, [hospital_id])

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
    if (!formData.description) errors.description = '상담 내용을 입력하세요'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    if (!hospital_id) {
      setFormErrors({
        general: '병원 정보를 불러오는데 실패했습니다. 다시 시도해주세요.'
      })
      return
    }

    try {
      setIsSubmitting(true)

      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return

      // 상담 데이터 저장
      const { data: consultation, error: consultationError } = await supabase
        .from('consultations')
        .insert({
          user_id: user.id,
          hospital_id: parseInt(hospital_id),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          description: formData.description,
          status: 1
        })
        .select()
        .single()

      if (consultationError) throw consultationError

      // 여러 이미지 저장
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

        {formErrors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-500 rounded-md">
            <p className="text-red-500">{formErrors.general}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* 병원 정보 */}
          <div className="space-y-2">
            <label className="block text-sm after:content-['*'] after:text-red-500 after:ml-1">
              Hospital
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-700">
              {hospitalInfo?.name}
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

          {/* 이미지 업로드 */}
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