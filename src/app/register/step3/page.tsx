'use client'

import Link from 'next/link'
import bodyPartsData from '@/data/bodyParts.json'
import treatmentMethodsData from '@/data/treatmentMethods.json'
import { CategoryIcon } from '@/components/category/CategoryIcon'

export default function RegisterStep3() {
  return (
    <div className="min-h-screen flex items-start justify-center pt-20 bg-gradient-to-br from-pink-50 to-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Sign Up (3/3)
          </h1>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100">
          <form className="space-y-8">
            <div>
              <h2 className="text-lg font-medium mb-4">고민 부위를 선택하세요 (5개까지 선택 가능)</h2>
              <div className="space-y-6">
                {/* 부위 섹션 */}
                <div>
                  <h3 className="text-sm text-gray-500 mb-3">부위</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {bodyPartsData.categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        className="aspect-square rounded-xl border-2 border-gray-100 p-3 flex flex-col items-center justify-center gap-2 hover:border-pink-500 hover:text-pink-500 transition-colors"
                      >
                        <CategoryIcon icon={category.icon} />
                        <span className="text-sm">{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 시술 방법 섹션 */}
                <div>
                  <h3 className="text-sm text-gray-500 mb-3">시술방법</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {treatmentMethodsData.categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        className="aspect-square rounded-xl border-2 border-gray-100 p-3 flex flex-col items-center justify-center gap-2 hover:border-pink-500 hover:text-pink-500 transition-colors"
                      >
                        <CategoryIcon icon={category.icon} />
                        <span className="text-sm">{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">관심 지역을 선택하세요 (3개까지 선택 가능)</h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-lg bg-pink-50 text-pink-500 hover:bg-pink-100 transition-colors text-center"
                >
                  하노이
                </button>
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-lg bg-pink-50 text-pink-500 hover:bg-pink-100 transition-colors text-center"
                >
                  호치민
                </button>
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-lg border-2 border-gray-100 text-gray-600 hover:border-pink-500 hover:text-pink-500 transition-colors text-center"
                >
                  다낭
                </button>
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-lg border-2 border-gray-100 text-gray-600 hover:border-pink-500 hover:text-pink-500 transition-colors text-center"
                >
                  나트랑
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 