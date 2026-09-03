# Prototype the year-explainer panel (2 pinned example years)

Type: prototype
Status: resolved
Assignee: staslev
Blocked by: 03 (resolved)

## Answer

**Validated direction (user picked "A", 2026-09-01).** Layout locked:

- **Top: two-pane** — "לאן הכסף הולך" (expense: base / rent / children) beside "מהיכן הכסף מגיע" (funding net-of-tax by bucket: ביטוח לאומי / קצבת פנסיה / משיכה מהתיק). Chosen first, unanimously.
- **Bottom: the tax band = "טבלה + פסי ייחוס" (band A).** A per-source **table** (מקור · ברוטו · בסיס חייב · מס · שיעור) covering **all taxed sources this year** — pension annuity (מס שולי) and portfolio draw (מס רווח הון) — plus a **full-width split bar** beneath it with each tax type's **label + share written inside its colored segment** (`מס שולי 21%` / `מס רווח הון 79%`), and the total-tax figure. Rejected along the way: per-cell inline bars (noise); the bars-on-top (B) and waterfall (C) treatments.
- **Scope = this year** across both sources. A lifetime cumulative-tax figure is deferred to fog (needs engine accumulation).
- **Effective rate shown, labeled** — portfolio reads "25% על הרווח (≈X% מהמשיכה)" so "rate of what?" is explicit.
- **Tax colors distinct from funding/shortfall:** מס שולי = purple, מס רווח הון = clay/amber.
- **Honesty:** the קצבה מוכרת "not modeled" caveat renders inside the band (from ticket 03).

Per-year data the panel needs (feeds the ticket 01 contract): expense rows; funding rows `{kind, label, net, gross?, formula?, note?}`; and a **tax-lines array** `{src, tname, kind, gross, exempt, base, baseLabel, tax, rate}` + a total — exactly the `taxLines()` shape in the prototype.

Prototype kept in `assets/` per this repo's convention (prior prototypes weren't branched); losing treatments live in its git history.

## Question

Make a cheap, rough, RTL/Hebrew prototype of the click-to-pin explainer panel **below the chart**, to react to. Validate against **two pinned example years** (hand-computed from the engine is fine):

- a **bridge year** — portfolio draw + real CGT, no annuity;
- a **60+ annuity year** — the full tax stack (מס שולי / קצבה מזכה / קצבה מוכרת) using the content from 03.

Decide: the panel's visual structure (expense group / funding group / tax group), how a **formula line** reads in RTL, how **plain-language notes** attach to rows without becoming walls of text, how **simplification caveats** are marked, and the phase-summary one-liner. Link the prototype as an asset.

## Assets

- [Explainer-panel prototype — winner: band A](../assets/04-explainer-panel-prototype.html) — two-pane top + "table + attribution split-bar" tax band.

## Context

Blocked by 03 (tax content). HITL — react with the user. Consult `prototype`. Interaction is settled (pin-on-click, panel below chart); this validates *content & layout*. Feeds the locked contract in 01. Starting point: the existing hover tooltip in `../../../src/ui/FundingChart.tsx`.
