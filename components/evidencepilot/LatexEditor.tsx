'use client'

import { Eye, FileText, RefreshCw } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { EditorToolbar } from './EditorToolbar'

type LatexEditorProps = {
  onRecompile?: () => void
}

// LaTeX document content for Agile Risk document
const LATEX_CONTENT = `\\documentclass{article}
\\usepackage[utf-8]{inputenc}
\\usepackage{xcolor}
\\usepackage{soul}

\\title{Managing Risk and Communication in Agile Software Projects}
\\author{Minh Nguyen}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}

Agile software development depends on fast communication between stakeholders, product owners, and delivery teams. However, project risk increases when feedback loops are informal or delayed.

\\section{Communication Protocols and Risk Reduction}

Clear communication protocols reduce project risk \\hl{because teams can identify blockers earlier and align decisions before sprint goals are missed}.

Risk management in agile projects should combine lightweight documentation, frequent review meetings, and traceable evidence for important project claims.

\\section{Addressing Common Assumptions}

Some teams assume daily meetings alone are enough to control project uncertainty, but this claim still needs stronger evidence from the uploaded sources.

\\end{document}`

const COMPILED_PDF_CONTENT = {
  title: 'Managing Risk and Communication in Agile Software Projects',
  author: 'Minh Nguyen',
  sections: [
    {
      heading: '1. Introduction',
      content:
        'Agile software development depends on fast communication between stakeholders, product owners, and delivery teams. However, project risk increases when feedback loops are informal or delayed.',
    },
    {
      heading: '2. Communication Protocols and Risk Reduction',
      content:
        'Clear communication protocols reduce project risk because teams can identify blockers earlier and align decisions before sprint goals are missed. Risk management in agile projects should combine lightweight documentation, frequent review meetings, and traceable evidence for important project claims.',
      highlight: 'because teams can identify blockers earlier and align decisions before sprint goals are missed.',
    },
    {
      heading: '3. Addressing Common Assumptions',
      content:
        'Some teams assume daily meetings alone are enough to control project uncertainty, but this claim still needs stronger evidence from the uploaded sources.',
    },
  ],
}

export function LatexEditor({ onRecompile }: LatexEditorProps) {
  const [mode, setMode] = useState<'code' | 'visual'>('code')
  const [latexCode, setLatexCode] = useState(LATEX_CONTENT)

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden rounded-md border border-slate-200 shadow-sm">
      {/* Left Panel - Code Editor */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-950">
        {/* Editor Toolbar */}
        <EditorToolbar />

        {/* Code Editor Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">LaTeX Code</span>
          </div>
          <button
            className={`rounded px-3 py-1 text-xs font-medium transition ${
              mode === 'code'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onClick={() => setMode('code')}
            type="button"
          >
            Code
          </button>
        </div>

        {/* Code Editor Content */}
        <div className="flex-1 overflow-hidden">
          <textarea
            className="size-full resize-none bg-slate-950 p-4 font-mono text-sm text-emerald-400 placeholder-slate-600 outline-none"
            defaultValue={latexCode}
            onChange={(e) => setLatexCode(e.target.value)}
            placeholder="Enter LaTeX code here..."
            spellCheck="false"
          />
        </div>
      </div>

      {/* Right Panel - PDF Preview */}
      <div className="flex flex-1 flex-col overflow-hidden border-l border-slate-200 bg-white">
        {/* PDF Preview Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700">PDF Preview</span>
          </div>
          <Button
            className="h-8 gap-2 rounded bg-emerald-500 px-3 text-xs font-medium text-white hover:bg-emerald-600"
            onClick={onRecompile}
            size="sm"
            variant="outline"
          >
            <RefreshCw className="size-3" />
            Recompile
          </Button>
        </div>

        {/* PDF Preview Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
          <div className="mx-auto max-w-2xl bg-white p-8 shadow-sm">
            {/* Title */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-slate-950">
                {COMPILED_PDF_CONTENT.title}
              </h1>
              <p className="text-sm text-slate-600">{COMPILED_PDF_CONTENT.author}</p>
            </div>

            {/* Sections */}
            {COMPILED_PDF_CONTENT.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="mb-3 text-lg font-bold text-slate-950">{section.heading}</h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {section.highlight ? (
                    <>
                      {section.content.split(section.highlight)[0]}
                      <mark className="bg-yellow-100 text-slate-950">{section.highlight}</mark>
                      {section.content.split(section.highlight)[1]}
                    </>
                  ) : (
                    section.content
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
