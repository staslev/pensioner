# Engine extension: real-estate & mortgage depth (Power)

Type: grilling
Status: open
Blocked by: 02
Priority: deferred / tentative (2026-08-30) — user is undecided whether to include this at all; sequence LAST, may be dropped.

## Question

The engine spec (ticket 02) models real estate shallowly — `equity` + a flat `netMonthlyRent`. Design the Power-tier deep model:

- **Rental-income tax track selection:** full exemption (~₪5,654/mo ceiling + partial-exemption formula), 10% flat track, or marginal-rate track with expenses + ~2%/yr depreciation (research 01). How the user picks / the engine defaults.
- **Mortgage (משכנתא):** amortization across fixed / prime / variable tranches, the ≥1/3-fixed rule, a prime-rate path assumption; how mortgage payments enter the cash-flow.
- **Primary residence vs investment property:** primary removes rent from expenses but ties up capital; investment yields taxable rent.
- **Selling a property:** when/if equity is liquidated into the drawdown, and betterment/capital-gains treatment.

Output: the extended `RealEstate` data model + formulas, consistent with the one-engine principle (Power inputs default so the shallow Core behavior is unchanged).

## Context

Graduated from the engine spec (ticket 02) as flagged in Q2. Research 01 already covers the rental tracks and mortgage basics; this is primarily a design/grilling ticket. Power-tier — Core is unaffected.
