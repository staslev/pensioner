# Israel FIRE Simulator — Design Briefing on Local Financial Instruments & Rules

**Scope & vintage:** Figures current for ~2024–2026. Where a value changes yearly the year is given. Verified against Kol Zchut (kolzchut.org.il), Bituach Leumi (btl.gov.il), the Israel Tax Authority (27-Jan-2025 guidance), Calcalist, Trading Economics/CBS. Items not confirmed against a live primary source are flagged **[verify]** (Tax Authority and Bank of Israel sites are bot-protected).

Complexity legend: **Simple** = plug-in rate/threshold; **Medium** = year-varying tables or conditional logic; **Hard** = path-dependent / interacts with other accounts / individual.

---

## 1. Pension (פנסיה / קרן פנסיה)

**What it is.** Mandatory retirement savings governed by the pension expansion order; accumulates in a new comprehensive pension fund and converts to a lifetime monthly annuity (קצבה) at retirement. Bundles old-age savings, disability, survivor coverage.

**Key numbers (2024–2026).**
- **Contribution rates (since Jan 2017):** employee **6%** + employer tagmulim **6.5%** + employer severance **6%** = **18.5%**. Employer may top up severance to **8.33%** under §14.
- **Salary base ceiling:** up to the **average national wage = 13,769 ILS/month (Jan 2026)** (drifts yearly). Salary above is not covered by the mandatory order.
- **Management fees, new comprehensive fund:** legal max **6% of deposits + 0.5% of assets/yr**. Default funds (Altshuler Shaham, Meitav, Infinity, Mor; tender 1-Nov-2021→31-Oct-2028) capped at **1% of deposits + 0.22% of assets**. Market average **[verify]** (פנסיה נט portal).
- **Annuity coefficient (מקדם המרה):** monthly pension = balance ÷ coefficient (e.g. 1,000,000 ÷ 200 = 5,000/mo). Typical at 67: **~161–180 single-life male, ~180–215 with survivor/guarantee**; women higher. Indicative.
- **Coefficient guarantee:** since a 2012 circular (eff. Jan 2013), **new pension-fund savers get NO guaranteed coefficient** — set at retirement from then-current mortality tables (longevity risk on saver). Guaranteed only in pre-2013 manager's-insurance or purchased from age 60 in insurance products.
- **Early annuitization from age 60 (verified against חוק גיל פרישה §5):** a saver may begin drawing the old-age **annuity from age 60** (both sexes) — statutorily *early retirement (גיל פרישה מוקדם)*, at an **actuarially reduced** benefit (fewer contribution years + higher conversion coefficient). This is *before* statutory age 67. **Tax gate (see the commutation briefing):** the §9א exemption on the *qualifying* pension applies only from **statutory age (67)** — a 60–66 qualifying-pension annuity is **fully taxable at marginal rates**; only the *recognized-pension (קצבה מוכרת)* slice is tax-free at 60.
- **Lump-sum (היוון) is capped by a minimum-pension floor (סכום קצבה מזערי; Supervision of Financial Services (Provident Funds) Law §23):** capital may be commuted to cash only while the retained lifelong monthly annuity (all sources) stays **≥ the floor: ~₪5,012/mo (2024) → ~₪5,183 (2025) → ~₪5,306 (2026)**, CPI-indexed. Only *surplus* capital above the floor is withdrawable; below it, the balance is locked into a lifelong stream. Small-accumulation exception (סכום צבירה מזערי): total below **~₪110,250 (2026)** may be taken whole.
- **Non-annuity / "unlawful" withdrawal (משיכה שלא כדין):** taxed at **the higher of 35% or marginal rate** (Income Tax Regs. reg. 3(1) + Ordinance §87(d)).
- **Severance component (פיצויים):** *not* age-gated — accessible on **leaving employment at any age**; tax-exempt up to **₪13,750/yr of service (2026)** [2024/25 [verify], widely reported same], excess at marginal rate. Options: withdraw, רצף פיצויים (roll forward), or רצף קצבה (leave to become annuity).
- **Annuity taxation (קצבה מזכה):** recognized-pension ceiling **9,430 ILS/month, frozen 2024–2026**. Exemption rate (§9א / תיקון 190; the original jump to 67% in 2025 was re-phased): **52% (2024) → 57% (2025) → 57.5% (2026) → 62.5% (2027) → 67% (2028+)**. Tax-free monthly pension ≈ **4,904 (2024), 5,375 (2025), 5,422 (2026), 6,318 (2028)**. Above the exempt slice: ordinary marginal rates. **Cross-verified** (finka calculator + gov.il basket mechanism; the ×180 basket arithmetic ties out: 57%×9,430×180 = ₪967,518 for 2025). **Caveat: do NOT revert the 2025 max-exempt to ₪5,183 — that Hebrew-Wikipedia figure is stale/incorrect; the correct value is ₪5,375** (and ₪5,183 is coincidentally the *minimum-pension floor*, a different number).

