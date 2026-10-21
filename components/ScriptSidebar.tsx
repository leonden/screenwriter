'use client'

import { useState } from 'react'
import type { StoredScript } from '@/lib/storage'

interface Props {
  scripts: StoredScript[]
  activeScriptId: string | null
  onSelect: (id: string) => void
  onCreate: (name: string) => void
  onDelete: (id: string) => void
}

export default function ScriptSidebar({ scripts, activeScriptId, onSelect, onCreate, onDelete }: Props) {
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  function handleCreate() {
    const name = newName.trim() || 'Untitled Script'
    onCreate(name)
    setNewName('')
    setCreating(false)
  }

  return (
    <div className="w-52 bg-neutral-950 border-r border-neutral-800 flex flex-col shrink-0">
      <div className="px-3 pt-3 pb-2 text-xs text-neutral-500 font-medium uppercase tracking-wider select-none">
        Scripts
      </div>

      <div className="flex-1 overflow-y-auto">
        {scripts.map((script) => (
          <div
            key={script.id}
            className={`group flex items-center gap-1 px-3 py-2 cursor-pointer ${
              script.id === activeScriptId
                ? 'bg-neutral-800 text-neutral-100'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
            }`}
            onClick={() => onSelect(script.id)}
          >
            <span className="flex-1 text-sm truncate">{script.name}</span>
            {scripts.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`Delete "${script.name}"?`)) onDelete(script.id)
                }}
                className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-400 transition-all text-xs px-1"
                title="Delete"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-neutral-800">
        {creating ? (
          <div className="flex gap-1">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate()
                if (e.key === 'Escape') setCreating(false)
              }}
              placeholder="Script name…"
              className="flex-1 bg-neutral-800 text-neutral-100 text-xs px-2 py-1 rounded outline-none border border-neutral-600 focus:border-neutral-400"
            />
            <button
              onClick={handleCreate}
              className="text-neutral-900 bg-neutral-100 text-xs px-2 py-1 rounded font-medium"
            >
              ✓
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="w-full text-neutral-500 hover:text-neutral-200 text-xs py-1 rounded hover:bg-neutral-800 transition-colors"
          >
            + New script
          </button>
        )}
      </div>
    </div>
  )
}
