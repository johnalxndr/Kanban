"use client"

import { useState, useEffect, useMemo } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { Plus, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import KanbanColumn from "./kanban-column"
import TaskCard from "./task-card"
import NewTaskForm from "./new-task-form"
import EditTaskForm from "./edit-task-form"
import TagFilter from "./tag-filter"
import ProjectFilter from "./project-filter"
import SettingsSheet from "./settings-sheet"
import type { Task, Column, User } from "@/lib/types"
import { initialData } from "@/lib/initial-data"

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [settingsSheetOpen, setSettingsSheetOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [customTags, setCustomTags] = useState<string[]>([])
  const [customProjects, setCustomProjects] = useState<string[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  useEffect(() => {
    // Load data from localStorage or use initial data
    const savedData = localStorage.getItem("kanbanData")
    if (savedData) {
      const { columns, tasks, users, customTags = [], customProjects = [] } = JSON.parse(savedData)

      // Ensure tasks have order property
      const tasksWithOrder = tasks.map((task: Task, index: number) => ({
        ...task,
        order: task.order !== undefined ? task.order : index,
      }))

      setColumns(columns)
      setTasks(tasksWithOrder)
      setUsers(users)
      setCustomTags(customTags)
      setCustomProjects(customProjects)
    } else {
      // Initialize with order property for each task
      const tasksWithOrder = initialData.tasks.map((task, index) => ({
        ...task,
        order: index,
      }))

      setColumns(initialData.columns)
      setTasks(tasksWithOrder)
      setUsers(initialData.users)
    }
  }, [])

  useEffect(() => {
    // Save data to localStorage whenever it changes
    if (columns.length > 0 && tasks.length > 0) {
      localStorage.setItem(
        "kanbanData",
        JSON.stringify({
          columns,
          tasks,
          users,
          customTags,
          customProjects,
        }),
      )
    }
  }, [columns, tasks, users, customTags, customProjects])

  // Get all unique tags from tasks and custom tags
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>([...customTags])
    tasks.forEach((task) => {
      task.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet)
  }, [tasks, customTags])

  // Get all unique projects from tasks and custom projects
  const availableProjects = useMemo(() => {
    const projectSet = new Set<string>([...customProjects])
    tasks.forEach((task) => {
      projectSet.add(task.project)
    })
    return Array.from(projectSet)
  }, [tasks, customProjects])

  // Filter tasks based on selected tags and projects
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by tags if any are selected
      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => task.tags.includes(tag))

      // Filter by projects if any are selected
      const matchesProjects = selectedProjects.length === 0 || selectedProjects.includes(task.project)

      // Task must match both filters
      return matchesTags && matchesProjects
    })
  }, [tasks, selectedTags, selectedProjects])

  // Group tasks by column and sort by order
  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, Task[]> = {}

    columns.forEach((column) => {
      const columnTasks = filteredTasks
        .filter((task) => task.columnId === column.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0))

      grouped[column.id] = columnTasks
    })

    return grouped
  }, [filteredTasks, columns])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)

    const draggedTask = tasks.find((task) => task.id === active.id)
    if (draggedTask) {
      setActiveTask(draggedTask)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeTaskId = active.id as string
    const overId = over.id as string

    // Find the task being dragged
    const activeTask = tasks.find((task) => task.id === activeTaskId)

    if (!activeTask) return

    // If dragging over a column, update the task's column
    if (overId.startsWith("column-")) {
      const newColumnId = overId.replace("column-", "")

      // Only update if the column has changed
      if (activeTask.columnId !== newColumnId) {
        // Get the highest order in the target column
        const columnTasks = tasks.filter((task) => task.columnId === newColumnId)
        const highestOrder =
          columnTasks.length > 0 ? Math.max(...columnTasks.map((task) => task.order || 0)) + 1 : 0

        setTasks(
          tasks.map((task) =>
            task.id === activeTaskId ? { ...task, columnId: newColumnId, order: highestOrder } : task,
          ),
        )
      }
    }
    // If dragging over another task, find its column and update
    else {
      const overTask = tasks.find((task) => task.id === overId)
      if (overTask && activeTask.columnId !== overTask.columnId) {
        // Get the highest order in the target column
        const columnTasks = tasks.filter((task) => task.columnId === overTask.columnId)
        const highestOrder = columnTasks.length > 0 ? Math.max(...columnTasks.map((task) => task.order || 0)) + 1 : 0

        setTasks(
          tasks.map((task) =>
            task.id === activeTaskId ? { ...task, columnId: overTask.columnId, order: highestOrder } : task,
          ),
        )
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const activeId = active.id as string
      const overId = over.id as string

      // Find the active task
      const activeTask = tasks.find((task) => task.id === activeId)

      if (!activeTask) {
        setActiveId(null)
        setActiveTask(null)
        return
      }

      // If dropping over a task (reordering within the same column)
      if (!overId.startsWith("column-")) {
        const overTask = tasks.find((task) => task.id === overId)

        if (overTask && activeTask.columnId === overTask.columnId) {
          // Get all tasks in this column
          const columnTasks = tasks
            .filter((task) => task.columnId === activeTask.columnId)
            .sort((a, b) => (a.order || 0) - (b.order || 0))

          // Find the indices
          const activeIndex = columnTasks.findIndex((task) => task.id === activeId)
          const overIndex = columnTasks.findIndex((task) => task.id === overId)

          if (activeIndex !== -1 && overIndex !== -1) {
            // Reorder the column tasks
            const newColumnTasks = arrayMove(columnTasks, activeIndex, overIndex)

            // Update the order of all tasks in the column
            const updatedTasks = tasks.map((task) => {
              if (task.columnId === activeTask.columnId) {
                const newIndex = newColumnTasks.findIndex((t) => t.id === task.id)
                return { ...task, order: newIndex }
              }
              return task
            })

            setTasks(updatedTasks)
          }
        }
      }
    }

    setActiveId(null)
    setActiveTask(null)
  }

  const addNewTask = (newTask: Task) => {
    // Find the highest order in the target column
    const columnTasks = tasks.filter((task) => task.columnId === newTask.columnId)
    const highestOrder = columnTasks.length > 0 ? Math.max(...columnTasks.map((task) => task.order || 0)) + 1 : 0

    // Add the new task with the correct order
    setTasks([...tasks, { ...newTask, order: highestOrder }])
    setCreateDialogOpen(false)
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task)
    setEditDialogOpen(true)
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditDialogOpen(false)
    setTaskToEdit(null)
  }

  const handleAddTag = (tag: string) => {
    if (!availableTags.includes(tag)) {
      setCustomTags([...customTags, tag])
    }
  }

  const handleAddProject = (project: string) => {
    if (!availableProjects.includes(project)) {
      setCustomProjects([...customProjects, project])
    }
  }

  // Settings actions
  const handleClearAllData = () => {
    // Reset to initial data
    const tasksWithOrder = initialData.tasks.map((task, index) => ({
      ...task,
      order: index,
    }))
    setColumns(initialData.columns)
    setTasks(tasksWithOrder)
    setCustomTags([])
    setCustomProjects([])
    setSelectedTags([])
    setSelectedProjects([])
    setSettingsSheetOpen(false)
  }

  const handleClearTasks = () => {
    setTasks([])
    setSettingsSheetOpen(false)
  }

  const handleClearTags = () => {
    setCustomTags([])
    setSelectedTags([])
    setSettingsSheetOpen(false)
  }

  const handleClearProjects = () => {
    setCustomProjects([])
    setSelectedProjects([])
    setSettingsSheetOpen(false)
  }

  // Calculate total number of filtered tasks
  const totalFilteredTasks = filteredTasks.length

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">KanBan</h1>
        <div className="flex items-center gap-2">
          <TagFilter
            availableTags={availableTags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            onAddTag={handleAddTag}
          />
          <ProjectFilter
            availableProjects={availableProjects}
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
            onAddProject={handleAddProject}
          />
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <NewTaskForm
                columns={columns}
                onAddTask={addNewTask}
                availableTags={availableTags}
                availableProjects={availableProjects}
                onAddTag={handleAddTag}
                onAddProject={handleAddProject}
              />
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="outline" onClick={() => setSettingsSheetOpen(true)}>
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>

      {/* Settings Sheet */}
      <SettingsSheet
        open={settingsSheetOpen}
        onOpenChange={setSettingsSheetOpen}
        onClearAllData={handleClearAllData}
        onClearTasks={handleClearTasks}
        onClearTags={handleClearTags}
        onClearProjects={handleClearProjects}
      />

      {/* Edit Task Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {taskToEdit && (
            <EditTaskForm
              task={taskToEdit}
              columns={columns}
              availableProjects={availableProjects}
              availableTags={availableTags}
              onUpdateTask={updateTask}
              onCancel={() => {
                setEditDialogOpen(false)
                setTaskToEdit(null)
              }}
              onAddProject={handleAddProject}
              onAddTag={handleAddTag}
            />
          )}
        </DialogContent>
      </Dialog>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column) => {
            const columnTasks = tasksByColumn[column.id] || []
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                columns={columns}
                tasks={columnTasks}
                users={users}
                onDeleteTask={deleteTask}
                onAddTask={addNewTask}
                onEditTask={handleEditTask}
                projects={availableProjects.length > 0 ? availableProjects : ["Studio"]}
                totalTasks={totalFilteredTasks}
              />
            )
          })}
        </div>

        <DragOverlay modifiers={[restrictToWindowEdges]}>
          {activeId && activeTask ? (
            <div className="opacity-80">
              <TaskCard task={activeTask} users={users} onDelete={() => {}} isDragging={true} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

