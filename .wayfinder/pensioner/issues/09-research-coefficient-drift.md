# Research: annuity-coefficient (מקדם קצבה) longevity drift & projection

Type: research
Status: resolved
Blocked by: —

## Question

For a **non-guaranteed** pension saver, the annuity conversion coefficient (מקדם המרה / מקדם קצבה) is set at first payment from the mortality tables then in force, and drifts **upward** as longevity rises — reducing the future annuity for a given pot. To model this (`coeff_at_retirement = coeff_today × (1+drift)^years`, a Power assumption), establish with primary/□reputable sourcing:

1. **Historical coefficient values over time** — enough data points (e.g. typical מקדם at age 67 across years/decades) to derive an implied annual/decadal drift rate.
2. **The mechanism & cadence** — how/when funds update the coefficient (regulator circulars, mortality-table revisions), and whether it's continuous or steppy.
3. **A defensible forward assumption** — a recommended drift (%/yr or points/decade) plus a plausible range, with the caveat that it's inherently uncertain.
4. **Scope of who's exposed** — confirm non-guaranteed (all pension funds post-2013, gemel, post-2013 ביטוח מנהלים) drift; guaranteed pre-2013 ביטוח מנהלים does not.
5. **Modeling note** — whether a simple compounding drift is adequate or if a table/step function is materially better.

Flag anything not confirmable against a live primary source as [verify].

## Context

Surfaced during ticket-04 prototyping (2026-08-29): the prototype holds the coefficient fixed, understating the longevity headwind over a long accumulation. Feeds an engine refinement — a Power-tier "coefficient longevity drift" assumption (amends the engine spec §6). Resolved by a background research subagent.

## Answer

Full detail: **[coefficient-drift research](../assets/09-coefficient-drift.md)**. Key points:

- Non-guaranteed coefficient drifts **up** with longevity, but the big historical moves (145→166→199→~186) were **mostly interest-rate-assumption driven, not longevity** — and non-monotonic (2000s ~199 > 2024 ~186).
- **Recommended model:** `coeff_ret = coeff_today × (1+drift)^years`, default **drift ≈ 0.4%/yr** (range 0.2%/0.4%/0.8% as a sensitivity band), with a **cap ~230–240 @67** and a floor near today's value.
- The coefficient also embeds an **interest-rate** component (unforecastable) — a single "longevity drift" is a simplification; surface the range, not false precision.
- Guaranteed pre-2013 ביטוח מנהלים is exempt (coefficient locked).
- **[verify]:** specific mortality-table revision dates; whether current typical is ~186 vs ~200–210 by fund/track/marital status.

**Wired into the prototype** as a Power "סחף מקדם" assumption (default 0.4%/yr, capped) and recorded as an engine-spec §6 Power assumption.
