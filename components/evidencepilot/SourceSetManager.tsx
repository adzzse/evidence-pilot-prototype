'use client'

import { BookOpen, CheckCircle2, FilePlus2, FileText, FolderGit2, FolderPlus, Network, Share2, Unlink, Upload } from 'lucide-react'
import { useMemo, useState } from 'react'

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
  onUnlinkSourceSet: (sourceSetId: string, projectId: string) => void
}

export function SourceSetManager({
  projects,
  sourceSets,
  onAddSource,
  onCreateSourceSet,
  onShareSourceSet,
  onUnlinkSourceSet,
}: SourceSetManagerProps) {
  const reviewProjects = projects.filter((project) => !project.isEmpty)
  const [selectedSourceSetId, setSelectedSourceSetId] = useState(sourceSets[0]?.id ?? '')
  const selectedSourceSet = useMemo(
    () => sourceSets.find((sourceSet) => sourceSet.id === selectedSourceSetId) ?? sourceSets[0],
    [selectedSourceSetId, sourceSets],
  )

  if (!selectedSourceSet) {
    return (
      <section className="mt-8 rounded-md border border-dashed border-slate-300 bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">My source sets</h2>
            <p className="mt-2 text-sm text-slate-600">Create the first instructor evidence pack for demo review.</p>
          </div>
          <Button className="h-10 gap-2 rounded-md" onClick={onCreateSourceSet}>
            <FolderPlus className="size-4" />
            New source set
          </Button>
        </div>
      </section>
    )
  }

  const relatedProjects = reviewProjects.filter((project) => selectedSourceSet.sharedProjectIds.includes(project.id))
  const availableProjects = reviewProjects.filter((project) => !selectedSourceSet.sharedProjectIds.includes(project.id))

  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">My source sets</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Upload reusable instructor sources, inspect source relationships, and see which student projects can use them.
          </p>
        </div>
        <Button className="h-10 gap-2 rounded-md" onClick={onCreateSourceSet}>
          <FolderPlus className="size-4" />
          New source set
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="min-w-0 rounded-md border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 px-1 text-xs font-semibold uppercase text-slate-500">Source set library</div>
          <div className="space-y-2">
            {sourceSets.map((sourceSet) => {
              const selected = sourceSet.id === selectedSourceSet.id

              return (
                <button
                  key={sourceSet.id}
                  className={`w-full rounded-md border p-3 text-left transition ${
                    selected
                      ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-950 hover:border-slate-300 hover:bg-white'
                  }`}
                  onClick={() => setSelectedSourceSetId(sourceSet.id)}
                  type="button"
                >
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{sourceSet.name}</div>
                      <p className={`mt-1 line-clamp-2 text-xs leading-5 ${selected ? 'text-slate-300' : 'text-slate-600'}`}>
                        {sourceSet.description}
                      </p>
                    </div>
                    <Badge
                      className={
                        selected
                          ? 'shrink-0 border-slate-500 bg-slate-800 text-slate-100'
                          : sourceSet.visibility === 'Shared'
                            ? 'shrink-0 border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'shrink-0 border-slate-200 bg-white text-slate-600'
                      }
                      variant="outline"
                    >
                      {sourceSet.visibility}
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <MiniMetric label="Sources" selected={selected} value={sourceSet.sources.length} />
                    <MiniMetric label="Projects" selected={selected} value={sourceSet.sharedProjectIds.length} />
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        <div className="min-w-0 space-y-4">
          <Card className="rounded-md border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex min-w-0 flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                    <BookOpen className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="break-words text-xl font-semibold leading-tight">{selectedSourceSet.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{selectedSourceSet.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedSourceSet.tags.map((tag) => (
                    <Badge key={tag} className="rounded-sm border-blue-100 bg-blue-50 text-blue-700" variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid min-w-[220px] grid-cols-3 gap-2">
                <Metric label="Sources" value={selectedSourceSet.sources.length} />
                <Metric label="Projects" value={relatedProjects.length} />
                <Metric label="Owner" value={selectedSourceSet.ownerName} />
              </div>
            </div>
          </Card>

          <div className="grid gap-4 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <UploadPanel sourceSet={selectedSourceSet} onAddSource={onAddSource} />
            <SourceGraphPanel sourceSet={selectedSourceSet} />
          </div>

          <RelatedProjectsPanel
            availableProjects={availableProjects}
            relatedProjects={relatedProjects}
            sourceSet={selectedSourceSet}
            onShareSourceSet={onShareSourceSet}
            onUnlinkSourceSet={onUnlinkSourceSet}
          />
        </div>
      </div>
    </section>
  )
}

function UploadPanel({
  sourceSet,
  onAddSource,
}: {
  sourceSet: SourceSet
  onAddSource: (sourceSetId: string) => void
}) {
  return (
    <Card className="rounded-md border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Upload className="size-4 text-emerald-600" />
            Upload source
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Simulates adding a reusable instructor source to this evidence pack.
          </p>
        </div>
        <Button className="h-9 gap-2 rounded-md" onClick={() => onAddSource(sourceSet.id)}>
          <FilePlus2 className="size-4" />
          Upload
        </Button>
      </div>

      <div className="space-y-2">
        {sourceSet.sources.map((source) => (
          <div key={source.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-950">{source.title}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {source.type} - {source.status}
                </div>
              </div>
              <Badge className="shrink-0 border-slate-200 bg-white text-slate-600" variant="outline">
                {source.themes?.[0] ?? 'Evidence'}
              </Badge>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600">{source.excerpt}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

function SourceGraphPanel({ sourceSet }: { sourceSet: SourceSet }) {
  const nodes = sourceSet.sources.length > 0 ? sourceSet.sources : []
  const edges = getSourceRelationships(nodes)

  return (
    <Card className="rounded-md border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Network className="size-4 text-blue-700" />
            Source graph
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Source-to-source relationships inside this instructor evidence pack.
          </p>
        </div>
        <Badge className="border-blue-200 bg-blue-50 text-blue-700" variant="outline">
          {edges.length} links
        </Badge>
      </div>

      <div className="relative min-h-[280px] overflow-hidden rounded-md border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <svg className="pointer-events-none absolute inset-0 size-full">
          {edges.map((edge) => {
            const from = getSourcePoint(edge.fromIndex, nodes.length)
            const to = getSourcePoint(edge.toIndex, nodes.length)
            return (
              <line
                key={edge.id}
                stroke="#94a3b8"
                strokeLinecap="round"
                strokeWidth="1.5"
                x1={`${from.x}%`}
                x2={`${to.x}%`}
                y1={`${from.y}%`}
                y2={`${to.y}%`}
              />
            )
          })}
        </svg>

        {nodes.map((source, index) => {
          const point = getSourcePoint(index, nodes.length)
          const connectionCount = getRelationshipCount(index, edges)

          return (
            <button
              key={source.id}
              className={`absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${getNodeColor(
                connectionCount,
              )}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              title={source.title}
              type="button"
            >
              <FileText className="size-4" />
            </button>
          )
        })}

        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 text-xs text-slate-500">
          <Badge className="border-blue-200 bg-blue-100 text-blue-950" variant="outline">
            0-1 light
          </Badge>
          <Badge className="border-blue-600 bg-blue-600 text-white" variant="outline">
            2 medium
          </Badge>
          <Badge className="border-blue-950 bg-blue-900 text-white" variant="outline">
            3+ dark
          </Badge>
        </div>

        <div className="absolute right-4 top-4 max-w-[220px] rounded-md bg-white/90 px-3 py-2 shadow-sm ring-1 ring-slate-200">
          <div className="text-xs font-semibold uppercase text-slate-500">Relationship rule</div>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Links are based on shared themes. Packs with no overlap fall back to same-pack links.
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {edges.map((edge) => (
          <div key={`${edge.id}-label`} className="rounded-md border border-slate-200 bg-slate-50 p-2">
            <div className="text-xs font-semibold text-slate-950">
              <span>{shortTitle(nodes[edge.fromIndex]?.title ?? '')}</span>
              <span className="mx-1 text-slate-400">to</span>
              <span>{shortTitle(nodes[edge.toIndex]?.title ?? '')}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">{edge.label}</div>
          </div>
        ))}
        {edges.length === 0 && (
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-500">
            Upload at least two sources to show source relationships.
          </div>
        )}
      </div>
    </Card>
  )
}

function RelatedProjectsPanel({
  availableProjects,
  relatedProjects,
  sourceSet,
  onShareSourceSet,
  onUnlinkSourceSet,
}: {
  availableProjects: ProjectSummary[]
  relatedProjects: ProjectSummary[]
  sourceSet: SourceSet
  onShareSourceSet: (sourceSetId: string, projectId: string) => void
  onUnlinkSourceSet: (sourceSetId: string, projectId: string) => void
}) {
  return (
    <Card className="rounded-md border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <FolderGit2 className="size-4 text-slate-700" />
            Related projects
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            See where this evidence pack is shared and attach it to another review project.
          </p>
        </div>
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700" variant="outline">
          {relatedProjects.length} linked
        </Badge>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {relatedProjects.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            state="linked"
            onUnlink={() => onUnlinkSourceSet(sourceSet.id, project.id)}
          />
        ))}

        {availableProjects.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            state="available"
            onShare={() => onShareSourceSet(sourceSet.id, project.id)}
          />
        ))}

        {relatedProjects.length === 0 && availableProjects.length === 0 && (
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            No review projects are available in this demo.
          </div>
        )}
      </div>
    </Card>
  )
}

function ProjectRow({
  project,
  state,
  onShare,
  onUnlink,
}: {
  project: ProjectSummary
  state: 'available' | 'linked'
  onShare?: () => void
  onUnlink?: () => void
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="break-words text-sm font-semibold leading-5 text-slate-950">{project.title}</div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
            <span>{project.studentName}</span>
            <span>{project.claimCount} claims</span>
            <span>{project.supportedClaimCount} supported</span>
          </div>
        </div>
        {state === 'linked' ? (
          <div className="flex shrink-0 items-center gap-2">
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700" variant="outline">
              <CheckCircle2 className="mr-1 size-3" />
              Linked
            </Badge>
            <Button className="h-8 gap-2 rounded-md text-xs" onClick={onUnlink} size="sm" variant="outline">
              <Unlink className="size-3.5" />
              Unlink
            </Button>
          </div>
        ) : (
          <Button className="h-8 shrink-0 gap-2 rounded-md text-xs" onClick={onShare} size="sm" variant="outline">
            <Share2 className="size-3.5" />
            Share
          </Button>
        )}
      </div>
    </div>
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

function MiniMetric({ label, selected, value }: { label: string; selected: boolean; value: number }) {
  return (
    <div className={`rounded border p-2 ${selected ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
      <div className={selected ? 'text-slate-400' : 'text-slate-500'}>{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  )
}

function getSourcePoint(index: number, count: number) {
  const safeCount = Math.max(count, 1)
  const angle = (index / safeCount) * Math.PI * 2 - Math.PI / 2
  const radius = 32
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
  }
}

function shortTitle(title: string) {
  return title.replace('https://example.com/', '').replace(/\.(pdf|docx)$/i, '')
}

function getSourceRelationships(sources: SourceSet['sources']) {
  const relationships = sources.flatMap((source, sourceIndex) =>
    sources.slice(sourceIndex + 1).map((target, offset) => {
      const targetIndex = sourceIndex + offset + 1
      const sharedThemes = (source.themes ?? []).filter((theme) => target.themes?.includes(theme))
      return {
        id: `${source.id}-${target.id}`,
        fromIndex: sourceIndex,
        toIndex: targetIndex,
        label: sharedThemes.length > 0 ? `shared theme: ${sharedThemes[0]}` : 'same evidence pack',
        hasThemeOverlap: sharedThemes.length > 0,
      }
    }),
  )

  const overlapping = relationships.filter((relationship) => relationship.hasThemeOverlap)
  return overlapping.length > 0 ? overlapping : relationships
}

function getRelationshipCount(sourceIndex: number, edges: ReturnType<typeof getSourceRelationships>) {
  return edges.filter((edge) => edge.fromIndex === sourceIndex || edge.toIndex === sourceIndex).length
}

function getNodeColor(connectionCount: number) {
  if (connectionCount >= 3) return 'size-12 border-blue-950 bg-blue-900 text-white'
  if (connectionCount === 2) return 'size-11 border-blue-700 bg-blue-600 text-white'
  return 'size-10 border-blue-200 bg-blue-100 text-blue-950'
}
