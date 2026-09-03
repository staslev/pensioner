# Prototype: input experience & app shell

Type: prototype
Status: resolved
Blocked by: 02

## Question

How should a user *enter* their financials so a non-sophisticated user finishes a credible Core answer in minutes, while a power user can progressively disclose nuance without feeling lost? This also decides the **overall app shell/flow** (guided wizard → dashboard, vs. a single live-updating page).

Produce **2–3 competing prototype directions** (rough, throwaway, RTL/Hebrew) to react to — not one guess. Each should embody:

- the Core-tier guided path and how Power fields reveal on demand (the Core/Power boundary from ticket 02);
- the RTL Hebrew layout, calm/confidence-building aesthetic, one-thing-at-a-time feel;
- desktop-first, mobile-responsive framing;
- how/when results recompute relative to input.

Link the prototypes as assets from this ticket; the resolution records the chosen direction and why.

## Context

Consult `prototype`. Blocked on ticket 02 (the input set is defined by the engine). Pairs with ticket 04 (results viz) to form the full validated prototype.

## Prototype

Three structurally-different directions in one throwaway file: **[03-input-shell-prototype.html](../assets/03-input-shell-prototype.html)** (RTL, simplified engine stub). Switchable via bottom bar / ← → / `?variant=A|B|C`.

## Answer

**Winner: Direction C — קנבס מחוונים (sliders-canvas).** The chart is the hero, with big drag-sliders for the numbers that matter and progressive disclosure behind a "כוונון עדין" drawer. Chosen because it best serves the "visually intuitive" bar and lets users *feel* trade-offs by dragging and watching the earliest-age hero + curve move — a natural fit for the retire-ASAP model (no target-age entry).

Refinements the user asked for and I built into C:
- **Informative chart:** labeled axes (X = גיל, Y = שווי נכסים ₪ ריאלי), value gridlines, phase markers (פרישה / קצבת פנסיה 60 / ביטוח לאומי 67).
- **Hover tooltip** that follows the line and shows the year's net worth **and which phase** (accumulation / bridge / bridge+pension / full floors) — teaching the model as you scrub.
- **"איך המספר מחושב?" explainer** — a collapsible high-level description of the model.

Build findings carried forward:
- **Decouple input DOM from output rendering** (controlled inputs + stable keys) so live recompute never steals focus — surfaced by a focus-loss bug during prototyping.
- **Chart depth is the Results-viz ticket's (04) domain** — this enriched chart is its starting point.
