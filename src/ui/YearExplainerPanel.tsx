import type { ReactNode } from 'react';
import type { YearExplanation, FundingRow, TaxLine } from '../engine/types';
import { fmt, fmtMo } from './format';
import {
  FUNDING_COLOR, FUNDING_LABEL, EXPENSE_LABEL, TAX_COLOR, TAX_NAME, TAX_SOURCE,
  TAX_BASE_LABEL, PHASE_LABEL, PATH_DESC, CAVEAT_TEXT, CAVEAT_CHIP, resolveNote,
  TAX_COLS, GLOSSARY_DEFS,
} from './explainContent';

// The pinned year-explainer panel (ticket 05), rendering the engine's YearExplanation (ticket 02)
// in the validated "band A" layout (ticket 04): two panes (expense | funding net-of-tax) over a
// per-source tax band. Numbers come straight from the engine; only formatting/prose live here.

/** LTR-isolated tabular number, so ₪ figures read correctly inside the RTL panel. */
function Num({ children }: { children: ReactNode }) {
  return <span className="yex-num">{children}</span>;
}

/** The amount column: the annual figure only (the monthly equivalent lives under the label).
 *  `tip` attaches a hover/focus tooltip to the figure (used for the gross→net derivation). */
function Amt({ value, className, tip }: { value: number; className?: string; tip?: string }) {
  return (
    <div className={className ?? 'yex-amt'}>
      {tip ? (
        <span className="yex-amt-tip" tabIndex={0} role="note" aria-label={tip}>
          <Num>{fmt(value)}</Num>
          <span className="yex-tip" role="tooltip">{tip}</span>
        </span>
      ) : (
        <Num>{fmt(value)}</Num>
      )}
    </div>
  );
}

/** The monthly equivalent as its own muted sub-line under a row's label (matches the prototype). */
function Monthly({ value }: { value: number }) {
  return <div className="yex-mo"><Num>{fmtMo(value)}</Num></div>;
}

/** A small circled "i" that reveals a tooltip on mouse hover (and keyboard focus). Pure CSS — the
 *  tooltip lives as a sibling span shown via :hover/:focus-within. Used for both the column-header
 *  explanations and the economic-jargon definitions. */
function InfoTip({ text, label }: { text: string; label?: string }) {
  return (
    <span className="yex-info" tabIndex={0} role="note" aria-label={label ? `${label}: ${text}` : text}>
      <span className="yex-i" aria-hidden="true">i</span>
      <span className="yex-tip" role="tooltip">{text}</span>
    </span>
  );
}

/** A jargon term followed by an info tooltip carrying its plain-language definition. */
function Jargon({ term }: { term: string }) {
  return (
    <>
      {term}
      <InfoTip text={GLOSSARY_DEFS[term]} label={term} />
    </>
  );
}

/** A gross→net one-liner, synthesized in the UI from engine scalars (only where a gross is known). */
function grossNetFormula(gross: number, net: number, taxName: string): string {
  return `ברוטו ${fmt(gross)} − ${taxName} ${fmt(gross - net)} = נטו ${fmt(net)}`;
}

function FundingRowView({ row }: { row: FundingRow }) {
  const note = resolveNote(row.note);
  // A gross is present only where the source is taxed and fully funded expense (uncapped) — show the math.
  const taxName = row.kind === 'pension' ? TAX_NAME.marginal : TAX_NAME.cgt;
  const formula = row.gross !== undefined ? grossNetFormula(row.gross, row.net, taxName) : undefined;
  return (
    <div className="yex-row">
      <div>
        <div className="yex-lab">
          <span className="yex-sw" style={{ background: FUNDING_COLOR[row.kind] }} />
          {resolveNote(row.label) ?? FUNDING_LABEL[row.kind]}
          {row.flag && <span className="yex-flag" title={CAVEAT_TEXT[row.flag]}>{CAVEAT_CHIP[row.flag]}</span>}
        </div>
        <Monthly value={row.net} />
        {note && <div className="yex-note">{note}</div>}
      </div>
      {/* the gross→net derivation lives in a tooltip on the net figure, to save vertical space */}
      <Amt value={row.net} tip={formula} />
    </div>
  );
}

