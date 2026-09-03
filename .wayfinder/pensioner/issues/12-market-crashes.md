# Model market crashes (periodic deterministic shock)

Type: grilling
Status: resolved
Blocked by: 02
Resolved (2026-08-31): periodic crash overlay + the crash-at-retirement worst-case toggle implemented in `src/engine/` (`crashAtRetirement`), engine-tested.

## Question

Add a downside-risk stress: a **market crash of size X% every N years**, applied to market-exposed balances. User inputs: **crash size (%)** and **frequency (years)** (frequency 0 = off).

Decided approach (user, 2026-08-30): two inputs (size, frequency), deterministic periodic shock.

- **Why it fits:** a scheduled periodic crash is still **deterministic** (consistent with the no-Monte-Carlo decision) and is a cheap, transparent way to inject downside / sequence-risk sensitivity that a flat trend-return hides.
- **Applied to:** market-exposed balances — liquid, keren hishtalmut, and the pension pot **while it's still a balance** (pre-annuitization, so an early crash lowers the eventual annuity). The **fixed annuity and Bituach Leumi are not** market-linked.
- **On top of the trend:** the real-return assumption stays the trend; crashes are discrete shocks layered on it (so enabling them makes the projection more conservative — more honest than ignoring crashes).
- **Recovery:** conservative — apply the drop, then resume trend growth (no modeled bounce-back rally).

Open refinements to decide:
- **Sequence risk / phase — DECIDED (2026-08-31, shulit.com review):** implement a first-class **"crash at retirement / first-decade" worst-case toggle** as the deterministic sequence-risk proxy (a crash lands the year retirement starts). Chosen as the *cheapest* option over reconsidering Monte-Carlo / historical sequences (which stays out of scope). To build.
- Whether to model a **recovery bounce** (crashes historically over-recover).
- Whether the **frequency/size defaults** should be on or off by default (currently on at 35%/10yr).

Output: the crash model + 2 inputs, consistent with the deterministic engine.

## Context

User request (2026-08-30). Extends the engine spec (assumptions/returns) and is demonstrated in the prototype (2 inputs in "פנסיה והנחות"; default 35%/10yr, set frequency 0 to disable). Deterministic periodic proxy, not a forecast.
