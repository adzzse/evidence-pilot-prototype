'use client'

import { Clock, Download, Eye } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export type VersionSnapshot = {
  id: string
  version: string
  label: string
  timestamp: string
  author: string
  description: string
  changesSummary?: string
}

type VersionHistoryProps = {
  versions?: VersionSnapshot[]
  onSelectVersion?: (versionId: string) => void
  isOpen?: boolean
  onClose?: () => void
}

const DEFAULT_VERSIONS: VersionSnapshot[] = [
  {
    id: 'v1.2',
    version: '1.2',
    label: 'Post-Review',
    timestamp: '2026-06-07 14:30',
    author: 'Minh Nguyen',
    description: 'Incorporated instructor feedback on communication protocols',
    changesSummary: 'Updated 3 paragraphs, added references',
  },
  {
    id: 'v1.1',
    version: '1.1',
    label: 'Draft',
    timestamp: '2026-06-05 10:15',
    author: 'Minh Nguyen',
    description: 'Initial draft with all four claims',
    changesSummary: 'Created sections, added evidence mapping',
  },
  {
    id: 'v1.0',
    version: '1.0',
    label: 'Skeleton',
    timestamp: '2026-06-01 09:00',
    author: 'Minh Nguyen',
    description: 'Project created with title and outline',
    changesSummary: 'Initial structure',
  },
]

export function VersionHistory({
  versions = DEFAULT_VERSIONS,
  onSelectVersion,
  isOpen = false,
  onClose,
}: VersionHistoryProps) {
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(versions[0]?.id ?? null)

  if (!isOpen) return null

  const handleSelectVersion = (versionId: string) => {
    setSelectedVersionId(versionId)
    onSelectVersion?.(versionId)
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-black/50">
      {/* Panel */}
      <div className="flex w-96 flex-col border-l border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-slate-700" />
              <h2 className="text-base font-semibold text-slate-950">Version History</h2>
            </div>
            <Button className="h-8 w-8 p-0" onClick={onClose} variant="outline">
              ✕
            </Button>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            {versions.length} snapshots · Save a new version before major edits
          </p>
        </div>

        {/* Versions List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2 p-3">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className={`rounded-md border-2 p-3 transition cursor-pointer ${
                  selectedVersionId === version.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                onClick={() => handleSelectVersion(version.id)}
                role="button"
                tabIndex={0}
              >
                {/* Version Info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-slate-900">v{version.version}</div>
                      <Badge className="shrink-0" variant="secondary">
                        {version.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{version.description}</p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{version.author}</span>
                    <span className="text-slate-500">{version.timestamp}</span>
                  </div>
                  {version.changesSummary && (
                    <div className="text-xs text-slate-600">
                      Changes: <span className="font-medium">{version.changesSummary}</span>
                    </div>
                  )}
                </div>

                {/* Timeline Connector */}
                {index < versions.length - 1 && (
                  <div className="mt-2 ml-1 h-3 w-0.5 bg-slate-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {selectedVersionId && (
          <div className="border-t border-slate-200 bg-slate-50 p-3">
            <div className="flex gap-2">
              <Button className="flex-1 gap-2 h-9 text-xs" onClick={() => {}} variant="outline">
                <Eye className="size-3.5" />
                Preview
              </Button>
              <Button className="flex-1 gap-2 h-9 text-xs" onClick={() => {}} variant="default">
                <Download className="size-3.5" />
                Restore
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
