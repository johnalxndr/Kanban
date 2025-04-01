import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import NewTaskForm from "./new-task-form"
import type { Column, Task } from "@/lib/types"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  columns: Column[]
  availableTags: string[]
  availableProjects: string[]
  onAddTask: (task: Task) => void
  onAddTag: (tag: string) => void
  onAddProject: (project: string) => void
}

export default function CreateTaskDialog({
  open,
  onOpenChange,
  columns,
  availableTags,
  availableProjects,
  onAddTask,
  onAddTag,
  onAddProject,
}: CreateTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="sr-only ">Create Task</DialogTitle>
        </DialogHeader>
        <NewTaskForm
          columns={columns}
          onAddTask={onAddTask}
          availableTags={availableTags}
          availableProjects={availableProjects}
          onAddTag={onAddTag}
          onAddProject={onAddProject}
        />
      </DialogContent>
    </Dialog>
  )
} 