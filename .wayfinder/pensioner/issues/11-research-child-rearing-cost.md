# Research: Israeli child-rearing cost (total + age-cost curve)

Type: research
Status: resolved
Blocked by: —

## Question

To model child expenses as a **total sum amortized over an age-cost curve** (ticket 10, option B), establish with sourcing:

1. **Total cost of raising a child in Israel** — the commonly-cited figure (user mentioned ~₪1.5M), what age it runs to (0–18? 0–21?), the source, and a plausible range. Real vs nominal.
2. **Distribution by age/stage** — how the cost splits across infancy/daycare (0–3), preschool (3–6), primary (6–12), teens (12–18), so we can build a normalized age-cost curve. Which stages are heaviest.
3. **Post-18 / university / army** — typical parental support cost during army (~18–21, usually low) and university / first-apartment (often significant), and whether the ₪1.5M includes it.
4. **Modeling recommendation** — a simple curve (e.g., a few age-band weights summing to the total) adequate for a deterministic model, plus a defensible default total and end age.

Flag anything not confirmable against a live source as [verify].

## Context

Feeds ticket 10 (child expenses). User's design call (2026-08-30): single total input, curve-amortized — the total dominates feasibility, the curve is for honesty + the funding-bars visual. Resolved by a background research subagent.

## Answer

Full detail: **[child-rearing cost research](../assets/11-child-rearing-cost.md)**. Key points:
- No official CBS/BoI total. **Typical birth-to-18 single child ≈ ₪1.1–1.3M**; the **~₪1.5M** the user cited is the **top-decile / to-21** figure. Low ~₪0.6M (direct-only); a 2nd child ~20% cheaper.
- **Age curve:** per-year cost peaks in **daycare (0–3)** and stays high through **teens (12–18)**, dips in subsidized primary. Recommended per-year weights: **0–3: 7%, 3–6: 6%, 6–12: 5%, 12–18: 5.2%** (sum ≈100% of the total over 0–18).
- **Default: ₪1.2M, end age 18.** Post-18 (army/university/apartment) is **additional** — optional to-25 tail ~₪150K–450K, apartment gift as a separate toggle.
- All figures **nominal, secondary/journalistic, mixed cutoffs → [verify]** before shipping.

**Implemented in the prototype:** per-child input = current age + total (default ₪1.2M), amortized over the 0–18 age-curve weights; funding bars now show the daycare/teen-peaked shape.
