'use client'

import FountainEditor from './FountainEditor'
import ScriptPreview from './ScriptPreview'
import type { FountainToken } from '@/lib/fountain'

interface Props {
  content: string
  tokens: FountainToken[]
  onContentChange: (value: string) => void
}

export default function Editor({ content, tokens, onContentChange }: Props) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="w-1/2 overflow-hidden border-r border-neutral-800">
        <FountainEditor content={content} onChange={onContentChange} />
      </div>
      <div className="w-1/2 overflow-hidden">
        <ScriptPreview tokens={tokens} />
      </div>
    </div>
  )
}
