import type { Column, Task, User } from "./types"

export const initialData = {
  columns: [
    { id: "backlog", title: "Backlog", order: 0 },
    { id: "in-progress", title: "In progress", order: 1 },
    { id: "done", title: "Done", order: 2 },
  ] as Column[],

  users: [{ id: "user-1", name: "Omar Geidt", avatar: "/placeholder.svg?height=32&width=32" }] as User[],

  tasks: [
    {
      id: "task-1",
      title: "Implement authentication",
      columnId: "backlog",
      project: "Studio",
      tags: ["Feature"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-2",
      title: "Fix navigation bug",
      columnId: "backlog",
      project: "Studio",
      tags: ["Bug"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-3",
      title: "Update API documentation",
      columnId: "backlog",
      project: "Studio",
      tags: ["Documentation"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-4",
      title: "Implement user profile page",
      columnId: "in-progress",
      project: "Studio",
      tags: ["Feature"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-5",
      title: "Fix login form validation",
      columnId: "in-progress",
      project: "Studio",
      tags: ["Bug"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-6",
      title: "Add unit tests",
      columnId: "done",
      project: "Studio",
      tags: ["Feature"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-7",
      title: "Update README",
      columnId: "done",
      project: "Studio",
      tags: ["Documentation"],
      createdAt: new Date().toISOString(),
    },
  ] as Task[],
}

