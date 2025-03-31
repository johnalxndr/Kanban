"use client"

import { useState } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SettingsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClearAllData: () => void
  onClearTasks: () => void
  onClearTags: () => void
  onClearProjects: () => void
}

export default function SettingsSheet({
  open,
  onOpenChange,
  onClearAllData,
  onClearTasks,
  onClearTags,
  onClearProjects,
}: SettingsSheetProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [actionToConfirm, setActionToConfirm] = useState<"all" | "tasks" | "tags" | "projects">("all")
  const [confirmTitle, setConfirmTitle] = useState("")
  const [confirmDescription, setConfirmDescription] = useState("")

  const handleConfirmAction = () => {
    switch (actionToConfirm) {
      case "all":
        onClearAllData()
        break
      case "tasks":
        onClearTasks()
        break
      case "tags":
        onClearTags()
        break
      case "projects":
        onClearProjects()
        break
    }
    setConfirmDialogOpen(false)
  }

  const openConfirmDialog = (action: "all" | "tasks" | "tags" | "projects", title: string, description: string) => {
    setActionToConfirm(action)
    setConfirmTitle(title)
    setConfirmDescription(description)
    setConfirmDialogOpen(true)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>Configure your Kanban board settings and manage your data.</SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Data Management</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive"
                  onClick={() =>
                    openConfirmDialog(
                      "all",
                      "Clear all data",
                      "This will permanently delete all tasks, tags, and projects. This action cannot be undone.",
                    )
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear all data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    openConfirmDialog(
                      "tasks",
                      "Clear all tasks",
                      "This will permanently delete all tasks. This action cannot be undone.",
                    )
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear all tasks
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    openConfirmDialog(
                      "tags",
                      "Clear all custom tags",
                      "This will permanently delete all custom tags. This action cannot be undone.",
                    )
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear all custom tags
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    openConfirmDialog(
                      "projects",
                      "Clear all custom projects",
                      "This will permanently delete all custom projects. This action cannot be undone.",
                    )
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear all custom projects
                </Button>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              {confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

