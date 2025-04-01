import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import EditTaskForm from "./edit-task-form"
import type { Column, Task } from "@/lib/types"

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  columns: Column[]
  availableTags: string[]
  availableProjects: string[]
  onUpdateTask: (task: Task) => void
  onAddTag: (tag: string) => void
  onAddProject: (project: string) => void
}

export default function EditTaskDialog({
  open,
  onOpenChange,
  task,
  columns,
  availableTags,
  availableProjects,
  onUpdateTask,
  onAddTag,
  onAddProject,
}: EditTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Edit Task</DialogTitle>
        </DialogHeader>
        {task && (
          <EditTaskForm
            task={task}
            columns={columns}
            availableProjects={availableProjects}
            availableTags={availableTags}
            onUpdateTask={onUpdateTask}
            onCancel={() => onOpenChange(false)}
            onAddProject={onAddProject}
            onAddTag={onAddTag}
          />
        )}
      </DialogContent>
    </Dialog>
  )
} 