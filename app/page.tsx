import KanbanBoard from "@/components/kanban-board"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4 font-mono">
      <KanbanBoard />
    </main>
  )
}

