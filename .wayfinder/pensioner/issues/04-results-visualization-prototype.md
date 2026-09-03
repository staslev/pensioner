# Prototype: results & verdict visualization

Type: prototype
Status: resolved
Blocked by: 02

## Answer

Direction C validated and now **implemented in the real app** (`src/ui/FundingChart.tsx`, `src/ui/Controls.tsx`, `src/App.tsx`): stacked funding-bars + net-liquid line (monthly flows / total stock, dual axis, hover tooltip), path selector + earliest-retirement auto-follow, sticky chart-left / controls-right dashboard, per-child editor, SWR gauge. All decisions captured below. Build + engine tests green.

<!-- In progress in the shared prototype: two-line split (liquid solid / pension dashed), comma money inputs, and Option 1 for path depiction (user-chosen 2026-08-29): a segmented path selector (קצבה מלאה 67 / קצבה מוקדמת 60 / היוון חלקי 60) that reshapes the two lines — commutation visibly transfers a chunk from the pension line into the liquid line. Pension line is drawn only from age 60 (accessibility), not during accumulation. Slider caps: liquid 30M, expense 50K; savings input is monthly. Retirement funding view built: stacked bars per year (bottom→top: ביטוח לאומי / קצבת פנסיה / משיכה מהתיק, each bar = the flat expense, shortfall = red-hatched gap) + a portfolio-line overlay on a right axis; hover breaks down the year's funding. Presentation rule: **engine steps yearly, but flows are shown monthly** (funding bars/tooltip) to match monthly inputs, while stocks (the portfolio line) stay as totals. Build finding: in an RTL page, SVG `<text text-anchor="start|end">` flips (start=right), so axis value labels render into the plot instead of the margins — force `direction:ltr` on the chart `<svg>` (Hebrew titles use `text-anchor="middle"`, unaffected). Layout (2026-08-30): **two-column dashboard** — sticky chart pane (verdict + chart + path tabs) beside an independently-scrolling controls pane, so config changes give immediate visual feedback without scrolling away from the graph; collapses to sticky-chart-on-top on narrow screens. Awaiting reaction before resolution. -->

## Decisions captured from the prototype (fold into the build)

- **Withdrawal-rate gauge (SWR badge):** beside the monthly-expense input — annual expense ÷ net-liquid portfolio, color-coded **≤3.5% safe / 3.5–5% borderline / ≥5% risky** (per the sub-4% Israeli-FIRE research). Deliberately on the **base** expense and **liquid-only** (excludes pension/BI floors) — a perpetuity gut-check, *not* the full feasibility (which the chart shows).
- **Path auto-follow:** by default select the decumulation path (wait67 / annuitize60 / commute60) that yields the **earliest retirement**; a **checkbox** toggles live auto-follow on any input change; clicking a tab locks a manual choice (auto-follow off).
- **Layout:** two-column dashboard — **sticky chart on the left, scrolling controls on the right** (RTL); collapses to sticky-chart-on-top on narrow screens. Inputs shown by default (no hidden Power drawer). Per-child numbering + total count.
- **Build / RTL notes:** numeric inputs need `direction:ltr` (RTL flips the caret) + comma-thousands with caret-preserving reformat; SVG axis labels need `direction:ltr` (text-anchor flips under RTL); live updates must **decouple input DOM from output render** (preserve focus); use **event delegation** for dynamically-rendered buttons.
- **Not in the prototype (spec-only):** the §9א annuity-tax layer and the nominal-cap erosion (ticket 13) — the stub simplifies pension tax, so those live in the engine spec, not the demo.


## Question

How should the answer be *shown* so it's instantly intuitive to a non-expert yet deep enough for a power user? The headline framings are "earliest age you can retire" and "the Gap" (how much more you need).

Produce **2–3 competing prototype directions** (rough, throwaway, RTL/Hebrew) to react to. Each should decide:

- the **hero verdict** — the single number/statement a non-expert reads first;
- the **hero chart** — the wealth/balance trajectory over time showing the bridge phase, where income floors switch on, and any depletion point;
- how "the Gap" is expressed (lump sum vs implied monthly saving);
- how much Power-tier depth is shown inline vs on demand (breakdown by account, what-if hooks — sensitivity interaction itself stays in the fog for now);
- whether the three decumulation paths (early-annuitize@60 / lump-sum-self-manage / wait-to-67; see ticket 02's scope directive) are **compared side-by-side** or chosen one-per-run — an open design question for these prototypes.

Link the prototypes as assets; the resolution records the chosen direction and why.

## Context

Consult `prototype`. Blocked on ticket 02 (outputs are defined by the engine). Pairs with ticket 03. May surface the **what-if / sensitivity** fog as a follow-on ticket.

**Seeded by ticket 03 (Direction C won):** the hero is a **chart-as-centerpiece** with drag-sliders around it. The enriched chart in [03's prototype](../assets/03-input-shell-prototype.html) is the starting point — it already has labeled axes, a phase-aware hover tooltip, and a "how it's calculated" explainer. This ticket takes that further: the verdict hero design, how "the Gap to retire now" is expressed, account/phase breakdowns, and the optional "retire-by-age-A" what-if explorer. Honor the retire-ASAP model (no target-age input) and the build note to decouple input DOM from output rendering.

**Open design questions surfaced while reviewing C's chart (2026-08-29):**
- **Stock→flow depiction.** At annuitization the pension converts from a balance to an income stream; naively plotting "portfolio balance" cliffs to ~0. Decide what the Y-axis represents across that boundary (capitalize the annuity? spend-down the pot? split assets-stock vs income-flow into two series/bands?). Prototype currently spends the pot down as a smooth proxy.
- **Slider range strategy.** Fixed linear caps (current: liquid 0–6M, expense 5k–40k, save 0–300k) are arbitrary and break for money spanning orders of magnitude. Options: adaptive max (expand as the user nears it), log scale, or slider-for-coarse + number-field-for-exact/out-of-range. Central to the sliders-canvas direction.
- **Number formatting.** Keep it consistent across sliders/verdict/axis (full ₪ on inputs; compact ₪K/₪M only on the axis).
