'use client'

import type { FountainToken } from '@/lib/fountain'

interface Props {
  tokens: FountainToken[]
}

export default function ScriptPreview({ tokens }: Props) {
  return (
    <div className="h-full overflow-y-auto bg-neutral-100 p-8">
      <div className="mx-auto w-[816px] min-h-[1056px] bg-white shadow-md px-[108px] py-[72px] font-mono text-[12px] leading-[1.5] text-neutral-900">
        {tokens.map((token, i) => {
          switch (token.type) {
            case 'scene_heading':
              return (
                <div key={i} className="mt-6 mb-1 font-bold uppercase">
                  {token.text}
                </div>
              )

            case 'action':
              return token.text.trim() ? (
                <div key={i} className="mt-3">
                  {token.text}
                </div>
              ) : null

            case 'character':
              return (
                <div key={i} className="mt-6 ml-[40%] uppercase">
                  {token.text}
                </div>
              )

            case 'dialogue':
              return (
                <div key={i} className="ml-[25%] mr-[15%] mt-0">
                  {token.text}
                </div>
              )

            case 'parenthetical':
              return (
                <div key={i} className="ml-[35%] mr-[25%] italic">
                  {token.text}
                </div>
              )

            case 'transition':
              return (
                <div key={i} className="mt-6 text-right uppercase">
                  {token.text}
                </div>
              )

            case 'page_break':
              return <hr key={i} className="my-6 border-dashed border-neutral-300" />

            case 'empty':
              return <div key={i} className="h-[1.5em]" />

            case 'note':
            case 'section':
            case 'synopsis':
              return null

            default:
              return null
          }
        })}
        {tokens.length === 0 && (
          <div className="text-neutral-400 text-center mt-24">
            Start typing Fountain on the left.
          </div>
        )}
      </div>
    </div>
  )
}
