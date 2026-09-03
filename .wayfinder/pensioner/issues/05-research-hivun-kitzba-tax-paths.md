# Research: היוון קצבה — pension-commutation tax paths

Type: research
Status: resolved
Blocked by: —

## Question

When a retiree commutes part of their pension annuity to a one-time lump sum (**היוון קצבה**), the tax treatment forks by *which slice* is commuted. Establish, with primary sourcing, the distinct paths and exactly how each lump sum is taxed — so the engine can price "annuitize vs. partially-commute" correctly:

1. **היוון קצבה מוכרת** (recognized pension, from already-taxed contributions) — is the commuted lump sum tax-exempt? Conditions?
2. **היוון קצבה פטורה** (the exempt slice of the קצבה מזכה) — tax-free up to the exempt-capital basket (סל הפטור = exemption% × ₪9,430 × 180)? How does taking it reduce the future monthly exemption? The election window / Form 161ד / קיבוע זכויות mechanics and timing.
3. **Commuting the *taxable* slice** — at what rate is it taxed? Does **פריסה** (spreading over up to ~6 years) apply to a commutation lump sum, and how does it reduce the effective rate? Any residual partial exemption?
4. **Constraints/interactions:** the minimum-pension floor (commute only down to ~₪5k/mo retained), the ×1.35 prior-exempt-severance offset to the basket, and any age gates (60 vs statutory).
5. **FIRE-modeling implication:** for an early retiree choosing among (a) full annuity no-היוון, (b) partial היוון of the exempt slice, (c) commuting recognized pension, (d) commuting taxable slice with פריסה — summarize the net after-tax lump sum vs. residual annuity trade-off each produces, and flag the biggest tax pitfalls.

Prefer primary sources (gov.il / Israel Tax Authority, פקודת מס הכנסה §9א, kolzchut); flag anything not confirmable against a live primary page as [verify].

## Context

Graduated from the engine-spec "tax modeling depth" fog when the user flagged that היוון קצבה has several differently-taxed paths (2026-08-28). Blocks ticket 02 (engine spec) — the engine must model these correctly.

## Answer

Confirmed against פקודת מס הכנסה §9א (primary). Full detail + 2026 worked example: **[היוון קצבה tax paths](../assets/05-hivun-kitzba-tax-paths.md)**. The commutation lump sum forks into **four differently-taxed paths**:

1. **היוון קצבה מוכרת (recognized pension** — from already-taxed contributions): principal **tax-free**, only the pro-rata gain taxed at a **flat 15% (nominal)**. Available from **age 60**; doesn't touch the §9א basket → usually the **cheapest early capital**.
2. **היוון the exempt slice of קצבה מזכה:** tax-free up to the **exempt-capital basket** (exempt% × ₪9,430 × 180 = **₪976,005 in 2026**), but **permanently cuts the monthly exemption by `commuted ÷ 180`**. Requires **Form 161ד within 90 days** of first exemption; **irreversible**; only from **statutory age**; reduced by the ×1.35 severance offset.
3. **Commuting the taxable slice:** ordinary **marginal rates** (§121, as personal-exertion income → credit points apply), but **פריסה** spreads it over **up to 6 years** (backward, or forward with approval) to cut the effective rate — powerful for a low-other-income early retiree.
4. **§9ב:** commuting an already-exempt annuity is fully exempt (niche).

**Key age-gate nuance (refines the earlier age-60 finding):** the §9א exemption on the *qualifying* pension only begins at **statutory retirement age (67)** — a **60–66 qualifying-pension annuity is fully taxable at marginal rates**; only the **recognized-pension** slice is tax-free at 60. So early annuitization gives income at 60 but not the exemption until 67.

**Also confirmed:** exemption schedule **52/57/57.5/62.5/67** verbatim from §9א(ז) (67% only from 2028); the **×1.35 offset** from statute arithmetic (=1.3502); stale Wikipedia ₪5,183 → use **₪5,375** (2025). **[verify]** flags: exact minimum-pension floor, forward-פריסה ratio, 161ד default, 2028 ceiling.
