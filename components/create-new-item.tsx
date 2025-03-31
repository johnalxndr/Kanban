"use client"

import type React from "react"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CreateNewItemProps {
  type: "tag" | "project"
  onAdd: (name: string) => void
  onCancel: () => void
}

export default function CreateNewItem({ type, onAdd, onCancel }: CreateNewItemProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAdd(name.trim())
      setName("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={`New ${type} name...`}
        className="h-8 flex-1"
        autoFocus
      />
      <Button type="submit" size="icon" variant="ghost" className="h-8 w-8" disabled={!name.trim()}>
        <Check className="h-4 w-4" />
        <span className="sr-only">Add</span>
      </Button>
      <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={onCancel}>
        <X className="h-4 w-4" />
        <span className="sr-only">Cancel</span>
      </Button>
    </form>
  )
}

