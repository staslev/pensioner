# Lock the year-explanation data model (engine↔UI contract)

Type: grilling
Status: resolved
Assignee: staslev
Blocked by: 04 (resolved)

## Answer

**Contract locked and written to `src/engine/types.ts`** (build green, 16 tests pass). Ten decisions, all confirmed with the user:

**Where it's produced (Q1).** The intermediates are **path-dependent** — a year's real CGT depends on `liquidBasis`, which `project()` mutates across the whole bridge; you can't compute year 63 without replaying 56→62. So `project()` builds a `YearExplanation` per retirement year *inside its loop* (the only place holding running state) and exposes them as `Projection.explanations` (same index as `bars`). `explainYear(s, fireAge, age)` is a thin wrapper — run `project` once, return that year's explanation (null if not a retirement year). No math duplication; `FundingBar` stays lean.

**Row modeling (Q2, Q7, Q11).** *Distinct* row types, not one union: `ExpenseRow` / `FundingRow` / `TaxLine`, sharing `RowBase { label?, note?, flag? }`. Each row's identity is a closed-enum `kind` (`ExpenseKind` = base/rent/children · `FundingKind` = bituachLeumi/pension/liquid/keren · `TaxKind` = marginal/cgt); **label, base-label and color all derive from `kind`** via keyed content (label is an optional override). Portfolio is split into `liquid` (CGT) + `keren` (tax-free) rows — UI may merge for display. A `TaxLine`'s scalar fields (`gross/exempt/base/tax/rate`) **are** its derivation — no separate `Formula`, no id graph; funding ↔ tax join by matching kind (pension↔marginal, liquid↔cgt). `shortfall` is a scalar on the year, not a funding source.

**Formulas (Q3).** Structured, not display strings — where a formula is shown it's operands→result the UI formats (LTR-isolated numbers per the parent RTL rules) and tests can assert against the engine. In practice the tax derivation *is* the `TaxLine` scalars, so no separate `Formula` type was needed for v1.

**Caveats (Q4, Q9).** A closed `Simplification` enum carried per-line as `RowBase.flag`; `YearExplanation.caveats` is the derived set of flags that fired. Only two members — `COMMUTE60_PROXY` (commute60 path only) and `NO_RECOGNIZED_PENSION_SLICE` (annuity present) — because only these make a *shown number* misleading. Broader model limits (no מס יסף, no min-pension floor, no פריסה/161ד, no explicit early-annuitization factor, commutation not reducing the exemption) are static model documentation, not per-line flags. The §9א age-gate is **faithful**, so it's a plain `note`, not a flag.

**i18n (Q5, Q8).** `Note = { key: ContentKey } | { text: string }` — keys for the finite/reused content (concept blurbs + caveat text from ticket 03, row labels), inline strings for one-off per-row notes. `ContentKey` type lives in the engine; the Hebrew registry `Record<ContentKey, string>` lives in the **UI** (ticket 05) — engine emits keys + numbers only, stays pure/i18n-agnostic.

**Scope split (Q10, Q12).** Ticket 01 delivers the **type vocabulary** in `types.ts` (`YearExplanation`, `RowBase`, `ExpenseRow`, `FundingRow`, `TaxLine`, `Formula`-free scalars, `Note`, `ContentKey`, `Simplification`, `PhaseKind`, `ExplainYear` signature, `Projection.explanations` added **optional**). Ticket **02** populates `explanations` inside `project()`, promotes it to required, implements `explainYear`. Ticket **05** builds the UI + Hebrew content registry. `PhaseKind` = bridge/earlyAnnuity/fullAnnuity, derived from age vs annuitization/statutory age.

## Question

From the validated prototype (04), lock the typed contract the engine emits and the UI renders. Decide:

- The shape of the ordered line-item model: `{ label, amount, formula?, note?, kind }` — and the sub-group structure (expense / funding / tax).
- How a **formula** is represented (display string vs structured operands) so it survives RTL and stays testable.
- How **simplification/caveat flags** are carried on a line (e.g. commute60's 30% proxy, the "60–66 fully taxable" nuance) so the UI can mark them.
- How plain-language **notes** are stored for i18n-readiness (Hebrew-only v1, but keyed).
- Whether it's re-derived by a dedicated `explainYear(scenario, fireAge, age)` or stored per `FundingBar`.

Resolution = the typed contract (in `../../../src/engine/types.ts` terms) that tickets 02 and 05 build against.

## Context

Blocked by the prototype (04) — the prototype *proposes* the shape; this ticket locks it. Consult `grilling` + `domain-modeling`. Option (b) accuracy: the contract carries the tax intermediates the engine already computes. Parent engine: `../../../src/engine/{engine,tax,types}.ts`.
