# Research: Israeli retirement-finance rates & rules

Type: research
Status: resolved
Blocked by: —

## Question

Compile the authoritative Israel-specific figures and rules the deterministic engine needs, current to ~2024–2026, each with modeling implications and a simple/medium/hard complexity flag:

- **Pension (קרן פנסיה):** contribution rates (employee/employer/severance), typical management fees, the annuity coefficient (מקדם קצבה), and taxation of the annuity in retirement.
- **Keren Hishtalmut (קרן השתלמות):** contribution ceilings, the tax-free holding rule, tax treatment, typical returns.
- **Kupat Gemel Lehashkaa (קופת גמל להשקעה):** contribution limits, tax treatment, liquidity.
- **Old-age allowance (קצבת זקנה):** approximate monthly amounts, statutory retirement age (גיל פרישה) by sex/birth-year, income tests.
- **Taxation:** securities capital-gains (real vs nominal, the 25% figure), dividend tax, marginal income-tax brackets, tax-free ceilings, relevant credit points (נקודות זיכוי).
- **Real estate:** rental-income tax tracks (exemption ceiling, 10% flat track), mortgage basics relevant to a FIRE model.
- **Assumptions:** typical Israeli inflation, ILS considerations, real-return assumptions common in Israeli FIRE communities.
- **Safe withdrawal:** how the 4%-rule / SWR thinking is adapted given pension + Bituach Leumi as later-life income floors.

Also flag: the biggest sources of modeling error / user confusion, and which items are "everyone needs this" vs "power-user nuance."

## Context

A background research briefing on exactly this scope was dispatched during charting and resolved this ticket. Do **not** fire a duplicate.

## Answer

Full cross-verified briefing (numbers, complexity ratings, sources, verify-flags): **[Israeli finance briefing](../assets/01-israeli-finance-briefing.md)**. Headline facts the engine spec depends on:

- **Two-phase "bridge" model is confirmed as the central design point.** Do NOT use a flat SWR. The portfolio fully funds FIRE-age → statutory age (men 67 / women 62→65) at a *higher* withdrawal rate; then income floors switch on and required drawdown drops sharply. SWR anchor is sub-4% (~3.5% floor for 40–50yr horizons).
- **Pension (18.5%** = 6% ee + 6.5% er tagmulim + 6% severance; base capped at avg wage ₪13,769/mo 2026). **Annuity can begin at age 60** (early, actuarially reduced — verified against חוק גיל פרישה §5), so the private-pension income floor starts at **60, not 67**; the self-funded bridge to *it* ends at 60. Lump-sum (היוון) is capped by a minimum-pension floor (סכום קצבה מזערי ~₪5,012/mo 2024 → ~₪5,306 2026) — only surplus above it is cashable; pre-60 non-annuity withdrawal taxed ≥35%. Severance slice reachable as a lump sum on leaving work (exempt to ₪13,750/yr-service, 2026). Annuity = balance ÷ coefficient (~161–215 at 67, **non-guaranteed since 2013**). Annuity tax: recognized ceiling ₪9,430/mo (frozen), exempt slice 57% (2025) → 57.5% (2026) → 67% (2028+), reduced per-person by the קיבוע זכויות severance offset (power nuance).
- **Keren Hishtalmut** = the bridge workhorse: tax-free after 6 years, any purpose; ~5.9%/yr general, ~10.1%/yr equity (10-yr).
- **Gemel lehashkaa:** liquid; 25% real-gains on lump sum OR tax-free annuity after 60; cap ~₪83,641/yr (2026, indexed).
- **Bituach Leumi old-age allowance (2026):** single ₪1,838/mo; couple-vs-two-individuals distinction; retirement age men 67 / women 62→65; pre-70 income test on *work* income (pension excluded).
- **Tax:** **25% on the REAL (CPI/FX-adjusted) capital gain**; **credit points do NOT offset capital-gains tax** (major user misconception); passive-income bracket floor 31%; 2025 adds +2% surtax on high passive income; several thresholds frozen 2024–26, others index up.
- **Real estate:** three rental tracks (full exemption ~₪5,654/mo, 10% flat, marginal+depreciation) → user toggle. Mortgage LTV 75% first / 50% investment; prime ≈ 5% (2026).
- **Assumptions (defaults now sourced):** inflation 2–3%; real returns ~3–4% general / ~5–7% equity.

**Top modeling-error traps** to design against: (1) pension annuity tax glide-path + severance offset; (2) credit points don't shelter CG; (3) real capital-gains basis; (4) the illiquidity wall (pension/gemel not spendable pre-60); (5) non-guaranteed coefficient; (6) frozen-vs-indexed thresholds; (7) Bituach Leumi couple-vs-individuals + income test.

**~5 figures flagged for a human check against primary .gov.il sources before shipping numbers** (see briefing) — a pre-ship task, past this map's destination.

**Follow-up verification (2026-08-28):** confirmed the pension **age-60 annuity** option against חוק גיל פרישה §5 and the היוון minimum-pension-floor mechanism (§23) — the pension is an income floor from **60**, staging the bridge into two endpoints (pension at 60, Bituach Leumi at statutory age). The briefing's §1, §8, and error-list #4 were amended accordingly.
