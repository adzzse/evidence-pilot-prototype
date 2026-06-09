'use client'

import { useMemo, useState } from 'react'

import { Dashboard } from '@/components/evidencepilot/Dashboard'
import { PROJECTS, SOURCE_SETS } from '@/components/evidencepilot/mock-data'
import type { ActorRole, ProjectWorkspace, SourceSet } from '@/components/evidencepilot/types'
import { Workspace } from '@/components/evidencepilot/Workspace'

const UPLOAD_SOURCE_TEMPLATES = [
  {
    title: 'added-risk-escalation-notes.pdf',
    type: 'PDF' as const,
    excerpt: 'Escalation notes compare communication checkpoints, decision ownership, and risk response timing.',
    themes: ['risk control', 'decision ownership'],
  },
  {
    title: 'added-feedback-quality-review.docx',
    type: 'DOCX' as const,
    excerpt: 'Feedback quality improves when reviewers separate evidence relevance from writing clarity.',
    themes: ['feedback quality', 'review rubric'],
  },
  {
    title: 'added-traceability-matrix.pdf',
    type: 'PDF' as const,
    excerpt: 'Traceability matrices help reviewers compare claims, source excerpts, and unresolved evidence gaps.',
    themes: ['traceability', 'evidence quality'],
  },
]

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
        const uploadIndex = sourceSet.sources.filter((source) => source.id.startsWith(`${sourceSetId}-added-source-`)).length
        const sourceId = `${sourceSetId}-added-source-${uploadIndex + 1}`
        const template = UPLOAD_SOURCE_TEMPLATES[uploadIndex % UPLOAD_SOURCE_TEMPLATES.length]

        return {
          ...sourceSet,
          sources: [
            ...sourceSet.sources,
            {
              id: sourceId,
              title: template.title,
              type: template.type,
              status: 'Ready',
              excerpt: template.excerpt,
              owner: 'instructor',
              sourceSetId,
              sharedBy: sourceSet.ownerName,
              themes: template.themes,
            },
          ],
        }
      }),
    )
  }

  function handleUnlinkSourceSet(sourceSetId: string, projectId: string) {
    setSourceSets((current) =>
      current.map((sourceSet) => {
        if (sourceSet.id !== sourceSetId) return sourceSet
        const sharedProjectIds = sourceSet.sharedProjectIds.filter((id) => id !== projectId)

        return {
          ...sourceSet,
          visibility: sharedProjectIds.length > 0 ? 'Shared' : 'Private',
          sharedProjectIds,
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
    // SỬA TẠI ĐÂY: Nếu là project mới (không tìm thấy data shared cũ), ép lấy luôn bộ sourceSets đầu tiên làm mẫu để hiển thị
    let sharedSourceSets = sourceSets.filter((sourceSet) => sourceSet.sharedProjectIds.includes(activeProject.id))
    
    if (sharedSourceSets.length === 0 && sourceSets.length > 0) {
      sharedSourceSets = [sourceSets[0]]
    }

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
      onUnlinkSourceSet={handleUnlinkSourceSet}
    />
  )
}