**Effect on a projection.** The private-pension **annuity can begin at age 60** (reduced), so for an early retiree it is an income floor from **60, not 67** — the self-funded bridge to *this* floor ends at 60. "Illiquid until 60" is too strong: before 60, tagmulim can be reached at a ~35%+ penalty, and the severance slice is reachable as a lump sum on leaving work. But the bulk stays locked into a lifelong annuity (only surplus above the ~₪5k/mo minimum-pension floor is cashable). Coefficient converts balance to monthly income; exempt slice sets net. **NB: this corrects an earlier framing that treated the pension as dead until ~67.**

**Complexity: Hard.** Contribution rate Simple; coefficient (age/gender/survivor, non-guaranteed) and annuity tax Hard: exemption interacts with prior severance via the **rights-fixing (קיבוע זכויות, Form 161ד) severance-offset** — the exempt-capital basket (rate × ceiling × 180; e.g. 57% × 9,430 × 180 ≈ 967,518 in 2025) is reduced ~1.35× per shekel of tax-exempt severance taken during the career. The headline exemption is a per-person max, not universal.

---

## 2. Keren Hishtalmut (קרן השתלמות)

**What it is.** The most tax-privileged liquid medium-term savings vehicle. Employee + employer contribute; after 6 years, tax-free for any purpose.

**Key numbers (2024–2026).**
- **Employees:** employee ≤ **2.5%** + employer ≤ **7.5%** of salary (employer ≤ 3× employee). Tax-exempt only up to **salary ceiling 15,712 ILS/month (188,544/yr), frozen**. Above: employer deposit taxed as salary, growth loses CGT exemption.
- **Self-employed:** deduct ≤ **4.5% of income** vs income ceiling **293,397 ILS (frozen)** → max deduction ≈ 13,203. Tax-exempt-growth deposit ceiling: **20,520 (2024–25) → 20,566 (2026)**.
- **Withdrawal:** **6 years** → entire balance (principal + gains) **tax-free, any age/purpose**. **3 years** → for education, or any purpose at retirement age. Early withdrawal: gains taxed at marginal rate, employer contributions taxed as income.
- **Returns (nominal, net of fees):** general ~12.8–13% and equity ~21.7–22% in 2024. **10-yr (~2015–25): general ≈ 5.9%/yr, equity ≈ 10.1%/yr.** 2023 general ≈ 9.4%.

**Effect on a projection.** The FIRE bridge workhorse: **6-year tax-free withdrawal** means gains escape 25% CGT → effective return beats a taxable brokerage account. Capped, so caps out as a share of net worth. Model as a tax-free sleeve tappable during bridge years.

**Complexity: Medium.** Ceilings Simple; 6-year rolling clock and tax-free-vs-taxable add logic.

---

## 3. Kupat Gemel Lehashkaa (קופת גמל להשקעה)

**What it is.** Flexible, fully liquid investment account in the pension-fund tax wrapper (~2016). Self-funded, no employer.

**Key numbers (2024–2026).**
- **Annual deposit ceiling per person (indexed):** **79,006 (2024) → 81,711 (2025) → 83,641 (2026) ILS**.
- **Tax:** **no deduction in.** Lump-sum withdrawal: **25% CGT on real (CPI-adjusted) gain**, withheld at source. Converted to annuity after **age 60: entire annuity (incl. gains) income-tax-exempt** (standout benefit).
- **Liquidity:** fully liquid, any time, no penalty (only tax on gains); loans up to 80%.

**Effect on a projection.** Liquid sleeve. Deposit cap limits sheltering, but **age-60 tax-free annuity conversion** is a real lever (0% vs 25% on gains). Model as liquid capital with 25% real-gains drag on lump-sum draws, or tax-free annuity branch at 60+.

**Complexity: Medium.** Ceiling and 25%-on-real-gains Simple; annuity-conversion branch and real-gain basis add logic.

---

## 4. Bituach Leumi Old-Age Allowance (קצבת זקנה / קצבת אזרח ותיק)

**What it is.** Universal state old-age pension (National Insurance) — a flat, means-adjacent floor, not earnings-related.

