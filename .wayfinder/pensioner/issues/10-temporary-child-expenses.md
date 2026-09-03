# Model temporary / child expenses (per-child)

Type: grilling
Status: open
Blocked by: 02

## Question

Generalize the flat expense into a **base expense + time-bounded temporary-expense layers**, and model **child expenses** (the flagship case) so they run for ~20–25 years and then stop.

Decided approach (user, 2026-08-30): **per-child (option B)** on top of a general temporary-layer mechanism.

- **Data model:** `children: [{ currentAge }]` + **one shared `childTotal`** (default ₪1.2M, birth–18) applied to every child (2026-08-30: user simplified — same total for all kids), amortized over an **age-cost curve** (per-year weights 0–3: 7%, 3–6: 6%, 6–12: 5%, 12–18: 5.2%; per research 11). The single total is the only input; the curve gives the daycare/teen-peaked shape. Post-18 (university/army/apartment help) is an **optional tail**, TBD.
- **Engine:** expense becomes **age-dependent**: `expense(parentAge) = baseExpense + Σ active child layers`. The yearly projection consumes this per year.
- **Visual consequence:** the funding bars **vary in height** — taller during child-rearing years, dropping as each child ages out (the flat-bar assumption goes away, which is more honest).
- **Independence age (Israeli nuance):** default ~21 (army ~18–21), editable higher for parents supporting through university / first apartment (~24–25).

Open refinements to decide: whether child costs during the *accumulation* phase matter (current stub treats `saveMonthly` as net, so they don't); whether to add a later "university bump"; whether the SWR gauge should include temporary child costs (currently excludes them — it's a perpetuity gauge on the base expense).

Output: the extended expense model + per-child input UX, consistent with "shown by default" (this is a Core-relevant feature, not a hidden module).

## Context

Graduated from fog (2026-08-30) once the per-child approach was chosen. Extends the engine spec (§8 expenses) and is being demonstrated in the shared prototype alongside the results-viz work (ticket 04). Terms added to `CONTEXT.md`: Temporary expense, Child expense.
