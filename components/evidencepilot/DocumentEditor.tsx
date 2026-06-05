import { MousePointer2, PencilLine } from 'lucide-react'
import type React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Claim, ReviewComment } from './types'

type DocumentEditorProps = {
  paragraphs: string[]
  claims: Claim[]
  comments: ReviewComment[]
  activeClaimId: string | null
  onSelectClaim: (claimId: string) => void
  onUseHighlightedText: (text: string) => void
}

const EMPTY_TEXT = 'Start drafting your project argument here. Highlight a sentence to turn it into a claim.'

export function DocumentEditor({
  paragraphs,
  claims,
  comments,
  activeClaimId,
  onSelectClaim,
  onUseHighlightedText,
}: DocumentEditorProps) {
  const content = paragraphs.length > 0 ? paragraphs : [EMPTY_TEXT]
  const unresolvedCount = comments.filter((comment) => !comment.resolved).length

  return (
    <section className="min-h-0 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-950">Document editor</div>
            <p className="text-xs text-slate-500">Type, highlight text, and inspect supported claims.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-sm border-blue-200 bg-blue-50 text-blue-700">
              {claims.filter((claim) => claim.supported).length} supported
            </Badge>
            <Badge variant="outline" className="rounded-sm border-rose-200 bg-rose-50 text-rose-700">
              {unresolvedCount} comments
            </Badge>
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-7 text-3xl font-semibold leading-tight tracking-tight text-slate-950">
          Managing Risk and Communication in Agile Software Projects
        </h1>

        {content.map((paragraph, index) => (
          <div key={`${paragraph}-${index}`} className="group relative mb-7">
            <p className="text-base leading-8 text-slate-800">{renderParagraph(paragraph, index, claims, activeClaimId, onSelectClaim)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 opacity-100 md:opacity-0 md:transition md:group-hover:opacity-100">
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-2 rounded-md text-xs"
                onClick={() => onUseHighlightedText(getSuggestedClaimText(paragraph))}
              >
                <PencilLine className="size-3.5" />
                Use as claim
              </Button>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <MousePointer2 className="size-3.5" />
                Simulated text selection
              </span>
            </div>
          </div>
        ))}
      </article>
    </section>
  )
}

function renderParagraph(
  paragraph: string,
  paragraphIndex: number,
  claims: Claim[],
  activeClaimId: string | null,
  onSelectClaim: (claimId: string) => void,
) {
  const paragraphClaims = claims
    .filter((claim) => claim.paragraphIndex === paragraphIndex && paragraph.includes(claim.text))
    .map((claim) => ({ claim, start: paragraph.indexOf(claim.text) }))
    .filter(({ start }) => start >= 0)
    .sort((a, b) => a.start - b.start)

  if (paragraphClaims.length === 0) return paragraph

  const parts: React.ReactNode[] = []
  let cursor = 0

  for (const { claim, start } of paragraphClaims) {
    if (start < cursor) continue
    if (start > cursor) {
      parts.push(<span key={`${claim.id}-before`}>{paragraph.slice(cursor, start)}</span>)
    }

    const isActive = activeClaimId === claim.id
    const className = claim.supported
      ? `rounded-sm border-b-2 px-1 py-0.5 ${
          isActive
            ? 'border-blue-700 bg-blue-100 text-blue-950'
            : 'border-blue-500 bg-blue-50 text-blue-950 hover:bg-blue-100'
        }`
      : 'rounded-sm border border-dashed border-amber-400 bg-amber-50 px-1 py-0.5 text-amber-950'

    parts.push(
      <button
        key={claim.id}
        className={`${className} text-left align-baseline transition`}
        onClick={() => {
          if (claim.supported) onSelectClaim(claim.id)
        }}
        type="button"
      >
        {claim.text}
      </button>,
    )
    cursor = start + claim.text.length
  }

  if (cursor < paragraph.length) {
    parts.push(<span key="remaining">{paragraph.slice(cursor)}</span>)
  }

  return parts
}

function getSuggestedClaimText(paragraph: string) {
  const sentence = paragraph.split('.').find((item) => item.trim().length > 24)
  return sentence?.trim() ?? paragraph.trim()
}
