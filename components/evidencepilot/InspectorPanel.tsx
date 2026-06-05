import { FileUp, GitBranch, Link2, MessageSquare, Network, PlusCircle } from 'lucide-react'
import type React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { SourceGraph } from './SourceGraph'
import type {
  ActorRole,
  Claim,
  CommentCategory,
  EvidenceResult,
  ReviewComment,
  ReviewSelection,
  Source,
  SourceGraphEdge,
  SourceGraphNode,
} from './types'

export type WorkspaceTab = 'source' | 'graph' | 'feedback'

type InspectorPanelProps = {
  actor: ActorRole
  activeTab: WorkspaceTab
  onTabChange: (tab: WorkspaceTab) => void
  activeClaim: Claim | null
  claims: Claim[]
  comments: ReviewComment[]
  sources: Source[]
  evidenceResults: EvidenceResult[]
  feedbackCategory: CommentCategory
  feedbackDraft: string
  reviewSelection: ReviewSelection | null
  selectedSourceId: string | null
  onAddComment: () => void
  onCommentOnEvidence: (evidence: EvidenceResult) => void
  onFeedbackCategoryChange: (category: CommentCategory) => void
  onFeedbackDraftChange: (draft: string) => void
  sourceGraphNodes: SourceGraphNode[]
  sourceGraphEdges: SourceGraphEdge[]
  onSelectSource: (sourceId: string) => void
  onSimulateUpload: () => void
  onMapEvidence: (evidenceId: string) => void
}

