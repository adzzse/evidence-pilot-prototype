'use client'

import { useMemo, useState } from 'react'

import { Dashboard } from '@/components/evidencepilot/Dashboard'
import { PROJECTS } from '@/components/evidencepilot/mock-data'
import type { ActorRole, ProjectWorkspace } from '@/components/evidencepilot/types'
import { Workspace } from '@/components/evidencepilot/Workspace'

export default function EvidencePilotPrototype() {
  const [actor, setActor] = useState<ActorRole>('student')
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [projects, setProjects] = useState<ProjectWorkspace[]>(PROJECTS)

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [activeProjectId, projects],
  )

  function handleActorChange(nextActor: ActorRole) {
    setActor(nextActor)
    setActiveProjectId(null)
  }

  function handleProjectChange(updatedProject: ProjectWorkspace) {
    setProjects((current) =>
      current.map((project) => (project.id === updatedProject.id ? updatedProject : project)),
    )
  }

  if (activeProject) {
    return (
      <Workspace
        actor={actor}
        project={activeProject}
        onBack={() => setActiveProjectId(null)}
        onProjectChange={handleProjectChange}
      />
    )
  }

  return (
    <Dashboard
      actor={actor}
      projects={projects}
      onActorChange={handleActorChange}
      onOpenProject={setActiveProjectId}
    />
  )
}
