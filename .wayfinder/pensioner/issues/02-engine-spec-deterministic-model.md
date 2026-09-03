# Engine spec: deterministic projection model

Type: grilling
Status: resolved
Blocked by: 01, 05, 06

## Question

Design and document the deterministic calculation core — the heart of the tool — precisely enough to build and unit-test independently of any UI. Decide and specify:

- **State & timeline:** what the projection iterates over (yearly?), the phases — accumulation (if any), the **staged bridge**: fully self-funded → then the **private-pension annuity** begins (~age 60, reduced) → then the **Bituach Leumi old-age allowance** stacks on at statutory age. Required drawdown steps down at *each* floor, not once.
- **Inputs:** the full input set and its Core/Power split; units (real terms, today's ₪).
- **Instruments:** how each modeled asset (liquid, pension **[קרן פנסיה + ביטוח מנהלים]**, keren hishtalmut, gemel, real estate) accumulates, is taxed, and is drawn down — and the ordering of drawdown across accounts. ביטוח מנהלים is a **Power-tier variant of the pension bucket** (attributes: guaranteed coefficient? + value, track annuity-vs-capital, fee level); its parameter details come from ticket 06.
- **Income floors:** how each floor switches on at its own age — the pension annuity at ~60 (reduced; and the היוון minimum-pension-floor rule on how much capital stays locked vs. is cashable), the old-age allowance at statutory age — and reduces required drawdown.
- **Tax application:** where and how tax is applied during drawdown (depth may graduate to its own ticket).
- **Success criterion:** solvency to the planning age with the bequest target respected.
- **Solve modes:** the one computation behind all three framings — "feasible at age X?", "earliest feasible age", and "the Gap" (lump sum and implied monthly saving).
- **Assumption parameters:** the set of tunable assumptions and their default values (sourced from ticket 01).

Output: a written engine spec (interfaces, formulas, worked example) plus the domain terms it introduces (update `CONTEXT.md`).

## Scope directive — decumulation paths (from user, 2026-08-28)

The engine MUST be able to compute all three retirement-pot decumulation strategies as **selectable, Power-tier** options ("if user asks"); the Core tier defaults to path ③ and hides the choice:

- **① Early annuitization (age 60+):** begin the pension annuity from 60, actuarially reduced — income floor starts at 60. **Tax gate:** the §9א exemption on the *qualifying* pension applies only from **statutory age (67)**, so a 60–66 qualifying-pension annuity is **fully taxable at marginal rates**; only the *recognized-pension* slice is tax-free from 60. **Two sub-variants the engine must distinguish:** (1a) full annuity, **no היוון**; (1b) **partial היוון קצבה** — commute part to a lump sum (down to the minimum-pension floor), taxed by slice: recognized pension (principal free + **15% on gains**, from 60), exempt slice (free up to the **×180 basket**, but cuts monthly exemption by commuted÷180; Form 161ד within 90 days; statutory age only), or taxable slice (marginal rates with **פריסה** over ≤6 yrs). Confirmed rules + 2026 worked example: [ticket 05's asset](../assets/05-hivun-kitzba-tax-paths.md).
- **② Lump sum + self-managed drawdown, with penalties/constraints modeled honestly:** freely lump-sum-able for liquid vehicles (brokerage 25% real CGT; keren hishtalmut tax-free after 6y; gemel 25% real, or tax-free annuity at 60) and the severance slice (exempt to ₪13,750/yr-service). For the pension **tagmulim**, lawful היוון is only the **surplus above the minimum-pension floor (~₪5k/mo)** (exempt slice tax-free up to the ×180 basket); a full/early raid = "משיכה שלא כדין" at **≥35%**. Both the floor cap and the ≥35% penalty must be represented so the path is comparable, not artificially free.
- **③ Wait until statutory age (~67):** full *unreduced* annuity + Bituach Leumi old-age allowance at statutory age. The Core default.

Whether users *compare* these paths side-by-side vs. pick one per run is a Results-prototype (ticket 04) concern; the engine must be able to compute each regardless.

## Context

Consult `grilling` + `domain-modeling`. Blocked on ticket 01 so the rates/rules are grounded. Expect this to graduate fog: **tax modeling depth** and **real-estate/mortgage depth** will likely become their own tickets.

## Answer

Full build-ready spec (data model, per-bucket rules, tax model, drawdown algorithm, solve modes, TS interfaces, worked example): **[engine spec](../assets/02-engine-spec.md)**. Resolved over three grilling rounds:

- **Skeleton:** yearly, real-terms projection; **accumulation** (now→FIRE age) then **staged decumulation** (bridge → ~60 → statutory → planning age); five buckets (liquid, keren hishtalmut, gemel, pension [קרן פנסיה + ביטוח מנהלים variant], real estate); one `project()` core wrapped for the three solve-modes (headline = **earliest feasible age** + **the Gap** as lump-sum and monthly-saving).
- **One-engine principle:** always runs the full model; Core = advanced inputs at defaults that collapse it to the simple case. No mode toggle.
- **Mechanics:** default drawdown order liquid→gemel→keren-hishtalmut (pension excluded, produces a floor); Core simplified-via-defaults tax, Power adds commutation/×1.35/FX/פריסה/ביטוח-מנהלים; assumptions & defaults tabled (4% real return, 2.5% inflation, planning age 92, coefficient 200, etc.); accumulation applies 18.5% + discretionary savings; expenses flat-real; income floors estimated-with-override.
- **Decumulation strategy:** per-run parameter; Core default `waitStatutory` (unreduced annuity, no היוון), Power `earlyAnnuitize60` / `partialCommute`.

**Graduated:** deep real-estate/mortgage → ticket 07; couple/household modeling → ticket 08 (both Power, blocked by this spec). **Unblocked:** the two prototype tickets (03, 04). **[verify] figures** carried forward in §12 for pre-ship checking.

**Amended 2026-08-29 (from ticket 03 prototyping):** target retirement age is **no longer an input** — the app assumes retire-as-soon-as-possible. Primary output = **earliest feasible age**; "the Gap" re-anchored to **retire-now** (a lump sum); "retire at age X?" demoted to an optional Power what-if. Engine spec §2/§10/§11 updated accordingly.
