# Cost of raising a child in Israel — research

**Caveat:** CBS (למ״ס) and Bank of Israel publish **no headline lifetime total**. Figures are journalistic/advisory calculations on the CBS Household Expenditure Survey + the Treasury pre-birth calculator, 2017–2026, with different age cutoffs (18/21/enlistment) and scopes — **not directly comparable**, all **nominal**.

## 1. Total cost (per single child unless noted)
| Figure | Range | Source (date) |
|---|---|---|
| **~₪1.26M** | birth–18 (~₪5,800/mo) | Ynet (Jul 2019) |
| **~₪1.16M** | birth–18 | Globes/Hon (Oct 2021) |
| ~₪612K (1st; ~₪491K 2nd) | birth–18, **direct/education-weighted (lower scope)** | Globes/Greenblatt (Mar 2017) — best age-distributed dataset |
| **₪1.08M mid / ~₪1.5M top-decile** | birth–**21** | Natanzon (Jun 2021) — **the ~₪1.5M the user cited**; top-decile is a 2-child-family avg (some economies of scale) |

**Bottom line:** typical **birth-to-18 single child ≈ ₪1.1–1.3M**. Range: **low ~₪0.6M** (direct-only) → **typical ~₪1.1–1.3M** (to 18) → **high ~₪1.5–1.8M** (to 21 / top-decile). A 2nd child ~20% cheaper (economies of scale).

## 2. Age-cost curve (Greenblatt shape, corroborated by current daycare rates)
| Stage | ≈ monthly | per-year intensity | share of 0–18 |
|---|---|---|---|
| **0–3 daycare (מעון)** | ~₪3,672 — **peak** | highest | ~21% |
| 3–6 preschool (גן+צהרון) | ~₪2,933 | high | ~18% |
| 6–12 primary | ~₪2,600 | lowest (subsidized) | ~30% (6 yrs) |
| 12–18 teens | ~₪2,640 | flat | ~31% (6 yrs) |

Two "heaviest" readings: **per-year** peaks at 0–3 (daycare); **by total share** primary+teens dominate (more years). Current daycare 0–3: official cap ~₪3,800–4,310/mo; private ₪3,000–5,500 (2026).

## 3. Post-18 (ADDITIONAL — excluded from the "to-18" totals)
- **Army 18–21:** parental top-up proxy ~₪1,500/mo → ~₪50K/3yr **[verify]**.
- **University 21–25:** tuition ~₪12,200/yr; parental support historically ~₪16,500/yr → ~₪50–150K/degree **[verify]**.
- **First-apartment help:** the big lumpy item — ~50–60% of young buyers get help, ~30% of value; dated ~₪300K, likely higher now **[verify]**. → treat as a separate optional toggle, not a smooth cost.

## 4. Modeling recommendation (implemented)
User enters **one total + end age**; model distributes via fixed per-year weights.
- **Default: ₪1,200,000, end age 18** (raise toward ~₪1.5M for a to-21/high-income scenario).
- **Per-year weights (0–18):** 0–3 **7%/yr**, 3–6 **6%/yr**, 6–12 **5%/yr**, 12–18 **5.2%/yr** (sum ≈100%; reproduces daycare-peak shape).
- **Optional to-25 tail** (only if extended): ~₪150K–450K (army + university + optional apartment gift as a separate toggle).

## [verify]
No official CBS/BoI total (figures are secondary/journalistic, 2017–2026, nominal, mixed cutoffs); exact 6–12 split derived arithmetically; post-18 army/university/apartment magnitudes from dated or low-trust sources. Confirm before shipping hard numbers.
