import { ShortCard } from './ShortCard'

interface ShortListProps {
  shorts: any[]
  isScrollable?: boolean // 홈화면에서 스크롤 가능한 형태로 표시할지 여부
}

export function ShortList({ shorts, isScrollable = false }: ShortListProps) {
  if (isScrollable) {
    // 홈화면용 가로 스크롤 레이아웃
    return (
      <div className="relative">
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide -mx-4 px-4">
          {shorts.map((short) => (
            <div key={short.id} className="flex-shrink-0 w-[240px]">
              <ShortCard {...short} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 일반 그리드 레이아웃 (2열)
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {shorts.map((short) => (
        <ShortCard key={short.id} {...short} />
      ))}
    </div>
  )
} 