# Wire bar-click → pinned explainer panel into the app

Type: task
Status: resolved
Assignee: staslev
Blocked by: 02 (resolved), 04 (resolved)

## Answer

**Built and validated live in the running app.** Clicking a funding bar pins that retirement year; the explainer panel renders below the chart in the validated band-A layout. Typecheck clean, 22 engine tests green, production build green, and a headless-Chrome click-through confirmed the panel renders from live engine data (pinned age 82, full-annuity phase: two-source tax table, split-bar מס שולי 83% / מס רווח הון 17%, §9א exempt slice shown, recognized-pension caveat).

**What shipped:**
- **`src/ui/explainContent.ts`** (new) — the Hebrew content registry ticket 01/02 deferred here. Resolves the engine's closed-enum `kind`s and note/caveat **keys** → Hebrew label + color: `FUNDING_LABEL/COLOR`, `EXPENSE_LABEL`, `TAX_NAME/SOURCE/BASE_LABEL/COLOR` (מס שולי = purple `#7d5ba6`, מס רווח הון = clay `#c07f4f`), `PHASE_LABEL`, `PATH_DESC`, `CAVEAT_TEXT`/`CAVEAT_CHIP` (keyed by the `Simplification` enum), and `resolveNote()` for `note.exemptGateEarly` / `note.annuityOverfunds` (falls back to the raw key so a missing entry is visible, not silent). Funding colors mirror the chart swatches so the panel reads as the same picture.
- **`src/ui/YearExplainerPanel.tsx`** (new) — renders a `YearExplanation`: header (age · phase · path + close), two panes (expense | funding net-of-tax with a UI-synthesized `ברוטו − מס = נטו` line wherever the engine supplied a `gross`), the per-source tax band (table + attribution split-bar + total), the §9א exempt slice as a sub-note on the marginal row, flag chips inline, and each fired caveat as a box. Numbers come straight from the engine; only prose/formatting live here.
- **`src/ui/FundingChart.tsx`** — added `pinnedAge`/`onPin`; **click** a bar pins the nearest retirement year (accumulation clicks ignored), **hover stays** the transient quick-peek. **Keyboard-selectable**: `role="slider"`, `tabIndex=0`, ←/→ step the pinned year across bars, focus-visible ring. The pinned bar's stack is outlined (`.segPin`).
- **`src/App.tsx`** — `pinnedAge` state, panel rendered in the (independently-scrolling) chart column below the chart, a discovery hint when nothing is pinned, and an effect that drops a stale pin when the scenario moves that age out of retirement.
- **`src/index.css`** — light-theme panel styles (`.yex-*`), the `.segPin` highlight, focus ring, and a mobile override: the chart column is no longer `position: sticky` so the panel **stacks under the chart** instead of being trapped in a tall sticky region.

**Design calls made:** liquid + keren rendered as **separate** funding rows (not merged) — the tax-free keren row visibly explains why only part of a portfolio draw is taxed; the gross→net formula is synthesized in the UI from engine scalars only where a `gross` is present (so it never appears on capped/over-funded pension rows, which instead show `note.annuityOverfunds`). Not yet committed.

## Question

Build the validated explainer into `src/`: click a funding bar → **pin** that year (hover stays transient), render the structured `explainYear` data (02) as the panel below the chart per the validated prototype (04). RTL-correct, mobile stacks under the chart, keyboard-selectable. Show the plain-language notes + simplification caveats. Build + engine tests green.

## Context

Blocked by 02 (engine data) and 04 (validated design). Execution ticket. Chart/UI: `../../../src/ui/FundingChart.tsx`, `../../../src/App.tsx`. Honor the RTL build notes from the parent map (SVG `direction:ltr`, decouple input DOM from output render, event delegation).
