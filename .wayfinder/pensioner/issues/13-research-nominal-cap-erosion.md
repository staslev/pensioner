# Research: real erosion of frozen nominal caps (esp. קצבה מזכה ceiling)

Type: research
Status: resolved
Blocked by: —

## Question

The engine is in **real terms**, but key Israeli thresholds are **nominal** and often **frozen**, so their real value erodes with inflation. To model this (`real_cap(t) = cap_today × (1−erosion)^t`, a Power assumption), establish:

1. **Which caps are frozen vs CPI-indexed** (confirm/extend prior research): קצבה מזכה ceiling (₪9,430/mo, frozen 2024–27), income-tax brackets, surtax threshold (₪721,560), credit-point value, keren hishtalmut salary ceiling (₪15,712), gemel-lehashkaa cap (indexed?), average-wage pension base (indexed), Bituach Leumi old-age allowance (indexed?).
2. **Historical re-indexation cadence for the frozen ones** — how often, historically, has the Knesset re-indexed frozen thresholds (tax brackets, קצבה מזכה ceiling)? Faithfully (≈CPI over time) or with persistent real erosion?
3. **A defensible real-erosion default**, especially for the **קצבה מזכה ceiling** — 0%/yr (assume re-indexed to hold real value), full-inflation (never re-indexed), or a middle estimate — with a plausible range.
4. **Modeling note** — is one shared "tax-ceiling erosion %/yr" adequate, or do brackets vs the קצבה-מזכה ceiling behave differently enough to split?

Flag anything not confirmable against a live source as [verify].

## Context

User request (2026-08-30) to model nominally-capped figures. Feeds an engine refinement — a Power "nominal-cap real erosion" assumption (amends the engine spec §7 tax model), analogous to the coefficient-drift model (ticket 09). Resolved by a background research subagent.

## Answer

Full detail: **[nominal-cap erosion research](../assets/13-nominal-cap-erosion.md)**. Key points:
- **Two clusters:** *frozen* (קצבה מזכה ceiling ₪9,430, brackets, credit point, surtax — frozen 2024/25–2027) and *indexed-up* (gemel cap, avg-wage base, old-age allowance — model constant-real).
- **Load-bearing finding: no catch-up after a freeze** → each freeze carves a *permanent* real notch. Long-run, caps broadly track CPI between freezes.
- **Recommended default (frozen cluster / קצבה מזכה):** explicit **flat-nominal segment through 2027** (~full-inflation erosion, near-certain) + **~1%/yr real erosion** long-run base (0% low / ~full-inflation high).
- **Offsetting tailwind:** §9א exemption *rate* rises 57→67% by 2028 — partly counters the ceiling erosion.
- **Two knobs:** frozen-cluster erosion (~1%/yr) vs indexed-cluster (~0%). Highest-impact cap for a retiree = the קצבה מזכה ceiling.

**Implementation note:** **implemented in `src/engine/tax.ts` (2026-08-31)** — the קצבה מזכה ceiling and bracket thresholds erode via a `capErosion` Power assumption (default ~1%/yr), feeding the §9א annuity-tax calc. Exposed as a "שחיקת תקרת מס" field. (The near-term explicit freeze-through-2027 two-segment refinement is folded into the single blended rate for now.)
