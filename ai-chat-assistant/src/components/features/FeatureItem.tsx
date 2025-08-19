import { LucideIcon } from "lucide-react"

interface FeatureItemProps {
  icon: LucideIcon
  title: string
  description: string
  isHighlighted?: boolean
}

export function FeatureItem({ 
  icon: Icon, 
  title, 
  description, 
  isHighlighted = false 
}: FeatureItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {isHighlighted ? (
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm mr-2">
              {title}
            </span>
          ) : (
            title
          )}
        </h3>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  )
}