import { ArrowRight, ClipboardCheck, FileText, MessageSquare, Plus, ShieldCheck, UserRound } from 'lucide-react'
import type React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SourceSetManager } from './SourceSetManager'
import type { ActorRole, ProjectStatus, ProjectSummary, SourceSet } from './types'

type DashboardProps = {
  actor: ActorRole
  projects: ProjectSummary[]
  sourceSets: SourceSet[]
  onActorChange: (actor: ActorRole) => void
  onAddSourceToSet: (sourceSetId: string) => void
  onCreateSourceSet: () => void
  onOpenProject: (projectId: string) => void
  onShareSourceSet: (sourceSetId: string, projectId: string) => void
  onUnlinkSourceSet: (sourceSetId: string, projectId: string) => void
}

const statusClassName: Record<ProjectStatus, string> = {
  Draft: 'bg-slate-100 text-slate-700 border-slate-200',
  Submitted: 'bg-amber-50 text-amber-700 border-amber-200',
  'Returned with Feedback': 'bg-rose-50 text-rose-700 border-rose-200',
  Revising: 'bg-blue-50 text-blue-700 border-blue-200',
}

export function Dashboard({
  actor,
  projects,
  sourceSets,
  onActorChange,
  onAddSourceToSet,
  onCreateSourceSet,
  onOpenProject,
  onShareSourceSet,
  onUnlinkSourceSet,
}: DashboardProps) {
  const isInstructor = actor === 'instructor'
  const visibleProjects = isInstructor ? projects.filter((project) => !project.isEmpty) : projects

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white">
              EP
            </div>
            <div>
              <h1 className="text-lg font-semibold">EvidencePilot</h1>
              <p className="text-sm text-slate-500">
                {isInstructor ? 'Instructor review queue' : 'Student evidence workspace'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 rounded-md border border-slate-200 bg-slate-50 p-1">
              <button
                className={`rounded-sm px-3 py-1.5 text-sm font-medium transition ${
                  actor === 'student' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
                onClick={() => onActorChange('student')}
                type="button"
              >
                Student
              </button>
              <button
                className={`rounded-sm px-3 py-1.5 text-sm font-medium transition ${
                  actor === 'instructor' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
                onClick={() => onActorChange('instructor')}
                type="button"
              >
                Instructor
              </button>
            </div>
            <Badge className="border-blue-200 bg-blue-50 text-blue-700" variant="outline">
              Prototype
            </Badge>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            {isInstructor ? 'Review queue' : 'My projects'}
          </h2>
          <p className="max-w-2xl text-sm text-slate-600">
            {isInstructor
              ? 'Open submitted student work, inspect evidence support, and return inline feedback.'
              : 'Continue the returned review project or start from an empty workspace with hardcoded prototype behavior.'}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {visibleProjects.map((project) => (
            <Card key={project.id} className="flex min-h-[300px] min-w-0 flex-col gap-5 rounded-md border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex min-w-0 flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                    {isInstructor ? (
                      <ClipboardCheck className="size-5" />
                    ) : project.isEmpty ? (
                      <Plus className="size-5" />
                    ) : (
                      <FileText className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-semibold leading-tight">{project.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p>
                    {isInstructor && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <UserRound className="size-3.5" />
                          {project.studentName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {isInstructor ? (
                  <Badge className="border-amber-200 bg-amber-50 text-amber-700" variant="outline">
                    {project.reviewStatus}
                  </Badge>
                ) : (
                  <Badge className={statusClassName[project.status]} variant="outline">
                    {project.status}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                <Metric icon={<FileText className="size-4" />} label="Documents" value={project.documentCount} />
                <Metric icon={<ShieldCheck className="size-4" />} label="Claims" value={project.claimCount} />
                <Metric icon={<ShieldCheck className="size-4" />} label="Supported" value={project.supportedClaimCount} />
                <Metric icon={<MessageSquare className="size-4" />} label="Feedback" value={project.feedbackCount} />
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">
                  {isInstructor
                    ? 'Review highlighted claims, sources, graph, and inline text.'
                    : project.isEmpty
                      ? 'No sources or claims yet.'
                      : 'Feedback is visible inside the workspace.'}
                </p>
                <Button className="gap-2 rounded-md" onClick={() => onOpenProject(project.id)}>
                  {isInstructor ? 'Review project' : project.isEmpty ? 'Start project' : 'Open workspace'}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {isInstructor && (
          <SourceSetManager
            projects={projects}
            sourceSets={sourceSets}
            onAddSource={onAddSourceToSet}
            onCreateSourceSet={onCreateSourceSet}
            onShareSourceSet={onShareSourceSet}
            onUnlinkSourceSet={onUnlinkSourceSet}
          />
        )}
      </section>
    </main>
  )
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-medium uppercase">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-slate-950">{value}</div>
    </div>
  )
}
