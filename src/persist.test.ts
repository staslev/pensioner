import { beforeEach, describe, expect, it } from 'vitest';
import { loadState, saveState, clearState, type PersistedState } from './persist';
import { DEFAULTS, DEFAULT_CHILD_TOTAL } from './engine/defaults';
import type { Scenario } from './engine/types';

// A minimal in-memory Storage shim so these run without jsdom.
function installStorageShim() {
  const store = new Map<string, string>();
  (globalThis as { sessionStorage?: Storage }).sessionStorage = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() { return store.size; },
  } as Storage;
  return store;
}

const SCENARIO: Scenario = {
  person: { currentAge: 41, sex: 'male', birthYear: 1985, grossMonthlySalary: 25000 },
  buckets: { liquid: 1_500_000, kerenHishtalmut: 500_000, pension: 1_200_000 },
  monthlyExpense: 16000, monthlyRent: 6000, monthlySaving: 5000,
  children: [{ currentAge: 0 }], childTotal: DEFAULT_CHILD_TOTAL,
  assumptions: DEFAULTS, pensionPath: 'wait67',
};
const FALLBACK: PersistedState = { scenario: SCENARIO, autoPath: true };

describe('scenario persistence', () => {
  let store: Map<string, string>;
  beforeEach(() => { store = installStorageShim(); });

  it('round-trips a saved scenario', () => {
    const saved: PersistedState = {
      scenario: { ...SCENARIO, monthlyExpense: 22222 },
      autoPath: false,
    };
    saveState(saved);
    expect(loadState(FALLBACK)).toEqual(saved);
  });

  it('returns the fallback when nothing is stored', () => {
    expect(loadState(FALLBACK)).toBe(FALLBACK);
  });

  it('returns the fallback on a schema-version mismatch', () => {
    store.set('pensioner:state', JSON.stringify({ version: 999, scenario: SCENARIO, autoPath: false }));
    expect(loadState(FALLBACK)).toBe(FALLBACK);
  });

  it('returns the fallback on corrupt JSON', () => {
    store.set('pensioner:state', '{ not json');
    expect(loadState(FALLBACK)).toBe(FALLBACK);
  });

  it('deep-merges: a field missing from the stored blob falls back to its default', () => {
    // Simulate an older blob written before `rentRealGrowth` existed.
    const { rentRealGrowth: _omit, ...oldAssumptions } = SCENARIO.assumptions;
    saveState({ scenario: { ...SCENARIO, assumptions: oldAssumptions as typeof SCENARIO.assumptions }, autoPath: true });
    const loaded = loadState(FALLBACK);
    expect(loaded.scenario.assumptions.rentRealGrowth).toBe(DEFAULTS.rentRealGrowth);
  });

  it('clears the saved state', () => {
    saveState(FALLBACK);
    clearState();
    expect(loadState(FALLBACK)).toBe(FALLBACK);
  });
});
