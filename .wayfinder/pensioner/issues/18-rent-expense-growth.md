# Rent as a faster-growing expense component (extends ticket 15)

Type: task
Status: resolved — approach B, implemented (2026-08-30)

## Question

Rent (שכר דירה) is often the dominant expense and can grow faster than general inflation. Let the user model rent's real growth separately from the rest of the basket. Options:

- **A** — Split the monthly expense into rent + other, each with its own real-growth rate (two expense inputs).
- **B (recommended)** — Keep the single total "הוצאה חודשית"; add Power inputs **"מתוכה שכר דירה (₪)"** + **"עליית שכר דירה ריאלית (%)"**. The non-rent remainder grows at the existing `realExpenseGrowth`. `expense(t) = rent·(1+rentGrowth)^t + (total−rent)·(1+otherGrowth)^t`.
- **C** — Rent as a separate expense line (amount + growth), generalizing toward per-component growth (rent now, healthcare later).

Recommended: **B** — keeps the Core expense slider intact, adds two Power knobs, and rent's rising share shows up in the funding bars over time.

Nuances: rent = 0 for owners (opt-in); "buy a home / rent stops" belongs to real-estate (ticket 07, deferred); rent's share of expense rises as it compounds faster.

## Context

Extends ticket 15 (real expense growth). User request 2026-08-31. Awaiting approach pick before build.

## Resolution (2026-08-30)

Approach **B** built. `Scenario.monthlyRent` (rent portion of the total `monthlyExpense`, real, default 0 = owner) + `Assumptions.rentRealGrowth` (default 1.5% real). Engine splits the yearly expense:
`expense(t) = rent·(1+rentRealGrowth)^t + (total−rent)·(1+realExpenseGrowth)^t + childAnnual`, with `rent` clamped ≤ total. `realExpenseGrowth` now governs only the non-rent remainder. UI: הוצאות section gains a "מתוכה שכר דירה" slider (max = monthlyExpense; lowering the total clamps rent) and a "עליית שכר דירה ריאלית (%)" field alongside the renamed "עליית שאר ההוצאות ריאלית (%)". Tests: faster rent growth raises later-year expense & never improves feasibility; rent = 0 makes the rent-growth knob inert. All 16 engine tests + build green.
