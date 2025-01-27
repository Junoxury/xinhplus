import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-6 text-center">
        {description}
      </p>
      <Button 
        onClick={onAction}
        className="bg-pink-500 hover:bg-pink-600 text-white"
      >
        {actionLabel}
      </Button>
    </div>
  )
} 