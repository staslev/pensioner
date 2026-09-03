# Tax treatment of היוון קצבה (Israeli pension commutation) — for the FIRE simulator

**Sourcing.** Load-bearing facts quoted from the official consolidated **פקודת מס הכנסה [נוסח חדש]** §§ 8(ג), 9(6), 9(7א), **9א**, 9ב (Hebrew Wikisource, reproducing Knesset PDFs; amended through תשפ"ה/2024–25; fetched 2026-08-28). Process/form facts from Hebrew Wikipedia "קיבוע זכויות". gov.il / רשות המסים / Kol-Zchut were bot-blocked → figures living only there flagged **[verify]**.

## Exemption schedule (confirmed verbatim from §9א(ז)) — 67% only from 2028

| Tax year | Exempt % | תקרת קצבה מזכה | Max exempt monthly annuity | הון פטור / basket (%×ceiling×180) |
|---|---|---|---|---|
| 2024 | **52%** | ₪9,430 | ₪4,903.6 | ₪882,648 |
| 2025 | **57%** | ₪9,430 | ₪5,375.1 | ₪967,518 |
| 2026 | **57.5%** | ₪9,430 | ₪5,422.25 | ₪976,005 |
| 2027 | **62.5%** | ₪9,430 | ₪5,893.75 | ₪1,060,875 |
| 2028+ | **67%** | ₪9,430* | ₪6,318.1* | ₪1,137,258* |

Conversion factor (מכפיל ההמרה להון) = **180**. \*2028 ceiling is re-set after 2027 — **[verify]**. Stale Hebrew-Wikipedia figure ₪5,183 for 2025 conflicts with the statute (57%×9,430 = **₪5,375**) — use the ordinance.

---

## The four commutation paths (each taxed differently)

### Path 1 — היוון קצבה מוכרת (recognized pension) — best treatment
- **קצבה מוכרת** (§9א(א)) = slice arising from **"תשלומים פטורים"** — contributions that got **no tax benefit going in** (already-taxed money): tagmulim above deductible caps, non-deductible עצמאי deposits, קופת גמל להשקעה deposits, §3(ה3) severance-as-wages.
- Monthly recognized pension is **tax-free from age 60** (§9א(ב1)); does **not** consume the §9א exempt basket.
- **Commutation (§9א(ה)(3)):** principal returns **tax-free**; only the pro-rata **investment gain** is taxed at a **flat 15% (nominal)**. Taxable profit = commuted × (balance − exempt payments) ÷ balance. No gains → 0 tax.
- **Model:** tax ≈ 15% × (gain fraction of the account); available from age 60; the cheapest capital to raise early.

### Path 2 — היוון the EXEMPT slice of the קצבה מזכה
- One shared **exempt-capital pot** = `exempt% × ₪9,430 × 180` (table). Spendable as monthly exemption, tax-free lump sum, or a mix.
- Tax-free commutation capped at the basket / יתרת ההון הפטורה (§9א(ה)(1)).
- **Taking the lump sum permanently cuts the monthly exemption** by `commuted ÷ 180` (§9א(ה)(2)): every ₪180,000 taken tax-free removes ₪1,000/mo of exemption for life. Fixed pot: capital now = less exempt income later.
- **Election:** Form **161ד ("בקשה לקיבוע זכויות")**, filed **≤90 days from first receiving the §9א exemption** (i.e. at retirement age). Locks exempt %, nets prior severance (×1.35), splits basket between monthly exemption and tax-free lump sum. **Irreversible.** Miss the window → forfeit the tax-free commutation (later commutation taxed at marginal rates); administrative default **[verify]**.

### Path 3 — commuting the TAXABLE slice
- Any commuted amount not covered by the basket (or if 161ד never filed) is **ordinary income** (§9(6)), but classified as **הכנסה מיגיעה אישית** → §121 marginal rates **with credit points/brackets applying**.
- **פריסה (§8(ג)(3)) — up to 6 years:** backward (up to 6 tax years ending in receipt year) or forward (Director's approval; practice ~1 yr per 4 yrs accrual, capped 6, annual filings — **[verify]** the ratio). Spreading fills lower brackets and multiplies annual credit points N times → materially lower effective rate, **especially for an early retiree with little other income** in those years.
- **No separate residual commutation exemption** — תיקון 190 folded the old "מענק היוון פטור" into the unified basket. (§9ב separately/fully exempts commutation of an *already-exempt* "other" annuity; niche disability/injury cases remain exempt.)

### Path 4 — §9ב (already-exempt annuity)
- "סכום המתקבל עקב היוון קיצבה פטורה … פטור ממס." Niche.

---

## Constraints & interactions

- **Minimum-pension floor (סכום קצבה מזערי):** commute only **down to** the floor — must retain ≥ the minimum monthly pension as a lifelong annuity (if total < floor, generally no partial commutation; a very small pension may be fully commuted under a separate low-threshold rule — **[verify]**). Capital Market Authority figure, annually updated: Hebrew-Wikipedia cites **₪4,850 (~2023)**; **₪5,012 (2024) / ₪5,306 (2026)** are consistent updates — **[verify]** against the regulator.
- **×1.35 severance offset — confirmed from statute arithmetic (§9א(ג)):** מקדם = (0.35 × 9,430 × 180) ÷ (13,750 × 32) = 594,090 ÷ 440,000 = **1.3502**. Each ₪1 of previously tax-exempt severance (in the ~32 yrs before גיל הזכאות) shrinks the exempt-capital basket by ~₪1.35 (indexed); stable at ~1.35 through 2027 (both inputs frozen). Exempt-severance ceiling **₪13,750/yr 2024–2027** (§9(7א)(א)(2)).
- **Age gates — the key FIRE nuance:**
  - **קצבה מוכרת:** monthly amount **and** favorable commutation available from **age 60** (§9א(ב1)(1)).
  - **קצבה מזכה exemption + exempt commutation:** only from **statutory retirement age** (67 men; women 62+4mo→65) — "גיל הזכאות = גיל הפרישה או הגיל שבו החל לקבל קצבה מזכה, לפי המאוחר." Early-retirement exception only for ≥75% permanent disability.
  - **Consequence:** you can *annuitize from 60*, but a qualifying-pension annuity drawn at **60–66 is fully taxable at marginal rates with NO §9א exemption until 67**. The 90-day 161ד clock starts at retirement age, not 60.

---

## FIRE-modeling implications (per option)

- **(a) Full annuity, no היוון:** max monthly exemption = `exempt% × 9,430` from retirement age (₪5,422/mo in 2026), less ×1.35 severance offset ÷ 180; recognized-pension slice tax-free from 60. *Pitfall:* no exemption until statutory age; qualifying pension fully taxable 60→67; basket never monetized as capital.
- **(b) Partial היוון of the exempt slice:** net lump sum tax-free up to the (offset-reduced) basket, but monthly exemption falls by `commuted ÷ 180` for life. Fixed pot split. *Pitfalls:* 161ד within 90 days; irreversible; ×1.35 offset can zero the basket; floor caps the pull.
- **(c) Commuting a recognized pension:** ≈ full principal tax-free + gains at 15% (nominal); available from 60; doesn't touch the basket → usually the cheapest early capital. *Pitfalls:* only the "תשלומים פטורים" slice qualifies; identify gains fraction; unmatched severance origin (§9א(ה)(4)→§9(7א)(ז)) can reclassify as taxable severance.
- **(d) Commuting the taxable slice with פריסה:** net = gross − marginal tax, with פריסה over up to 6 yrs cutting the effective rate — powerful for a low-other-income early retiree. *Pitfalls:* forward פריסה needs approval + annual filings; no exemption before statutory age.

**Cross-cutting model rules:** (1) one exempt-capital pot governs both monthly exemption and exempt commutation (÷180 both ways); (2) subtract 1.35 × indexed prior exempt severance from the basket first; (3) respect the minimum-pension floor as a hard cap on convertible annuity; (4) gate the §9א exemption at statutory age while allowing the recognized-pension slice (monthly + commutation) from 60; (5) use the deferred 52/57/57.5/62.5/67 schedule, not 67% from 2025.

**2026 illustration (57.5%, ₪9,430):** basket = 0.575×9,430×180 = **₪976,005**; with ₪100k prior exempt severance → יתרת ההון הפטורה ≈ 976,005 − 1.35×100,000 = **₪841,005** → monthly exemption if fully annuitized ≈ 841,005/180 = **₪4,672/mo**. Commute ₪300,000 tax-free → exemption drops 300,000/180 = ₪1,667 → **~₪3,005/mo** retained.

## [verify] against live רשות המסים / רשות שוק ההון
Current minimum-pension floor (₪5,012 2024 / ₪5,306 2026); exact forward-פריסה ratio; administrative default when 161ד isn't filed; 2028 קצבה מזכה ceiling.
