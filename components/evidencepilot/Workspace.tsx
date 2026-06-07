'use client'

import { ArrowLeft, CheckCircle2, MessageSquare, RotateCcw, Send, Sparkles, Clock } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LatexEditor } from './LatexEditor'
import { RightPanel, type ConsolidatedTab } from './RightPanel'
import { Sidebar } from './Sidebar'
import { FileOutlinePanel } from './FileOutlinePanel'
import { VersionHistory } from './VersionHistory'
import type {
  ActorRole,
  Claim,
  CommentCategory,
  EvidenceResult,
  ProjectStatus,
  ProjectWorkspace,
  ReviewComment,
  ReviewSelection,
  Source,
  SourceGraphNode,
  SourceGraphEdge,
  SourceSet,
} from './types'

type WorkspaceProps = {
  actor: ActorRole
  project: ProjectWorkspace
  sharedSourceSets: SourceSet[]
  onBack: () => void
  onProjectChange: (project: ProjectWorkspace) => void
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

export function Workspace({ actor, project, sharedSourceSets, onBack, onProjectChange }: WorkspaceProps) {
  const isInstructor = actor === 'instructor'
  const sharedSources = useMemo(() => sharedSourceSets.flatMap((sourceSet) => sourceSet.sources), [sharedSourceSets])
  const initialSources = useMemo(() => mergeSources(project.sources, sharedSources), [project.sources, sharedSources])
  const initialEvidenceResults = useMemo(
    () => mergeSharedEvidence(project.evidenceResults, project.claims, sharedSources),
    [project.evidenceResults, project.claims, sharedSources],
  )
  const initialSourceGraphNodes = useMemo(
    () => mergeSourceGraphNodes(project.sourceGraphNodes, sharedSources),
    [project.sourceGraphNodes, sharedSources],
  )
  const initialSourceGraphEdges = useMemo(
    () => mergeSourceGraphEdges(project.sourceGraphEdges, project.sources[0]?.id, sharedSources),
    [project.sourceGraphEdges, project.sources, sharedSources],
  )
  const [projectStatus, setProjectStatus] = useState(project.status)
  const [reviewStatus, setReviewStatus] = useState(project.reviewStatus)
  const [activeTab, setActiveTab] = useState<ConsolidatedTab>('source')
  const [activeSidebarSection, setActiveSidebarSection] = useState<'files' | 'history' | 'settings'>('files')
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false)
  const [activeClaimId, setActiveClaimId] = useState<string | null>(
    project.claims.find((claim) => claim.supported)?.id ?? null,
  )
  const [claimInput, setClaimInput] = useState('')
  const [sources, setSources] = useState<Source[]>(initialSources)
  const [claims, setClaims] = useState<Claim[]>(project.claims)
  const [evidenceResults, setEvidenceResults] = useState<EvidenceResult[]>(initialEvidenceResults)
  const [comments, setComments] = useState(project.comments)
  const [feedbackCategory, setFeedbackCategory] = useState<CommentCategory>('Claim clarity')
  const [feedbackDraft, setFeedbackDraft] = useState('')
  const [reviewSelection, setReviewSelection] = useState<ReviewSelection | null>(null)
  const [paragraphs] = useState(project.paragraphs.length > 0 ? project.paragraphs : emptyDraftParagraphs)
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(initialSources[0]?.id ?? null)
  const [sourceGraphNodes, setSourceGraphNodes] = useState<SourceGraphNode[]>(initialSourceGraphNodes)
  const [sourceGraphEdges, setSourceGraphEdges] = useState<SourceGraphEdge[]>(initialSourceGraphEdges)

  const activeClaim = useMemo(
    () => claims.find((claim) => claim.id === activeClaimId) ?? null,
    [activeClaimId, claims],
  )

  const visibleComments =
    isInstructor || projectStatus === 'Returned with Feedback' || projectStatus === 'Revising' ? comments : []
  const unresolvedCount = comments.filter((comment) => !comment.resolved).length

  function publishProject(overrides: Partial<ProjectWorkspace>) {
    onProjectChange({
      ...project,
      status: projectStatus,
      reviewStatus,
      sources,
      claims,
      evidenceResults,
      comments,
      sourceGraphNodes,
      sourceGraphEdges,
      ...overrides,
    })
  }

  function handleSelectClaim(claimId: string) {
    setActiveClaimId(claimId)
    setActiveTab('graph')
    const selected = claims.find((claim) => claim.id === claimId)
    setClaimInput(selected?.text ?? '')
    if (selected && isInstructor) {
      setFeedbackCategory(selected.supported ? 'Claim clarity' : 'Evidence strength')
      setReviewSelection({
        target: 'claim',
        claimId,
        quote: selected.text,
      })
    }
    const firstEvidence = evidenceResults.find((evidence) => evidence.claimId === claimId)
    setSelectedSourceId(firstEvidence?.sourceId ?? sources[0]?.id ?? null)
  }

  function handleCommentOnText(text: string) {
    setFeedbackCategory('Writing')
    setReviewSelection({
      target: 'text',
      quote: text,
    })
    setActiveTab('feedback')
  }

  function handleCommentOnEvidence(evidence: EvidenceResult) {
    setFeedbackCategory(evidence.status === 'mapped' ? 'Source mapping' : 'Evidence strength')
    setReviewSelection({
      target: 'mapping',
      evidenceId: evidence.id,
      claimId: evidence.claimId,
      quote: evidence.excerpt,
    })
    setSelectedSourceId(evidence.sourceId)
    setActiveTab('feedback')
  }

  function handleAddComment() {
    if (!reviewSelection || !feedbackDraft.trim()) return

    const newComment: ReviewComment = {
      id: `comment-${Date.now()}`,
      ...reviewSelection,
      author: 'Instructor',
      body: feedbackDraft.trim(),
      category: feedbackCategory,
      resolved: false,
    }
    const nextComments = [...comments, newComment]
    setComments(nextComments)
    setFeedbackDraft('')
    publishProject({
      comments: nextComments,
      feedbackCount: nextComments.length,
    })
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
          owner: 'student',
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

    const nextEvidenceResults = evidenceResults.map((item) =>
      item.id === evidenceId ? { ...item, status: 'mapped' as const } : item,
    )
    const nextClaims = claims.map((claim) =>
      claim.id === evidence.claimId ? { ...claim, supported: true } : claim,
    )
    setEvidenceResults(nextEvidenceResults)
    setClaims(nextClaims)
    setActiveClaimId(evidence.claimId)
    setSelectedSourceId(evidence.sourceId)
    setActiveTab('graph')
    publishProject({
      claims: nextClaims,
      evidenceResults: nextEvidenceResults,
      supportedClaimCount: nextClaims.filter((claim) => claim.supported).length,
    })
  }

  function handleSubmitToggle() {
    const nextStatus =
      projectStatus === 'Draft' || projectStatus === 'Revising'
        ? 'Submitted'
        : projectStatus === 'Submitted'
          ? 'Returned with Feedback'
          : 'Revising'
    setProjectStatus(nextStatus)
    publishProject({ status: nextStatus })
  }

  function handleResolveComment(commentId: string) {
    const nextComments = comments.map((comment) =>
      comment.id === commentId ? { ...comment, resolved: true } : comment,
    )
    setComments(nextComments)
    publishProject({ comments: nextComments })
  }

  function handleReturnWithFeedback() {
    const nextStatus: ProjectStatus = 'Returned with Feedback'
    setProjectStatus(nextStatus)
    setReviewStatus('Returned')
    publishProject({
      status: nextStatus,
      reviewStatus: 'Returned',
      comments,
      feedbackCount: comments.length,
    })
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
    setSourceGraphNodes((current) => {
      if (current.some((node) => node.sourceId === source.id)) return current
      return [
        ...current,
        {
          id: `graph-${source.id}`,
          sourceId: source.id,
          x: 20 + (current.length % 5) * 16,
          y: 72,
        },
      ]
    })
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
            <Button aria-label="Back" className="size-9 rounded-md" onClick={onBack} size="icon" variant="outline">
              <ArrowLeft className="size-4" />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-slate-950 text-xs font-semibold text-white">
                  EP
                </div>
                <h1 className="truncate text-base font-semibold">{project.title}</h1>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {isInstructor
                  ? `Reviewing ${project.studentName}'s submitted workspace`
                  : 'Student workspace with returned instructor feedback'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={statusClassName[projectStatus]} variant="outline">
              {projectStatus}
            </Badge>
            {isInstructor && (
              <Badge className="border-amber-200 bg-amber-50 text-amber-700" variant="outline">
                {reviewStatus}
              </Badge>
            )}
            {unresolvedCount > 0 && (
              <Badge className="border-rose-200 bg-rose-50 text-rose-700" variant="outline">
                {unresolvedCount} open feedback
              </Badge>
            )}
            <Button
              className="gap-2 rounded-md"
              onClick={() => setIsVersionHistoryOpen(!isVersionHistoryOpen)}
              variant="outline"
            >
              <Clock className="size-4" />
              History
            </Button>
            {isInstructor ? (
              <Button className="gap-2 rounded-md" onClick={handleReturnWithFeedback}>
                <MessageSquare className="size-4" />
                Return with feedback
              </Button>
            ) : (
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
            )}
          </div>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-y-auto p-0 xl:grid-cols-[40px_180px_minmax(0,7fr)_minmax(0,3fr)] xl:overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeSection={activeSidebarSection} onSectionChange={setActiveSidebarSection} />

        {/* File Outline Panel */}
        <FileOutlinePanel />

        {/* LaTeX Editor */}
        <div className="hidden min-h-0 flex-col gap-4 overflow-hidden p-4 xl:flex">
          <LatexEditor onRecompile={() => {}} />
        </div>

        {/* Right Column - Consolidated Panel */}
        <div className="hidden min-h-0 flex-col gap-4 overflow-hidden p-4 xl:flex">
          <RightPanel
          actor={actor}
          activeClaim={activeClaim}
          activeTab={activeTab}
          claims={claims}
          comments={comments}
          evidenceResults={evidenceResults}
          feedbackCategory={feedbackCategory}
          feedbackDraft={feedbackDraft}
          reviewSelection={reviewSelection}
          onAddComment={handleAddComment}
          onCommentOnEvidence={handleCommentOnEvidence}
          onFeedbackCategoryChange={setFeedbackCategory}
          onFeedbackDraftChange={setFeedbackDraft}
          onMapEvidence={handleMapEvidence}
          onSelectSource={setSelectedSourceId}
          onSimulateUpload={handleSimulateUpload}
          onTabChange={setActiveTab}
          selectedSourceId={selectedSourceId}
          sourceGraphEdges={sourceGraphEdges}
          sourceGraphNodes={sourceGraphNodes}
          sourceSets={sharedSourceSets}
          sources={sources}
        />
        </div>
      </main>

      {/* Version History Panel */}
      <VersionHistory isOpen={isVersionHistoryOpen} onClose={() => setIsVersionHistoryOpen(false)} />
    </div>
  )
}

function mergeSources(projectSources: Source[], sharedSources: Source[]) {
  const seen = new Set(projectSources.map((source) => source.id))
  return [
    ...projectSources.map((source) => ({ ...source, owner: source.owner ?? 'student' })),
    ...sharedSources.filter((source) => !seen.has(source.id)),
  ]
}

function mergeSharedEvidence(
  projectEvidenceResults: EvidenceResult[],
  claims: Claim[],
  sharedSources: Source[],
) {
  const seen = new Set(projectEvidenceResults.map((evidence) => evidence.id))
  const sharedEvidence = sharedSources.flatMap((source, sourceIndex) =>
    claims.slice(0, 2).map((claim, claimIndex) => ({
      id: `shared-evidence-${source.id}-${claim.id}`,
      sourceId: source.id,
      claimId: claim.id,
      excerpt: source.excerpt,
      match: Math.max(74, 88 - sourceIndex * 5 - claimIndex * 4),
      status: 'suggested' as const,
    })),
  )

  return [
    ...projectEvidenceResults,
    ...sharedEvidence.filter((evidence) => !seen.has(evidence.id)),
  ]
}

function mergeSourceGraphNodes(projectNodes: SourceGraphNode[], sharedSources: Source[]) {
  const seen = new Set(projectNodes.map((node) => node.sourceId))
  const sharedPositions = [
    { x: 20, y: 28 },
    { x: 86, y: 24 },
    { x: 88, y: 72 },
    { x: 18, y: 74 },
  ]

  return [
    ...projectNodes,
    ...sharedSources
      .filter((source) => !seen.has(source.id))
      .map((source, index) => ({
        id: `graph-${source.id}`,
        sourceId: source.id,
        ...sharedPositions[index % sharedPositions.length],
      })),
  ]
}

function mergeSourceGraphEdges(projectEdges: SourceGraphEdge[], anchorSourceId: string | undefined, sharedSources: Source[]) {
  if (!anchorSourceId) return projectEdges
  const seen = new Set(projectEdges.map((edge) => `${edge.fromSourceId}:${edge.toSourceId}`))
  const sharedEdges = sharedSources.map((source) => ({
    id: `source-edge-${anchorSourceId}-${source.id}`,
    fromSourceId: anchorSourceId,
    toSourceId: source.id,
    label: 'related evidence' as const,
  }))

  return [
    ...projectEdges,
    ...sharedEdges.filter((edge) => !seen.has(`${edge.fromSourceId}:${edge.toSourceId}`)),
  ]
}
