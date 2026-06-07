'use client'

import { FileUp, Network, Search, MessageSquare } from 'lucide-react'
import type React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  SourceSet,
} from './types'

export type ConsolidatedTab = 'source' | 'graph' | 'feedback'

type RightPanelProps = {
  actor: ActorRole
  activeTab: ConsolidatedTab
  onTabChange: (tab: ConsolidatedTab) => void
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
  sourceSets: SourceSet[]
  onSelectSource: (sourceId: string) => void
  onSimulateUpload: () => void
  onMapEvidence: (evidenceId: string) => void
  onSearchChange?: (query: string) => void
}

export function RightPanel({
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
  sourceSets,
  onAddComment,
  onCommentOnEvidence,
  onFeedbackCategoryChange,
  onFeedbackDraftChange,
  onSelectSource,
  onSimulateUpload,
  onMapEvidence,
  onSearchChange,
}: RightPanelProps) {
  const activeEvidence = activeClaim
    ? evidenceResults.filter((evidence) => evidence.claimId === activeClaim.id)
    : []

    const unresolvedComments = comments.filter((comment) => !comment.resolved)
  const isInstructor = actor === 'instructor'

  return (
    <aside className="flex min-h-0 flex-col rounded-md border border-slate-200 bg-white shadow-sm">
      {/* Search Bar */}
      <div className="border-b border-slate-200 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="h-9 pl-10 pr-3 text-sm"
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search Sources and Papers..."
            type="text"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-3 border-b border-slate-200">
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
            activeTab === 'feedback' ? 'bg-slate-100 text-slate-950' : 'text-slate-500 hover:bg-slate-50'
          }`}
          onClick={() => onTabChange('feedback')}
          type="button"
        >
          <MessageSquare className="size-4" />
          Feedback
          {unresolvedComments.length > 0 && (
            <Badge className="ml-1 size-5 rounded-full bg-rose-100 p-0 text-xs font-bold text-rose-700">
              {unresolvedComments.length}
            </Badge>
          )}
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

      {/* Tab Content */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {activeTab === 'source' ? (
          <SourceTabContent
            actor={actor}
            activeClaim={activeClaim}
            activeEvidence={activeEvidence}
            sourceSets={sourceSets}
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
          <FeedbackTabContent
            actor={actor}
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

function SourceTabContent({
  actor,
  activeClaim,
  activeEvidence,
  sourceSets,
  sources,
  onCommentOnEvidence,
  onMapEvidence,
  onSimulateUpload,
}: {
  actor: ActorRole
  activeClaim: Claim | null
  activeEvidence: EvidenceResult[]
  sourceSets: SourceSet[]
  sources: Source[]
  onCommentOnEvidence: (evidence: EvidenceResult) => void
  onMapEvidence: (evidenceId: string) => void
  onSimulateUpload: () => void
}) {
  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3">
        <Button
          className="h-8 w-full gap-2 rounded text-xs"
          onClick={onSimulateUpload}
          variant="outline"
        >
          <FileUp className="size-3" />
          Upload PDF / DOCX
        </Button>
      </div>

      {/* Source Sets */}
      {sourceSets.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold text-slate-600 uppercase">Shared Resources</h3>
          {sourceSets.map((sourceSet) => (
            <div key={sourceSet.id} className="mb-3 rounded-md border border-slate-200 p-2">
              <div className="mb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-900">{sourceSet.name}</div>
                    <p className="text-xs text-slate-600">{sourceSet.description}</p>
                  </div>
                  <Badge className="shrink-0 text-xs" variant="outline">
                    {sourceSet.sources.length}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                {sourceSet.sources.map((source) => (
                  <div
                    key={source.id}
                    className="rounded-sm border border-slate-200 bg-slate-50 p-2 text-xs"
                  >
                    <div className="font-semibold text-slate-900">{source.title}</div>
                    <p className="mt-1 line-clamp-2 text-slate-600">{source.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Sources */}
      {sources.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold text-slate-600 uppercase">Uploaded Sources</h3>
          <div className="space-y-2">
            {sources.map((source) => (
              <div key={source.id} className="rounded-md border border-slate-200 bg-white p-2">
                <div className="font-semibold text-slate-900">{source.title}</div>
                <p className="mt-1 text-xs text-slate-600">{source.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Evidence */}
      {activeEvidence.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold text-slate-600 uppercase">Evidence for Claim</h3>
          <div className="space-y-2">
            {activeEvidence.map((evidence) => (
              <div key={evidence.id} className="rounded-md border border-slate-200 bg-white p-2">
                <div className="mb-1 flex items-center justify-between">
                  <Badge
                    className="text-xs"
                    variant={evidence.status === 'mapped' ? 'default' : 'secondary'}
                  >
                    {evidence.status === 'mapped' ? 'Mapped' : 'Suggested'} ({evidence.match}%)
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">{evidence.excerpt}</p>
                <div className="mt-2 flex gap-1">
                  {evidence.status === 'suggested' && (
                    <Button
                      className="h-6 text-xs"
                      onClick={() => onMapEvidence(evidence.id)}
                      size="sm"
                      variant="outline"
                    >
                      Map
                    </Button>
                  )}
                  {actor === 'instructor' && (
                    <Button
                      className="h-6 text-xs"
                      onClick={() => onCommentOnEvidence(evidence)}
                      size="sm"
                      variant="outline"
                    >
                      Comment
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FeedbackTabContent({
  actor,
  comments,
  feedbackCategory,
  feedbackDraft,
  reviewSelection,
  onAddComment,
  onFeedbackCategoryChange,
  onFeedbackDraftChange,
}: {
  actor : ActorRole
  comments: ReviewComment[]
  feedbackCategory: CommentCategory
  feedbackDraft: string
  reviewSelection: ReviewSelection | null
  onAddComment: () => void
  onFeedbackCategoryChange: (category: CommentCategory) => void
  onFeedbackDraftChange: (draft: string) => void
}) {
  const categories: CommentCategory[] = ['Claim clarity', 'Evidence strength', 'Source mapping', 'Writing']

  // Sample timestamps for demo (in real app, would come from data)
  const commentTimestamps: Record<string, string> = {
    'comment-1': '2026-06-07 14:30',
    'comment-2': '2026-06-07 14:35',
  }

  return (
    <div className="space-y-4">
      {/* Feedback History Header */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Instructor's Feedback History
        </h3>

        {/* Comments Feed */}
        {comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((comment, index) => (
              <div key={comment.id} className="relative">
                {/* Timeline Connector */}
                {index < comments.length - 1 && (
                  <div className="absolute left-2 top-8 h-6 w-0.5 bg-slate-200"></div>
                )}

                {/* Comment Card */}
                <div
                  className={`rounded-md border-l-2 p-3 ${
                    comment.resolved
                      ? 'border-l-slate-300 bg-slate-50'
                      : 'border-l-emerald-500 bg-emerald-50'
                  }`}
                >
                  {/* Header with Author and Timestamp */}
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
                        {comment.author[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900">{comment.author}</div>
                        <div className="text-xs text-slate-500">{commentTimestamps[comment.id] || 'Just now'}</div>
                      </div>
                    </div>
                    <Badge className="shrink-0 text-xs" variant="secondary">
                      {comment.category}
                    </Badge>
                  </div>

                  {/* Quoted Text */}
                  <div className="mb-2 border-l-2 border-slate-300 bg-white px-2 py-1 pl-3">
                    <p className="text-xs text-slate-600 italic">"{comment.quote}"</p>
                  </div>

                  {/* Feedback Body */}
                  <p className="text-xs leading-relaxed text-slate-700">{comment.body}</p>

                  {/* Status Badge */}
                  {comment.resolved && (
                    <div className="mt-2 text-xs text-slate-500">✓ Resolved</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-xs text-slate-600">No feedback yet</p>
          </div>
        )}
      </div>

      {/* New Comment Form */}
      {actor === 'instructor' && reviewSelection && (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <h4 className="mb-2 text-xs font-semibold uppercase text-slate-600">Add Feedback</h4>
          <div className="mb-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Category
            </label>
            <select
              className="h-8 w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900"
              onChange={(e) => onFeedbackCategoryChange(e.target.value as CommentCategory)}
              value={feedbackCategory}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Quote
            </label>
            <div className="rounded bg-white p-2">
              <p className="text-xs text-slate-600">"{reviewSelection.quote}"</p>
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Feedback
            </label>
            <textarea
              className="h-16 w-full rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 placeholder-slate-400 outline-none"
              onChange={(e) => onFeedbackDraftChange(e.target.value)}
              placeholder="Enter your feedback..."
              value={feedbackDraft}
            />
          </div>
          <Button className="h-8 w-full text-xs" onClick={onAddComment} variant="default">
            Add Comment
          </Button>
        </div>
      )}
    </div>
  )
}
