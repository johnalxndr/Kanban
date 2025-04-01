export interface Task {
  id: string
  title: string
  description?: string
  columnId: string
  project: string
  dueDate?: string
  tags: string[]
  createdAt: string
  order?: number // Add order property to track position within column
}

export interface Column {
  id: string
  title: string
  order: number
}

