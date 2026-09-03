# Horizon-dependent safe-withdrawal threshold (SWR gauge)

Type: task
Status: resolved
Blocked by: —
Resolved (2026-08-31): SWR gauge cutoff now scales with horizon (~4% @30y → ~3.25% @55y+) in `src/ui/Controls.tsx`.

## Question

The SWR gauge uses fixed thresholds (≤3.5% safe / 3.5–5% borderline / ≥5% risky). Make the "safe" cutoff **scale with the retirement horizon** (`planningAge − retireAge`): ~4% for a ~30-yr horizon down to ~3.25% (≈×31) for a 40–60-yr early retirement (Bengen/Trinity vs Karsten Jeske/ERN, per shulit.com/early-retirement).

How: derive the green/amber cutoffs from the horizon — longer horizon → stricter safe rate (interpolate ~4% @30y → ~3.25% @55y+). Keep it a heuristic gauge on the liquid portfolio (base expense, floors excluded), as previously decided.

## Context

From the shulit.com early-retirement review (2026-08-31). Touches the SWR badge (ticket 04 / `src/ui/Controls.tsx`). Build-mode implementation item.
