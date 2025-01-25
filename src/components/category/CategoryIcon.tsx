import Image from 'next/image'
import Link from 'next/link'

interface CategoryIconProps {
  icon: string
  label: string
  href?: string
  onClick?: () => void
  isSelected?: boolean
}

export function CategoryIcon({ icon, label, onClick, isSelected }: CategoryIconProps) {
  return (
    <div 
      className="flex flex-col items-center gap-1 p-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
      onClick={onClick}
    >
      <div className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all
        ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}`}
      >
        <img src={icon} alt={label} className="w-8 h-8" />
      </div>
      <span className="text-xs text-center">{label}</span>
    </div>
  )
} 