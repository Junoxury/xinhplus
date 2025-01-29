'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RegisterStep1() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/
    return passwordRegex.test(password)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 실시간 유효성 검사
    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value) ? '' : '유효한 이메일 주소를 입력해주세요'
      }))
    }
    if (name === 'password') {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(value) ? '' : '비밀번호 형식이 올바르지 않습니다'
      }))
    }
    if (name === 'confirmPassword') {
      setErrors(prev => ({
        ...prev,
        confirmPassword: value === formData.password ? '' : '비밀번호가 일치하지 않습니다'
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 최종 유효성 검사
    if (!validateEmail(formData.email) || 
        !validatePassword(formData.password) || 
        formData.password !== formData.confirmPassword) {
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error
      
      if (data.user) {
        // 세션 스토리지에 UUID 저장
        sessionStorage.setItem('userUUID', data.user.id)
        router.push(`/register/step2`)
      } else {
        throw new Error('User data not found')
      }

    } catch (error) {
      console.error('Error:', error)
      setErrors(prev => ({
        ...prev,
        email: '회원가입 중 오류가 발생했습니다'
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
            Sign Up (1/3)
          </h1>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={`w-full px-4 py-3 rounded-lg bg-pink-50 border ${
                  errors.email ? 'border-red-500' : 'border-pink-100'
                } focus:outline-none focus:border-pink-500`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full px-4 py-3 rounded-lg bg-pink-50 border ${
                    errors.password ? 'border-red-500' : 'border-pink-100'
                  } focus:outline-none focus:border-pink-500`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500 pl-1">
                숫자, 영문자, 특수문자 포함 8 - 20자로 입력해주세요
              </p>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-3 rounded-lg bg-pink-50 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-pink-100'
                  } focus:outline-none focus:border-pink-500`}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading || Object.values(errors).some(error => error !== '')}
                className="w-full py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 flex items-center justify-center"
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
      </div>
    </div>
  )
} 