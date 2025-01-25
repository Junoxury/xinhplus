import Image from 'next/image'
import Link from 'next/link'

interface CategoryIconProps {
  icon: string
  label: string
  href: string
}

export function CategoryIcon({ icon, label, href }: CategoryIconProps) {
  return (
    <Link 
      href={href} 
      className="flex flex-col items-center gap-2 transition-transform hover:scale-[1.05]"
    >
      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center relative shadow-sm hover:shadow-base transition-shadow">
        <Image
          src={icon}
          alt={label}
          fill
          sizes="48px"
          className="p-2"
          unoptimized
        />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </Link>
  )
} 