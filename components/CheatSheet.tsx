'use client'

interface Props {
  onClose: () => void
}

const ENTRIES = [
  {
    category: 'Scene Heading',
    shortcut: 'INT. / EXT.',
    example: 'INT. COFFEE SHOP - DAY',
    note: 'Starts with INT., EXT., INT./EXT., or a leading dot (.)',
  },
  {
    category: 'Action',
    shortcut: '(default)',
    example: 'Sarah stares at her phone.',
    note: 'Any line that isn\'t a special element becomes action/description.',
  },
  {
    category: 'Character',
    shortcut: 'ALL CAPS',
    example: 'SARAH\nor\n@ Sarah',
    note: 'An ALL CAPS line before dialogue. Use @ to force any casing.',
  },
  {
    category: 'Dialogue',
    shortcut: 'Line after character',
    example: 'SARAH\nI can\'t believe this.',
    note: 'Any line following a character name is treated as dialogue.',
  },
  {
    category: 'Parenthetical',
    shortcut: '(text)',
    example: 'SARAH\n(quietly)\nI can\'t believe this.',
    note: 'Must be inside a dialogue block, wrapped in parentheses.',
  },
  {
    category: 'Transition',
    shortcut: '> or ends with TO:',
    example: '> SMASH CUT TO:\nor\nCUT TO:',
    note: 'Leading > forces a transition. Lines ending in TO: are auto-detected.',
  },
  {
    category: 'Character extensions',
    shortcut: '(V.O.) / (O.S.)',
    example: 'SARAH (V.O.)\nI always knew this day would come.',
    note: 'V.O. = voice over. O.S. = off screen. Written after the name.',
  },
  {
    category: 'Forced scene heading',
    shortcut: '. (dot)',
    example: '.LATER',
    note: 'A leading dot forces any line to be treated as a scene heading.',
  },
  {
    category: 'Page break',
    shortcut: '===',
    example: '===',
    note: 'Three or more equals signs insert a manual page break.',
  },
  {
    category: 'Note (hidden)',
    shortcut: '[[ ]]',
    example: '[[This is a note for the writer only]]',
    note: 'Notes are parsed but hidden from the formatted preview and PDF.',
  },
  {
    category: 'Section heading',
    shortcut: '# / ## / ###',
    example: '# ACT ONE',
    note: 'Structural markers. Hidden from preview, visible in outline view.',
  },
  {
    category: 'Fade in / out',
    shortcut: 'Exact text',
    example: 'FADE IN:\nFADE OUT.',
    note: 'These exact phrases are recognized as transitions automatically.',
  },
]

export default function CheatSheet({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div>
            <h2 className="text-neutral-100 font-semibold text-sm">Fountain Syntax Cheatsheet</h2>
            <p className="text-neutral-500 text-xs mt-0.5">
              Based on the open{' '}
              <span className="text-neutral-400">Fountain</span> screenplay format
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-200 transition-colors text-lg leading-none px-1"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {ENTRIES.map((entry) => (
            <div
              key={entry.category}
              className="grid grid-cols-[140px_1fr] gap-4 px-3 py-3 rounded-md hover:bg-neutral-800/60 transition-colors"
            >
              <div>
                <div className="text-neutral-200 text-xs font-semibold">{entry.category}</div>
                <div className="text-neutral-500 text-[11px] mt-0.5 font-mono">{entry.shortcut}</div>
              </div>
              <div>
                <pre className="text-neutral-300 text-[11px] font-mono bg-neutral-800 rounded px-2 py-1.5 whitespace-pre-wrap leading-relaxed">
                  {entry.example}
                </pre>
                <p className="text-neutral-500 text-[11px] mt-1.5 leading-relaxed">{entry.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-neutral-600 text-xs">
            Tip: files are portable — open .fountain files in Final Draft, Highland, or Fade In
          </span>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-100 text-xs px-3 py-1.5 rounded border border-neutral-700 hover:border-neutral-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
