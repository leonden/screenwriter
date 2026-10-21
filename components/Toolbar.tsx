'use client'

interface Props {
  scriptName: string
  onNameChange: (name: string) => void
  onNew: () => void
  onExportPDF: () => void
  onToggleSidebar: () => void
  onHelp: () => void
  sidebarOpen: boolean
  isSaved: boolean
}

export default function Toolbar({
  scriptName,
  onNameChange,
  onNew,
  onExportPDF,
  onToggleSidebar,
  onHelp,
  sidebarOpen,
  isSaved,
}: Props) {
  return (
    <div className="h-11 flex items-center gap-3 px-3 bg-neutral-950 border-b border-neutral-800 shrink-0">
      <button
        onClick={onToggleSidebar}
        title={sidebarOpen ? 'Close scripts (⌘\\)' : 'Open scripts (⌘\\)'}
        className="text-neutral-400 hover:text-neutral-100 transition-colors text-sm px-2 py-1 rounded hover:bg-neutral-800"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <span className="text-neutral-600 font-mono text-xs font-semibold tracking-widest select-none">
        SCREENWRITER
      </span>

      <div className="flex-1 flex items-center justify-center">
        <input
          type="text"
          value={scriptName}
          onChange={(e) => onNameChange(e.target.value)}
          className="bg-transparent text-neutral-200 text-sm text-center outline-none border-b border-transparent hover:border-neutral-600 focus:border-neutral-400 transition-colors px-2 py-0.5 min-w-0 max-w-xs"
          placeholder="Untitled Script"
        />
      </div>

      <span className="text-xs text-neutral-600 select-none">{isSaved ? 'Saved' : 'Saving…'}</span>

      <button
        onClick={onNew}
        title="New script (⌘N)"
        className="text-neutral-400 hover:text-neutral-100 text-xs px-2.5 py-1 rounded border border-neutral-700 hover:border-neutral-500 transition-colors"
      >
        New
      </button>

      <button
        onClick={onExportPDF}
        title="Export PDF (⌘⇧E)"
        className="text-neutral-900 bg-neutral-100 hover:bg-white text-xs px-2.5 py-1 rounded font-medium transition-colors"
      >
        Export PDF
      </button>

      <button
        onClick={onHelp}
        title="Fountain syntax cheatsheet (?)"
        className="text-neutral-500 hover:text-neutral-200 text-xs w-6 h-6 flex items-center justify-center rounded-full border border-neutral-700 hover:border-neutral-500 transition-colors font-semibold"
      >
        ?
      </button>
    </div>
  )
}
