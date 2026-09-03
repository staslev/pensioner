import { useEffect, useRef, type ReactNode } from 'react';
import type { Child } from '../engine/types';

function Info({ hint }: { hint?: string }) {
  return hint ? <span className="hint" data-hint={hint}>ⓘ</span> : null;
}

// Re-format a numeric text input to comma-grouped digits while preserving the caret position.
function reformatMoney(el: HTMLInputElement, onChange: (v: number) => void) {
  const raw = el.value;
  const caret = el.selectionStart ?? raw.length;
  const digitsBefore = (raw.slice(0, caret).match(/\d/g) || []).length;
  const n = parseInt(raw.replace(/\D/g, ''), 10) || 0;
  const f = n.toLocaleString('en-US');
  el.value = f;
  let pos = 0, seen = 0;
  while (pos < f.length && seen < digitsBefore) { if (/\d/.test(f[pos])) seen++; pos++; }
  el.setSelectionRange(pos, pos);
  onChange(n);
}

// Round a value UP to the nearest "nice" number (1/2/2.5/5/10 × power of ten) — used for adaptive slider ceilings.
function niceCeil(v: number): number {
  if (v <= 0) return 0;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / mag;
  const s = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return Math.round(s * mag);
}

// Slider with an editable ₪ readout: the base range covers the common case; typing a value above the
// current max rescales the ceiling (with headroom) so no value is ever unreachable (ticket: slider caps).
export function Slider(props: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format?: (n: number) => string; extra?: ReactNode; hint?: string; wide?: boolean;
}) {
  const { label, value, min, max, step, onChange, extra, hint, wide } = props;
  const ref = useRef<HTMLInputElement>(null);
  // Keep the text field in sync with slider drags / external changes, but never while it's being typed in.
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el) el.value = value.toLocaleString('en-US');
  }, [value]);
  const effMax = value <= max ? max : niceCeil(value * 1.05);
  return (
    <div className={wide ? 'sld wide' : 'sld'}>
      <label className="muted">{label}<Info hint={hint} /></label>
      <div className="vrow">
        <div className="vedit">
          <span className="vunit">₪</span>
          <input ref={ref} className="vinput" type="text" inputMode="numeric" dir="ltr"
            defaultValue={value.toLocaleString('en-US')} onChange={(e) => reformatMoney(e.currentTarget, onChange)} />
        </div>
        {extra}
      </div>
      <input type="range" min={min} max={effMax} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </div>
  );
}

// Comma-formatted, caret-preserving money input. Shares the slider's ₪ readout markup (.vedit) so
// every monetary input in the app looks identical, whether or not it carries a slider.
export function MoneyInput({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el) el.value = value.toLocaleString('en-US');
  }, [value]);
  return (
    <div className="moneyfield">
      <label className="muted">{label}<Info hint={hint} /></label>
      <div className="vedit">
        <span className="vunit">₪</span>
        <input ref={ref} className="vinput" type="text" inputMode="numeric" dir="ltr"
          defaultValue={value.toLocaleString('en-US')} onChange={(e) => reformatMoney(e.currentTarget, onChange)} />
      </div>
    </div>
  );
}

export function NumberField(props: { label: string; value: number; step?: number; width?: number; max?: number; onChange: (v: number) => void; hint?: string }) {
  const { label, value, step = 1, width, max, onChange, hint } = props;
  return (
    <div className="field" style={width ? { maxWidth: width } : undefined}>
      <label>{label}<Info hint={hint} /></label>
      <input type="number" value={value} step={step} max={max}
        onChange={(e) => onChange(max != null ? Math.min(max, +e.target.value) : +e.target.value)} />
    </div>
  );
}

export function PctField({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  // Percentages are at most 3 digits (0–100%): clamp the value and size the box to fit, not the label.
  return (
    <div className="field">
      <label>{label}<Info hint={hint} /></label>
      <input type="number" step={0.1} max={100} value={+(value * 100).toFixed(1)} style={{ maxWidth: 92 }}
        onChange={(e) => onChange(Math.min(100, +e.target.value) / 100)} />
    </div>
  );
}

export function SwrBadge({ monthlyExpense, liquidPortfolio, horizon }: { monthlyExpense: number; liquidPortfolio: number; horizon: number }) {
  const r = liquidPortfolio > 0 ? (monthlyExpense * 12) / liquidPortfolio : 0;
  // Safe rate scales with the retirement horizon: ~4% @30y → ~3.25% @55y+ (Bengen/Trinity vs ERN).
  const safe = Math.max(0.0325, Math.min(0.04, 0.04 - (Math.max(0, horizon - 30) / 25) * 0.0075));
  const risky = safe + 0.015;
  const cls = r <= safe ? 'ok' : r < risky ? 'warn' : 'bad';
  const word = r <= safe ? 'בטוח' : r < risky ? 'גבולי' : 'מסוכן';
  return (
    <div className={'swrBadge ' + cls} title={`שיעור המשיכה השנתי מהתיק הנזיל. לאופק של ~${horizon} שנים, עד ${(safe * 100).toFixed(2)}% נחשב בטוח; מעל כך הסיכון עולה.`}>
      משיכה שנתית {(r * 100).toFixed(1)}% · {word}
    </div>
  );
}

export function ChildrenEditor(props: {
  kids: Child[]; childTotal: number;
  onKidsChange: (k: Child[]) => void; onTotalChange: (t: number) => void;
}) {
  const { kids, childTotal, onKidsChange, onTotalChange } = props;
  const add = () => onKidsChange([...kids, { currentAge: 0 }]);
  const remove = (i: number) => onKidsChange(kids.filter((_, j) => j !== i));
  const setAge = (i: number, age: number) => onKidsChange(kids.map((c, j) => (j === i ? { currentAge: age } : c)));
  return (
    <div className="advsec">
      <div className="advtitle">ילדים (הוצאה זמנית){kids.length ? ` · ${kids.length} סה"כ` : ''}</div>
      <div className="segcap muted">עלות כוללת אחת לכל ילד/ה עד גיל 18, נפרסת לפי עקומת גיל.</div>
      <div className="row">
        <MoneyInput label="עלות לילד/ה עד 18" value={childTotal} onChange={onTotalChange}
          hint="סך העלות הכוללת לגידול ילד/ה מלידה עד גיל 18. המודל פורס אותה אוטומטית לפי גיל (יקר יותר בגיל הרך ובגיל ההתבגרות)." />
      </div>
      {kids.map((c, i) => (
        <div className="childrow" key={i}>
          <span className="childnum">{i + 1}.</span>
          <div className="field" style={{ maxWidth: 130, margin: 0 }}>
            <label>גיל<Info hint="הגיל הנוכחי של הילד/ה. ההוצאה נמשכת עד גיל 18." /></label>
            <input type="number" value={c.currentAge} onChange={(e) => setAge(i, +e.target.value)} />
          </div>
          <button type="button" className="btn ghost" onClick={() => remove(i)}>הסר</button>
          {i === kids.length - 1 && <button type="button" className="btn ghost" onClick={add}>+ הוסף</button>}
        </div>
      ))}
      {kids.length === 0 && <button type="button" className="btn ghost" onClick={add}>+ הוסף ילד/ה</button>}
    </div>
  );
}
