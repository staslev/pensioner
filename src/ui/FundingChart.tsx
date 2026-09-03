import { useState, type ReactNode } from 'react';
import type { Projection, Age, FundingBar } from '../engine/types';
import { fmt, fmtK } from './format';

// nearest "nice" round step (1 / 2 / 2.5 / 5 × 10ⁿ) that splits `range` into ~`target` intervals.
function niceStep(range: number, target: number): number {
  const raw = range / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return m * mag;
}

// Round-numbered axis ticks: pick a nice step, round the axis top up to a multiple of it (so the
// top tick is a clean labeled value, at the cost of re-scaling the axis's data slightly to fit).
function axisTicks(max: number): { ticks: number[]; axisMax: number } {
  const step = niceStep(max, 5);
  const axisMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= axisMax + 1e-6; v += step) ticks.push(v);
  return { ticks, axisMax };
}

// The monthly funding sources shown in the hover tooltip (portfolio / pension / BI, ₪/month),
// dropping any zero-valued source so only the active ones appear.
function monthlyRows(hb: FundingBar) {
  return [
    { cls: 'sPort', label: 'מהתיק', mo: hb.fromPortfolio / 12 },
    { cls: 'sPen', label: 'קצבה', mo: hb.fromPension / 12 },
    { cls: 'sBI', label: 'ביטוח לאומי', mo: hb.fromBI / 12 },
  ].filter((r) => r.mo > 0);
}

interface Props {
  proj: Projection;
  fireAge: Age;
  statAge: Age;
  annuitizeAge: Age;
  pinnedAge?: number | null; // clicking a bar pins a year → the explainer panel below (ticket 05)
  onPin?: (age: number) => void;
}

