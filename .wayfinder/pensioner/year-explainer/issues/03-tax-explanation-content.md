# Synthesize the 60+ annuity-tax explanation content (מס שולי / מזכה / מוכרת, per path)

Type: research
Status: resolved
Blocked by: —

## Answer

Panel-ready explanation content delivered: [asset 03](../assets/03-tax-explanation-content.md) — intro, one section per concept (מס שולי / קצבה מזכה / קצבה מוכרת) with a UI-note + exact rule + key figures, a per-path table (wait67 / annuitize60 / commute60), and a faithful-vs-simplified caveats list. Sources cited inline.

**Rules confirmed:** מס שולי = 2024/25 brackets 10→47% minus 2.25 resident credit points (₪242/mo/pt; offsets ordinary income only, not CGT). §9א exempt = `exemptPct(year) × min(monthly, ₪9,430 ceiling)`, ceiling frozen-nominal/real-eroding, rate schedule 52/57/57.5/62.5/**67% (2028)** — *not* 67% from 2025; **statutory-age gate** confirmed (60–66 qualifying annuity fully taxable). קצבה מוכרת = monthly tax-free from 60 (§9א(ב1)(1)); commutation returns principal free, gain flat **15% nominal** (§9א(ה)(3)).

**Verification caveat:** both flagged nuances are quoted from פקודת מס הכנסה §9א via the parent map's local asset 05 (Wikisource); independent live re-checks (kolzchut / Wikisource / gov.il) hit 404s / bot-blocks / non-resolving host — the same walls prior research hit — so both stay **[verify]-against-live-source**. Also flagged the stale ₪5,183 (2025) figure Wikipedia still shows (correct ₪5,375 = 57%×9,430; ₪5,183 is coincidentally the minimum-pension floor).

**Engine faithfulness (precise):** *Faithful* — §9א statutory-age gate, exempt-slice formula + rate schedule, progressive brackets minus 2.25 credit points, cap erosion, 25% real CGT, tax-free keren/Bituach Leumi. *Simplified/absent* — commute60 is a crude 30%-lump/95%-net proxy (no four היוון paths, no minimum-pension floor, no ÷180 basket, no ×1.35 severance offset, no 161ד/פריסה); **no קצבה מוכרת slice tracked at all** (whole pot treated as qualifying → overstates 60–66 tax for anyone with a real recognized slice); commutation doesn't reduce the monthly exemption; no מס יסף; early-annuitization reduction only via smaller pot + coefficient drift, not an explicit factor.

## Question

Produce the **canonical plain-Hebrew explanation content** for how a retirement year's annuity is taxed at 60+, structured for the explainer panel. Must cover, clearly and correctly:

- **מס שולי** (marginal income tax) — how the progressive brackets + credit points apply to the taxable slice.
- **קצבה מזכה** (qualifying pension) — the §9א exemption, its ceiling, the **statutory-age gate** (a 60–66 annuity is fully taxable), and the exempt-rate schedule rising to 67% by 2028.
- **קצבה מוכרת** (recognized pension) — principal tax-free from 60, only the gain taxed (flat 15%).
- How each **withdrawal path** (wait67 / annuitize60 / commute60) differs in what gets taxed and when.
- **Honest caveats**: which of the above the *current engine* actually models vs simplifies (esp. commute60's 30% proxy and the absent real מוכרת slice).

Draw primarily on the parent map's completed research — [research 05](../../issues/05-research-hivun-kitzba-tax-paths.md), [06](../../issues/06-research-bituach-menahalim.md), [01](../../issues/01-research-israeli-rates-rules.md), [13](../../issues/13-research-nominal-cap-erosion.md) — plus primary .gov.il sources for anything they don't cover. Deliver as an asset (`../assets/03-tax-explanation-content.md`): the structured content + short Hebrew note text per concept + a caveats list.

## Context

AFK research; unblocks the prototype (04). Consult `research`. Source of truth is mostly local (parent research assets); verify the statutory-age-gate nuance and the 15%-on-gains recognized-pension rule against primary sources. Fired as a subagent at charting time.
