import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { IconType } from "react-icons"

interface ShapeToolProps {
  onClick: () => void
  icon: LucideIcon | IconType
  iconClassName?: string
}

export const ShapeTool = ({
  onClick,
  icon: Icon,
  iconClassName,
}: ShapeToolProps) => {
  return (
    <button onClick={onClick} className="aspect-square border rounded-md p-5">
      <Icon className={cn("h-full w-full", iconClassName)} />
    </button>
  )
}
