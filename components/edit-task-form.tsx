"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import type { Task, Column } from "@/lib/types"
import ProjectFilter from "./project-filter"
import TagFilter from "./tag-filter"

interface EditTaskFormProps {
  task: Task
  columns: Column[]
  availableProjects: string[]
  availableTags: string[]
  onUpdateTask: (updatedTask: Task) => void
  onCancel: () => void
  onAddProject: (project: string) => void
  onAddTag: (tag: string) => void
}

export default function EditTaskForm({ 
  task, 
  columns, 
  availableProjects,
  availableTags,
  onUpdateTask, 
  onCancel,
  onAddProject,
  onAddTag 
}: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")
  const [columnId, setColumnId] = useState(task.columnId)
  const [project, setProject] = useState(task.project)
  const [tags, setTags] = useState<string[]>([...task.tags])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !columnId) return

    const updatedTask: Task = {
      ...task,
      title,
      description,
      columnId,
      project,
      tags,
    }

    onUpdateTask(updatedTask)
  }

  const getColumnTitle = () => {
    return columns.find((col) => col.id === columnId)?.title || "Select column"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-mono">
      {/* Title input */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Issue title"
        className="text-xl font-medium border-none px-0 shadow-none focus-visible:ring-0"
        required
      />

      {/* Description textarea */}
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add description..."
        className="min-h-24 resize-none border-none px-0 shadow-none focus-visible:ring-0"
        rows={3}
      />

      {/* Metadata row */}
      <div className="flex flex-wrap gap-2 pt-2">
        {/* Status */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border border-dashed border-border flex items-center gap-1.5"
            >
              {columnId ? (
                <div className="flex items-center">
                  <span>{getColumnTitle()}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Plus className="h-4 w-4 mr-1" />
                  <span>Status</span>
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {columns.map((column) => (
                    <CommandItem
                      key={column.id}
                      value={column.title}
                      onSelect={() => setColumnId(column.id)}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span>{column.title}</span>
                      </div>
                      {columnId === column.id && <span className="text-primary">✓</span>}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Project Filter */}
        <ProjectFilter
          availableProjects={availableProjects}
          selectedProjects={[project]}
          setSelectedProjects={(projects) => setProject(projects[0] || "")}
          onAddProject={onAddProject}
        />

        {/* Tag Filter */}
        <TagFilter
          availableTags={availableTags}
          selectedTags={tags}
          setSelectedTags={setTags}
          onAddTag={onAddTag}
        />
      </div>

      {/* Submit and Cancel buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" className="px-6" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="px-6">
          Save changes
        </Button>
      </div>
    </form>
  )
}

