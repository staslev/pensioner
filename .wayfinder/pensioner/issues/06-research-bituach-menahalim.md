# Research: ביטוח מנהלים (manager's insurance) — modeling parameters

Type: research
Status: resolved
Blocked by: —

## Question

Establish, with primary sourcing, what the engine needs to model **ביטוח מנהלים** as a variant of the pension bucket — where it matches קרן פנסיה and where it differs:

1. **What it is & how it differs** from קרן פנסיה (insurance-based pension vs. mutual pension fund).
2. **Guaranteed annuity coefficient (מקדם קצבה מובטח):** which vintages carry it, typical guaranteed values vs. current non-guaranteed pension-fund coefficients, and the FIRE value of the guarantee.
3. **Capital vs annuity track (מסלול הוני vs. קצבתי):** old policies paying a lump sum (הון) vs. annuity; the 2008 reform (תיקון 3) cutoff and any earlier ones (pre-2001 "עדיף"); tax treatment of the capital lump sum.
4. **Fees:** typical management fees vs. pension funds.
5. **Tax:** is the annuity/commutation treatment identical to קרן פנסיה (§9א, קצבה מזכה/מוכרת, the four commutation paths), or are there ביטוח-מנהלים-specific nuances (e.g. פוליסות עדיף with a הון component)?
6. **Accumulation:** contribution structure; how balances grow; risk-component (life/disability) drag on savings.
7. **Vintage cutoffs that matter** (pre-2001, 2001–2008, 2008–2013, post-2013) and what changes at each.
8. **FIRE-modeling implication:** which attributes the engine needs (guaranteed coefficient? + value, track, fee level) and exactly when it behaves like an annuity floor vs. like liquid capital (capital track). What can Core safely ignore vs. what a Power user must set.

Prefer primary sources (רשות שוק ההון, פקודת מס הכנסה, kolzchut); flag anything not confirmable against a live primary page as [verify].

## Context

Added to scope when the user flagged that ביטוח מנהלים was missing from the instrument set (2026-08-28). Blocks ticket 02 (engine spec) — the pension-bucket formulas need these parameters.

## Answer

Confirmed against primary sources (חוזר ביטוח 2012-1-5, kolzchut). Full detail + tables: **[ביטוח מנהלים research](../assets/06-bituach-menahalim.md)**. Model it as a **Power-tier variant of the pension bucket** with 4 knobs; annuity tax (§9א) is **identical** to a pension fund → no separate tax logic. Key facts:

- **Guaranteed coefficient (מקדם מובטח):** only pre-2013 policies (ended by חוזר 2012-1-5, eff. 1 Jan 2013; exception: sold to 60+). **"Guaranteed" ≠ better** — only **pre-2001** policies (~145–166) carry a real edge (**+11% to +38%** on the annuity); 2001–2012 guaranteed (~200) is no better than today's non-guaranteed, just higher-fee. **The value matters, not the flag.**
- **Capital (הון) track:** pre-2008 grandfathered balance = **liquid, largely tax-free lump sum at 60**, NOT an annuity floor (תיקון 3, annuity-only from 1 Jan 2008; 35% penalty on post-2008 non-annuity withdrawal).
- **Fees:** materially costlier — ~0.8% balance + 2% deposits vs pension ~0.17% + 1.7%.
- **Behavior selector:** annuity floor when (guaranteed) OR (post-2008 track); liquid capital when (pre-2008 capital/הון).
- **Now a legacy vehicle** — new sales effectively closed since Sept 2023.
- **Core** can ignore it (default plain non-guaranteed pension); **Power** sets guaranteed-flag+value, track, fee, vintage.

**[verify]:** תיקון 3 citation, historical exemption stages, latest CMA fees, קיזוז formula, age-55-vs-60 (primary says 60).
