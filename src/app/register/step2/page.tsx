'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RegisterStep2() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    gender: '',
    phone: ''
  })
  const [errors, setErrors] = useState({
    gender: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [uuid, setUuid] = useState<string | null>(null)

  // UUID 체크 및 설정
  useEffect(() => {
    const storedUuid = sessionStorage.getItem('userUUID')
    if (!storedUuid) {
      router.push('/register/step1')
    } else {
      setUuid(storedUuid)
    }
  }, [router])

  const validateVietnamesePhone = (phone: string) => {
    const phoneRegex = /^(\+84|0)([35789])[0-9]{8}$/
    return phoneRegex.test(phone)
  }

  // 폼 유효성 검사
  const isFormValid = () => {
    return formData.gender !== '' && 
           validateVietnamesePhone(formData.phone) &&
           !errors.gender && 
           !errors.phone
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid() || !uuid) {
      return
    }

    setIsLoading(true)
    try {
      // user_profiles 테이블에 데이터 삽입
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: uuid,
          gender: formData.gender,
          phone: formData.phone,
          is_active: true
        }, {
          onConflict: 'id'
        })

      if (profileError) throw profileError

      // 성공시 다음 단계로 이동
      router.push('/register/step3')
    } catch (error) {
      console.error('Error:', error)
      setErrors(prev => ({
        ...prev,
        phone: '프로필 저장 중 오류가 발생했습니다'
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-20 bg-gradient-to-br from-pink-50 to-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Sign Up (2/3)
          </h1>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, gender: 'male' }))
                    setErrors(prev => ({ ...prev, gender: '' }))
                  }}
                  className={`py-4 px-6 rounded-lg border-2 transition-all flex items-center justify-center space-x-2
                    ${formData.gender === 'male' 
                      ? 'border-purple-600 bg-purple-100 text-purple-800 shadow-md scale-105' 
                      : 'border-purple-500 text-purple-500 hover:bg-purple-50'}`}
                >
                  <span className={formData.gender === 'male' ? 'font-semibold' : ''}>Male</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, gender: 'female' }))
                    setErrors(prev => ({ ...prev, gender: '' }))
                  }}
                  className={`py-4 px-6 rounded-lg border-2 transition-all flex items-center justify-center space-x-2
                    ${formData.gender === 'female' 
                      ? 'border-pink-600 bg-pink-100 text-pink-800 shadow-md scale-105' 
                      : 'border-pink-500 text-pink-500 hover:bg-pink-50'}`}
                >
                  <span className={formData.gender === 'female' ? 'font-semibold' : ''}>Female</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-xs text-center">{errors.gender}</p>
              )}
            </div>

            <div className="space-y-2">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, phone: e.target.value }))
                  if (validateVietnamesePhone(e.target.value)) {
                    setErrors(prev => ({ ...prev, phone: '' }))
                  }
                }}
                placeholder="Contact number (e.g. +84123456789)"
                className={`w-full px-4 py-3 rounded-lg bg-pink-50 border ${
                  errors.phone ? 'border-red-500' : 'border-pink-100'
                } focus:outline-none focus:border-pink-500`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
              <p className="text-xs text-gray-500 pl-1">
                베트남 전화번호 형식: +84 또는 0으로 시작하는 10-11자리 번호
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className={`w-full py-3 rounded-lg transition-all flex items-center justify-center
                  ${isFormValid() 
                    ? 'bg-pink-500 hover:bg-pink-600 text-white' 
                    : 'bg-pink-200 text-pink-400 cursor-not-allowed'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    처리중...
                  </>
                ) : (
                  'Next'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 