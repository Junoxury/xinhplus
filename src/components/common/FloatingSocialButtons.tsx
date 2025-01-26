import { Facebook, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function FloatingSocialButtons() {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4">
      <Link
        href="https://facebook.com"
        target="_blank"
        className="bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition-colors"
      >
        <Facebook size={24} />
      </Link>
      <Link
        href="https://zalo.me"
        target="_blank"
        className="bg-blue-500 p-3 rounded-full text-white hover:bg-blue-600 transition-colors"
      >
        <MessageCircle size={24} />
      </Link>
    </div>
  )
} 