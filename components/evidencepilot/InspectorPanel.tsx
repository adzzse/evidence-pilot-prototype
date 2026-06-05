import { FileUp, GitBranch, Link2, Network, PlusCircle } from 'lucide-react'
import type React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SourceGraph } from './SourceGraph'
import type { Claim, EvidenceResult, Source, SourceGraphEdge, SourceGraphNode } from './types'

type InspectorPanelProps = {
  activeTab: 'source' | 'graph'
  onTabChange: (tab: 'source' | 'graph') => void
  activeClaim: Claim | null
  claims: Claim[]
  sources: Source[]
  evidenceResults: EvidenceResult[]
  selectedSourceId: string | null
  sourceGraphNodes: SourceGraphNode[]
  sourceGraphEdges: SourceGraphEdge[]
  onSelectSource: (sourceId: string) => void
  onSimulateUpload: () => void
  onMapEvidence: (evidenceId: string) => void
}

export function InspectorPanel({
  activeTab,
  onTabChange,
  activeClaim,
  claims,
  sources,
  evidenceResults,
  selectedSourceId,
  sourceGraphNodes,
  sourceGraphEdges,
  onSelectSource,
  onSimulateUpload,
  onMapEvidence,
}: InspectorPanelProps) {
  const activeEvidence = activeClaim
    ? evidenceResults.filter((evidence) => evidence.claimId === activeClaim.id)
    : []

  return (
    <aside className="flex min-h-0 flex-col rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-2 border-b border-slate-200">
        <button
          className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'source' ? 'bg-slate-100 text-slate-950' : 'text-slate-500 hover:bg-slate-50'
          }`}
          onClick={() => onTabChange('source')}
          type="button"
        >
          <FileUp className="size-4" />
          Source
        </button>
        <button
          className={`flex items-center justify-center gap-2 border-l border-slate-200 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'graph' ? 'bg-slate-100 text-slate-950' : 'text-slate-500 hover:bg-slate-50'
          }`}
          onClick={() => onTabChange('graph')}
          type="button"
        >
          <Network className="size-4" />
          Graph
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {activeTab === 'source' ? (
          <SourceTab
            activeClaim={activeClaim}
            activeEvidence={activeEvidence}
            sources={sources}
            onMapEvidence={onMapEvidence}
            onSimulateUpload={onSimulateUpload}
          />
        ) : (
          <SourceGraph
            claims={claims}
            evidenceResults={evidenceResults}
            onSelectSource={onSelectSource}
            selectedSourceId={selectedSourceId}
            sourceGraphEdges={sourceGraphEdges}
            sourceGraphNodes={sourceGraphNodes}
            sources={sources}
          />
        )}
      </div>
    </aside>
  )
}

function SourceTab({
  activeClaim,
  activeEvidence,
  sources,
  onMapEvidence,
  onSimulateUpload,
}: {
  activeClaim: Claim | null
  activeEvidence: EvidenceResult[]
  sources: Source[]
  onMapEvidence: (evidenceId: string) => void
  onSimulateUpload: () => void
}) {
  return (
    <div className="space-y-4">
      <Button className="h-auto w-full justify-start gap-3 rounded-md border-dashed py-3" onClick={onSimulateUpload} variant="outline">
        <PlusCircle className="size-5" />
        <span>
          <span className="block text-left text-sm font-semibold">Upload PDF / DOCX / Link</span>
          <span className="block text-left text-xs text-slate-500">Simulated upload for prototype data</span>
        </span>
      </Button>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Uploaded sources</h3>
          <Badge variant="outline">{sources.length}</Badge>
        </div>
        <div className="space-y-2">
          {sources.length === 0 ? (
            <EmptyPanel icon={<FileUp className="size-5" />} text="Upload a source to begin matching evidence." />
          ) : (
            sources.map((source) => (
              <div key={source.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start gap-2">
                  <Link2 className="mt-0.5 size-4 shrink-0 text-slate-500" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900">{source.title}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {source.type} - {source.status}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h3 className="mb-2 text-sm font-semibold">Related evidence</h3>
        {!activeClaim ? (
          <EmptyPanel icon={<GitBranch className="size-5" />} text="Type or highlight a claim to see related source evidence." />
        ) : activeEvidence.length === 0 ? (
          <EmptyPanel icon={<GitBranch className="size-5" />} text="No related evidence yet. Upload a source or try another claim." />
        ) : (
          <div className="space-y-3">
            <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-950">
              <div className="text-xs font-semibold uppercase text-blue-700">Active claim</div>
              <div className="mt-1 leading-5">{activeClaim.text}</div>
            </div>
            {activeEvidence.map((evidence) => {
              const source = sources.find((item) => item.id === evidence.sourceId)
              return (
                <Card key={evidence.id} className="rounded-md border-slate-200 p-3 shadow-none">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{source?.title ?? 'Unknown source'}</div>
                      <div className="text-xs text-slate-500">Match {evidence.match}%</div>
                    </div>
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
                  </div>
                  <p className="mb-3 text-sm leading-5 text-slate-700">{evidence.excerpt}</p>
                  <Button
                    className="h-8 w-full rounded-md text-xs"
                    disabled={evidence.status === 'mapped'}
                    onClick={() => onMapEvidence(evidence.id)}
                    size="sm"
                  >
                    {evidence.status === 'mapped' ? 'Mapped to claim' : 'Map to claim'}
                  </Button>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyPanel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
      <div className="mb-2 flex justify-center text-slate-400">{icon}</div>
      {text}
    </div>
  )
}