// Stacked funding-bars (flows, shown monthly) + net-liquid portfolio line (stock) on a right axis.
// Ported from the validated Direction-C prototype. SVG forced to LTR so axis labels sit correctly under RTL.
export function FundingChart({ proj, fireAge, statAge, annuitizeAge, pinnedAge, onPin }: Props) {
  const [hoverAge, setHoverAge] = useState<number | null>(null);

  const W = 780, H = 300, padL = 62, padR = 70, padT = 36, padB = 40;
  const { path, bars, peakAnnualExpense: peak } = proj;
  const ages = path.map((p) => p.age);
  const minA = Math.min(...ages), maxA = Math.max(...ages);
  const maxLine = Math.max(1, ...path.map((p) => p.netLiquid));

  // Round-numbered ticks for both Y axes. `axisMax` is the value at the top of each axis (rounded up
  // to a nice number, which re-scales that axis's data to fit). The left axis is in the monthly domain.
  const { ticks: rightTicks, axisMax } = axisTicks(maxLine);
  const peakMo = peak / 12;
  const { ticks: leftTicksMo, axisMax: leftMaxMo } = axisTicks(peakMo);

  const inner = W - padL - padR;
  const barW = Math.max(2, (inner / Math.max(1, maxA - minA)) * 0.7);
  const half = barW / 2;
  const X = (a: number) => padL + half + ((a - minA) / Math.max(1, maxA - minA)) * (inner - 2 * half);
  const Yb = (v: number) => H - padB - (v / (leftMaxMo * 12)) * (H - padT - padB); // annual funding (labels ÷12 → monthly)
  const Yl = (v: number) => H - padB - (v / axisMax) * (H - padT - padB); // net-liquid (right axis, total)

  const barRects: ReactNode[] = [];
  for (const b of bars) {
    const x = X(b.age) - half;
    let base = 0;
    // Spotlight: when a year is pinned, every other bar fades back so the selection stands out.
    const dim = pinnedAge != null && b.age !== pinnedAge ? ' segDim' : '';
    const seg = (val: number, cls: string, k: string) => {
      if (val <= 0) return;
      const y = Yb(base + val), h = Yb(base) - Yb(base + val);
      barRects.push(<rect key={`${b.age}-${k}`} className={cls + dim} x={x} y={y} width={barW} height={Math.max(0, h)} />);
      base += val;
    };
    seg(b.fromBI, 'segBI', 'bi');
    seg(b.fromPension, 'segPen', 'pen');
    seg(b.fromPortfolio, 'segPort', 'port');
    if (b.shortfall > 0.01) {
      const y = Yb(b.expense), h = Yb(base) - Yb(b.expense);
      barRects.push(<rect key={`${b.age}-sf`} className={'segShort' + dim} x={x} y={y} width={barW} height={Math.max(0, h)} />);
    }
  }

  // Selection overlay for the pinned bar: a soft accent band + ink ring on the live column
  // (the other bars are dimmed above), plus an age-label pill below the baseline.
  const pinnedBar = pinnedAge != null ? bars.find((b) => b.age === pinnedAge) : undefined;
  const selBehind: ReactNode[] = [];
  const selFront: ReactNode[] = [];
  if (pinnedBar) {
    const x = X(pinnedBar.age) - half;
    const top = Yb(pinnedBar.expense);
    const baseline = H - padB;
    const cx = X(pinnedBar.age);
    selBehind.push(
      <rect key="pin-band" fill="var(--accent)" opacity={0.1} x={x - 5} y={padT} width={barW + 10} height={baseline - padT} rx={4} />,
    );
    const pillW = 42, pillH = 18;
    // Place the age label BELOW the baseline: the top of the chart is crowded with marker labels
    // (פרישה / קצבת פנסיה / ביטוח לאומי), and a tall pinned bar's top would collide with them. The area
    // under the axis only holds x-ticks (~108px apart), so the pill can't hit its neighbours.
    const pillY = baseline + 5;
    selFront.push(
      <rect key="pin-ring" fill="none" stroke="var(--ink)" strokeWidth={1.5} rx={3} x={x - 2} y={top - 2} width={barW + 4} height={baseline - top + 2} />,
      <path key="pin-ptr" fill="var(--ink)" d={`M ${cx - 5} ${pillY + 1} L ${cx + 5} ${pillY + 1} L ${cx} ${pillY - 5} Z`} />,
      <rect key="pin-pill" fill="var(--ink)" x={cx - pillW / 2} y={pillY} width={pillW} height={pillH} rx={9} />,
      <text key="pin-txt" x={cx} y={pillY + 13} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>גיל {pinnedBar.age}</text>,
    );
  }

  const linePts = path.map((p) => `${X(p.age).toFixed(1)},${Yl(p.netLiquid).toFixed(1)}`).join(' ');
  const step = Math.max(1, Math.round((maxA - minA) / 6));
  const xTicks: number[] = [];
  for (let a = minA; a <= maxA; a += step) xTicks.push(a);

  // Event markers (retirement / pension-annuity / Bituach Leumi). Labels that land too close
  // horizontally are staggered onto a second (higher) row so they never overlap at edge cases.
  const MIN_GAP = 72;
  let prevX = -Infinity, prevRow = 1;
  const markerEls = [
    { a: fireAge, label: 'פרישה' },
    ...(annuitizeAge < statAge ? [{ a: annuitizeAge, label: 'קצבת פנסיה' }] : []),
    { a: statAge, label: 'ביטוח לאומי' },
  ]
    .filter((m) => m.a >= minA && m.a <= maxA)
    .map((m) => ({ ...m, x: X(m.a) }))
    .sort((p, q) => p.x - q.x)
    .map((m) => {
      const row = m.x - prevX < MIN_GAP ? (prevRow === 0 ? 1 : 0) : 0;
      prevX = m.x; prevRow = row;
      return (
        <g key={m.label}>
          <line className="mark" x1={m.x} y1={padT} x2={m.x} y2={H - padB} />
          <text className="lab" x={m.x} y={row === 0 ? padT - 6 : padT - 22} textAnchor="middle">{m.label}</text>
        </g>
      );
    });

  const ageAtClientX = (clientX: number, r: DOMRect) => {
    const vbx = ((clientX - r.left) / r.width) * W;
    const a = Math.round(minA + ((vbx - padL - half) / Math.max(1, inner - 2 * half)) * (maxA - minA));
    return Math.max(minA, Math.min(maxA, a));
  };
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    setHoverAge(ageAtClientX(e.clientX, e.currentTarget.getBoundingClientRect()));
  };
  // Click a bar → pin that retirement year (only ages that have a bar; clicks in the accumulation
  // region are ignored). Hover remains the transient quick-peek.
  const barAges = bars.map((b) => b.age);
  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const a = ageAtClientX(e.clientX, e.currentTarget.getBoundingClientRect());
    const nearest = barAges.reduce<number | null>((best, ba) =>
      best == null || Math.abs(ba - a) < Math.abs(best - a) ? ba : best, null);
    if (nearest != null) onPin?.(nearest);
  };
  // Keyboard-selectable: when the chart is focused, ←/→ step the pinned year across retirement bars.
  const onKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (!barAges.length || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    e.preventDefault();
    const i = pinnedAge == null ? -1 : barAges.indexOf(pinnedAge);
    const dir = e.key === 'ArrowRight' ? 1 : -1; // SVG is LTR → right = older
    const next = i < 0 ? 0 : Math.max(0, Math.min(barAges.length - 1, i + dir));
    onPin?.(barAges[next]);
  };

  const hp = hoverAge != null ? path.find((p) => p.age === hoverAge) : undefined;
  const hb = hoverAge != null ? bars.find((b) => b.age === hoverAge) : undefined;
  const rows = hb ? monthlyRows(hb) : [];
  const shortfallMo = hb && hb.shortfall > 0.01 ? hb.shortfall / 12 : 0;

  // Anchor the tooltip so it never overflows (and gets clipped by the pane): centered normally,
  // but flipped to sit left of the point near the right edge and right of it near the left edge.
  const hoverFrac = hoverAge == null ? 0.5 : X(hoverAge) / W;
  const tipTx = hoverFrac > 0.75 ? '-100%' : hoverFrac < 0.25 ? '0%' : '-50%';

  return (
    <div>
      <div className="legend">
        <span className="sw sPort" />משיכה מהתיק&nbsp;&nbsp;
        <span className="sw sPen" />קצבת פנסיה&nbsp;&nbsp;
        <span className="sw sBI" />ביטוח לאומי&nbsp;&nbsp;
        <span className="sw sLine" />תיק נזיל
      </div>
      <div className="chartWrap">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="fundingSvg"
          role="slider"
          tabIndex={0}
          aria-label="מימון לפי גיל — לחצו או השתמשו בחצים כדי לנעוץ שנה"
          aria-valuenow={pinnedAge ?? undefined}
          onMouseMove={onMove}
          onMouseLeave={() => setHoverAge(null)}
          onClick={onClick}
          onKeyDown={onKeyDown}
        >
          <line className="grid" x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} />
          {selBehind}
          {barRects}
          {selFront}
          {/* net-liquid portfolio trajectory — a dark ink line reads over the coloured bars without a casing */}
          <polyline className="lineNet" points={linePts} />
          {markerEls}
          {/* left (monthly funding) Y-axis ticks — labels in monthly ₪ with short marks */}
          {leftTicksMo.map((mo) => (
            <g key={`yl${mo}`}>
              <line className="tick" x1={padL - 5} x2={padL} y1={Yb(mo * 12)} y2={Yb(mo * 12)} />
              <text className="lab" x={padL - 9} y={Yb(mo * 12) + 3} textAnchor="end">{fmtK(mo)}</text>
            </g>
          ))}
          {/* right (net-liquid) Y-axis ticks — total ₪ with short marks */}
          {rightTicks.map((v) => (
            <g key={`yr${v}`}>
              <line className="tick" x1={W - padR} x2={W - padR + 5} y1={Yl(v)} y2={Yl(v)} />
              <text className="labR" x={W - padR + 9} y={Yl(v) + 3} textAnchor="start">{fmtK(v)}</text>
            </g>
          ))}
          {xTicks
            // The pinned age's pill sits under the baseline and replaces this tick label. Drop not
            // just the tick at the pinned age but any tick whose label would fall under the pill's
            // footprint (half the pill width + margin), so a bar pinned next to a tick doesn't collide.
            .filter((a) => pinnedAge == null || Math.abs(X(a) - X(pinnedAge)) > 28)
            .map((a) => (
              <text key={`x${a}`} className="lab" x={X(a)} y={H - padB + 15} textAnchor="middle">{a}</text>
            ))}
          <text className="axtitle" transform={`translate(14,${padT + (H - padT - padB) / 2}) rotate(-90)`} textAnchor="middle">מימון חודשי (₪)</text>
          <text className="axtitleR" transform={`translate(${W - 12},${padT + (H - padT - padB) / 2}) rotate(-90)`} textAnchor="middle">תיק נזיל (₪)</text>
          <text className="axtitle" x={padL + (W - padL - padR) / 2} y={H - 4} textAnchor="middle">גיל</text>
          {hoverAge != null && (
            <line className="cur" x1={X(hoverAge)} x2={X(hoverAge)} y1={padT} y2={H - padB} />
          )}
        </svg>
        {hoverAge != null && hp && (
          <div
            className="tip tipGrid"
            style={{ left: `${(X(hoverAge) / W) * 100}%`, top: `${(Yl(hp.netLiquid) / H) * 100}%`, transform: `translate(${tipTx}, -135%)` }}
          >
            <span className="tipHead">גיל {hoverAge}</span>
            <div className="tipNet"><span><span className="sw sLine" />תיק נזיל</span><b>{fmt(hp.netLiquid)}</b></div>
            {hb && (
              <div className="tipRows">
                {rows.map((r) => (
                  <span key={r.cls} style={{ display: 'contents' }}>
                    <span className="k"><span className={`sw ${r.cls}`} />{r.label}</span>
                    <span className="v">{fmt(r.mo)}</span>
                  </span>
                ))}
                {shortfallMo > 0 && (
                  <>
                    <span className="k" style={{ color: '#f2b8a8' }}>חוסר</span>
                    <span className="v" style={{ color: '#f2b8a8' }}>{fmt(shortfallMo)}</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
