"use client"

import { useState, useRef } from "react"
import { TagIcon, Check, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import CreateNewItem from "./create-new-item"

interface TagFilterProps {
  availableTags: string[]
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  onAddTag: (tag: string) => void
}

export default function TagFilter({ availableTags, selectedTags, setSelectedTags, onAddTag }: TagFilterProps) {
  const [open, setOpen] = useState(false)
  const [commandInput, setCommandInput] = useState("")
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const commandInputRef = useRef<HTMLInputElement>(null)

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    setSelectedTags([])
  }

  const handleAddNewTag = (tagName: string) => {
    onAddTag(tagName)
    setIsCreatingNew(false)
    // Optionally select the new tag
    setSelectedTags([...selectedTags, tagName])
  }

  // Display the first selected tag, or empty string if none selected
  const displayTag = selectedTags.length > 0 ? selectedTags[0] : ""
  // Count of additional tags beyond the first one
  const additionalTags = selectedTags.length > 1 ? selectedTags.length - 1 : 0

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (!open) {
          setTimeout(() => {
            setCommandInput("")
            setIsCreatingNew(false)
          }, 200)
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border border-dashed border-border flex items-center gap-1.5"
        >
          {selectedTags.length === 0 ? (
            <div className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              <span>Tag</span>
            </div>
          ) : (
            <div className="flex items-center">
              <TagIcon className="h-4 w-4 mr-2" />
              <span>{displayTag}</span>
              {additionalTags > 0 && (
                <span className="ml-1 text-xs text-muted-foreground">{`+${additionalTags}`}</span>
              )}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search tags..."
            className="h-9"
            value={commandInput}
            onValueChange={setCommandInput}
            ref={commandInputRef}
          />
          <CommandList>
            <CommandEmpty>
              {!isCreatingNew && (
                <div className="py-2 px-2 text-sm text-center">
                  <p className="text-muted-foreground">No tags found.</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full justify-center"
                    onClick={() => setIsCreatingNew(true)}
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    Create "{commandInput}"
                  </Button>
                </div>
              )}
            </CommandEmpty>
            <CommandGroup heading="Available tags">
              {availableTags.map((tag) => (
                <CommandItem
                  key={tag}
                  value={tag}
                  onSelect={() => handleTagSelect(tag)}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <TagIcon className="h-3 w-3" />
                    <span>{tag}</span>
                  </div>
                  {selectedTags.includes(tag) && <Check className="h-4 w-4 text-primary" />}
                </CommandItem>
              ))}
            </CommandGroup>

            {!isCreatingNew && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => setIsCreatingNew(true)} className="text-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create new tag
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>

          {isCreatingNew && (
            <div className="border-t">
              <CreateNewItem type="tag" onAdd={handleAddNewTag} onCancel={() => setIsCreatingNew(false)} />
            </div>
          )}

          {selectedTags.length > 0 && !isCreatingNew && (
            <div className="border-t p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs justify-center" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