export function InspectorPanel({
  actor,
  activeTab,
  onTabChange,
  activeClaim,
  claims,
  comments,
  sources,
  evidenceResults,
  feedbackCategory,
  feedbackDraft,
  reviewSelection,
  selectedSourceId,
  sourceGraphNodes,
  sourceGraphEdges,
  onAddComment,
  onCommentOnEvidence,
  onFeedbackCategoryChange,
  onFeedbackDraftChange,
  onSelectSource,
  onSimulateUpload,
  onMapEvidence,
}: InspectorPanelProps) {
  const activeEvidence = activeClaim
    ? evidenceResults.filter((evidence) => evidence.claimId === activeClaim.id)
    : []

  return (
    <aside className="flex min-h-0 flex-col rounded-md border border-slate-200 bg-white shadow-sm">
      <div className={`grid border-b border-slate-200 ${actor === 'instructor' ? 'grid-cols-3' : 'grid-cols-2'}`}>
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
        {actor === 'instructor' && (
          <button
            className={`flex items-center justify-center gap-2 border-l border-slate-200 px-4 py-3 text-sm font-semibold transition ${
              activeTab === 'feedback' ? 'bg-slate-100 text-slate-950' : 'text-slate-500 hover:bg-slate-50'
            }`}
            onClick={() => onTabChange('feedback')}
            type="button"
          >
            <MessageSquare className="size-4" />
            Feedback
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {activeTab === 'source' ? (
          <SourceTab
            actor={actor}
            activeClaim={activeClaim}
            activeEvidence={activeEvidence}
            sources={sources}
            onCommentOnEvidence={onCommentOnEvidence}
            onMapEvidence={onMapEvidence}
            onSimulateUpload={onSimulateUpload}
          />
        ) : activeTab === 'graph' ? (
          <SourceGraph
            claims={claims}
            evidenceResults={evidenceResults}
            onSelectSource={onSelectSource}
            selectedSourceId={selectedSourceId}
            sourceGraphEdges={sourceGraphEdges}
            sourceGraphNodes={sourceGraphNodes}
            sources={sources}
          />
        ) : (
          <FeedbackTab
            comments={comments}
            feedbackCategory={feedbackCategory}
            feedbackDraft={feedbackDraft}
            reviewSelection={reviewSelection}
            onAddComment={onAddComment}
            onFeedbackCategoryChange={onFeedbackCategoryChange}
            onFeedbackDraftChange={onFeedbackDraftChange}
          />
        )}
      </div>
    </aside>
  )
}

function SourceTab({
  actor,
  activeClaim,
  activeEvidence,
  sources,
  onCommentOnEvidence,
  onMapEvidence,
  onSimulateUpload,
}: {
  actor: ActorRole
  activeClaim: Claim | null
  activeEvidence: EvidenceResult[]
  sources: Source[]
  onCommentOnEvidence: (evidence: EvidenceResult) => void
  onMapEvidence: (evidenceId: string) => void
  onSimulateUpload: () => void
}) {
  const isInstructor = actor === 'instructor'

  return (
    <div className="space-y-4">
      {isInstructor ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          Review the student's submitted sources and evidence matches before returning feedback.
        </div>
      ) : (
        <Button className="h-auto w-full justify-start gap-3 rounded-md border-dashed py-3" onClick={onSimulateUpload} variant="outline">
          <PlusCircle className="size-5" />
          <span>
            <span className="block text-left text-sm font-semibold">Upload PDF / DOCX / Link</span>
            <span className="block text-left text-xs text-slate-500">Simulated upload for prototype data</span>
          </span>
        </Button>
      )}

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
                  {isInstructor ? (
                    <Button
                      className="h-8 w-full rounded-md text-xs"
                      onClick={() => onCommentOnEvidence(evidence)}
                      size="sm"
                      variant="outline"
                    >
                      <MessageSquare className="size-3.5" />
                      Comment on evidence
                    </Button>
                  ) : (
                    <Button
                      className="h-8 w-full rounded-md text-xs"
                      disabled={evidence.status === 'mapped'}
                      onClick={() => onMapEvidence(evidence.id)}
                      size="sm"
                    >
                      {evidence.status === 'mapped' ? 'Mapped to claim' : 'Map to claim'}
                    </Button>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function FeedbackTab({
  comments,
  feedbackCategory,
  feedbackDraft,
  reviewSelection,
  onAddComment,
  onFeedbackCategoryChange,
  onFeedbackDraftChange,
}: {
  comments: ReviewComment[]
  feedbackCategory: CommentCategory
  feedbackDraft: string
  reviewSelection: ReviewSelection | null
  onAddComment: () => void
  onFeedbackCategoryChange: (category: CommentCategory) => void
  onFeedbackDraftChange: (draft: string) => void
}) {
  const categories: CommentCategory[] = ['Claim clarity', 'Evidence strength', 'Source mapping', 'Writing']

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        <div className="text-xs font-semibold uppercase text-slate-500">Feedback target</div>
        <div className="mt-2 text-sm font-medium text-slate-950">
          {reviewSelection ? reviewSelection.target : 'No text selected'}
        </div>
        <blockquote className="mt-2 border-l-2 border-slate-300 pl-2 text-sm leading-5 text-slate-600">
          {reviewSelection?.quote ?? 'Click a claim, use Comment on text, or comment on evidence.'}
        </blockquote>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="feedback-category">
          Category
        </label>
        <select
          id="feedback-category"
          className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
          value={feedbackCategory}
          onChange={(event) => onFeedbackCategoryChange(event.target.value as CommentCategory)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold" htmlFor="feedback-comment">
          Instructor comment
        </label>
        <Textarea
          id="feedback-comment"
          className="min-h-28 resize-none rounded-md"
          placeholder="Write feedback for the selected claim, text, or evidence."
          value={feedbackDraft}
          onChange={(event) => onFeedbackDraftChange(event.target.value)}
        />
      </div>

      <Button className="w-full rounded-md" disabled={!reviewSelection || !feedbackDraft.trim()} onClick={onAddComment}>
        Add feedback
      </Button>

      <div className="border-t border-slate-200 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Feedback in this review</h3>
          <Badge variant="outline">{comments.length}</Badge>
        </div>
        <div className="space-y-2">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-md border border-slate-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant="outline" className="rounded-sm border-slate-200 bg-slate-50 text-slate-600">
                  {comment.category}
                </Badge>
                <span className="text-xs text-slate-500">{comment.target}</span>
              </div>
              <blockquote className="mb-2 border-l-2 border-slate-300 pl-2 text-xs leading-5 text-slate-500">
                {comment.quote}
              </blockquote>
              <p className="text-sm leading-5 text-slate-800">{comment.body}</p>
            </div>
          ))}
        </div>
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
