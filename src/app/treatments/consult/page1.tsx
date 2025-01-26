'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'
import Link from 'next/link'
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

export default function ConsultPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-2xl font-bold mb-8">상담 신청</h1>
        <div className="space-y-6">
          {/* 시술 정보 */}
          <div className="space-y-2">
            <label className="block text-sm after:content-['*'] after:text-red-500 after:ml-1">
              Treatment
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border rounded-md text-gray-700">
              리프팅, 미친 리프팅!!!!!
            </div>
          </div>

          {/* 시술 선택 */}
          <div className="space-y-2">
            <label className="block text-sm after:content-['*'] after:text-red-500 after:ml-1">
              Beauty
            </label>
            <div className="flex flex-wrap gap-2">
              {beautyCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  type="button"
                  className={`px-4 py-1 rounded-full text-sm transition-colors ${
                    selectedCategories.includes(category.id)
                      ? 'bg-pink-500 text-white'
                      : 'border border-gray-200 text-gray-700 hover:border-pink-500 hover:text-pink-500'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            {selectedCategories.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                선택된 항목: {selectedCategories.length}개
              </p>
            )}
          </div>

          {/* 이름 입력 */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm after:content-['*'] after:text-red-500 after:ml-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Name"
            />
          </div>

          {/* 이메일 입력 */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm after:content-['*'] after:text-red-500 after:ml-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="abc@gmail.com"
            />
          </div>

          {/* 전화번호 입력 */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm after:content-['*'] after:text-red-500 after:ml-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="abc@gmail.com"
            />
          </div>

          {/* 프로필 이미지 업로드 */}
          <div className="space-y-2">
            <label className="block text-sm">
              Profile Image
            </label>
            <div {...getRootProps()} className="relative">
              <div className={`
                border-2 border-dashed rounded-lg p-4 transition-colors
                ${isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}
                hover:border-pink-500 cursor-pointer
              `}>
                <input {...getInputProps()} accept="image/*" capture="environment" />
                
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

              {previewUrl && (
                <div className="mt-4 relative inline-block">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-lg"
                    objectFit="cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile()
                    }}
                    className="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
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
              rows={4}
              className="w-full px-3 py-2 border rounded-md resize-none"
              placeholder="상담하고 싶은 내용을 입력하세요."
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 py-3 border rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 