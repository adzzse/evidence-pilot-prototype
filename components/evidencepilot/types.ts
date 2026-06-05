export type ProjectStatus = 'Draft' | 'Submitted' | 'Returned with Feedback' | 'Revising'

export type ActorRole = 'student' | 'instructor'

export type ReviewStatus = 'Not submitted' | 'Ready for Review' | 'Returned'

export type SourceType = 'PDF' | 'DOCX' | 'Link'

export type SourceOwner = 'student' | 'instructor'

export type SourceSetVisibility = 'Private' | 'Shared'

export type EvidenceStatus = 'mapped' | 'suggested'

export type CommentTarget = 'claim' | 'mapping' | 'text'

export type CommentCategory = 'Claim clarity' | 'Evidence strength' | 'Source mapping' | 'Writing'

export type ProjectSummary = {
  id: string
  title: string
  description: string
  status: ProjectStatus
  reviewStatus: ReviewStatus
  studentName: string
  documentCount: number
  claimCount: number
  supportedClaimCount: number
  feedbackCount: number
  isEmpty: boolean
}

export type Source = {
  id: string
  title: string
  type: SourceType
  status: 'Ready' | 'Processing'
  excerpt: string
  owner?: SourceOwner
  sourceSetId?: string
  sharedBy?: string
  themes?: string[]
}

export type SourceSet = {
  id: string
  name: string
  description: string
  tags: string[]
  visibility: SourceSetVisibility
  ownerName: string
  sharedProjectIds: string[]
  sources: Source[]
}

export type EvidenceResult = {
  id: string
  sourceId: string
  claimId: string
  excerpt: string
  match: number
  status: EvidenceStatus
}

export type Claim = {
  id: string
  text: string
  supported: boolean
  paragraphIndex: number
}

export type ReviewComment = {
  id: string
  target: CommentTarget
  claimId?: string
  evidenceId?: string
  quote: string
  author: string
  body: string
  category: CommentCategory
  resolved: boolean
}

export type ReviewSelection = {
  target: CommentTarget
  quote: string
  claimId?: string
  evidenceId?: string
}

export type GraphNode = {
  id: string
  label: string
  kind: 'claim' | 'source' | 'related-claim'
}

export type GraphEdge = {
  id: string
  from: string
  to: string
  label: string
  strength: 'strong' | 'medium' | 'weak'
}

export type SourceGraphNode = {
  id: string
  sourceId: string
  x: number
  y: number
}

export type SourceGraphEdge = {
  id: string
  fromSourceId: string
  toSourceId: string
  label: 'shared claim' | 'related evidence' | 'same topic'
}

export type ProjectWorkspace = ProjectSummary & {
  paragraphs: string[]
  sources: Source[]
  claims: Claim[]
  evidenceResults: EvidenceResult[]
  comments: ReviewComment[]
  graphNodes: GraphNode[]
  graphEdges: GraphEdge[]
  sourceGraphNodes: SourceGraphNode[]
  sourceGraphEdges: SourceGraphEdge[]
}
