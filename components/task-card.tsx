"use client"

import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Task, User, Column } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TaskCardProps {
  task: Task
  users: User[]
  columns?: Column[] // Add columns prop for edit functionality
  onDelete: (id: string) => void
  onEdit?: (task: Task) => void // Add onEdit prop
  isDragging?: boolean
}

export default function TaskCard({ task, users, columns, onDelete, onEdit, isDragging = false }: TaskCardProps) {
  // Check if the task is in the "done" column
  const isDone = task.columnId === "done"

  return (
    <div
      className={`bg-card rounded border border-border overflow-hidden ${isDragging ? "shadow-lg" : ""} ${
        isDone ? "opacity-80 bg-muted" : ""
      }`}
    >
      <div className="p-3 space-y-2">
        <div className="flex justify-between items-start">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3
                  className={`font-medium text-foreground text-sm truncate max-w-[180px] ${
                    isDone ? "line-through decoration-1 decoration-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </h3>
              </TooltipTrigger>
              <TooltipContent side="top" align="start">
                <p className="text-xs">{task.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-xs text-muted-foreground ml-2 shrink-0">{task.project}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1 overflow-hidden max-w-[70%]">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className={`text-xs ${isDone ? "opacity-70" : ""}`}>
                {tag}
              </Badge>
            ))}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit task
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(task.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

