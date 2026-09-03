# Research: ביטוח סיעודי via קופת חולים & late-life care (LTC) modeling

Type: research
Status: resolved
Blocked by: —

## Question

The shulit review flags LTC (סיעוד) costs ~₪13–25K/mo, with private LTC insurance unavailable since 2019 — but most Israelis hold **collective nursing insurance via their קופת חולים**. Determine how much that offsets LTC, to decide whether/how to model a late-life care expense (item #5 from the review):

1. Cost of LTC in Israel (institutional vs home).
2. What the קופת-חולים collective nursing insurance pays — monthly benefit (₪/mo), duration (limited months vs lifetime), ADL/dependency trigger, waiting period, home vs institution.
3. Bituach Leumi's גמלת סיעוד contribution.
4. The residual out-of-pocket gap after insurance — is coverage usually enough, or a meaningful uncovered window?
5. The 2019 private-LTC change and current state of the collective health-fund insurance.
6. Modeling recommendation: model LTC at all? If yes, as a NET late-life expense (cost − benefit) over a limited window, with defaults + range.

Flag [verify].

## Context

From the shulit.com review (2026-08-31); the user specifically asked how קופת-חולים nursing insurance helps. Feeds the LTC decision (was review item #5). Resolved by a background research subagent.

## Answer

Full detail: **[LTC research](../assets/16-ltc-nursing-insurance.md)**. Direct answer to "how does the קופת-חולים insurance help?":
- It pays a real monthly benefit (home ₪3,200–5,000 / institution ₪4,500–10,000 by join age) **but only for 5 years (60 months) — not lifetime**, 60-day wait, institution = reimbursement capped 80%.
- **At home**, stacking with Bituach Leumi גמלת סיעוד (~₪7,400/mo top level, home-only) it can **nearly/fully cover** high-dependency care.
- **In institution** (~₪13–20K/mo) Bituach Leumi doesn't apply and the insurance runs out after 5 years → a residual gap ~₪4–12K/mo (rising to full cost after the cap).
- **Verdict: still worth modeling** — as a **modest NET late-life expense**, not the gross cost.
- **Recommended default:** a "late-life care" toggle adding **~₪6,000/mo (net) for ~4 years** at the plan tail (~ages 83–88); range ₪0–2K (covered at home) to ₪12–15K (institution post-cap). Feeds ticket 17.
