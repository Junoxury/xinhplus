import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { X } from "lucide-react"

interface FilterProps {
  onFilterChange: (filters: any) => void;
  onClose?: () => void;
  isMobile?: boolean;
  showPriceFilter?: boolean;
}

interface CheckOption {
  id: string;
  label: string;
}

const CHECK_OPTIONS: CheckOption[] = [
  { id: 'recommended', label: '추천' },
  { id: 'discount', label: '할인' },
  { id: 'member', label: 'Member' },
]

const LOCATIONS = [
  { id: 'hanoi', name: '하노이' },
  { id: 'hochiminh', name: '호치민' },
  { id: 'danang', name: '다낭' },
  { id: 'haiphong', name: '하이퐁' },
  { id: 'nhatrang', name: '나트랑' }
]

const formatPrice = (value: number) => {
  return `${(value / 1000000).toFixed(0)}M`
}

export function TreatmentFilter({ 
  onFilterChange, 
  onClose, 
  isMobile = false,
  showPriceFilter = true
}: FilterProps) {
  const [priceRange, setPriceRange] = useState([0, 100000000])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    updateFilters()
  }

  const toggleLocation = (locationId: string) => {
    setSelectedLocations(prev => {
      const newLocations = prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
      return newLocations
    })
    updateFilters()
  }

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => {
      const newOptions = prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
      return newOptions
    })
    updateFilters()
  }

  const updateFilters = () => {
    onFilterChange({ 
      priceRange, 
      locations: selectedLocations,
      options: selectedOptions 
    })
  }

  const removeLocation = (locationId: string) => {
    setSelectedLocations(prev => {
      const newLocations = prev.filter(id => id !== locationId)
      onFilterChange({ priceRange, locations: newLocations })
      return newLocations
    })
  }

  const handleReset = () => {
    setPriceRange([0, 100000000])
    setSelectedLocations([])
    setSelectedOptions([])
    onFilterChange({
      priceRange: [0, 100000000],
      locations: [],
      options: []
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
            {/* 선택된 지역 표시 */}
            {selectedLocations.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedLocations.map(locationId => {
                  const location = LOCATIONS.find(l => l.id === locationId)
                  return (
                    <Badge 
                      key={locationId}
                      variant="secondary" 
                      className="flex items-center gap-1"
                    >
                      {location?.name}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeLocation(locationId)}
                      />
                    </Badge>
                  )
                })}
              </div>
            )}
            {/* 지역 선택 버튼들 */}
            <div className="grid grid-cols-2 gap-2">
              {LOCATIONS.map(location => (
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