**Key numbers (eff. 1-Jan-2026).**
- **Single:** **1,838 ILS/month** (<80), **1,941** (80+).
- **Couple (one qualifier + dependent spouse):** **2,762** (<80) / **2,865** (80+). If **both spouses independently qualify, each gets their own** (~2 × 1,838 ≈ 3,676), not 2,762.
- **Seniority increment (תוספת ותק):** **2%/insured year, max 50%**. Deferral increment: **5%/yr** deferred due to work income before 70.
- **Retirement age (גיל פרישה):** **men 67**; **women rising 62 → 65** by cohort (65 for women born Jan-1970+).
- **Age vs income test:** between retirement age and **70**, subject to an **income test on work income** (**pension income excluded**). **From 70, paid regardless of income.**

**Effect on a projection.** Modest, inflation-linked, guaranteed lifetime floor beginning at statutory age. With the pension annuity, the portfolio need not fund 100% of late-life spending → relaxes post-67 withdrawal math. Pre-70 income test matters for FIRE-ers keeping earned income.

**Complexity: Medium.** Base amounts Simple; male/female age divergence, 2%/yr seniority, couple-vs-two-individuals, pre-70 income test are wrinkles.

---

## 5. Taxation

**What it is.** Investment income mostly at flat final rates; earned income progressive; distinctive **real (inflation-adjusted) basis** for capital gains/interest.

**Key numbers (2024–2026).**
- **Securities capital gains: 25%** on the **real gain** (shekel assets reduced by CPI; foreign-currency assets measured in that currency, so ILS devaluation vs USD untaxed). **30% for significant shareholder (10%+).**
- **Dividends: 25%** (30% sig. shareholder). **Interest: 25% real** on index-linked, **15% nominal** on non-linked shekel instruments.
- **Marginal brackets — 2024 & 2025 identical (frozen):** 10% ≤84,120; 14% ≤120,720; 20% ≤193,800; 31% ≤269,280; 35% ≤560,280; **47% >560,280** (annual ILS). **Passive income generally starts at 31%** (10/14/20 for earned income; exception 60+). 2026 widened middle bands.
- **Surtax (מס יסף): 3%** on income >**721,560 ILS/yr (frozen through 2027)**. **New 2025: extra 2%** on capital/passive income above the same threshold → **combined 5%** (top CGT can reach 30%).
- **Credit points (נקודות זיכוי): 242 ILS/month = 2,904/yr per point (2024–26)**. Resident 2.25 points, woman 2.75 (+children). **Offset income tax on earned income ONLY — do NOT reduce flat 25%/30% on capital gains/dividends/interest.** Shields ~first 5,000–5,500 ILS/month of ordinary income for a single resident.

**Effect on a projection.** 25% real-gains is the biggest tax lever on a taxable sleeve; **real basis is FIRE-friendly** (inflation erodes the taxable portion; foreign gains shielded from ILS depreciation). A retiree living off withdrawals gets **little benefit from credit points/low brackets** — a common user error.

**Complexity: Hard.** Flat rates Simple; real-vs-nominal basis (needs CPI/FX series), foreign-currency rule, passive-income bracket floor, 2025 surtax split, and credit-points-don't-apply-to-CG are Hard.

---

## 6. Real Estate

**What it is.** Owner-occupied and rental residential property; three mutually exclusive rental tax tracks; BoI mortgage rules.

**Key numbers.**
- **Rental income — three tracks (residential):**
  1. **Full exemption:** ceiling ≈ **5,654 ILS/mo (2024 confirmed; 2025/26 [verify])**. Above: partial — adjusted ceiling = 2 × ceiling − actual rent; excess at marginal rates; if rent ≥ 2× ceiling, exemption fully lost.
  2. **10% flat:** **10% on gross rent from first shekel**, no deductions (depreciation deemed taken on future sale).
  3. **Marginal-rate:** marginal rate (**min 31%, or from 10% if 60+**), allows expenses, financing interest, ~2%/yr depreciation.
- **Mortgage (BoI):** max **LTV 75%** first/only home, **70%** replacement **[verify]**, **50%** investment (75%/50% verified). Max **PTI ~50%** **[verify]**; term **~30 yr**; **≥1/3 fixed-rate** **[verify — Directive 329]**.
- **Rates:** **BoI 3.50% (Jul-2026), prime ≈ 5.00%**. 2023–24 much higher (BoI ~4.75%, prime ~6%) → regime-dependent.

**Effect on a projection.** Common FIRE income source; **track choice materially changes net yield** → user toggle. Mortgage changes leverage and prime-linked cost. Primary residence removes rent from expenses but ties up capital.

**Complexity: Medium–Hard.** Track selection + partial-exemption formula Medium; proper mortgage amortization (fixed/prime/variable tranches) Hard, Simple if approximated as fixed payment.

---

## 7. Inflation & Market Assumptions

