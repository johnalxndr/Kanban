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
}

export default function SettingsSheet({
  open,
  onOpenChange,
  onClearAllData,
}: SettingsSheetProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>Configure your Kanban board settings and manage your data.</SheetDescription>
          </SheetHeader>

          <div className="flex flex-col space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Data Management</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive px-4"
                  onClick={() => setConfirmDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear all data
                </Button>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-auto pt-4">
            <Button variant="outline" className="px-4" onClick={() => onOpenChange(false)}>
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
              Clear all data
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all tasks, tags, and projects. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onClearAllData()
                setConfirmDialogOpen(false)
              }}
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

