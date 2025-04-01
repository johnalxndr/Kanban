"use client"

import type React from "react"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Task } from "@/lib/types"

interface QuickAddTaskProps {
  columnId: string
  onAddTask: (task: Task) => void
  projects: string[]
}

export default function QuickAddTask({ columnId, onAddTask, projects }: QuickAddTaskProps) {
  const [title, setTitle] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    const newTask: Task = {
      id: uuidv4(),
      title,
      columnId,
      project: projects.length > 0 ? projects[0] : "", // Only use first project if available
      tags: [],
      createdAt: new Date().toISOString(),
    }

    onAddTask(newTask)
    setTitle("")
    setIsExpanded(false)
  }

  return (
    <div className="border border-dashed border-border rounded p-2 mt-3">
      {isExpanded ? (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task"
            className="flex-1"
            autoFocus
          />
          <Button type="submit" size="sm">
            Add
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setIsExpanded(false)}>
            Cancel
          </Button>
        </form>
      ) : (
        <Button variant="ghost" className="w-full justify-start" onClick={() => setIsExpanded(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add a task
        </Button>
      )}
    </div>
  )
}

