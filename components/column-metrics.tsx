"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ColumnMetricsProps {
  count: number
  total: number
  title: string
}

export default function ColumnMetrics({ count, total, title }: ColumnMetricsProps) {
  const percentage = useMemo(() => {
    return total > 0 ? Math.round((count / total) * 100) : 0
  }, [count, total])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {count}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">
            {count} tasks in {title} ({percentage}% of total)
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

