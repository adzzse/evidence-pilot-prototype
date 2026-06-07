'use client'

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Undo2,
  Redo2,
  Sigma,
  Copy,
  Trash2,
} from 'lucide-react'
import type React from 'react'

import { Button } from '@/components/ui/button'

type EditorToolbarProps = {
  onBold?: () => void
  onItalic?: () => void
  onBullets?: () => void
  onNumbers?: () => void
  onEquation?: () => void
  onLink?: () => void
  onUndo?: () => void
  onRedo?: () => void
}

export function EditorToolbar({
  onBold,
  onItalic,
  onBullets,
  onNumbers,
  onEquation,
  onLink,
  onUndo,
  onRedo,
}: EditorToolbarProps) {
  const iconSize = 'size-4'
  const buttonClass = 'h-8 w-8 p-0 rounded'

  return (
    <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-3 py-2">
      {/* Text Formatting */}
      <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
        <Button
          aria-label="Bold"
          className={buttonClass}
          onClick={onBold}
          title="Bold"
          variant="outline"
        >
          <Bold className={iconSize} />
        </Button>
        <Button
          aria-label="Italic"
          className={buttonClass}
          onClick={onItalic}
          title="Italic"
          variant="outline"
        >
          <Italic className={iconSize} />
        </Button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 border-r border-slate-200 px-2">
        <Button
          aria-label="Bullet List"
          className={buttonClass}
          onClick={onBullets}
          title="Bullet List"
          variant="outline"
        >
          <List className={iconSize} />
        </Button>
        <Button
          aria-label="Numbered List"
          className={buttonClass}
          onClick={onNumbers}
          title="Numbered List"
          variant="outline"
        >
          <ListOrdered className={iconSize} />
        </Button>
      </div>

      {/* Special Elements */}
      <div className="flex items-center gap-1 border-r border-slate-200 px-2">
        <Button
          aria-label="Insert Equation"
          className={buttonClass}
          onClick={onEquation}
          title="Insert Equation"
          variant="outline"
        >
          <Sigma className={iconSize} />
        </Button>
        <Button
          aria-label="Insert Link"
          className={buttonClass}
          onClick={onLink}
          title="Insert Link"
          variant="outline"
        >
          <Link2 className={iconSize} />
        </Button>
      </div>

      {/* History */}
      <div className="flex items-center gap-1">
        <Button
          aria-label="Undo"
          className={buttonClass}
          onClick={onUndo}
          title="Undo"
          variant="outline"
        >
          <Undo2 className={iconSize} />
        </Button>
        <Button
          aria-label="Redo"
          className={buttonClass}
          onClick={onRedo}
          title="Redo"
          variant="outline"
        >
          <Redo2 className={iconSize} />
        </Button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Save Status */}
      <div className="text-xs font-medium text-slate-500">Saved</div>
    </div>
  )
}
