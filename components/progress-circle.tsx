"use client"

import { cn } from "@/lib/utils"

interface ProgressCircleProps {
  percentage: number
  size?: number
  strokeWidth?: number
  className?: string
}

export default function ProgressCircle({ percentage, size = 50, strokeWidth = 5, className }: ProgressCircleProps) {
  // Ensure percentage is between 0 and 100
  const normalizedPercentage = Math.min(100, Math.max(0, percentage))

  // Calculate radius (accounting for stroke width)
  const radius = size / 2 - strokeWidth / 2

  // Calculate the circumference of the circle
  const circumference = 2 * Math.PI * radius

  // Calculate the dash offset based on the percentage
  const dashOffset = circumference - (normalizedPercentage / 100) * circumference

  // Determine color based on percentage
  const getProgressColor = () => {
    if (normalizedPercentage >= 90) return "stroke-green-500"
    if (normalizedPercentage >= 60) return "stroke-blue-500"
    if (normalizedPercentage >= 30) return "stroke-amber-500"
    return "stroke-rose-500"
  }

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted/40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className={`transition-all duration-700 ease-out ${getProgressColor()}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold font-mono">{Math.round(normalizedPercentage)}%</span>
      </div>
    </div>
  )
}

