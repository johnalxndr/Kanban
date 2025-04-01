"use client"

import { useState, useRef } from "react"
import { FolderKanban, Check, Plus } from "lucide-react"
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

interface ProjectFilterProps {
  availableProjects: string[]
  selectedProjects: string[]
  setSelectedProjects: (projects: string[]) => void
  onAddProject: (project: string) => void
}

export default function ProjectFilter({
  availableProjects,
  selectedProjects,
  setSelectedProjects,
  onAddProject,
}: ProjectFilterProps) {
  const [open, setOpen] = useState(false)
  const [commandInput, setCommandInput] = useState("")
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const commandInputRef = useRef<HTMLInputElement>(null)

  const handleProjectSelect = (project: string) => {
    if (selectedProjects.includes(project)) {
      setSelectedProjects(selectedProjects.filter((p) => p !== project))
    } else {
      setSelectedProjects([...selectedProjects, project])
    }
  }

  const handleAddNewProject = (projectName: string) => {
    onAddProject(projectName)
    setIsCreatingNew(false)
    // Optionally select the new project
    setSelectedProjects([...selectedProjects, projectName])
  }

  // Display the first selected project, or empty string if none selected
  const displayProject = selectedProjects.length > 0 ? selectedProjects[0] : ""
  // Count of additional projects beyond the first one
  const additionalProjects = selectedProjects.length > 1 ? selectedProjects.length - 1 : 0

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
          {selectedProjects.length === 0 ? (
            <div className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              <span>Project</span>
            </div>
          ) : (
            <div className="flex items-center">
              <FolderKanban className="h-4 w-4 mr-2" />
              <span>{displayProject}</span>
              {additionalProjects > 0 && (
                <span className="ml-1 text-xs text-muted-foreground">{`+${additionalProjects}`}</span>
              )}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search projects..."
            className="h-9"
            value={commandInput}
            onValueChange={setCommandInput}
            ref={commandInputRef}
          />
          <CommandList>
            <CommandEmpty>
              {!isCreatingNew && (
                <div className="py-2 px-2 text-sm text-center">
                  <p className="text-muted-foreground">No projects found.</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full justify-center"
                    onClick={() => setIsCreatingNew(true)}
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    Create &quot;{commandInput}&quot;
                  </Button>
                </div>
              )}
            </CommandEmpty>
            <CommandGroup heading="Available projects">
              {availableProjects.map((project) => (
                <CommandItem
                  key={project}
                  value={project}
                  onSelect={() => handleProjectSelect(project)}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <FolderKanban className="h-3 w-3" />
                    <span>{project}</span>
                  </div>
                  {selectedProjects.includes(project) && <Check className="h-4 w-4 text-primary" />}
                </CommandItem>
              ))}
            </CommandGroup>

            {!isCreatingNew && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => setIsCreatingNew(true)} className="text-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create new project
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>

          {isCreatingNew && (
            <div className="border-t">
              <CreateNewItem type="project" onAdd={handleAddNewProject} onCancel={() => setIsCreatingNew(false)} />
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

