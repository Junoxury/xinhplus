import { Button } from '@/components/ui/button'
import { Loader2, Filter } from 'lucide-react'
import { TreatmentCard } from './TreatmentCard'
import { EmptyState } from "@/components/EmptyState"

interface TreatmentListProps {
  treatments: any[];
  totalCount: number;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  className?: string;
  onFilterClick?: () => void;
  onSortChange?: (sortBy: 'view_count' | 'like_count' | 'rating' | 'discount_price_asc' | 'discount_price_desc') => void;
}

export function TreatmentList({ 
  treatments, 
  totalCount, 
  loading, 
  hasMore, 
  onLoadMore,
  className = "",
  onFilterClick,
  onSortChange
}: TreatmentListProps) {
  const sortOptions = [
    { value: 'view_count', label: '조회순' },
    { value: 'like_count', label: '좋아요순' },
    { value: 'rating', label: '평점순' },
    { value: 'discount_price_asc', label: '가격 낮은순' },
    { value: 'discount_price_desc', label: '가격 높은순' }
  ]

  // 데이터가 없는 경우
  if (!loading && treatments.length === 0) {
    return (
      <div className={`w-3/4 ${className}`}>
        <EmptyState 
          title="아직 등록된 Beauty가 없어요"
          description="지금 먼저 신청하세요"
          actionLabel="Contact Us"
          onAction={() => window.location.href = '/contact'}
        />
      </div>
    )
  }

  return (
    <div className={`w-3/4 ${className}`}>
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
            총 <span className="font-semibold">{totalCount}</span>개의 시술
          </div>
        </div>

        <select 
          className="border rounded-lg px-3 py-2 text-sm"
          onChange={(e) => onSortChange?.(e.target.value as any)}
          defaultValue="view_count"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {treatments.map((treatment) => (
          <TreatmentCard 
            key={`treatment-${treatment.id}`}
            {...treatment}
          />
        ))}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={loading}
            className="w-full max-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                로딩중...
              </>
            ) : (
              '더보기'
            )}
          </Button>
        </div>
      )}
    </div>
  )
} 