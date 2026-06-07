'use client'

import { ChevronDown, ChevronRight, FileText, Folder } from 'lucide-react'
import { useState } from 'react'

type FileOutlinePanelProps = {
  onFileSelect?: (filename: string) => void
}

export function FileOutlinePanel({ onFileSelect }: FileOutlinePanelProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['figures']))

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  return (
    <aside className="flex h-full w-44 flex-col border-r border-slate-200 bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 px-3 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">File Outline</h3>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2 text-sm">
        {/* main.tex */}
        <div
          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-slate-200"
          onClick={() => onFileSelect?.('main.tex')}
          role="button"
          tabIndex={0}
        >
          <FileText className="size-4 shrink-0 text-slate-600" />
          <span className="text-xs font-medium text-slate-900">main.tex</span>
        </div>

        {/* references.bib */}
        <div
          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-slate-200"
          onClick={() => onFileSelect?.('references.bib')}
          role="button"
          tabIndex={0}
        >
          <FileText className="size-4 shrink-0 text-slate-600" />
          <span className="text-xs font-medium text-slate-900">references.bib</span>
        </div>

        {/* figures/ folder */}
        <div className="mt-1">
          <button
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-slate-200"
            onClick={() => toggleFolder('figures')}
            type="button"
          >
            {expandedFolders.has('figures') ? (
              <ChevronDown className="size-4 shrink-0 text-slate-600" />
            ) : (
              <ChevronRight className="size-4 shrink-0 text-slate-600" />
            )}
            <Folder className="size-4 shrink-0 text-slate-600" />
            <span className="text-xs font-medium text-slate-900">figures</span>
          </button>

          {/* Folder contents */}
          {expandedFolders.has('figures') && (
            <div className="ml-4 space-y-1">
              <div
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-slate-200"
                onClick={() => onFileSelect?.('figures/architecture.png')}
                role="button"
                tabIndex={0}
              >
                <FileText className="size-3 shrink-0 text-slate-500" />
                <span className="text-xs text-slate-700">architecture.png</span>
              </div>
              <div
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-slate-200"
                onClick={() => onFileSelect?.('figures/process-flow.pdf')}
                role="button"
                tabIndex={0}
              >
                <FileText className="size-3 shrink-0 text-slate-500" />
                <span className="text-xs text-slate-700">process-flow.pdf</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
