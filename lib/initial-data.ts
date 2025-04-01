import type { Column, Task } from "./types"

export const initialData = {
  columns: [
    { id: "backlog", title: "Backlog", order: 0 },
    { id: "in-progress", title: "In progress", order: 1 },
    { id: "done", title: "Done", order: 2 },
  ] as Column[],

  tasks: [
    {
      id: "task-1",
      title: "setup analytics",
      columnId: "backlog",
      project: "Kanban",
      tags: ["Feature"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-2",
      title: "setup feedback component",
      columnId: "backlog",
      project: "Kanban",
      tags: ["Bug"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-5",
      title: "Post on X",
      columnId: "in-progress",
      project: "Kanban",
      tags: ["Bug"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-6",
      title: "Record Video",
      columnId: "done",
      project: "Kanban",
      tags: ["Feature"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-7",
      title: "Update README",
      columnId: "done",
      project: "Kanban",
      tags: ["Documentation"],
      createdAt: new Date().toISOString(),
    },
  ] as Task[],
}

