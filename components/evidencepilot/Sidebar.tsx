'use client'

import { FileText, History, Settings } from 'lucide-react'
import type React from 'react'

type SidebarProps = {
  activeSection?: 'files' | 'history' | 'settings'
  onSectionChange?: (section: 'files' | 'history' | 'settings') => void
}

export function Sidebar({ activeSection = 'files', onSectionChange }: SidebarProps) {
  const iconClass = 'size-5'
  const buttonClass = (section: string) =>
    `flex h-14 w-full items-center justify-center rounded-none border-l-2 transition ${
      activeSection === section
        ? 'border-l-emerald-500 bg-slate-800 text-emerald-400'
        : 'border-l-transparent bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
    }`

  return (
    <aside className="flex h-full w-10 flex-col bg-slate-900">
      {/* Files */}
      <button
        aria-label="Project Files"
        className={buttonClass('files')}
        onClick={() => onSectionChange?.('files')}
        title="Project Files"
        type="button"
      >
        <FileText className={iconClass} />
      </button>

      {/* History */}
      <button
        aria-label="Version History"
        className={buttonClass('history')}
        onClick={() => onSectionChange?.('history')}
        title="Version History"
        type="button"
      >
        <History className={iconClass} />
      </button>

      {/* Settings */}
      <button
        aria-label="Settings"
        className={buttonClass('settings')}
        onClick={() => onSectionChange?.('settings')}
        title="Settings"
        type="button"
      >
        <Settings className={iconClass} />
      </button>

      {/* Spacer */}
      <div className="flex-1" />
    </aside>
  )
}
