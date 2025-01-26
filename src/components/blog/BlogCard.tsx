import Image from 'next/image'
import { Heart, MessageCircle, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface BlogCardProps {
  id: string
  title: string
  content: string
  thumbnail: string
  author: {
    name: string
    avatar: string
  }
  date: string
  tags: string[]
  likes: number
  comments: number
  views: number
}

export function BlogCard({
  title,
  content,
  thumbnail,
  author,
  date,
  tags,
  likes,
  comments,
  views
}: BlogCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      {/* 썸네일 이미지 */}
      <div className="relative h-[200px]">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* 제목 */}
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{title}</h3>

        {/* 내용 미리보기 */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {content}
        </p>

        {/* 작성자 정보 & 통계 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{author.name}</div>
              <div className="text-xs text-gray-500">{date}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 