# Annuity coefficient (מקדם קצבה) drift over time — research

**Bottom line:** the non-guaranteed coefficient has drifted **upward** for decades as longevity rose, but the historical rise is *inflated* by a parallel secular fall in the assumed interest rate. For a forward model, a **central longevity drift of ~0.4%/yr (≈ +7–8 points/decade on a ~190 base)** is defensible, range **~0.2%–0.8%/yr** — and the interest-rate component is a separate, dominant, unforecastable mover. Sources: Hebrew Wikipedia (מקדם קצבה, קרן פנסיה, ביטוח מנהלים; the מקדם-קצבה article carries a quality tag → indicative), Kol Zchut (מקדם המרה לקצבה, updated 2025-06). gov.il circulars were 403-blocked → circular dates [verify].

## 1. Historical trajectory (male ביטוח מנהלים, indicative)
| Era | Typical coefficient |
|---|---|
| 1980s | ~145 |
| 1990s | ~166 |
| 2000s | "jumped to" ~199 |
| 2024 | married man @67 ~**186**; married woman @63 ~202 |

Kol Zchut uses a round **200** (₪1M ÷ 200 = ₪5,000/mo). **Caution:** the trajectory is NOT monotonic — the 2000s ~199 sits *above* the 2024 ~186. That inversion is the tell that the coefficient isn't longevity-only: the ~199 reflected lower-interest-rate assumptions of that period; a later rate revision pulled it back. So the naive 145→166→199 slope (~1.3–1.8%/yr) is **mostly interest-rate-driven, not pure longevity** — don't use it as the drift.

## 2. Mechanism & cadence
- Set by the regulator (**רשות שוק ההון**) via circulars prescribing the actuarial basis — **mortality tables (לוחות תמותה)** + an assumed real return.
- For a non-guaranteed saver it **locks at the first pension payment (at retirement)**, using the tables in force then, fixed for life after.
- 2012 (Sharig) decision ended new guaranteed-coefficient managers'-insurance from **1 Jan 2013** (carve-outs ~age 55–60+). Pre-2013 guaranteed policies exempt.
- **Steppy, not continuous:** the prescribed basis is flat between revisions and steps on each regulator revision every few years. Specific revision years/circular numbers **[verify]** (gov.il blocked).

## 3. Forward-projection assumption (recommended)
Coefficient ≈ discounted months of payout; a +1 year/decade longevity gain is a modest coefficient rise once discounted.
- **Central: ~0.4%/yr** (≈ +7–8 pts/decade on ~190). Over 30 yrs: 190 × 1.004³⁰ ≈ **214**.
- **Low: ~0.2%/yr** (longevity gains decelerating). **High: ~0.8%/yr** (continued longevity + falling assumed rate reinforcing).
- Inherently uncertain — depends jointly on future longevity AND the interest-rate assumption at the saver's retirement date.

## 4. Interest-rate component (why it's not pure longevity)
- The coefficient embeds an assumed reserve/technical interest rate. **Higher assumed rate → lower coefficient** (higher annuity); lower rate → higher coefficient. This is why it fell 2000s ~199 → 2024 ~186 despite rising longevity.
- New pension funds hold 30% in state bonds at index+**4.86%**; assumed return tied to such rates. 2013 attempt to cut the assumed return was reversed; Aug-2015 introduced a post-retirement **מקדם עדכון** that re-adjusts annually vs actual returns.
- **Implication:** a single "longevity drift" conflates two drivers. If the sim has a real-rate assumption, cleaner to let longevity contribute a small steady drift and let the rate assumption move the coefficient separately.

## 5. Modeling recommendation
- **`coeff_ret = coeff_today × (1+drift)^years` is adequate** as a first-order model (real drivers unforecastable; smooth exponential ≈ averaged step-revisions). A lookup/step table would be false precision (no credible future revision schedule exists).
- **Add bounds:** cap ~**230–240 @67** even for 30–40yr-out retirements (mortality + rate floor bound it); floor near today's value.
- **Best practice:** run **low/central/high (0.2 / 0.4 / 0.8%/yr)** as a sensitivity band; the qualitative certainty ("retiring later → smaller annuity per shekel") is solid, the magnitude is an assumption.

## [verify]
Specific mortality-table revision years/circular numbers; whether current typical value is ~186 or higher (~200–210) for specific fund/track/marital-status combos — confirm vs רשות שוק ההון circulars + a current fund's תקנון before hard-coding.
