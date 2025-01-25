import { ClinicCard } from './ClinicCard'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'

interface ClinicListProps {
  clinics: ClinicCardProps[]
  totalCount: number
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  className?: string
  onFilterClick?: () => void
}

export function ClinicList({
  clinics,
  totalCount,
  loading = false,
  hasMore = false,
  onLoadMore,
  className = '',
  onFilterClick
}: ClinicListProps) {
  return (
    <div className={className}>
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {onFilterClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onFilterClick}
              className="md:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              필터
            </Button>
          )}
          <div className="text-sm text-gray-600">
            총 <span className="font-semibold">{totalCount}</span>개
          </div>
        </div>

        <select className="h-9 px-3 text-sm border rounded-md bg-background">
          <option value="recommended">추천순</option>
          <option value="views">조회순</option>
          <option value="latest">최신순</option>
        </select>
      </div>

      {/* 병원 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {clinics.map((clinic) => (
          <ClinicCard
            key={clinic.id}
            {...clinic}
          />
        ))}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="w-full md:w-[200px]"
          >
            {loading ? '로딩중...' : '더보기'}
          </Button>
        </div>
      )}
    </div>
  )
} 