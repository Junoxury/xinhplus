import { CategoryIcon } from '@/components/category/CategoryIcon'
import { useRef, MouseEvent, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface Category {
  id: number;
  name: string;
  icon: string;
  label: string;
  href: string;
}

interface SubCategory {
  parentId: number;
  id: number;
  name: string;
  label: string;
  href: string;
}

interface CategorySectionProps {
  bodyParts: Category[];
  treatmentMethods: Category[];
  bodyPartSubs: SubCategory[];
  treatmentMethodSubs: SubCategory[];
  onCategorySelect?: (categoryIds: string[]) => void;
}

export function CategorySection({ 
  bodyParts, 
  treatmentMethods,
  bodyPartSubs,
  treatmentMethodSubs,
  onCategorySelect 
}: CategorySectionProps) {
  const [selectedBodyPart, setSelectedBodyPart] = useState<number | null>(null)
  const [selectedTreatment, setSelectedTreatment] = useState<number | null>(null)
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  // 모바일용 상태와 핸들러
  const [selectedMobileCategory, setSelectedMobileCategory] = useState<number | null>(null)

  const onMouseDown = (e: MouseEvent) => {
    isDown.current = true
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grabbing'
      startX.current = e.pageX - scrollRef.current.offsetLeft
      scrollLeft.current = scrollRef.current.scrollLeft
    }
  }

  const onMouseLeave = () => {
    isDown.current = false
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'
    }
  }

  const onMouseUp = () => {
    isDown.current = false
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'
    }
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!isDown.current) return
    e.preventDefault()
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft
      const walk = (x - startX.current) * 2
      scrollRef.current.scrollLeft = scrollLeft.current - walk
    }
  }

  const handleCategoryClick = (categoryId: number, isBodyPart: boolean) => {
    if (isBodyPart) {
      setSelectedBodyPart(prev => prev === categoryId ? null : categoryId)
    } else {
      setSelectedTreatment(prev => prev === categoryId ? null : categoryId)
    }
  }

  const handleSubCategorySelect = (subCategory: SubCategory) => {
    setSelectedSubCategories(prev => {
      const newSelection = prev.includes(subCategory.href)
        ? prev.filter(href => href !== subCategory.href)
        : [...prev, subCategory.href]
      
      // 상위 컴포넌트에 선택된 카테고리 전달
      onCategorySelect?.(newSelection)
      return newSelection
    })
  }

  const getSubCategories = (categoryId: number | null, isBodyPart: boolean) => {
    if (!categoryId) return []
    
    const subs = isBodyPart
      ? bodyPartSubs.filter(sub => sub.parentId === categoryId)
      : treatmentMethodSubs.filter(sub => sub.parentId === categoryId)

    return subs.map(sub => ({
      ...sub,
      key: `${isBodyPart ? 'body' : 'treatment'}-${sub.id}`
    }))
  }

  const handleMobileCategoryClick = (categoryId: number) => {
    setSelectedMobileCategory(prev => prev === categoryId ? null : categoryId)
  }

  const isMobileBodyPart = (categoryId: number) => {
    return bodyParts.some(bp => bp.id === categoryId)
  }

  const getMobileSubCategories = (categoryId: number | null) => {
    if (!categoryId) return []
    
    const isBodyPart = isMobileBodyPart(categoryId)
    const subs = isBodyPart
      ? bodyPartSubs.filter(sub => sub.parentId === categoryId)
      : treatmentMethodSubs.filter(sub => sub.parentId === categoryId)

    return subs.map(sub => ({
      ...sub,
      key: `mobile-${sub.id}`
    }))
  }

  return (
    <div className="space-y-4">
      {/* PC 버전 */}
      <div className="hidden md:block">
        <div className="flex gap-8">
          {/* 부위 섹션 */}
          <div className="flex flex-col w-2/3">
            <h2 className="text-lg font-bold mb-4">부위</h2>
            <div className="grid grid-cols-6 gap-1 mb-4 min-h-[180px]">
              {bodyParts.map((category) => (
                <div key={`body-${category.id}`}>
                  <CategoryIcon 
                    icon={category.icon}
                    label={category.label}
                    onClick={() => handleCategoryClick(category.id, true)}
                    isSelected={selectedBodyPart === category.id}
                  />
                </div>
              ))}
            </div>
            {/* 부위 서브카테고리 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              {selectedBodyPart ? (
                <div className="flex flex-wrap gap-2">
                  {getSubCategories(selectedBodyPart, true).map((sub) => (
                    <Badge
                      key={sub.key}
                      variant={selectedSubCategories.includes(sub.href) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/90"
                      onClick={() => handleSubCategorySelect(sub)}
                    >
                      {sub.label}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center">부위를 선택하세요</div>
              )}
            </div>
          </div>

          {/* 시술 섹션 */}
          <div className="flex flex-col w-1/3">
            <h2 className="text-lg font-bold mb-4">시술</h2>
            <div className="grid grid-cols-4 gap-1 mb-4 min-h-[180px]">
              {treatmentMethods.map((method) => (
                <div key={`treatment-${method.id}`}>
                  <CategoryIcon 
                    icon={method.icon}
                    label={method.label}
                    onClick={() => handleCategoryClick(method.id, false)}
                    isSelected={selectedTreatment === method.id}
                  />
                </div>
              ))}
            </div>
            {/* 시술 서브카테고리 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              {selectedTreatment ? (
                <div className="flex flex-wrap gap-2">
                  {getSubCategories(selectedTreatment, false).map((sub) => (
                    <Badge
                      key={sub.key}
                      variant={selectedSubCategories.includes(sub.href) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/90"
                      onClick={() => handleSubCategorySelect(sub)}
                    >
                      {sub.label}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center">시술을 선택하세요</div>
              )}
            </div>
          </div>
        </div>

        {/* 선택된 서브카테고리 표시 */}
        {selectedSubCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {selectedSubCategories.map(href => {
              const sub = [...bodyPartSubs, ...treatmentMethodSubs].find(s => s.href === href)
              return sub && (
                <Badge 
                  key={`selected-${sub.parentId}-${sub.id}`}
                  variant="secondary" 
                  className="flex items-center gap-1"
                >
                  {sub.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleSubCategorySelect(sub)}
                  />
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      {/* 모바일 버전 */}
      <div className="md:hidden">
        {/* 카테고리 아이콘 스크롤 영역 */}
        <div className="mb-4 overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-1 overflow-x-auto scrollbar-hide"
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
          >
            {[...bodyParts, ...treatmentMethods].map((item) => (
              <div 
                key={`mobile-${item.id}`}
                className="flex-shrink-0 w-[60px]"
              >
                <CategoryIcon 
                  icon={item.icon}
                  label={item.label}
                  onClick={() => handleMobileCategoryClick(item.id)}
                  isSelected={selectedMobileCategory === item.id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 모바일 서브카테고리 영역 */}
        <div className="px-4 space-y-4 mb-8">
          {/* 통합된 서브카테고리 */}
          {selectedMobileCategory ? (
            <div className="flex flex-wrap gap-2">
              {getMobileSubCategories(selectedMobileCategory).map((sub) => (
                <Badge
                  key={sub.key}
                  variant={selectedSubCategories.includes(sub.href) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90"
                  onClick={() => handleSubCategorySelect(sub)}
                >
                  {sub.label}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center">
              카테고리를 선택하세요
            </div>
          )}

          {/* 선택된 서브카테고리 표시 */}
          {selectedSubCategories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedSubCategories.map(href => {
                const sub = [...bodyPartSubs, ...treatmentMethodSubs].find(s => s.href === href)
                return sub && (
                  <Badge 
                    key={`mobile-selected-${sub.parentId}-${sub.id}`}
                    variant="secondary" 
                    className="flex items-center gap-1"
                  >
                    {sub.label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleSubCategorySelect(sub)}
                    />
                  </Badge>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 