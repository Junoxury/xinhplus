import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { supabase } from '@/lib/supabase'

interface FilterProps {
  onFilterChange: (filters: {
    cityId: number | null;
    bodyPartId: number | null;
    treatmentId: number | null;
    bodyPartSubId: number | null;
    treatmentSubId: number | null;
    options: {
      is_advertised: boolean;
      has_discount: boolean;
      is_member: boolean;
    };
    priceRange: number[];
  }) => void;
  onClose?: () => void;
  isMobile?: boolean;
  showPriceFilter?: boolean;
  initialFilters?: {
    cityId: number | null;
    bodyPartId: number | null;
    treatmentId: number | null;
    bodyPartSubId: number | null;
    treatmentSubId: number | null;
    options: {
      is_advertised: boolean;
      has_discount: boolean;
      is_member: boolean;
    };
    priceRange: number[];
  };
}

interface Location {
  id: string;
  name: string;
}

interface CheckOption {
  id: string;
  label: string;
}

const CHECK_OPTIONS: CheckOption[] = [
  { id: 'is_advertised', label: '추천' },
  { id: 'has_discount', label: '할인' },
  { id: 'is_member', label: 'Member' },
]

export function TreatmentFilter({ 
  onFilterChange, 
  onClose, 
  isMobile = false,
  showPriceFilter = true,
  initialFilters
}: FilterProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialFilters?.cityId ? [initialFilters.cityId.toString()] : []
  )
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    Object.entries(initialFilters?.options || {})
      .filter(([_, value]) => value)
      .map(([key]) => key)
  )
  const [priceRange, setPriceRange] = useState(
    initialFilters?.priceRange || [0, 100000000]
  )

  useEffect(() => {
    const fetchCities = async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name_vi')
        .eq('is_active', true)
        .order('sort_order')

      if (error) {
        console.error('도시 목록 조회 실패:', error)
        return
      }

      // Supabase에서 가져온 데이터를 Location 형식으로 변환
      const formattedLocations: Location[] = data.map(city => ({
        id: city.id.toString(),
        name: city.name_vi
      }))

      setLocations(formattedLocations)
    }

    fetchCities()
  }, [])

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    updateFilters()
  }

  const toggleLocation = (locationId: string) => {
    // 새로운 locations 배열을 즉시 생성
    const newLocations = selectedLocations.includes(locationId)
      ? [] // 이미 선택된 경우 선택 해제 (빈 배열)
      : [locationId] // 새로 선택하는 경우 해당 ID만 포함

    // 상태 업데이트와 필터 적용을 동시에 처리
    setSelectedLocations(newLocations)
    
    // 필터 즉시 적용
    onFilterChange({ 
      cityId: newLocations.length > 0 ? Number(newLocations[0]) : null,
      options: {
        is_advertised: selectedOptions.includes('is_advertised'),
        has_discount: selectedOptions.includes('has_discount'),
        is_member: selectedOptions.includes('is_member')
      },
      priceRange 
    })
  }

  const toggleOption = (optionId: string) => {
    // 새로운 options 배열을 즉시 생성
    const newOptions = selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId)
      : [...selectedOptions, optionId]
    
    // 상태 업데이트와 필터 적용을 동시에 처리
    setSelectedOptions(newOptions)
    
    // 필터 즉시 적용
    onFilterChange({ 
      cityId: selectedLocations.length > 0 ? Number(selectedLocations[0]) : null,
      options: {
        is_advertised: newOptions.includes('is_advertised'),
        has_discount: newOptions.includes('has_discount'),
        is_member: newOptions.includes('is_member')
      },
      priceRange 
    })
  }

  const updateFilters = () => {
    onFilterChange({ 
      cityId: selectedLocations.length > 0 ? Number(selectedLocations[0]) : null,
      options: {
        is_advertised: selectedOptions.includes('is_advertised'),
        has_discount: selectedOptions.includes('has_discount'),
        is_member: selectedOptions.includes('is_member')
      },
      priceRange 
    })
  }

  const removeLocation = (locationId: string) => {
    setSelectedLocations([]) // 선택 해제 시 빈 배열로 설정
    
    // 필터 즉시 적용
    onFilterChange({
      cityId: null, // 선택 해제 시 null
      options: {
        is_advertised: selectedOptions.includes('is_advertised'),
        has_discount: selectedOptions.includes('has_discount'),
        is_member: selectedOptions.includes('is_member')
      },
      priceRange
    })
  }

  const handleReset = () => {
    setPriceRange([0, 100000000])
    setSelectedLocations([])
    setSelectedOptions([])
    onFilterChange({
      cityId: null,
      options: {
        is_advertised: false,
        has_discount: false,
        is_member: false
      },
      priceRange: [0, 100000000]
    })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 헤더 영역 */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h3 className="font-semibold text-lg">Filter</h3>
        {isMobile && (
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* 필터 내용 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* 체크박스 옵션 */}
          <div>
            <h4 className="text-sm font-medium mb-3">옵션</h4>
            <div className={`${isMobile ? 'flex gap-4' : 'space-y-2'}`}>
              {CHECK_OPTIONS.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${option.id}-${isMobile ? 'mobile' : 'pc'}`}
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={() => toggleOption(option.id)}
                  />
                  <label 
                    htmlFor={`${option.id}-${isMobile ? 'mobile' : 'pc'}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 가격 범위 필터 - 조건부 렌더링 */}
          {showPriceFilter && (
            <div>
              <h4 className="text-sm font-medium mb-4">가격 범위</h4>
              <Slider
                defaultValue={priceRange}
                max={100000000}
                step={1000000}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          )}

          {/* 지역 필터 */}
          <div>
            <h4 className="text-sm font-medium mb-3">지역</h4>
            <div className="grid grid-cols-2 gap-2">
              {locations.map(location => (
                <button
                  key={location.id}
                  onClick={() => toggleLocation(location.id)}
                  className={`p-2 text-sm rounded-md border transition-colors
                    ${selectedLocations.includes(location.id)
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-200 hover:border-primary'
                    }`}
                >
                  {location.name}
                </button>
              ))}
            </div>
          </div>

          {/* 필터 적용 버튼 */}
          {isMobile && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-4 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                초기화
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                적용하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 