"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Task, Column } from "@/lib/types"
import SortableTaskCard from "./sortable-task-card"
import QuickAddTask from "./quick-add-task"
import ProgressCircle from "./progress-circle"

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  onDeleteTask: (id: string) => void
  onAddTask: (task: Task) => void
  onEditTask?: (task: Task) => void
  projects: string[]
  totalTasks: number
}

export default function KanbanColumn({
  column,
  tasks,
  onDeleteTask,
  onAddTask,
  onEditTask,
  projects,
  totalTasks,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: `column-${column.id}`,
  })

  // Calculate percentage for the progress indicator (only for Done column)
  const isDoneColumn = column.id === "done"
  const percentage = isDoneColumn && totalTasks > 0 ? (tasks.length / totalTasks) * 100 : 0

  return (
    <div ref={setNodeRef} className="flex flex-col h-full min-h-[70vh]">
      <div className="p-3 border-b border-border">
        <div className="flex justify-between items-center h-14">
          <h2 className="text-lg font-medium text-foreground">{column.title}</h2>

          <div className="flex items-center justify-center">
            {isDoneColumn ? (
              <ProgressCircle percentage={percentage} size={50} />
            ) : (
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
                <span className="font-mono">{tasks.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
              />
            ))}
          </div>
        </SortableContext>

        {column.id !== "done" && <QuickAddTask columnId={column.id} onAddTask={onAddTask} projects={projects} />}
      </div>
    </div>
  )
}