**Key numbers.**
- **BoI inflation target: 1–3%/yr.** Dec/Dec CPI: 2021 ≈ 2.8%, 2022 ≈ 5.3% (peak), 2023 ≈ 3.0%, 2024 ≈ 3.2%, 2025 ≈ 2.6%, mid-2026 ≈ 1.5%. Long-run ~2–3%.
- **ILS/USD:** Most Israeli FIRE portfolios are globally diversified (S&P 500 / MSCI World) → ILS wealth swings with FX. Foreign-asset gains computed in foreign currency (FX untaxed) but real volatility for a shekel spender. Hedged-vs-unhedged debated.
- **Return assumptions commonly used:** general/balanced ~**5–7% nominal (~3–4% real)**; equity/global-index ~**7–10% nominal (~5–7% real)**.

**Complexity: Simple–Medium.** Single real-return Simple; ILS/USD volatility + CPI-linked taxation Medium.

---

## 8. The "Number" / Safe Withdrawal Rate

**Key points.**
- Israeli FIRE community (blog **הסולידית / The Solidit**) frames the 4% rule as **"כלל ה-300"** (300 × monthly = 25 × annual).
- Used as **anchor, not gospel**: ~7% real returns ≠ 7% safe withdrawal; **long horizons (40–50 yr) push the safe rate toward ~3.5% floor**; critics argue 2–3% (×400–600). Sequence-of-returns risk in the first decade dominates.
- **Tax + fee drag** raise the required multiple (25% real-gains + fees) — partly offset by tax-free sleeves (Keren Hishtalmut, gemel annuity).
- **Pension + Bituach Leumi floors → a STAGED bridge with two endpoints:** (1) the portfolio fully funds FIRE-age → **age 60**, when the private-pension annuity can begin (reduced); (2) the **Bituach Leumi old-age allowance** stacks on later at **statutory age** (~67 men / up to 65 women; unconditional at 70). So the required portfolio draw steps *down twice*, not once. This permits a higher early-phase withdrawal than a flat perpetual 4% — **key design point**. *(Bridge framing is standard in the community; exact quantified numbers were not confirmed against a primary source — treat as own modeling.)*

**Effect on a projection.** The headline output. Should NOT apply a single flat SWR; model two phases with floors switching on and withdrawals taxed at 25% real.

**Complexity: Hard.**

---

## Cross-Cutting: Biggest Sources of Modeling Error / User Confusion

1. **Pension annuity taxation is a glide path + per-person severance offset (קיבוע זכויות)** — the single most error-prone, genuinely individual number.
2. **Credit points do NOT reduce capital-gains tax** — users wrongly assume their tax-free ordinary allowance shelters withdrawals.
3. **Real (inflation-adjusted) capital-gains basis** — most calculators assume nominal; Israel taxes CPI/FX-adjusted gain.
4. **The illiquidity wall (nuanced, verified).** The pension *annuity* CAN start at 60 (reduced) → it IS a floor from 60, not dead until 67. But the bulk is locked into a lifelong annuity (only surplus above the ~₪5k/mo minimum-pension floor is cashable), and pre-60 tagmulim access costs a ~35%+ penalty. Conflating net worth with spendable capital before 60 still overstates early feasibility — but treating the pension as dead until 67 *understates* it.
5. **Coefficient/longevity risk is on the saver** (no guarantee since 2013).
6. **Frozen vs indexed thresholds** — several frozen 2024–26 (brackets, surtax, credit-point value, recognized-pension ceiling, keren hishtalmut salary ceiling); others index up (gemel cap, average-wage base). Indexing all or none drifts.
7. **Couple vs two-individuals for Bituach Leumi**, and the pre-70 income test.

## Power-User Nuances vs "Everyone Needs This"

**Everyone needs (credible baseline):** pension contributions (18.5%) + annuity floor (can begin at **60**, reduced); keren hishtalmut as 6-yr tax-free bridge sleeve; 25% real CGT on taxable sleeve; Bituach Leumi flat late-life floor; two-phase (bridge vs post-67) withdrawal with sub-4% SWR anchor; single real-return + inflation assumption.

**Power-user nuances (advanced toggles):** קיבוע זכויות severance offset (161ד); gemel age-60 tax-free annuity vs 25% lump-sum; 2025 extra-2% surtax + 30% sig.-shareholder; real-vs-nominal & ILS/USD FX on foreign gains; rental track selection + mortgage tranche modeling (≥1/3 fixed, prime path); non-guaranteed coefficient / longevity sensitivity.

**Flagged for a final human check against primary .gov.il pages before shipping numbers:** 2025/26 rental-income exemption ceiling; replacement-home LTV (70%); PTI 50% cap, 30-yr term, 1/3-fixed rule (BoI Directive 329); typical negotiated (non-default) pension management fee; the quantified bridge-withdrawal claim in §8.
