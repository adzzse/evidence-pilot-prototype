export type ProjectStatus = 'Draft' | 'Submitted' | 'Returned with Feedback' | 'Revising'

export type SourceType = 'PDF' | 'DOCX' | 'Link'

export type EvidenceStatus = 'mapped' | 'suggested'

export type CommentTarget = 'claim' | 'mapping' | 'text'

export type ProjectSummary = {
  id: string
  title: string
  description: string
  status: ProjectStatus
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
  resolved: boolean
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

export type ProjectWorkspace = ProjectSummary & {
  paragraphs: string[]
  sources: Source[]
  claims: Claim[]
  evidenceResults: EvidenceResult[]
  comments: ReviewComment[]
  graphNodes: GraphNode[]
  graphEdges: GraphEdge[]
}
