import { FileText, Network, Waypoints } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { Claim, EvidenceResult, Source, SourceGraphEdge, SourceGraphNode } from './types'

type SourceGraphProps = {
  sources: Source[]
  claims: Claim[]
  evidenceResults: EvidenceResult[]
  sourceGraphNodes: SourceGraphNode[]
  sourceGraphEdges: SourceGraphEdge[]
  selectedSourceId: string | null
  onSelectSource: (sourceId: string) => void
}

export function SourceGraph({
  sources,
  claims,
  evidenceResults,
  sourceGraphNodes,
  sourceGraphEdges,
  selectedSourceId,
  onSelectSource,
}: SourceGraphProps) {
  const selectedSource = sources.find((source) => source.id === selectedSourceId) ?? null

  if (sources.length === 0 || sourceGraphNodes.length === 0) {
    return (
      <EmptyGraph
        title="No source graph yet"
        text="Upload sources and map evidence to claims before exploring source relationships."
      />
    )
  }

  return (
    <div className="grid min-h-[520px] gap-4 2xl:grid-cols-[minmax(0,1fr)_260px]">
      <section className="relative min-h-[420px] overflow-hidden rounded-md border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute left-4 top-4 z-10 rounded-md bg-white/90 px-3 py-2 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Network className="size-4 text-blue-700" />
            Source network
          </div>
          <div className="mt-1 text-xs text-slate-500">Darker nodes have more source connections.</div>
        </div>

        <svg className="pointer-events-none absolute inset-0 size-full">
          {sourceGraphEdges.map((edge) => {
            const from = sourceGraphNodes.find((node) => node.sourceId === edge.fromSourceId)
            const to = sourceGraphNodes.find((node) => node.sourceId === edge.toSourceId)
            if (!from || !to) return null

            return (
              <line
                key={edge.id}
                x1={`${from.x}%`}
                x2={`${to.x}%`}
                y1={`${from.y}%`}
                y2={`${to.y}%`}
                stroke="#94a3b8"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            )
          })}
        </svg>

        {sourceGraphNodes.map((node) => {
          const source = sources.find((item) => item.id === node.sourceId)
          if (!source) return null
          const connectionCount = getConnectionCount(source.id, sourceGraphEdges)
          const selected = selectedSourceId === source.id

          return (
            <button
              key={node.id}
              className={`absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${getNodeColor(
              connectionCount,
              )} ${selected ? 'ring-4 ring-blue-300 size-12' : 'size-10'}`} // Made the node a clean circle
            onClick={() => onSelectSource(source.id)}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            title={source.title} // Let the native browser tooltip handle the long name on hover
            type="button">
            <FileText className="size-4" />
          </button>
          )
        })}

        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 text-xs text-slate-500">
          <Badge variant="outline" className="border-blue-200 bg-blue-100 text-blue-950">
            0-1 light
          </Badge>
          <Badge variant="outline" className="border-blue-600 bg-blue-600 text-white">
            2 medium
          </Badge>
          <Badge variant="outline" className="border-blue-950 bg-blue-900 text-white">
            3+ dark
          </Badge>
        </div>
      </section>

      <SelectedSourcePanel
        claims={claims}
        connectionCount={selectedSource ? getConnectionCount(selectedSource.id, sourceGraphEdges) : 0}
        evidenceResults={evidenceResults}
        selectedSource={selectedSource}
        sourceGraphEdges={sourceGraphEdges}
      />
    </div>
  )
}

function SelectedSourcePanel({
  claims,
  connectionCount,
  evidenceResults,
  selectedSource,
  sourceGraphEdges,
}: {
  claims: Claim[]
  connectionCount: number
  evidenceResults: EvidenceResult[]
  selectedSource: Source | null
  sourceGraphEdges: SourceGraphEdge[]
}) {
  if (!selectedSource) {
    return <EmptyGraph title="Source detail" text="Select a source node to inspect its claims." />
  }

  const sourceEvidence = evidenceResults.filter((evidence) => evidence.sourceId === selectedSource.id)
  const sourceClaims = getClaimsForSource(selectedSource.id, claims, evidenceResults)
  const connectedSourceIds = getConnectedSourceIds(selectedSource.id, sourceGraphEdges)

  return (
    <aside className="space-y-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-950">{selectedSource.title}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {selectedSource.type} - {selectedSource.status}
            </p>
            {selectedSource.owner === 'instructor' && (
              <Badge className="mt-2 border-emerald-200 bg-emerald-50 text-emerald-700" variant="outline">
                Shared by {selectedSource.sharedBy ?? 'Instructor'}
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
            {connectionCount} links
          </Badge>
        </div>
        <p className="text-xs leading-5 text-slate-600">{selectedSource.excerpt}</p>
      </div>

      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
          <Waypoints className="size-4" />
          Connected sources
        </div>
        <div className="text-sm font-semibold text-slate-950">{connectedSourceIds.length}</div>
      </div>

      <div className="border-t border-slate-200 pt-3">
        <h4 className="mb-2 text-sm font-semibold">Claims from this source</h4>
        {sourceClaims.length === 0 ? (
          <p className="text-sm text-slate-500">No claims are mapped or suggested for this source yet.</p>
        ) : (
          <div className="space-y-3">
            {sourceClaims.map((claim) => {
              const evidence = sourceEvidence.find((item) => item.claimId === claim.id)
              return (
                <Card key={claim.id} className="rounded-md border-slate-200 p-3 shadow-none">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-5 text-slate-950">{claim.text}</p>
                    {evidence && (
                      <Badge
                        variant="outline"
                        className={
                          evidence.status === 'mapped'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        }
                      >
                        {evidence.status}
                      </Badge>
                    )}
                  </div>
                  {evidence && (
                    <>
                      <div className="mb-2 text-xs text-slate-500">Match {evidence.match}%</div>
                      <p className="text-xs leading-5 text-slate-600">{evidence.excerpt}</p>
                    </>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}

function EmptyGraph({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <Network className="mb-3 size-6 text-slate-400" />
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">{text}</p>
    </div>
  )
}

function getConnectionCount(sourceId: string, edges: SourceGraphEdge[]) {
  return edges.filter((edge) => edge.fromSourceId === sourceId || edge.toSourceId === sourceId).length
}

function getConnectedSourceIds(sourceId: string, edges: SourceGraphEdge[]) {
  return edges
    .filter((edge) => edge.fromSourceId === sourceId || edge.toSourceId === sourceId)
    .map((edge) => (edge.fromSourceId === sourceId ? edge.toSourceId : edge.fromSourceId))
}

function getNodeColor(connectionCount: number) {
  if (connectionCount >= 3) return 'bg-blue-900 text-white border-blue-950'
  if (connectionCount === 2) return 'bg-blue-600 text-white border-blue-700'
  return 'bg-blue-100 text-blue-950 border-blue-200'
}

function getClaimsForSource(sourceId: string, claims: Claim[], evidenceResults: EvidenceResult[]) {
  const claimIds = new Set(
    evidenceResults.filter((evidence) => evidence.sourceId === sourceId).map((evidence) => evidence.claimId),
  )
  return claims.filter((claim) => claimIds.has(claim.id))
}

function shortSourceTitle(title: string) {
  return title.replace('https://example.com/', '').replace(/\.(pdf|docx)$/i, '')
}
