'use client'

import { useMemo, useState } from 'react'

import { Dashboard } from '@/components/evidencepilot/Dashboard'
import { PROJECTS } from '@/components/evidencepilot/mock-data'
import { Workspace } from '@/components/evidencepilot/Workspace'

export default function EvidencePilotPrototype() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)

  const activeProject = useMemo(
    () => PROJECTS.find((project) => project.id === activeProjectId) ?? null,
    [activeProjectId],
  )

  if (activeProject) {
    return <Workspace project={activeProject} onBack={() => setActiveProjectId(null)} />
  }

  return <Dashboard projects={PROJECTS} onOpenProject={setActiveProjectId} />
}
