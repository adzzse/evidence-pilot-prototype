import { BookOpen, FilePlus2, FolderPlus, Share2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { ProjectSummary, SourceSet } from './types'

type SourceSetManagerProps = {
  projects: ProjectSummary[]
  sourceSets: SourceSet[]
  onAddSource: (sourceSetId: string) => void
  onCreateSourceSet: () => void
  onShareSourceSet: (sourceSetId: string, projectId: string) => void
}

export function SourceSetManager({
  projects,
  sourceSets,
  onAddSource,
  onCreateSourceSet,
  onShareSourceSet,
}: SourceSetManagerProps) {
  const reviewProjects = projects.filter((project) => !project.isEmpty)

  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">My source sets</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Create reusable instructor evidence packs, add sources, and share them into student projects.
          </p>
        </div>
        <Button className="h-10 gap-2 rounded-md" onClick={onCreateSourceSet}>
          <FolderPlus className="size-4" />
          New source set
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {sourceSets.map((sourceSet) => {
          const targetProject = reviewProjects[0]
          const alreadyShared = Boolean(targetProject && sourceSet.sharedProjectIds.includes(targetProject.id))

          return (
            <Card key={sourceSet.id} className="min-w-0 rounded-md border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex min-w-0 flex-col items-start justify-between gap-3 sm:flex-row">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                      <BookOpen className="size-4" />
                    </div>
                    <h3 className="break-words text-lg font-semibold leading-tight">{sourceSet.name}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{sourceSet.description}</p>
                </div>
                <Badge
                  className={
                    sourceSet.visibility === 'Shared'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }
                  variant="outline"
                >
                  {sourceSet.visibility}
                </Badge>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {sourceSet.tags.map((tag) => (
                  <Badge key={tag} className="rounded-sm border-blue-100 bg-blue-50 text-blue-700" variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mb-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <Metric label="Sources" value={sourceSet.sources.length} />
                <Metric label="Shared" value={sourceSet.sharedProjectIds.length} />
                <Metric label="Owner" value={sourceSet.ownerName} />
              </div>

              <div className="space-y-2">
                {sourceSet.sources.map((source) => (
                  <div key={source.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="flex min-w-0 flex-col items-start justify-between gap-3 sm:flex-row">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-950">{source.title}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {source.type} - {source.status}
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0 border-slate-200 bg-white text-slate-600">
                        {source.themes?.[0] ?? 'Evidence'}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{source.excerpt}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
                <Button className="h-9 flex-1 gap-2 rounded-md" onClick={() => onAddSource(sourceSet.id)} variant="outline">
                  <FilePlus2 className="size-4" />
                  Add source
                </Button>
                <Button
                  className="h-9 flex-1 gap-2 rounded-md"
                  disabled={!targetProject || alreadyShared}
                  onClick={() => {
                    if (targetProject) onShareSourceSet(sourceSet.id, targetProject.id)
                  }}
                >
                  <Share2 className="size-4" />
                  {alreadyShared ? 'Shared to project' : 'Share to project'}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-medium uppercase text-slate-500">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold text-slate-950">{value}</div>
    </div>
  )
}
