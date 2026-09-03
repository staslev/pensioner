# ביטוח מנהלים (Manager's Insurance) — research for the FIRE simulator

**Framing:** a *variant of the pension bucket*. Same §9א tax rules and same "balance ÷ coefficient → monthly annuity" mechanics as a קרן פנסיה, with four vehicle-specific knobs: **(a) guaranteed conversion coefficient, (b) capital vs. annuity track, (c) higher fees, (d) vintage** (which drives a–c). Sources fetched live 2026-08-28; gov.il/CMA direct-fetch blocked, primary circular reached via reader-proxy + cross-checked. Unconfirmed items flagged **[verify]**.

## 1. What it is & core difference from קרן פנסיה
- An **insurance-company contract (פוליסה)**, terms largely fixed at inception — opposite of a mutual pension fund whose rules are collective and updated over time.
- **Insurer bears the risk (individual counterparty)** vs. the fund's mutual pool (ערבות הדדית). The insurer *guarantees* contract terms.
- **Bundled risk riders:** life (ריסק מוות) + optional disability (אכ"ע), priced as premiums **deducted from contributions before savings** (risk capped at 35% of contributions; disability payout ≤75% of insured salary).

## 2. Guaranteed annuity coefficient (מקדם קצבה מובטח) — the key distinction
Annuity = balance ÷ coefficient; lower coefficient → higher pension.
- **Guaranteed:** locked on **join date** using then-current mortality tables; never rises → longevity risk on the **insurer**. Only in **pre-2013** ביטוח מנהלים.
- **Non-guaranteed:** all pension funds, gemel, and post-2013 ביטוח מנהלים; fixed only at first payment, drifts up with longevity → risk on the **saver**.
- **Ended by:** חוזר ביטוח **2012-1-5** (pub. 29 Nov 2012, **eff. 1 Jan 2013**). Exception: guaranteed coefficient may still be sold to buyers **aged 60+ at sale**. (The "age 55 at joining" claim on Wikipedia is **[verify]** — the primary circular says 60.)

| Vintage | Guaranteed coefficient | Annuity edge vs. ~200 today |
|---|---|---|
| Pre-1991 | ~145–157 (often + guaranteed return) | Large — "don't touch" |
| 1990s | ~166 | Meaningful |
| 2001–2012 | **~196–206 (≈200)** | **≈None** |
| 2013+ | none | — |
| Today non-guaranteed | male 67 ~186–201; female 63 ~202 | (baseline) |

Uplift (annuity = balance÷coeff): **170 vs 200 = +17.6%**, **145 vs 200 = +38%**, **180 vs 200 = +11%**.
**Critical nuance:** "guaranteed" ≠ better. Only **pre-2001** policies (~145–166) carry a real edge; 2001–2012 guaranteed (~200) is no better than today's non-guaranteed **and** carries higher fees. **The value matters, not the flag.**

## 3. Capital (הון) vs. annuity (קצבה) track
- **מסלול הון** = one-time lump sum; **מסלול קצבה** = lifetime annuity. Both existed until end-2007.
- **Cutoff:** תיקון 3 to חוק הפיקוח (קופות גמל) 2005 — deposits **from 1 Jan 2008 are annuity-only**; capital-deposit option abolished. Money accrued **through 31 Dec 2007 grandfathered as capital/הון**, payable as a lump sum at retirement. (Exact statute cite **[verify]**.)
- **Pre-2001 / פוליסת עדיף:** premium split savings/insurance (e.g. 80/20 in 2001–2003; 72/28 earlier); transparent annuity policies from 2004.
- **Tax of the capital lump sum (distinct from §9א):** pre-2008 capital withdrawable **tax-free after age 60** (capital/severance-style); post-2008 non-annuity withdrawal → **35%**. Severance has its own §9(7א) exemption.
- **FIRE meaning:** a **capital-track / pre-2008 grandfathered balance behaves like liquid capital arriving at 60 (largely tax-free), NOT a lifetime annuity floor.**

## 4. Fees (דמי ניהול)
Caps: pension מקיפה **0.5% balance + 6% deposits**; ביטוח מנהלים/gemel/pension כללית **1.05% balance + 4% deposits**.
Actual averages (Calcalist, Jun 2023, CMA data): pension **~1.71% deposits + 0.17% balance**; ביטוח מנהלים **~2.05% deposits + 0.83% balance** (~5× the balance fee). Managers' insurance is **materially costlier**. Pre-2004 policies added profit-share (15% of real profit) + גורם פוליסה (abolished 2004). Latest CMA figures **[verify]**.

## 5. Tax of the annuity
- **§9א / קצבה מזכה is vehicle-agnostic** — identical recognized-pension exemption, קיבוע זכויות (161ד), commutation paths as a pension fund. No separate tax logic.
- Exemption schedule 57.5% (2026) → 62.5% (2027) → 67% (2028+); ceiling ₪9,430/mo; max tax-free ≈ ₪5,422/mo (2026). היוון only above the ~₪5,306/mo (2026) protected minimum.
- **ביטוח-מנהלים-specific tax differences live in the *product* (guaranteed coefficient, pre-2008 capital lump sum), not the annuity tax rule.**

## 6. Accumulation / contributions
- Same 18.5% structure (6% ee + 12.5% er) from 2017.
- **Savings grow net of a risk-premium drag** — death/disability rider premiums deducted from contributions before savings (a genuine difference vs. a fund's collective cover). Pre-2004 עדיף diverted 20–28% of premium to insurance; post-2004 the risk premium is separated/explicit.
- **New ביטוח מנהלים essentially closed since Sept 2023** (requires salary >~2× average wage + prior pension deposits) → today it's mostly a **legacy** vehicle.

## 7. Vintage map
| Attribute | Pre-2001 (esp. pre-1991) | 2001–2008 | 2008–2013 | Post-2013 |
|---|---|---|---|---|
| Coefficient guarantee | Yes; **low ~145–166** → big edge | Yes but **~200** (little edge) | Yes ~200 | **None** (unless 60+ at sale) |
| Capital vs annuity | Both; capital common | Both until end-2007 | **Annuity-only** new (pre-2008 grandfathered capital) | Annuity-only |
| Fees | Opaque, high | Transparent from 2004 | Transparent | Capped 1.05% + 4% |

## 8. FIRE-modeling bottom line
**Power-user attributes (beyond shared pension-bucket params):**
1. **Guaranteed coefficient? + value** — highest-value input. Fixed annuity floor at a known rate if guaranteed; else inherits the fund's floating ~200+. Edge of a low guaranteed coefficient ≈ **+11% to +38%**.
2. **Track: annuity vs. capital (pre-2008 grandfathered הון)** — capital portion = **liquid, largely tax-free lump sum at 60**, not a floor.
3. **Fee level** — default managers' to **~0.8% balance + 2% deposits** (vs pension ~0.17% + 1.7%); allow higher for pre-2004.
4. **Vintage** — master switch setting defaults for 1–3.

**Behavior selector:** *annuity floor* when (guaranteed) OR (post-2008 annuity track); *liquid capital* when (pre-2008 capital/הון).

**Core can ignore** the guarantee toggle & capital track (default to non-guaranteed ~200 annuity like a pension fund, just a higher fee) — annuity tax is identical, so no separate tax logic. **Power must set** guaranteed flag+value, track, fee, vintage.

### [verify]
Exact תיקון 3 citation; historical 43.5/49/52% exemption stages & exact 2025 %; latest CMA average fees; the קיזוז formula; "age 55 vs 60 at sale" (primary says 60).
