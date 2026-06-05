'use client'

import { ArrowLeft, CheckCircle2, RotateCcw, Send, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CommentMargin } from './CommentMargin'
import { DocumentEditor } from './DocumentEditor'
import { InspectorPanel } from './InspectorPanel'
import type { Claim, EvidenceResult, ProjectStatus, ProjectWorkspace, Source, SourceGraphEdge } from './types'

type WorkspaceProps = {
  project: ProjectWorkspace
  onBack: () => void
}

const statusClassName: Record<ProjectStatus, string> = {
  Draft: 'border-slate-200 bg-slate-100 text-slate-700',
  Submitted: 'border-amber-200 bg-amber-50 text-amber-700',
  'Returned with Feedback': 'border-rose-200 bg-rose-50 text-rose-700',
  Revising: 'border-blue-200 bg-blue-50 text-blue-700',
}

const emptyDraftParagraphs = [
  'Start drafting your project argument here. Highlight a sentence to turn it into a claim.',
]

export function Workspace({ project, onBack }: WorkspaceProps) {
  const [projectStatus, setProjectStatus] = useState(project.status)
  const [activeTab, setActiveTab] = useState<'source' | 'graph'>('source')
  const [activeClaimId, setActiveClaimId] = useState<string | null>(
    project.claims.find((claim) => claim.supported)?.id ?? null,
  )
  const [claimInput, setClaimInput] = useState('')
  const [sources, setSources] = useState<Source[]>(project.sources)
  const [claims, setClaims] = useState<Claim[]>(project.claims)
  const [evidenceResults, setEvidenceResults] = useState<EvidenceResult[]>(project.evidenceResults)
  const [comments, setComments] = useState(project.comments)
  const [paragraphs] = useState(project.paragraphs.length > 0 ? project.paragraphs : emptyDraftParagraphs)
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(project.sources[0]?.id ?? null)
  const [sourceGraphNodes] = useState(project.sourceGraphNodes)
  const [sourceGraphEdges, setSourceGraphEdges] = useState<SourceGraphEdge[]>(project.sourceGraphEdges)

  const activeClaim = useMemo(
    () => claims.find((claim) => claim.id === activeClaimId) ?? null,
    [activeClaimId, claims],
  )

  const visibleComments = projectStatus === 'Returned with Feedback' || projectStatus === 'Revising' ? comments : []
  const unresolvedCount = comments.filter((comment) => !comment.resolved).length

  function handleSelectClaim(claimId: string) {
    setActiveClaimId(claimId)
    setActiveTab('graph')
    const selected = claims.find((claim) => claim.id === claimId)
    setClaimInput(selected?.text ?? '')
    const firstEvidence = evidenceResults.find((evidence) => evidence.claimId === claimId)
    setSelectedSourceId(firstEvidence?.sourceId ?? sources[0]?.id ?? null)
  }

  function handleUseHighlightedText(text: string) {
    setClaimInput(text)
    setActiveTab('source')
    ensureClaimForText(text)
  }

  function handleFindSources() {
    if (!claimInput.trim()) return
    const claim = ensureClaimForText(claimInput.trim())
    ensureEvidenceForClaim(claim.id, sources)
    setActiveTab('source')
  }

  function handleSimulateUpload() {
    let nextSources = sources
    if (!sources.some((source) => source.id === 'source-uploaded')) {
      nextSources = [
        ...sources,
        {
          id: 'source-uploaded',
          title: 'uploaded-literature-review.pdf',
          type: 'PDF',
          status: 'Ready',
          excerpt: 'Newly uploaded source prepared for simulated evidence matching.',
        },
      ]
      setSources(nextSources)
    }

    if (activeClaimId) {
      ensureEvidenceForClaim(activeClaimId, nextSources)
    }
  }

  function handleMapEvidence(evidenceId: string) {
    const evidence = evidenceResults.find((item) => item.id === evidenceId)
    if (!evidence) return

    setEvidenceResults((current) =>
      current.map((item) => (item.id === evidenceId ? { ...item, status: 'mapped' } : item)),
    )
    setClaims((current) =>
      current.map((claim) => (claim.id === evidence.claimId ? { ...claim, supported: true } : claim)),
    )
    setActiveClaimId(evidence.claimId)
    setSelectedSourceId(evidence.sourceId)
    setActiveTab('graph')
  }

  function handleSubmitToggle() {
    setProjectStatus((current) => {
      if (current === 'Draft' || current === 'Revising') return 'Submitted'
      if (current === 'Submitted') return 'Returned with Feedback'
      return 'Revising'
    })
  }

  function handleResolveComment(commentId: string) {
    setComments((current) =>
      current.map((comment) => (comment.id === commentId ? { ...comment, resolved: true } : comment)),
    )
  }

  function ensureClaimForText(text: string) {
    const existing = claims.find((claim) => claim.text.toLowerCase() === text.toLowerCase())
    if (existing) {
      setActiveClaimId(existing.id)
      return existing
    }

    const newClaim: Claim = {
      id: `claim-${Date.now()}`,
      text,
      supported: false,
      paragraphIndex: Math.max(0, paragraphs.findIndex((paragraph) => paragraph.includes(text))),
    }
    setClaims((current) => [...current, newClaim])
    setActiveClaimId(newClaim.id)
    return newClaim
  }

  function ensureEvidenceForClaim(claimId: string, availableSources: Source[]) {
    if (evidenceResults.some((item) => item.claimId === claimId)) return
    const source = availableSources[0]
    if (!source) return

    const newEvidence: EvidenceResult = {
      id: `evidence-${Date.now()}`,
      sourceId: source.id,
      claimId,
      excerpt: source.excerpt,
      match: 79,
      status: 'suggested',
    }

    setEvidenceResults((current) => [...current, newEvidence])
    setSelectedSourceId(source.id)
    setSourceGraphEdges((current) => {
      const fromSourceId = sources[0]?.id
      const toSourceId = source.id
      if (!fromSourceId || !toSourceId || fromSourceId === toSourceId) return current
      const exists = current.some(
        (edge) =>
          (edge.fromSourceId === fromSourceId && edge.toSourceId === toSourceId) ||
          (edge.fromSourceId === toSourceId && edge.toSourceId === fromSourceId),
      )
      if (exists) return current
      return [
        ...current,
        {
          id: `source-edge-${Date.now()}`,
          fromSourceId,
          toSourceId,
          label: 'related evidence',
        },
      ]
    })
  }

  return (
    <div className="flex h-screen min-h-0 flex-col bg-[#f6f7f9] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Button className="size-9 rounded-md" onClick={onBack} size="icon" variant="outline">
              <ArrowLeft className="size-4" />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-slate-950 text-xs font-semibold text-white">
                  EP
                </div>
                <h1 className="truncate text-base font-semibold">{project.title}</h1>
              </div>
              <p className="mt-1 text-xs text-slate-500">Student workspace with returned instructor feedback</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={statusClassName[projectStatus]} variant="outline">
              {projectStatus}
            </Badge>
            {unresolvedCount > 0 && (
              <Badge className="border-rose-200 bg-rose-50 text-rose-700" variant="outline">
                {unresolvedCount} open feedback
              </Badge>
            )}
            <Button className="gap-2 rounded-md" onClick={handleSubmitToggle}>
              {projectStatus === 'Draft' || projectStatus === 'Revising' ? (
                <>
                  <Send className="size-4" />
                  Submit
                </>
              ) : projectStatus === 'Submitted' ? (
                <>
                  <CheckCircle2 className="size-4" />
                  Simulate returned
                </>
              ) : (
                <>
                  <RotateCcw className="size-4" />
                  Revise
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="border-t border-slate-100 px-4 py-3">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 md:flex-row">
            <Input
              value={claimInput}
              onChange={(event) => setClaimInput(event.target.value)}
              placeholder="Type a claim, or highlight text in the document"
              className="h-10 rounded-md bg-white"
            />
            <Button className="h-10 shrink-0 gap-2 rounded-md" onClick={handleFindSources}>
              <Sparkles className="size-4" />
              Find sources
            </Button>
          </div>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 xl:grid-cols-[220px_minmax(0,1fr)_560px] xl:overflow-hidden">
        <CommentMargin comments={visibleComments} onResolve={handleResolveComment} />
        <DocumentEditor
          activeClaimId={activeClaimId}
          claims={claims}
          comments={visibleComments}
          onSelectClaim={handleSelectClaim}
          onUseHighlightedText={handleUseHighlightedText}
          paragraphs={paragraphs}
        />
        <InspectorPanel
          activeClaim={activeClaim}
          activeTab={activeTab}
          claims={claims}
          evidenceResults={evidenceResults}
          onMapEvidence={handleMapEvidence}
          onSelectSource={setSelectedSourceId}
          onSimulateUpload={handleSimulateUpload}
          onTabChange={setActiveTab}
          selectedSourceId={selectedSourceId}
          sourceGraphEdges={sourceGraphEdges}
          sourceGraphNodes={sourceGraphNodes}
          sources={sources}
        />
      </main>
    </div>
  )
}
