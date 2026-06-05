'use client'

import { useState } from 'react'
import { FileUp, Upload, Link as LinkIcon, Search, FileText, CheckCircle, MoreVertical, RotateCcw, RotateCw, Bold, Italic, List, ToggleLeft, Send, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Sample data for sources
const SAMPLE_SOURCES = [
  { id: 1, title: 'agile-risk-management.pdf', type: 'PDF', status: 'Ready' },
  { id: 2, title: 'requirements-change-report.docx', type: 'DOCX', status: 'Ready' },
  { id: 3, title: 'project-communication-study.pdf', type: 'PDF', status: 'Ready' },
  { id: 4, title: 'https://example.com/software-project-risk', type: 'Link', status: 'Ready' },
]

// Sample chat messages
const SAMPLE_MESSAGES = [
  { role: 'user', content: 'Does this source support my claim clearly?' },
  { role: 'assistant', content: 'The source supports the claim about communication risk, but the paragraph could be more specific about stakeholder feedback loops. Consider emphasizing the specific mechanisms through which the source supports your argument.' },
]

export default function EvidencePilotWorkspace() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [filteredType, setFilteredType] = useState('All')
  const [chatInput, setChatInput] = useState('')
  const [highlightedText, setHighlightedText] = useState('we must establish clear communication protocols to mitigate agile project risks')
  const [showPopover, setShowPopover] = useState(true)

  const filterSources = () => {
    if (filteredType === 'All') return SAMPLE_SOURCES
    return SAMPLE_SOURCES.filter(s => s.type === filteredType)
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">EvidencePilot</h1>
          </div>
          <h2 className="text-sm font-medium text-muted-foreground">Managing Risk and Communication in Agile Software Projects</h2>
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Sources Manager */}
        <div className="w-full md:w-80 border-r border-border bg-white flex flex-col overflow-hidden md:flex">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Sources</h3>
            
            {/* Upload Area */}
            <div className="bg-secondary rounded-lg p-3 mb-4">
              <div className="text-xs font-medium text-muted-foreground mb-3">Add Source</div>
              <div className="flex gap-2">
                <button className="flex-1 flex flex-col items-center justify-center py-2 rounded border border-border hover:bg-background transition-colors">
                  <FileText className="w-4 h-4 text-primary mb-1" />
                  <span className="text-xs text-foreground">PDF</span>
                </button>
                <button className="flex-1 flex flex-col items-center justify-center py-2 rounded border border-border hover:bg-background transition-colors">
                  <FileUp className="w-4 h-4 text-primary mb-1" />
                  <span className="text-xs text-foreground">DOCX</span>
                </button>
                <button className="flex-1 flex flex-col items-center justify-center py-2 rounded border border-border hover:bg-background transition-colors">
                  <LinkIcon className="w-4 h-4 text-primary mb-1" />
                  <span className="text-xs text-foreground">Link</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sources..."
                className="pl-9 h-9 text-sm bg-white border-border"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['All', 'PDF', 'DOCX', 'Links'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setFilteredType(filter)}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                    filteredType === filter
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground border border-border'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Sources List */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-2">
              {filterSources().map(source => (
                <button
                  key={source.id}
                  onClick={() => setSelectedSource(source.id.toString())}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedSource === source.id.toString()
                      ? 'bg-secondary border border-primary'
                      : 'hover:bg-secondary border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{source.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{source.type}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {source.status}
                        </span>
                      </div>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Document Editor */}
        <div className="flex-1 border-r border-border bg-white flex flex-col overflow-hidden min-w-0">
          {/* Toolbar */}
          <div className="border-b border-border px-6 py-3 flex items-center justify-between gap-4 bg-white">
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Bold className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Italic className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="gap-2 text-xs"
            >
              <ToggleLeft className="w-4 h-4" />
              Citation Mode
            </Button>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <article className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-foreground mb-8">Managing Risk and Communication in Agile Software Projects</h1>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
                <p className="text-base leading-relaxed text-foreground mb-4">
                  Agile software development has become the dominant paradigm in modern software engineering. However, the transition from traditional waterfall methodologies introduces new challenges in risk management and team communication. This paper examines the intersection of these two critical dimensions in agile project contexts.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Risk and Communication in Agile Projects</h2>
                <p className="text-base leading-relaxed text-foreground mb-4">
                  Effective risk mitigation in agile environments depends heavily on transparent and continuous communication. Organizations that implement structured communication frameworks report significantly better outcomes in stakeholder alignment and project success rates. To address these challenges, {' '}
                  <span
                    className="relative inline-block bg-blue-100 px-1 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => setShowPopover(!showPopover)}
                  >
                    we must establish clear communication protocols to mitigate agile project risks
                    {showPopover && (
                      <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-border rounded-lg shadow-lg p-3 z-10 text-sm">
                        <div className="font-medium text-foreground mb-2">agile-risk-management.pdf</div>
                        <Badge variant="outline" className="text-xs mb-2">PDF</Badge>
                        <p className="text-xs text-muted-foreground mb-3">
                          Evidence supporting effective communication protocols in risk mitigation.
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            View Detail
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            Change Source
                          </Button>
                        </div>
                      </div>
                    )}
                  </span>
                  {' '}and develop mechanisms for rapid feedback loops that allow teams to identify and address risks early.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Conclusion</h2>
                <p className="text-base leading-relaxed text-foreground">
                  The success of agile projects hinges on the ability to balance flexibility with appropriate risk management and communication structures. Future research should explore how different organizational cultures impact the effectiveness of communication-driven risk mitigation strategies.
                </p>
              </section>
            </article>
          </div>
        </div>

        {/* Right Panel - Citation Details & AI Chat */}
        <div className="w-full md:w-96 border-l border-border bg-white flex flex-col overflow-hidden md:flex hidden lg:flex">
          {/* Citation Detail Section */}
          <div className="border-b border-border p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Selected Citation</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Claim</div>
                <p className="text-sm text-foreground leading-relaxed">
                  &quot;We must establish clear communication protocols to mitigate agile project risks&quot;
                </p>
              </div>

              <Separator />

              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Source</div>
                <div className="text-sm font-medium text-foreground">agile-risk-management.pdf</div>
              </div>

              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Type</div>
                <Badge variant="secondary" className="text-xs">PDF</Badge>
              </div>

              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Supporting Excerpt</div>
                <p className="text-xs text-foreground leading-relaxed italic bg-secondary p-2 rounded">
                  &quot;Organizations that implement structured communication frameworks report significantly better outcomes in stakeholder alignment.&quot;
                </p>
              </div>

              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Why This Source</div>
                <p className="text-xs text-foreground leading-relaxed bg-secondary p-2 rounded">
                  This source directly addresses the relationship between communication protocols and risk mitigation in agile contexts, providing empirical support for the claim.
                </p>
              </div>
            </div>
          </div>

          {/* AI Chat Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <h3 className="text-sm font-semibold text-foreground">EvidencePilot Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {SAMPLE_MESSAGES.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about this paragraph..."
                  className="text-sm h-9 bg-white border-border"
                />
                <Button
                  size="sm"
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
