# Pensioner Retirement Simulator

The shared language for a client-side simulator that estimates whether a user can retire early **in Israel**, or how much more they need. This file is a glossary only — no implementation details, no decisions (those live in `.wayfinder/pensioner/map.md` and, later, `docs/adr/`).

## Simulation concepts

**Feasibility**:
Whether the user's assets plus later-life income floors cover their expenses every year until the planning age without the portfolio going negative. The engine's core yes/no.
_Avoid_: success, pass/fail

**The Gap**:
The additional money needed to retire sooner than the earliest feasible age — by default, to retire *right now* (a lump sum). The motivating "how much more" answer.
_Avoid_: shortfall, deficit

**Earliest feasible age**:
The soonest age at which the plan stays solvent to the planning age — the tool's hero output. The user never enters a target age; the app assumes they want to retire as soon as possible and solves for this.
_Avoid_: FIRE age (reserve for the user's own framing), target retirement age

**Bridge phase**:
The self-funded years between the user's early-retirement age and the ages at which income floors begin — funded entirely from liquid assets. It is **staged**: the private-pension annuity can begin at ~60 (reduced), while the Bituach Leumi old-age allowance starts only at statutory age, so the required drawdown steps down twice. The distinctive feature of _early_ retirement in Israel.
_Avoid_: gap years (collides with "The Gap"), interim period

**Income floor**:
A recurring, largely-guaranteed later-life income stream that reduces required drawdown once it starts — the pension annuity and the Bituach Leumi old-age allowance. Contrast with liquid assets, which are drawn down.
_Avoid_: guaranteed income, safety net

**Real terms**:
All money is expressed in today's shekels (₪). Inflation is handled inside the engine; the user never reasons about inflated future numbers.
_Avoid_: constant shekels, inflation-adjusted (in UI copy)

**Planning age**:
The age to which the plan must remain solvent (a life-expectancy proxy, default ~92). Editable.
_Avoid_: horizon, death age, life expectancy

**Nominal-cap real erosion**:
The loss of real value, in a real-terms model, of a threshold defined in nominal shekels and not fully inflation-indexed (e.g., the frozen קצבה מזכה ceiling). Modeled as an annual real-erosion rate; the flagship effect is a shrinking tax-free pension slice over time.
_Avoid_: bracket creep (related but narrower — reserve for income-tax brackets)

**Market crash (stress)**:
A deterministic downside overlay — a drop of a set size (%) applied to market-exposed balances every N years — used to stress-test feasibility against sequence risk without resorting to probabilistic modeling. A scheduled proxy, not a forecast.
_Avoid_: correction, drawdown (reserve for portfolio decline generally)

**Deterministic projection**:
A single forward projection using fixed assumptions (one real-return rate, one inflation rate, etc.), producing one clear answer. This tool does **not** do probabilistic / Monte Carlo modeling.

## Tiers

**Core tier**:
Not a separate mode — the inputs that matter most to a non-expert (liquid assets, keren hishtalmut, pension, monthly expense, Bituach Leumi floor). All inputs are **shown by default**; "Core" just names the primary ones. The engine always runs the full model; unset advanced inputs carry sensible defaults.

**Power tier**:
Not a separate mode and no longer hidden — the additional, less-commonly-changed inputs (coefficient, longevity drift, commutation strategy, ביטוח מנהלים knobs, custom assumptions) shown **alongside** the Core ones with defaults filled in. Only genuinely deep/rare modules (deep real-estate, couple modeling) remain behind progressive disclosure. Setting any input changes the result; leaving it uses the default.

**Temporary expense**:
A time-bounded addition to the base expense that runs for a period and then stops — as opposed to the permanent base expense held to the planning age. The flagship case is child expenses (see Child expense); the concept also covers a mortgage payment until payoff, supporting a parent for a period, etc.
_Avoid_: one-off (reserve for single-year events), phase expense

**Child expense**:
A temporary expense from a **single shared total** (default ~₪1.2M, birth–18) applied to every child and amortized over an **age-cost curve** that peaks in daycare (0–3) and the teens (12–18). Each child carries only an age; ends at ~18 (university/army support is an optional post-18 extension). Multiple children stack as overlapping layers offset by age.
_Avoid_: dependent cost, monthly child cost (the input is a total)

## Israeli instruments (canonical terms)

**Pension (פנסיה / קרן פנסיה)**:
The mandatory Israeli pension fund; contributions accumulate and convert to a lifetime monthly annuity (an income floor). The head of the "pension bucket" vehicle family (with manager's insurance). Its conversion coefficient is non-guaranteed (set at retirement) for new savers since 2013.
_Avoid_: 401k, superannuation

**Manager's insurance (ביטוח מנהלים)**:
An insurance-based retirement vehicle, sibling to the pension fund within the pension bucket — feeds the same annuity income floor and shares the §9א tax rules, but distinguished by an often-**guaranteed annuity coefficient** (older policies), a possible **capital (הון) track** paying a lump sum instead of an annuity (pre-2008 policies), and historically higher fees. Modeled as a Power-tier variant of the pension bucket.
_Avoid_: executive insurance (prefer "manager's insurance" / ביטוח מנהלים)

**Keren Hishtalmut (קרן השתלמות)**:
A tax-advantaged study/education fund, commonly used as a medium-term investment vehicle; broadly liquid and tax-free after a holding period. A Power-tier asset.
_Avoid_: study fund (in Hebrew UI), education fund

**Kupat Gemel Lehashkaa (קופת גמל להשקעה)**:
A tax-advantaged investment provident fund with contribution ceilings. A Power-tier asset.
_Avoid_: provident fund (ambiguous)

**Old-age allowance (קצבת זקנה)**:
The Bituach Leumi (National Insurance) state pension paid from the statutory age — an income floor.
_Avoid_: social security, state pension (in UI)

**Statutory retirement age (גיל פרישה)**:
The legally defined age (men 67, women rising 62→65) at which the Bituach Leumi old-age allowance becomes payable and the _unreduced_ pension annuity is reached. Not the earliest access — the pension annuity may begin earlier (see Early annuitization).
_Avoid_: pension age, official age

**Early annuitization (age 60)**:
Beginning the private-pension monthly annuity from age 60, before statutory age — statutorily "early retirement," actuarially reduced. Marks the end of the bridge for the _pension_ income floor. The §9א tax exemption on the qualifying pension does not apply until statutory age, so a 60–66 annuity is fully taxable (only the recognized-pension slice is tax-free at 60).
_Avoid_: early retirement (ambiguous with the user's FIRE age)

**Recognized pension (קצבה מוכרת)**:
The slice of the pension annuity funded by contributions that received no tax benefit going in (already-taxed money). Its monthly annuity is tax-free from age 60, and commuting it returns principal tax-free with only the gain taxed (flat 15%). Contrast with the _qualifying pension_ (קצבה מזכה), whose exemption starts only at statutory age.
_Avoid_: exempt pension (ambiguous with §9ב)

**Qualifying pension (קצבה מזכה)**:
The slice of the pension annuity funded by tax-benefited contributions. It carries the §9א exemption — but only from **statutory age** (a 60–66 early annuity is fully taxable), applied to a monthly ceiling (frozen nominal ₪9,430, eroding in real terms) at an exempt rate rising to 67% by 2028. Contrast with the _recognized pension_ (קצבה מוכרת), whose principal is tax-free from age 60.
_Avoid_: entitling pension, exempt pension (ambiguous with §9ב)

**Marginal tax (מס שולי)**:
Progressive Israeli income tax applied to the **taxable** slice of the annuity (gross annuity minus the §9א exempt amount), net of resident credit points. The mechanism behind why the same gross annuity nets differently before vs after statutory age and across withdrawal paths.
_Avoid_: income tax (too broad), bracket tax

**Liquid assets**:
Investments the user can freely draw down before statutory ages — brokerage/ETFs/stocks, cash, and the liquid portion of keren hishtalmut/gemel. What funds the bridge phase.
_Avoid_: savings, portfolio (reserve "portfolio" for the whole holding)
