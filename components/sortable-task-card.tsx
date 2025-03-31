"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Task, User, Column } from "@/lib/types"
import TaskCard from "./task-card"

interface SortableTaskCardProps {
  task: Task
  users: User[]
  columns?: Column[] // Add columns prop
  onDelete: (id: string) => void
  onEdit?: (task: Task) => void // Add onEdit prop
}

export default function SortableTaskCard({ task, users, columns, onDelete, onEdit }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        users={users}
        columns={columns}
        onDelete={onDelete}
        onEdit={onEdit}
        isDragging={isDragging}
      />
    </div>
  )
}

