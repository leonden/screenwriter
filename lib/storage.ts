const STORAGE_KEY = 'screenwriter_v1'

export interface StoredScript {
  id: string
  name: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface ScriptsStore {
  scripts: StoredScript[]
  activeScriptId: string | null
}

const SAMPLE_SCRIPT = `FADE IN:

INT. COFFEE SHOP - DAY

A quiet corner table. Morning light streams through fogged windows.

SARAH (30s, sharp eyes, tired smile) stares at her phone. A notification blinks: "REJECTED."

She sets the phone face-down. Takes a long sip of coffee.

WAITER
Can I get you anything else?

SARAH
(quietly)
No. I think I have everything I need.

She stands, leaves exact change, and walks out into the city.

EXT. CITY STREET - CONTINUOUS

Sarah steps into the crowd. For a moment she disappears — then reappears, walking faster, with purpose.

CUT TO:

INT. ELEVATOR - DAY

Sarah presses the button for the top floor.

FADE OUT.`

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function defaultStore(): ScriptsStore {
  const id = generateId()
  const now = new Date().toISOString()
  return {
    scripts: [
      {
        id,
        name: 'Untitled Script',
        content: SAMPLE_SCRIPT,
        createdAt: now,
        updatedAt: now,
      },
    ],
    activeScriptId: id,
  }
}

export function loadStore(): ScriptsStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStore()
    const parsed = JSON.parse(raw) as ScriptsStore
    if (!parsed.scripts || !Array.isArray(parsed.scripts)) return defaultStore()
    return parsed
  } catch {
    return defaultStore()
  }
}

export function saveStore(store: ScriptsStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // localStorage quota exceeded or unavailable
  }
}

export function createScript(store: ScriptsStore, name: string): ScriptsStore {
  const id = generateId()
  const now = new Date().toISOString()
  const newScript: StoredScript = { id, name, content: '', createdAt: now, updatedAt: now }
  return {
    scripts: [...store.scripts, newScript],
    activeScriptId: id,
  }
}

export function updateScript(
  store: ScriptsStore,
  id: string,
  patch: Partial<Pick<StoredScript, 'name' | 'content'>>
): ScriptsStore {
  return {
    ...store,
    scripts: store.scripts.map((s) =>
      s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s
    ),
  }
}

export function deleteScript(store: ScriptsStore, id: string): ScriptsStore {
  const remaining = store.scripts.filter((s) => s.id !== id)
  const activeScriptId =
    store.activeScriptId === id
      ? (remaining[remaining.length - 1]?.id ?? null)
      : store.activeScriptId
  return { scripts: remaining, activeScriptId }
}

export function getActiveScript(store: ScriptsStore): StoredScript | undefined {
  return store.scripts.find((s) => s.id === store.activeScriptId)
}
