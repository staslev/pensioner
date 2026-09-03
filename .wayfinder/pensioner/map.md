<!-- wayfinder:map -->
# Pensioner Retirement Simulator — spec & prototype

## Destination

A **build-ready spec** for a fully client-side, zero-persistence early-retirement simulator for **Israel** — Hebrew-first / RTL, a **deterministic** projection engine, the full Israeli instrument set delivered in **Core + Power** tiers — **plus** a validated interactive **UX prototype** of the key screens (input + results) that proves the "visually intuitive" bar. The destination stops at spec + prototype; it is not the full production app.

## Notes

**Domain:** early-retirement (FIRE) financial planning, Israel-specific. See `../../CONTEXT.md` for the glossary.

**Mode:** planning phase complete → **now building (execution override, 2026-08-31).** The destination is redrawn to include the build. The spec (`assets/02-engine-spec.md`), `CONTEXT.md`, and the research tickets are the build's source of truth; the `.scratch` HTML prototype is **superseded** by the real app in `src/` (React+TS+Vite, tested TS engine core). Earlier tickets resolved *decisions*; remaining work is implementation.

**Skills every session should consult:** `grilling` + `domain-modeling` for decision tickets; `prototype` for UX tickets; `research` for fact tickets.

**Standing preferences (settled while charting — not tickets):**
- Destination = spec + validated prototype, not production app.
- Hebrew-first, RTL; i18n-ready architecture but v1 is Hebrew-only.
- Deterministic engine only — no Monte Carlo / probabilistic modeling.
- Display everything in **real terms** (today's ₪).
- Success = solvent to a **planning age** (default ~92); bequest default ₪0, editable.
- Model the early-retirement **bridge** explicitly, with **two staged income-floor endpoints**: the **private-pension annuity can begin at ~60** (reduced), while the **Bituach Leumi old-age allowance** starts only at statutory age (~67 men / up to 65 women). Required portfolio draw steps down twice, not once.
- **No target-age input** — the app assumes retire-as-soon-as-possible. Primary output = the **earliest feasible age** (the hero); "the Gap" = how much more to retire **now**. "Retire at age X?" survives only as an optional Power what-if.
- **One engine; inputs shown by default (revised 2026-08-30).** No mode toggle, and the engine always runs the *full* model. Advanced inputs are now **shown by default** — the earlier "hide behind a drawer for non-power users" is dropped; they proved simple enough to always show — each carrying a sensible default so a non-expert can ignore them. Progressive disclosure is reserved only for genuinely deep/rare modules (deep real-estate → ticket 07, couple modeling → ticket 08). The 25% real CGT and §9א exemption are always applied; leaving an advanced input at its default collapses the full model to the simple case.
- Stack: React + TypeScript + Vite, static-hostable; charting lib with RTL support; a pure, unit-tested TS **calculation core** separated from UI. No backend, no storage.
- UX: desktop-first, mobile-responsive; calm, confidence-building; one hero number + one hero chart.

**Priority:** [Engine extension: real-estate & mortgage depth](issues/07-real-estate-mortgage-depth.md) and [Engine extension: couple / household modeling](issues/08-couple-household-modeling.md) are **deferred & tentative** — the user is on the fence about including them at all; sequence last, may be dropped.

## Decisions so far

<!-- one line per closed ticket: gist + link -->

- [Research: Israeli retirement-finance rates & rules](issues/01-research-israeli-rates-rules.md) — Israel-specific rates/rules compiled (2024–26): 18.5% pension (**annuity can begin at 60, reduced**; lump-sum capped by ~₪5k/mo minimum-pension floor), 6-yr tax-free keren hishtalmut, 25% real-gains CGT (credit points don't offset it), Bituach Leumi ₪1,838/mo floor at statutory age. **Confirms a STAGED bridge** (pension floor at ~60, state allowance at statutory age) as the central design point. Defaults now sourced (inflation 2–3%, real returns 3–4%/5–7%). ~5 figures flagged for pre-ship verification.
- [Research: היוון קצבה — pension-commutation tax paths](issues/05-research-hivun-kitzba-tax-paths.md) — commuting a pension to a lump sum forks into **4 differently-taxed paths** (recognized pension: principal free + 15% on gains, from 60; exempt slice: free up to the ₪976k 2026 basket but cuts monthly exemption ÷180, 161ד within 90 days, statutory age only; taxable slice: marginal rates with פריסה over ≤6 yrs; §9ב niche). **Key nuance:** the §9א exemption only starts at **statutory age** — a 60–66 qualifying-pension annuity is **fully taxable**; only the recognized-pension slice is tax-free at 60. Confirmed vs Income Tax Ordinance §9א.
- [Research: ביטוח מנהלים — manager's insurance](issues/06-research-bituach-menahalim.md) — modeled as a **Power-tier variant of the pension bucket** (annuity tax identical → no new tax logic). Knobs: guaranteed coefficient (only pre-2013; **"guaranteed" ≠ better** — real edge +11–38% only for pre-2001 ~145–166), capital/הון track (pre-2008 = liquid tax-free lump sum at 60, not a floor), higher fees (~0.8% + 2%), vintage. Now a legacy vehicle. Core ignores it; Power sets the knobs.
- [Research: annuity-coefficient longevity drift](issues/09-research-coefficient-drift.md) — the non-guaranteed מקדם קצבה drifts up with longevity; model as `coeff_today × (1+drift)^years`, **default 0.4%/yr** (range 0.2–0.8), cap ~230–240. Historical 145→199 moves were mostly interest-rate-driven (unforecastable), not pure longevity → surface a range. Power assumption; guaranteed pre-2013 policies exempt.
- [Research: Israeli child-rearing cost](issues/11-research-child-rearing-cost.md) — no official total; **birth-to-18 single child ≈ ₪1.1–1.3M** (the ~₪1.5M cited = top-decile/to-21). Age curve peaks in daycare (0–3) & teens (12–18). Default **₪1.2M over 0–18**, per-year weights 7/6/5/5.2%. Post-18 = optional tail. Feeds ticket 10; figures [verify].
- [Research: real erosion of frozen nominal caps](issues/13-research-nominal-cap-erosion.md) — Israeli frozen caps (esp. **קצבה מזכה ₪9,430**, brackets, credit-point, surtax) get **no catch-up after a freeze** → permanent real erosion. Model 2 knobs: frozen cluster (flat-nominal through 2027, then **~1%/yr** real erosion, range 0→full-inflation) vs indexed cluster (~0%, constant real). קצבה מזכה = highest impact; §9א rate rising 57→67% by 2028 partly offsets. Feeds engine §7; figures [verify].
- [Engine spec: deterministic projection model](issues/02-engine-spec-deterministic-model.md) — the full [engine spec](assets/02-engine-spec.md): yearly real-terms projection, accumulation → staged-decumulation, 5 buckets, one `project()` core solving the **earliest feasible age** as the hero (no target-age input; the Gap = how much more to retire now). One-engine principle (Core = defaulted inputs). Drawdown liquid→gemel→keren; Core-defaults tax with Power commutation/FX/פריסה; pension strategy defaults to wait-to-statutory. Graduated tickets 07 (real-estate depth) & 08 (couple modeling); unblocked prototypes 03 & 04.
- [Prototype: results & verdict visualization](issues/04-results-visualization-prototype.md) — Direction-C results UX validated & **implemented in `src/`**: funding-bars + portfolio-line chart, path selector + earliest-retirement auto-follow, sticky chart-left/controls-right dashboard, per-child editor, SWR gauge.
- [Prototype: input experience & app shell](issues/03-input-ux-prototype.md) — **Direction C (sliders-canvas)** chosen: chart-as-hero + drag-sliders + progressive disclosure, RTL. Chart made informative (labeled axes, phase-aware hover tooltip, "how it's calculated" explainer). Build note: decouple input DOM from output render to preserve focus. Prototype: [asset](assets/03-input-shell-prototype.html).

- [Research: ביטוח סיעודי & LTC](issues/16-research-ltc-nursing-insurance.md) — health-fund nursing insurance pays ₪3.2–10K/mo but **only 5 years**; Bituach Leumi covers home care only. Residual gap is mainly institutional / post-cap → model LTC as a modest **NET late-life expense** (~₪6K/mo × ~4yr). **Deferred** (user skipped for now); ticket 17 holds the recommendation.
- Shulit-review refinements **implemented** (2026-08-31): [crash-at-retirement toggle](issues/12-market-crashes.md) (12), [horizon-scaled SWR](issues/14-horizon-swr-threshold.md) (14), [real expense growth](issues/15-real-expense-growth.md) (15).
- [Rent as a faster-growing expense component](issues/18-rent-expense-growth.md) — **implemented (2026-08-30, approach B)**: `monthlyRent` (portion of the total expense, default 0 = owner) grows at its own `rentRealGrowth` (~1.5% real); the non-rent remainder keeps `realExpenseGrowth`. Rent's share of spending rises over the horizon. Extends ticket 15.

## Not yet specified

<!-- in-scope fog; graduates into tickets as the frontier advances -->

- **Assumption defaults' editing UX** — the *values* are sourced and the engine boundary is set; the open part is how transparently defaults are exposed/edited in the UI (a prototype concern).
- **Pre-ship verification of ~5 flagged figures** against primary .gov.il sources — a `task` ticket near build time; recorded now so the spec flags which numbers are uncertain.
- **What-if / sensitivity interaction for Power users** — sliders, scenario compare; depends on the results-viz direction.
- **i18n architecture specifics & Hebrew financial copy** — deferred until the shell lands.

- **Deferred (shulit.com review, 2026-08-31):** partial / "barista" retirement income (post-retirement earnings offsetting expenses, halving the withdrawal rate) — **skipped for now**, may return.
- **Low priority / later (shulit.com review):** currency risk (USD portfolio vs ILS spend); dynamic/variable withdrawal; CAPE-informed lower default return; severance (פיצויים) as a distinct liquid bucket; life-cycle expense curve (spend declines then LTC spike). Also parked: reconsidering Monte-Carlo / historical-sequence success-% (the deterministic **crash-at-retirement** proxy was chosen instead — ticket 12).

## Out of scope

<!-- past the destination; does not graduate unless the destination is redrawn -->

- **Monte Carlo / probabilistic simulation** — user chose deterministic only.
- **Data persistence, accounts, saved scenarios** — hard product requirement: nothing is stored.
- **Backend / server** — fully client-side.
- **Production build, deployment, hosting, analytics** — destination stops at spec + prototype.
- **English / bilingual UI in v1** — architecture stays i18n-ready; a translation pass is a future effort.
- **Nominal-terms display** — real terms only for now.
