// Hebrew content registry for the year-explainer panel (ticket 05). The engine emits keyed content
// and closed-enum `kind`s (never prose, per the ticket 01 contract); this is where keys/kinds resolve
// to Hebrew label + color. Keeping it here keeps the engine pure and i18n-agnostic.

import type {
  ExpenseKind, FundingKind, TaxKind, PhaseKind, Simplification, Note, PensionPath,
} from '../engine/types';

// Funding-row colors mirror the chart's stacked-bar swatches so the panel reads as the same picture.
export const FUNDING_COLOR: Record<FundingKind, string> = {
  bituachLeumi: '#6f9bd8', // sBI
  pension: '#c79a3e', // sPen
  liquid: 'var(--accent)', // sPort (portfolio)
  keren: 'var(--accent)', // portfolio, tax-free slice
};

export const FUNDING_LABEL: Record<FundingKind, string> = {
  bituachLeumi: 'קצבת זקנה (ביטוח לאומי)',
  pension: 'קצבת פנסיה (נטו)',
  liquid: 'משיכה מהתיק',
  keren: 'משיכה מקרן השתלמות',
};

export const EXPENSE_LABEL: Record<ExpenseKind, string> = {
  base: 'הוצאה בסיסית (ללא שכ״ד)',
  rent: 'שכר דירה',
  children: 'ילדים',
};

// Tax colors kept distinct from the main funding chart's palette (teal --accent, gold #c79a3e,
// blue #6f9bd8, clay #c76a4e shortfall): מס שולי = purple, מס רווח הון = magenta-rose.
// (cgt was clay #c07f4f — retinted to avoid clashing with the chart's clay shortfall segment.)
export const TAX_COLOR: Record<TaxKind, string> = {
  marginal: '#7d5ba6', // מס שולי — purple (unused elsewhere)
  cgt: '#b5568f', // מס רווח הון — magenta-rose (was clay, which collided with the shortfall segment)
};

export const TAX_NAME: Record<TaxKind, string> = {
  marginal: 'מס שולי',
  cgt: 'מס רווח הון',
};

/** The taxed *source* (the "מקור" column), distinct from the tax's name. */
export const TAX_SOURCE: Record<TaxKind, string> = {
  marginal: 'קצבת פנסיה',
  cgt: 'משיכה מהתיק',
};

/** Label for the taxable-base column value. */
export const TAX_BASE_LABEL: Record<TaxKind, string> = {
  marginal: 'פלח חייב',
  cgt: 'פלח רווח',
};

export const PHASE_LABEL: Record<PhaseKind, string> = {
  bridge: 'גשר — מימון מהחיסכון',
  earlyAnnuity: 'קצבה מוקדמת (60+) — לפני גיל הזכאות',
  fullAnnuity: 'קצבה מלאה — הפטור פעיל',
};

export const PATH_DESC: Record<PensionPath, string> = {
  wait67: 'קצבה מלאה מגיל הזכאות',
  annuitize60: 'קצבה מופחתת מגיל 60',
  commute60: 'היוון חלקי בגיל 60 + קצבה מהיתרה',
};

// Caveat text keyed by the Simplification enum itself (per ticket 01). These are the honest
// "what the engine simplifies" notes from the tax-content research (asset 03).
export const CAVEAT_TEXT: Record<Simplification, string> = {
  COMMUTE60_PROXY:
    'המנוע מדמה את ההיוון בגיל 60 כפרוקסי גס (~30% מהצבירה כמזומן) — לא ארבעת מסלולי ההיוון האמיתיים, ' +
    'וללא רצפת קצבה מזערית, מנגנון הסל או קיזוז פיצויים. המספרים כאן מקורבים.',
  NO_RECOGNIZED_PENSION_SLICE:
    'המנוע אינו עוקב אחר פלח קצבה מוכרת (פטור כבר מגיל 60). אם יש לך פלח כזה — המס בפועל כאן נמוך יותר.',
};

/** Short chip label for a flag, shown inline on the affected row. */
export const CAVEAT_CHIP: Record<Simplification, string> = {
  COMMUTE60_PROXY: 'היוון מקורב',
  NO_RECOGNIZED_PENSION_SLICE: 'ללא קצבה מוכרת',
};

// Content-registry entries for the note keys the engine emits (ticket 02).
const NOTE_TEXT: Record<string, string> = {
  'note.exemptGateEarly':
    'בגיל זה אין עדיין פטור §9א (חל רק מגיל הזכאות) — הקצבה חייבת במלואה במס שולי.',
  'note.annuityOverfunds':
    'הקצבה מכסה את ההוצאה במלואה; העודף מושקע חזרה בתיק.',
};

// Column headers for the per-source tax table, each with a one-line plain-language explanation
// (shown as a muted sub-line under the header, so the columns are self-explaining).
export const TAX_COLS: { key: string; label: string; help: string }[] = [
  { key: 'source', label: 'מקור', help: 'מהיכן מגיע הכסף שעליו חל המס' },
  { key: 'gross', label: 'ברוטו', help: 'הסכום לפני ניכוי מס' },
  { key: 'base', label: 'בסיס חייב', help: 'החלק מהברוטו שעליו מחושב המס בפועל' },
  { key: 'tax', label: 'מס', help: 'סכום המס שנוכה השנה' },
  { key: 'rate', label: 'שיעור', help: 'המס כאחוז מהברוטו' },
];

// Plain-language definitions of the economic jargon used across the panel, keyed by the term itself.
// Feeds the inline info-icon tooltips (`Jargon` / `InfoTip`) shown on hover.
export const GLOSSARY_DEFS: Record<string, string> = {
  'ברוטו': 'הסכום לפני ניכוי מס.',
  'נטו': 'הסכום שנשאר ביד אחרי ניכוי מס.',
  'מס שולי': 'מס הכנסה לפי מדרגות המס; חל על קצבת פנסיה חייבת.',
  'מס רווח הון': 'מס של 25% על הרווח הריאלי במשיכה מהתיק המשקיע — לא על הקרן שהופקדה.',
  'פטור §9א': 'פטור ממס על חלק מקצבת הפנסיה, פעיל מגיל הזכאות (סעיף 9א לפקודת מס הכנסה).',
  'בסיס חייב': 'החלק מהברוטו שעליו מחושב המס בפועל, לאחר קיזוז פטורים.',
  'שיעור אפקטיבי': 'המס בפועל כאחוז מכלל הברוטו (בשונה משיעור מדרגת המס העליונה).',
  'היוון': 'משיכת חלק מצבירת הפנסיה כסכום חד-פעמי במקום כקצבה חודשית.',
  'קרן השתלמות': 'אפיק חיסכון שהמשיכה ממנו פטורה ממס לאחר תקופת הוותק.',
  'קצבת זקנה': 'קצבה חודשית מהביטוח הלאומי החל מגיל הפרישה.',
};

/** Resolve a Note to Hebrew: a `{key}` looks up the registry (falling back to the raw key so a
 *  missing entry is visible, not silent); a `{text}` is a one-off inline string, returned as-is. */
export function resolveNote(note: Note | undefined): string | undefined {
  if (!note) return undefined;
  if ('key' in note) return NOTE_TEXT[note.key] ?? note.key;
  return note.text;
}
