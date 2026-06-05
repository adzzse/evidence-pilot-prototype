import { CheckCircle2, MessageSquare } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { ReviewComment } from './types'

type CommentMarginProps = {
  comments: ReviewComment[]
  onResolve: (commentId: string) => void
}

const targetLabel: Record<ReviewComment['target'], string> = {
  claim: 'Claim',
  mapping: 'Mapping',
  text: 'Text',
}

export function CommentMargin({ comments, onResolve }: CommentMarginProps) {
  if (comments.length === 0) {
    return (
      <aside className="rounded-md border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
        <MessageSquare className="mb-3 size-5 text-slate-400" />
        No returned feedback yet.
      </aside>
    )
  }

  return (
    <aside className="space-y-3 overflow-y-auto pr-1">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Instructor feedback</div>
      {comments.map((comment) => (
        <Card
          key={comment.id}
          className={`rounded-md border-slate-200 bg-white p-3 shadow-sm transition ${
            comment.resolved ? 'opacity-60' : ''
          }`}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <Badge variant="outline" className="rounded-sm border-slate-200 bg-slate-50 text-slate-600">
              {targetLabel[comment.target]}
            </Badge>
            {comment.resolved && <CheckCircle2 className="size-4 text-emerald-600" />}
          </div>
          <blockquote className="mb-2 border-l-2 border-slate-300 pl-2 text-xs leading-5 text-slate-500">
            {comment.quote}
          </blockquote>
          <p className="mb-3 text-sm leading-5 text-slate-800">{comment.body}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500">{comment.author}</span>
            <Button
              disabled={comment.resolved}
              onClick={() => onResolve(comment.id)}
              size="sm"
              variant="outline"
              className="h-7 rounded-md px-2 text-xs"
            >
              {comment.resolved ? 'Resolved' : 'Resolve'}
            </Button>
          </div>
        </Card>
      ))}
    </aside>
  )
}
