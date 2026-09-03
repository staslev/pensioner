# Engine extension: couple / household modeling (Power)

Type: grilling
Status: open
Blocked by: 02
Priority: deferred / tentative (2026-08-30) — user is undecided whether to include this at all; sequence LAST, may be dropped.

## Question

The engine core is built around a `persons[]` array but Core supplies one. Design the two-partner model:

- **Two persons, different ages/sexes:** separate statutory ages (men 67; women 62→65 by birth year), separate FIRE ages, separate salaries/buckets/pensions — the bridge and floor timings differ per partner.
- **Bituach Leumi couple logic:** the couple-vs-two-individuals distinction (research 01) — if both independently qualify, each gets their own (~2× single) rather than the couple rate; the pre-70 income test per partner.
- **Shared vs individual expenses:** household expenses drawn against combined assets; how drawdown spans both partners' buckets.
- **Survivor / sequencing** (scope check): whether one partner predeceasing is modeled or explicitly out of scope for this deterministic tool.

Output: how `project()` aggregates `1..N` persons, the couple-specific floor rules, and the input surface a Power user fills for a second partner.

## Context

Graduated from the engine spec (ticket 02) as decided in Q10. Power-tier — Core stays single-person. The engine's `persons[]` shape is the extension point.
