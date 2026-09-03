// Per-tab persistence of the user's scenario, backed by sessionStorage: inputs survive a reload but
// are cleared when the tab/browser closes (chosen over localStorage so sensitive financial figures
// don't linger in a shared browser profile). Every access is wrapped so private-mode / disabled
// storage degrades to plain in-memory state instead of throwing.
import type { Scenario } from './engine/types';

const KEY = 'pensioner:state';
const VERSION = 1;

export interface PersistedState {
  scenario: Scenario;
  autoPath: boolean;
}

// Read the saved state, deep-merged onto `fallback` so that a field added to Scenario/Assumptions
// after this blob was written falls back to its default instead of arriving as `undefined` (which
// would feed NaN into the engine). Returns `fallback` untouched if nothing is stored, the JSON is
// unreadable, or the schema version has moved on.
export function loadState(fallback: PersistedState): PersistedState {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as { version?: number } & Partial<PersistedState>;
    if (parsed.version !== VERSION || !parsed.scenario) return fallback;
    const fb = fallback.scenario;
    const ps = parsed.scenario;
    return {
      autoPath: typeof parsed.autoPath === 'boolean' ? parsed.autoPath : fallback.autoPath,
      scenario: {
        ...fb,
        ...ps,
        person: { ...fb.person, ...ps.person },
        buckets: { ...fb.buckets, ...ps.buckets },
        assumptions: { ...fb.assumptions, ...ps.assumptions },
        children: Array.isArray(ps.children) ? ps.children : fb.children,
      },
    };
  } catch {
    return fallback;
  }
}

export function saveState(state: PersistedState): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ version: VERSION, ...state }));
  } catch {
    // storage unavailable (private mode / quota) — persistence is best-effort, so ignore.
  }
}

export function clearState(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // nothing to do if storage is unavailable.
  }
}
