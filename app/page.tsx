'use client'

import { useMemo, useState } from 'react'

import { Dashboard } from '@/components/evidencepilot/Dashboard'
import { PROJECTS, SOURCE_SETS } from '@/components/evidencepilot/mock-data'
import type { ActorRole, ProjectWorkspace, SourceSet } from '@/components/evidencepilot/types'
import { Workspace } from '@/components/evidencepilot/Workspace'

export default function EvidencePilotPrototype() {
  const [actor, setActor] = useState<ActorRole>('student')
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [projects, setProjects] = useState<ProjectWorkspace[]>(PROJECTS)
  const [sourceSets, setSourceSets] = useState<SourceSet[]>(SOURCE_SETS)

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

  function handleCreateSourceSet() {
    if (sourceSets.some((sourceSet) => sourceSet.id === 'source-set-created')) return

    setSourceSets((current) => [
      ...current,
      {
        id: 'source-set-created',
        name: 'Instructor Created Evidence Set',
        description: 'Prototype source set created from the instructor dashboard.',
        tags: ['Instructor Created', 'Evidence'],
        visibility: 'Private',
        ownerName: 'Instructor',
        sharedProjectIds: [],
        sources: [
          {
            id: 'instructor-created-source-1',
            title: 'created-source-overview.pdf',
            type: 'PDF',
            status: 'Ready',
            excerpt: 'Instructor-created source prepared for sharing into a student evidence workspace.',
            owner: 'instructor',
            sourceSetId: 'source-set-created',
            sharedBy: 'Instructor',
            themes: ['created source', 'evidence pack'],
          },
        ],
      },
    ])
  }

  function handleAddSourceToSet(sourceSetId: string) {
    setSourceSets((current) =>
      current.map((sourceSet) => {
        if (sourceSet.id !== sourceSetId) return sourceSet
        const sourceId = `${sourceSetId}-added-source`
        if (sourceSet.sources.some((source) => source.id === sourceId)) return sourceSet

        return {
          ...sourceSet,
          sources: [
            ...sourceSet.sources,
            {
              id: sourceId,
              title: 'added-instructor-source.docx',
              type: 'DOCX',
              status: 'Ready',
              excerpt: 'Newly added instructor source with reusable evidence for claim review and student support.',
              owner: 'instructor',
              sourceSetId,
              sharedBy: sourceSet.ownerName,
              themes: ['added source', 'claim support'],
            },
          ],
        }
      }),
    )
  }

  function handleShareSourceSet(sourceSetId: string, projectId: string) {
    setSourceSets((current) =>
      current.map((sourceSet) => {
        if (sourceSet.id !== sourceSetId) return sourceSet
        if (sourceSet.sharedProjectIds.includes(projectId)) return sourceSet

        return {
          ...sourceSet,
          visibility: 'Shared',
          sharedProjectIds: [...sourceSet.sharedProjectIds, projectId],
        }
      }),
    )
  }

  if (activeProject) {
    const sharedSourceSets = sourceSets.filter((sourceSet) => sourceSet.sharedProjectIds.includes(activeProject.id))

    return (
      <Workspace
        actor={actor}
        project={activeProject}
        sharedSourceSets={sharedSourceSets}
        onBack={() => setActiveProjectId(null)}
        onProjectChange={handleProjectChange}
      />
    )
  }

  return (
    <Dashboard
      actor={actor}
      projects={projects}
      sourceSets={sourceSets}
      onActorChange={handleActorChange}
      onAddSourceToSet={handleAddSourceToSet}
      onCreateSourceSet={handleCreateSourceSet}
      onOpenProject={setActiveProjectId}
      onShareSourceSet={handleShareSourceSet}
    />
  )
}
