import { Button } from '@/components/ui/button'
import { Loader2, Filter } from 'lucide-react'
import { TreatmentCard } from './TreatmentCard'

interface TreatmentListProps {
  treatments: any[];
  totalCount: number;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  className?: string;
  onFilterClick?: () => void;
}

export function TreatmentList({ 
  treatments, 
  totalCount, 
  loading, 
  hasMore, 
  onLoadMore,
  className = "",
  onFilterClick
}: TreatmentListProps) {
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

        <select className="h-9 px-3 text-sm border rounded-md bg-background">
          <option value="recommended">추천순</option>
          <option value="price-low">가격 낮은순</option>
          <option value="price-high">가격 높은순</option>
          <option value="rating">평점순</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {treatments.map((treatment) => (
          <TreatmentCard 
            key={treatment.id}
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