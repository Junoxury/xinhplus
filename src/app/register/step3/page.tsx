'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CategoryIcon } from '@/components/category/CategoryIcon'
import { supabase } from '@/lib/supabase'

interface City {
  id: number
  name: string
  name_vi: string
  name_ko: string
}

interface Category {
  id: number
  name: string
  shortname: string
  icon_path: string
  depth: number
  parent_id: number | null
  sort_order: number
}

export default function RegisterStep3() {
  const router = useRouter()
  const [cities, setCities] = useState<City[]>([])
  const [bodyParts, setBodyParts] = useState<Category[]>([])
  const [treatments, setTreatments] = useState<Category[]>([])
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uuid, setUuid] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYouModal, setShowThankYouModal] = useState(false)

  useEffect(() => {
    // UUID 체크
    const storedUuid = sessionStorage.getItem('userUUID')
    if (!storedUuid) {
      router.push('/register/step1')
      return
    }
    setUuid(storedUuid)

    const fetchData = async () => {
      try {
        // 도시 데이터 로드
        const { data: citiesData, error: citiesError } = await supabase
          .from('cities')
          .select('id, name, name_vi, name_ko')
          .eq('is_active', true)
          .order('sort_order')

        if (citiesError) throw citiesError

        // 신체 부위 카테고리 로드 (depth2)
        const { data: bodyPartsData, error: bodyPartsError } = await supabase
          .from('categories')
          .select('id, name, shortname, icon_path, depth, parent_id, sort_order')
          .eq('depth', 2)
          .eq('parent_id', 1)
          .eq('is_active', true)
          .order('sort_order')

        if (bodyPartsError) throw bodyPartsError

        // 시술 방법 카테고리 로드 (depth2)
        const { data: treatmentsData, error: treatmentsError } = await supabase
          .from('categories')
          .select('id, name, shortname, icon_path, depth, parent_id, sort_order')
          .eq('depth', 2)
          .eq('parent_id', 2)
          .eq('is_active', true)
          .order('sort_order')

        if (treatmentsError) throw treatmentsError

        setCities(citiesData || [])
        setBodyParts(bodyPartsData || [])
        setTreatments(treatmentsData || [])
      } catch (error) {
        console.error('데이터 로드 실패:', error)
        setError('데이터를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleCitySelect = (cityId: number) => {
    setSelectedCityId(cityId === selectedCityId ? null : cityId)
  }

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategories(prev => {
      // 이미 선택된 경우 제거
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      }
      // 5개 이상 선택 방지
      if (prev.length >= 5) {
        return prev
      }
      // 새로운 카테고리 추가
      return [...prev, categoryId]
    })
  }

  const isCategorySelected = (categoryId: number) => {
    return selectedCategories.includes(categoryId)
  }

  // 폼 유효성 검사
  const isFormValid = () => {
    return selectedCityId !== null && selectedCategories.length > 0
  }

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid() || !uuid) return

    setIsSubmitting(true)
    try {
      // 1. city_id 업데이트
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ city_id: selectedCityId })
        .eq('id', uuid)

      if (profileError) throw profileError

      // 2. 선호 카테고리 저장
      const categoryInserts = selectedCategories.map(depth2_id => ({
        user_id: uuid,
        depth2_id,
      }))

      const { error: categoriesError } = await supabase
        .from('user_preferred_categories')
        .insert(categoryInserts)

      if (categoriesError) throw categoriesError

      // 성공 처리
      setShowThankYouModal(true)
      
      // 3초 후 자동 이동
      setTimeout(() => {
        router.push('/login')
      }, 3000)

    } catch (error) {
      console.error('Error:', error)
      setError('저장 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen flex items-start justify-center pt-20 bg-gradient-to-br from-pink-50 to-white p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
              Sign Up (3/3)
            </h1>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <h2 className="text-lg font-medium mb-4">
                  고민 부위를 선택하세요 (5개까지 선택 가능)
                  <span className="text-sm text-gray-500 ml-2">
                    ({selectedCategories.length}/5)
                  </span>
                </h2>
                <div className="space-y-6">
                  {/* 부위 섹션 */}
                  <div>
                    <h3 className="text-sm text-gray-500 mb-3">부위</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {bodyParts.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategorySelect(category.id)}
                          disabled={selectedCategories.length >= 5 && !isCategorySelected(category.id)}
                          className={`aspect-square rounded-xl border-2 p-3 flex flex-col items-center justify-center gap-2 transition-all
                            ${isCategorySelected(category.id)
                              ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-md scale-105'
                              : selectedCategories.length >= 5
                                ? 'border-gray-100 text-gray-400 cursor-not-allowed'
                                : 'border-gray-100 hover:border-pink-500 hover:text-pink-500'
                            }`}
                        >
                          <Image
                            src="/images/placeholdericon.png"
                            alt={category.name}
                            width={24}
                            height={24}
                            className={isCategorySelected(category.id) ? 'opacity-100' : 'opacity-50'}
                          />
                          <span className="text-sm">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 시술 방법 섹션 */}
                  <div>
                    <h3 className="text-sm text-gray-500 mb-3">시술방법</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {treatments.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategorySelect(category.id)}
                          disabled={selectedCategories.length >= 5 && !isCategorySelected(category.id)}
                          className={`aspect-square rounded-xl border-2 p-3 flex flex-col items-center justify-center gap-2 transition-all
                            ${isCategorySelected(category.id)
                              ? 'border-pink-500 bg-pink-50 text-pink-600 shadow-md scale-105'
                              : selectedCategories.length >= 5
                                ? 'border-gray-100 text-gray-400 cursor-not-allowed'
                                : 'border-gray-100 hover:border-pink-500 hover:text-pink-500'
                            }`}
                        >
                          <Image
                            src="/images/placeholdericon.png"
                            alt={category.name}
                            width={24}
                            height={24}
                            className={isCategorySelected(category.id) ? 'opacity-100' : 'opacity-50'}
                          />
                          <span className="text-sm">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-4">관심 지역을 선택하세요</h2>
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-4">{error}</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {cities.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => handleCitySelect(city.id)}
                        className={`w-full py-3 px-4 rounded-lg transition-all
                          ${selectedCityId === city.id 
                            ? 'bg-pink-500 text-white shadow-md scale-105' 
                            : 'bg-pink-50 text-pink-500 hover:bg-pink-100'}`}
                      >
                        {city.name_vi}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-3 rounded-lg transition-all flex items-center justify-center
                  ${isFormValid() 
                    ? 'bg-pink-500 hover:bg-pink-600 text-white' 
                    : 'bg-pink-200 text-pink-400 cursor-not-allowed'}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    처리중...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Thank You Modal */}
      {showThankYouModal && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/30" onClick={() => router.push('/login')} />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="mx-auto max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <div className="text-center">
                <div className="mb-4">
                  <svg 
                    className="mx-auto h-12 w-12 text-pink-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
                
                <h2 className="text-lg font-medium mb-4">
                  Xinh+와 함께 해주셔서 감사합니다.
                </h2>

                <button
                  onClick={() => router.push('/login')}
                  className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  확인
                </button>

                <div className="mt-3 text-sm text-gray-500">
                  <span>3초 후 자동으로 이동합니다...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 