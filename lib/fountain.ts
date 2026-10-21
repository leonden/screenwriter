export type TokenType =
  | 'scene_heading'
  | 'action'
  | 'character'
  | 'dialogue'
  | 'parenthetical'
  | 'transition'
  | 'page_break'
  | 'note'
  | 'section'
  | 'synopsis'
  | 'empty'

export interface FountainToken {
  type: TokenType
  text: string
  depth?: number
}

const SCENE_HEADING_RE = /^(INT|EXT|INT\.\/EXT|INT\/EXT|I\/E)[. ]/i
const ALL_CAPS_RE = /^[^a-z]+$/
const CHARACTER_EXTENSION_RE = /\s*\([^)]+\)\s*$/
const TRANSITION_SUFFIX_RE = /\s+TO:\s*$/i
const FORCED_TRANSITION_RE = /^>\s*/

function isAllCaps(line: string): boolean {
  const stripped = line.replace(CHARACTER_EXTENSION_RE, '').trim()
  return stripped.length > 0 && ALL_CAPS_RE.test(stripped)
}

function nextNonEmptyLine(lines: string[], fromIndex: number): string | null {
  for (let i = fromIndex; i < lines.length; i++) {
    if (lines[i].trim().length > 0) return lines[i]
  }
  return null
}

export function parseFountain(text: string): FountainToken[] {
  const lines = text.split('\n')
  const tokens: FountainToken[] = []
  let inDialogue = false

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = raw.trimEnd()
    const trimmed = line.trim()

    if (trimmed === '') {
      tokens.push({ type: 'empty', text: '' })
      inDialogue = false
      continue
    }

    if (trimmed === '===') {
      tokens.push({ type: 'page_break', text: '' })
      inDialogue = false
      continue
    }

    if (trimmed.startsWith('#')) {
      const depth = (trimmed.match(/^#+/) ?? [''])[0].length
      tokens.push({ type: 'section', text: trimmed.replace(/^#+\s*/, ''), depth })
      inDialogue = false
      continue
    }

    if (trimmed.startsWith('=') && trimmed !== '===') {
      tokens.push({ type: 'synopsis', text: trimmed.replace(/^=\s*/, '') })
      inDialogue = false
      continue
    }

    if (trimmed.startsWith('[[') && trimmed.endsWith(']]')) {
      tokens.push({ type: 'note', text: trimmed.slice(2, -2).trim() })
      continue
    }

    if (trimmed.startsWith('.') && !trimmed.startsWith('..')) {
      tokens.push({ type: 'scene_heading', text: trimmed.slice(1).trim() })
      inDialogue = false
      continue
    }

    if (SCENE_HEADING_RE.test(trimmed)) {
      tokens.push({ type: 'scene_heading', text: trimmed })
      inDialogue = false
      continue
    }

    if (FORCED_TRANSITION_RE.test(trimmed)) {
      tokens.push({ type: 'transition', text: trimmed.replace(FORCED_TRANSITION_RE, '') })
      inDialogue = false
      continue
    }

    if (TRANSITION_SUFFIX_RE.test(trimmed) || trimmed === 'FADE IN:' || trimmed === 'FADE OUT.' || trimmed === 'THE END') {
      tokens.push({ type: 'transition', text: trimmed })
      inDialogue = false
      continue
    }

    if (trimmed.startsWith('@')) {
      tokens.push({ type: 'character', text: trimmed.slice(1).trim() })
      inDialogue = true
      continue
    }

    if (inDialogue && trimmed.startsWith('(') && trimmed.endsWith(')')) {
      tokens.push({ type: 'parenthetical', text: trimmed })
      continue
    }

    if (inDialogue) {
      tokens.push({ type: 'dialogue', text: trimmed })
      continue
    }

    if (isAllCaps(trimmed) && nextNonEmptyLine(lines, i + 1) !== null) {
      tokens.push({ type: 'character', text: trimmed })
      inDialogue = true
      continue
    }

    tokens.push({ type: 'action', text: line })
    inDialogue = false
  }

  return tokens
}
