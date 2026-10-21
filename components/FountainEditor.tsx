'use client'

import { useCallback, useRef } from 'react'

interface Props {
  content: string
  onChange: (value: string) => void
}

export default function FountainEditor({ content, onChange }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => onChange(value), 300)
      // also call immediately so preview is responsive
      onChange(value)
    },
    [onChange]
  )

  return (
    <div className="h-full flex flex-col bg-neutral-900">
      <div className="px-3 py-1.5 text-xs text-neutral-500 border-b border-neutral-800 select-none">
        Fountain
      </div>
      <textarea
        className="flex-1 resize-none bg-neutral-900 text-neutral-100 font-mono text-[13px] leading-[1.6] p-4 outline-none placeholder:text-neutral-600"
        value={content}
        onChange={handleChange}
        placeholder={`Start writing in Fountain syntax…\n\nINT. LOCATION - DAY\n\nAction description.\n\nCHARACTER\nDialogue line.`}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
  )
}
