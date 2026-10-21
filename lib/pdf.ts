import type { FountainToken } from './fountain'

// All measurements in points (1 inch = 72pt)
// US Letter: 612pt x 792pt
const PAGE_W = 612
const PAGE_H = 792
const MARGIN_TOP = 72       // 1"
const MARGIN_BOTTOM = 72    // 1"
const MARGIN_LEFT = 108     // 1.5"
const MARGIN_RIGHT = 72     // 1"
const USABLE_W = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT  // 432pt
const LINE_H = 12           // 12pt line height (Courier 12pt)
const FONT_SIZE = 12

// x positions from left edge
const X_SCENE = MARGIN_LEFT
const X_ACTION = MARGIN_LEFT
const X_CHARACTER = 265     // ~3.7"
const X_DIALOGUE = 180      // ~2.5"
const X_PAREN = 223         // ~3.1"
const DIALOGUE_MAX_W = 252  // ~3.5"

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    if (current.length + word.length + (current ? 1 : 0) <= maxChars) {
      current += (current ? ' ' : '') + word
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines.length ? lines : ['']
}

export async function exportToPDF(tokens: FountainToken[], scriptName: string): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  doc.setFont('Courier', 'normal')
  doc.setFontSize(FONT_SIZE)

  let y = MARGIN_TOP

  function newPage() {
    doc.addPage()
    y = MARGIN_TOP
  }

  function checkPageBreak(linesNeeded = 1) {
    if (y + linesNeeded * LINE_H > PAGE_H - MARGIN_BOTTOM) {
      newPage()
    }
  }

  function writeLine(text: string, x: number, bold = false) {
    checkPageBreak(1)
    doc.setFont('Courier', bold ? 'bold' : 'normal')
    doc.text(text, x, y)
    y += LINE_H
  }

  function writeWrapped(text: string, x: number, maxChars: number, bold = false) {
    const lines = wrapText(text, maxChars)
    for (const line of lines) {
      writeLine(line, x, bold)
    }
  }

  function writeBlank() {
    y += LINE_H
  }

  for (const token of tokens) {
    switch (token.type) {
      case 'scene_heading':
        writeBlank()
        checkPageBreak(2)
        writeWrapped(token.text.toUpperCase(), X_SCENE, 60, true)
        break

      case 'action':
        if (token.text.trim()) {
          writeBlank()
          writeWrapped(token.text, X_ACTION, 60)
        }
        break

      case 'character':
        writeBlank()
        checkPageBreak(3)
        writeLine(token.text.toUpperCase(), X_CHARACTER)
        break

      case 'dialogue':
        writeWrapped(token.text, X_DIALOGUE, Math.floor(DIALOGUE_MAX_W / 7.2))
        break

      case 'parenthetical':
        writeLine(token.text, X_PAREN)
        break

      case 'transition': {
        writeBlank()
        const transText = token.text.toUpperCase()
        const textW = doc.getTextWidth(transText)
        writeLine(transText, PAGE_W - MARGIN_RIGHT - textW)
        break
      }

      case 'page_break':
        newPage()
        break

      case 'empty':
        // handled implicitly via writeBlank() calls before scene/action/character
        break

      default:
        break
    }
  }

  doc.save(`${scriptName.replace(/[^a-zA-Z0-9-_ ]/g, '')}.pdf`)
}
