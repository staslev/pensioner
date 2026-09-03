<!-- wayfinder:map -->
# Year Explainer — per-year expense & funding breakdown (with 60+ tax clarity)

## Destination

A **built, validated** "year explainer" in the FIRE app: clicking a funding bar pins a clear, plain-Hebrew breakdown of that retirement year's **expenses** and **funding by bucket**, with real per-year **math surfaced from the engine** — and, from age 60+, an explanation of the **annuity-tax mechanics** (מס שולי / קצבה מזכה / קצבה מוכרת) and how each withdrawal path is taxed. Faithful to the *current* model (option b: surface intermediates, honestly flag simplifications). Deepening the engine to the full four היוון paths is downstream fog, not a gate. Built in place in `src/`, validated via a prototype first.

## Notes

**Parent effort:** child of the [Pensioner Retirement Simulator map](../map.md); inherits its glossary (`../../CONTEXT.md`), engine (`../../../src/`), and out-of-scope rulings (no Monte Carlo, no persistence, Hebrew-only v1, real-terms only).

**Mode:** execution override (inherited) — this map **builds**, it doesn't just spec. Tickets may implement.

**Skills every session should consult:** `grilling` + `domain-modeling` for decisions; `prototype` for the panel; `research` for tax content.

**Standing preferences (settled while charting, 2026-08-31):**
- Interaction: click a bar → **pins** a breakdown panel **below the chart**; hover stays the transient quick-peek. Mobile: stacks under the chart.
- Explanation is a **structured model** — the engine emits ordered line-items `{label, amount, formula?, note?}` (expense / funding / tax sub-groups); UI renders uniformly with short plain-language notes. Math and prose never drift.
- Accuracy = **option (b)**: surface what the engine already computes; where the model simplifies (esp. commute60's 30% proxy, no real קצבה מוכרת slice), **say so in the panel** rather than fake precision.
- Coverage: **every retirement year**; funding + CGT + expense decomposition always shown; tax-path detail expands at 60+.
- Prototype validates on **two pinned example years**: a bridge year (portfolio + CGT, no annuity) and a 60+ annuity year (full tax stack).

## Decisions so far

<!-- one line per closed ticket: gist + link -->

> **Destination reached (2026-09-01).** All tickets closed; the frontier is empty. The click-to-pin year explainer is built in `src/` and validated live. Everything under *Not yet specified* is optional follow-on toward a fuller version, not a gate — a future `/wayfinder` charting pass can graduate it.

- [Wire bar-click → pinned explainer panel into the app](issues/05-wire-explainer-into-app.md) — **built + validated live.** New `src/ui/explainContent.ts` (the Hebrew registry — resolves engine `kind`s + note/caveat keys → label/color; מס שולי purple, מס רווח הון clay) and `YearExplainerPanel.tsx` (band-A: two panes + per-source tax band with split-bar, §9א exempt slice, flag chips, caveat boxes). `FundingChart` gained click-to-pin + ←/→ keyboard selection + pinned-bar outline; hover stays transient. `App` pins state, renders the panel below the chart, drops stale pins. Mobile: chart column de-stickied so the panel stacks. Headless-Chrome click-through confirmed a full-annuity year renders correctly. **Calls:** liquid/keren shown as separate funding rows; gross→net formula synthesized in UI only where the engine supplied a `gross`.
- [Synthesize the 60+ annuity-tax explanation content](issues/03-tax-explanation-content.md) — panel-ready content ([asset](assets/03-tax-explanation-content.md)) for מס שולי / קצבה מזכה / קצבה מוכרת + a per-path table. **Confirmed:** exempt = `exemptPct × min(monthly, ₪9,430)`, rate reaching **67% only in 2028**, §9א **statutory-age gate** (60–66 qualifying annuity fully taxable), recognized-pension gain taxed flat **15% nominal**. **Two nuances stay [verify]** — live primary sources 404/bot-blocked, so they rest on the parent map's §9א quotes. **Engine honesty spelled out:** faithful on §9א gate/brackets/CGT/erosion; simplified/absent on commute60 (30% proxy) and the **entirely untracked קצבה מוכרת slice** (overstates 60–66 tax for anyone holding one) — the panel must flag these.
- [Lock the year-explanation data model (engine↔UI contract)](issues/01-lock-explanation-data-model.md) — the typed contract is **written to `src/engine/types.ts`** (build green, 16 tests pass). Key ruling: the tax/CGT intermediates are **path-dependent**, so `project()` emits a `YearExplanation` per year *inside its loop* → `Projection.explanations` (added optional), and `explainYear(s, fireAge, age)` is a thin lookup — no re-derivation, no math duplication. Distinct row types (`ExpenseRow`/`FundingRow`/`TaxLine`) over a shared `RowBase`; identity is a closed-enum `kind`, from which label/base-label/color derive via **keyed content** (`Note = {key}|{text}`; keys in engine, Hebrew registry in UI). Portfolio split liquid/keren; `TaxLine` scalars *are* the derivation (no `Formula`, join by kind). Simplifications = closed `Simplification` flag on the line (`COMMUTE60_PROXY`, `NO_RECOGNIZED_PENSION_SLICE` only — §9א age-gate is faithful, so a note). **Scope split:** 01 = types; 02 populates + implements `explainYear`; 05 = UI + Hebrew registry.
- [Engine emits per-year explanation data (surface tax & CGT intermediates)](issues/02-engine-emits-explanation-data.md) — **built, 22 tests green, numbers unchanged.** `project()` populates `Projection.explanations` (now **required**) inside its loop; `explainYear` is a thin lookup. `tax.ts` gained `annuityTaxBreakdown()` (exempt/taxable/tax), with `annuityNetAnnual` a wrapper over `.net`. Expense factored into `base`/`rent`/`children` rows; funding rows are the **capped bar amounts** (`funding.total = expense − shortfall`); tax band is **full-flow** (`marginal` + `cgt` lines). **For ticket 05:** funding pension `gross` is set only when uncapped (else omit + `note.annuityOverfunds`); the two flags ride separate rows (`NO_RECOGNIZED_PENSION_SLICE` on `marginal`, `COMMUTE60_PROXY` on `pension`); registry keys to add — `note.exemptGateEarly`, `note.annuityOverfunds` (caveat text keyed by the `Simplification` enum).
- [Prototype the year-explainer panel](issues/04-prototype-explainer-panel.md) — **band "A" won** ([prototype](assets/04-explainer-panel-prototype.html)): two-pane top (expense | funding-net-by-bucket) + a **tax band** = per-source table (מקור · ברוטו · בסיס חייב · מס · שיעור) covering **both** taxed sources (pension מס שולי + portfolio מס רווח הון) with a **full-width split bar carrying each tax type's label + % inside its colored segment**. Effective rate shown & labeled; מס שולי=purple / מס רווח הון=clay; this-year scope. The prototype's `taxLines()` shape is the proposed engine↔UI contract for ticket 01.

## Not yet specified

<!-- in-scope fog toward this destination -->

- **(c) Deepen the engine to the real four היוון paths + a קצבה מוכרת/מזכה split** — would make the explanation fully faithful, but needs a **new user input** (recognized-pension holdings). Sequence *after* the explainer ships and reveals which simplifications mislead most — that sizes the work. The biggest fog patch.
- **In-panel path comparison / what-if** — "how would this same year be taxed under a different withdrawal path?" shown side-by-side. Depends on the panel landing.
- **Simplification & [verify]-figure surfacing** — how prominently the panel flags the model's simplifications and the parent map's ~5 unverified tax figures. Ties into the parent's pre-ship verification fog.
- **Lifetime cumulative-tax figure** — a running total-tax-paid stat (or its own viz) alongside the per-year band. Deferred from ticket 04's scope decision; needs the engine to accumulate tax across years. Sequence after the per-year explainer lands.

## Out of scope

<!-- past the destination -->

- **Accumulation-year explanation** (contributions + compounding growth) — the chart draws funding bars only in retirement; this effort explains retirement expenses & funding.
- Everything the [parent map](../map.md) rules out (Monte Carlo, persistence, English UI, nominal-terms display) — inherited.