function TaxBand({ ex }: { ex: YearExplanation }) {
  const lines = ex.tax.lines;
  if (lines.length === 0) {
    return (
      <div className="yex-band">
        <h3>מס השנה</h3>
        <p className="yex-mini">אין מס השנה — המימון פטור (קרן השתלמות / ביטוח לאומי) או שאין משיכה חייבת.</p>
      </div>
    );
  }
  const total = ex.tax.total;
  const rateNote = (l: TaxLine) =>
    l.kind === 'cgt' ? '25% על הרווח הריאלי' : 'שיעור אפקטיבי מהברוטו';
  return (
    <div className="yex-band">
      <h3>סך המס השנה — לפי מקור</h3>
      <table className="yex-tbl">
        <thead>
          <tr>
            {TAX_COLS.map((c) => (
              <th key={c.key}>
                {c.label}
                <InfoTip text={c.help} label={c.label} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.kind}>
              <td>
                <span className="yex-sw" style={{ background: TAX_COLOR[l.kind] }} />{TAX_SOURCE[l.kind]}
                <div className="yex-mini"><Jargon term={TAX_NAME[l.kind]} /></div>
              </td>
              <td className="yex-num">{fmt(l.gross)}</td>
              <td className="yex-num">
                {fmt(l.base)}
                <div className="yex-mini">{TAX_BASE_LABEL[l.kind]}</div>
                {l.kind === 'marginal' && l.exempt > 0 && (
                  <div className="yex-mini">− <Jargon term="פטור §9א" /> <Num>{fmt(l.exempt)}</Num></div>
                )}
              </td>
              <td className="yex-num yex-neg">{fmt(l.tax)}</td>
              <td className="yex-num">
                {(l.rate * 100).toFixed(1)}%
                <div className="yex-mini">{rateNote(l)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* attribution split-bar: only the (short) share sits inside each segment so it never clips
          on a narrow slice; the full tax name lives in the legend below (and in each segment's title). */}
      <div className="yex-split">
        {lines.map((l) => {
          const pct = total > 0 ? Math.round((l.tax / total) * 100) : 0;
          return (
            <span
              key={l.kind}
              style={{ flex: l.tax || 0.001, background: TAX_COLOR[l.kind] }}
              title={`${TAX_NAME[l.kind]} ${pct}%`}
            >
              {/* a thin slice can't fit its label without clipping — drop it; the title + legend carry it */}
              {pct >= 8 ? `${pct}%` : ''}
            </span>
          );
        })}
      </div>
      <div className="yex-split-legend">
        {lines.map((l) => (
          <span key={l.kind} className="yex-legend-item">
            <span className="yex-sw" style={{ background: TAX_COLOR[l.kind] }} />{TAX_NAME[l.kind]}
          </span>
        ))}
      </div>
      <div className="yex-total"><span>סך המס השנה</span><span className="yex-num yex-neg">{fmt(total)}</span></div>
    </div>
  );
}

export function YearExplainerPanel({ ex, onClose }: { ex: YearExplanation; onClose?: () => void }) {
  const expenseTotal = ex.expense.total;
  const fundingTotal = ex.funding.total; // net, after tax
  // Gross funding = each source before its tax (untaxed sources have no `gross`, so net == gross).
  const fundingGross = ex.funding.rows.reduce((s, r) => s + (r.gross ?? r.net), 0);
  return (
    <div className="yex">
      <div className="yex-hdr">
        <div>
          <span className="yex-age"><Num>גיל {ex.age}</Num></span>
          <span className="yex-phase">{PHASE_LABEL[ex.phase]}</span>
        </div>
        <span className="yex-path">מסלול משיכת פנסיה: {PATH_DESC[ex.pensionPath]}</span>
        {onClose && <button type="button" className="yex-close" onClick={onClose} aria-label="סגירה">✕</button>}
      </div>

      <div className="yex-body">
        <div className="yex-cols">
          <div className="yex-col">
            <h3>לאן הכסף הולך</h3>
            {ex.expense.rows.map((r) => {
              const note = resolveNote(r.note);
              return (
                <div className="yex-row" key={r.kind}>
                  <div>
                    <div className="yex-lab">{resolveNote(r.label) ?? EXPENSE_LABEL[r.kind]}</div>
                    <Monthly value={r.amount} />
                    {note && <div className="yex-note">{note}</div>}
                  </div>
                  <Amt value={r.amount} />
                </div>
              );
            })}
            <div className="yex-total"><div><span>הוצאה</span><Monthly value={expenseTotal} /></div><Amt value={expenseTotal} /></div>
          </div>

          <div className="yex-col">
            <h3>מהיכן הכסף מגיע (נטו, אחרי מס)</h3>
            {ex.funding.rows.map((r) => <FundingRowView key={r.kind} row={r} />)}
            {ex.shortfall > 0.01 && (
              <div className="yex-row">
                <div className="yex-lab yex-neg">חוסר (התיק לא מספיק)</div>
                <Amt value={ex.shortfall} className="yex-amt yex-neg" />
              </div>
            )}
            <div className="yex-total">
              <div><span>מימון<span className="yex-gross">ברוטו <Num>{fmt(fundingGross)}</Num></span></span><Monthly value={fundingTotal} /></div>
              <Amt value={fundingTotal} />
            </div>
          </div>
        </div>

        <TaxBand ex={ex} />

        {ex.caveats.map((c) => (
          <div className="yex-caveat" key={c}><b>הסתייגות:</b> {CAVEAT_TEXT[c]}</div>
        ))}
      </div>
    </div>
  );
}
