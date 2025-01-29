'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { signIn } from '@/lib/auth'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''  // 일반적인 에러 메시지
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // 컴포넌트 마운트 시 UUID 삭제
  useEffect(() => {
    sessionStorage.removeItem('userUUID')
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // 실시간 이메일 유효성 검사
    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: value && !validateEmail(value) ? '유효한 이메일 주소를 입력해주세요' : ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 입력값 검증
    if (!formData.email.trim()) {
      setErrors(prev => ({ ...prev, email: '이메일을 입력해주세요' }))
      return
    }
    if (!formData.password.trim()) {
      setErrors(prev => ({ ...prev, password: '비밀번호를 입력해주세요' }))
      return
    }

    setIsLoading(true)
    setErrors({ email: '', password: '', general: '' })

    try {
      const result = await signIn(formData.email, formData.password)
      
      if (result.error) {
        // 에러 메시지 표시
        setErrors(prev => ({ ...prev, general: result.error }))
        return
      }

      if (result.user) {
        router.push('/')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Xinh hơn mỗi ngày
          </h1>
          <p className="text-gray-600">Welcome back! Please login to your account.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100">
          <h2 className="text-2xl font-bold text-center mb-8">Sign In</h2>
          
          {errors.general && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {errors.general}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg bg-pink-50 border ${
                  errors.email ? 'border-red-500' : 'border-pink-100'
                } focus:outline-none focus:border-pink-500 disabled:opacity-50`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg bg-pink-50 border ${
                  errors.password ? 'border-red-500' : 'border-pink-100'
                } focus:outline-none focus:border-pink-500 disabled:opacity-50`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-pink-500">
                Forgot password ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className={`w-full py-3 rounded-lg transition-all flex items-center justify-center
                ${isLoading || !formData.email || !formData.password
                  ? 'bg-pink-300 cursor-not-allowed'
                  : 'bg-pink-500 hover:bg-pink-600'
                } text-white`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  로그인 중...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">or continue with</p>
            <div className="flex justify-center space-x-4">
              <button className="p-2 border rounded-full hover:border-pink-500 transition-colors">
                <Image
                  src="/images/facebook.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </button>
              <button className="p-2 border rounded-full hover:border-pink-500 transition-colors">
                <Image
                  src="/images/google.svg"
                  alt="Google"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-gray-600">Don't have an account?</p>
          <Link 
            href="/register/step1" 
            className="text-pink-500 font-semibold hover:text-pink-600 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
} 