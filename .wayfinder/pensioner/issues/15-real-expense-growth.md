# Real expense growth (wrong-index / housing & senior CPI)

Type: task
Status: resolved
Blocked by: —
Resolved (2026-08-31): `realExpenseGrowth` assumption applied to the base expense in the engine + a Power field ("עליית הוצאה ריאלית"); default 0.

## Question

Expenses are currently held **flat-real**. Add a Power **"real expense growth %/yr"** assumption so the retiree's basket can drift up in real terms — reflecting that Israeli **housing** and the senior/health index have historically risen ~faster than general CPI, and that US-based SWR studies peg to US CPI, not the retiree's actual basket (shulit.com/early-retirement).

How: apply `(1 + realExpenseGrowth)^(age − currentAge)` to the base expense inside the projection; expose as a Power field. Default **0** (flat-real); allow a positive premium (e.g. ~0.5–1%/yr for housing-heavy baskets).

## Context

From the shulit.com early-retirement review (2026-08-31). Engine change + a Power input. Interacts with the child-expense curve (temporary) — this is a persistent real drift of the base.
