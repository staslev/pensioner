# LTC (סיעוד) in Israel — cost, health-fund insurance, and modeling — research

Sources: kolzchut, btl.gov.il, Ynet (fetched Aug 2026). [verify] flags noted.

## Cost of LTC
- Private nursing institution (מוסד סיעודי): **~₪6,000–20,000/mo** (families sometimes "tens of thousands"). The cited ₪13–25K is a plausible institutional mid-high range **[verify]**.
- Home care, foreign live-in caregiver: **~₪7,500–9,000/mo** all-in (min wage ₪6,444/mo from 4/2026 + social costs + room/board).
- (דיור מוגן luxury ₪10–20K/mo + large deposit — not סיעודי.)

## קופת-חולים collective nursing insurance (the one most Israelis hold) — key
Basic tier, effective 01.01.2024:
| Join age | at home | in institution |
|---|---|---|
| ≤49 | ₪5,000/mo | ₪10,000/mo |
| 50–59 | ₪4,100 | ₪6,500 |
| 60+ | ₪3,200 | ₪4,500 |
- **Duration: 5 years (60 months) only — NOT lifetime.** ← the critical limit.
- 60-day waiting period; trigger = mental frailty or ≥3/6 ADLs.
- Home = fixed cash; institution = reimbursement capped at 80% of actual.
- Extended (15-yr) tier & top-ups **frozen to new buyers ~Dec 2023**.

## Bituach Leumi גמלת סיעוד
- **Home/community only** (does NOT fund institution). Retirement age + ADL test + income test. Paid as care hours; top level 6 ≈ 30 hrs/wk ≈ **~₪7,400/mo** equivalent; lower levels less.

## Residual out-of-pocket gap
- **At home:** foreign caregiver ~₪7.5–9K/mo − Bituach Leumi (up to ~₪7.4K) − health-fund cash (₪3.2–5K) → **can nearly/fully cover** for high dependency; partial in mid-level years.
- **Institution:** ~₪13–20K/mo − health-fund reimbursement (₪4.5–10K, **5 yrs only**), Bituach Leumi doesn't apply → gap **~₪4–12K/mo for 5 yrs, then the full ₪13–20K/mo after the cap** if the person lives longer. MoH "code" subsidizes placement but is **means-tested** (resident+spouse+adult-children income; no public flat ceiling [verify]).

## 2019 change
Private individual LTC policies stopped being sold ~2019; the **health-fund collective insurance remains in force and is still sold** — now the de-facto LTC coverage.

## Modeling recommendation (deterministic)
Model LTC as a **modest NET late-life expense** (cost − expected benefits), not the gross cost — else it badly overstates the burden for a typical insured Israeli.
- **Default: ~₪6,000/mo (today's ₪) for ~4 years** near end of life (~ages 83–88). Approximates the institutional gap during the insured window + partial home gaps.
- **Sensitivity range: ₪0–2,000/mo** (benefits ≈ cover home care) **to ₪12,000–15,000/mo** (institution, post-5-yr cap, long survival, disqualified from MoH subsidy).
- **Shape:** a single "late-life care" toggle adding the NET monthly expense for N years at the plan tail; default ON ~₪6K/4yr, adjustable; reducible to ~0 if the user ages at home with coverage.
- **Highest-uncovered risk to surface:** a long institutional stay beyond the 5-year cap for an asset-rich household (disqualified from subsidy) — a high-end stress.

## [verify]
Exact ₪13–25K institutional figure; all-in caregiver total; MoH-code co-payment ceiling (means-tested, no public flat rate).
