import { api, Loadout } from './mockApi';

describe('Path Planner Logic (AI Advisor)', () => {
  // Helper to mock localStorage
  const mockLoadouts: Loadout[] = [
    {
      id: 'l1',
      name: 'Root Buster',
      weaponPrimary: 'Peashooter',
      weaponSecondary: 'Spread',
      charm: 'Smoke Bomb',
      superMove: 'Energy Beam',
    },
    {
      id: 'l2',
      name: 'Wrong Tool',
      weaponPrimary: 'Charge',
      weaponSecondary: 'Roundabout',
      charm: 'Heart',
      superMove: 'Invincibility',
    },
  ];

  beforeAll(() => {
    // Mock getLoadoutsFromStorage by spying on api.getLoadouts or mocking localStorage
    // Since mockApi reads from localStorage directly in calculatePath (via helper), we need to mock localStorage.
    const localStorageMock = (function () {
      let store: Record<string, string> = {
        ppp_loadouts: JSON.stringify(mockLoadouts),
      };
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        clear: () => {
          store = {};
        },
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  it('should calculate high score for effective loadout against The Root Pack', async () => {
    // "The Root Pack" weak to Peashooter/Spread. Loadout l1 has both.
    const result = await api.calculatePath('The Root Pack', 'l1');

    expect(result.goalName).toBe('Defeat The Root Pack');
    expect(result.recommendedLoadoutId).toBe('l1');
    // Base 0.5 + 0.3 (weakness) + 0.1 (smoke bomb) = 0.9.
    expect(result.efficiencyScore).toBeGreaterThanOrEqual(0.9);
    expect(result.strategyLabel).toBe('S-Rank Strategy');
  });

  it('should calculate lower score for ineffective loadout', async () => {
    // "The Root Pack" weak to Peashooter/Spread. Loadout l2 has Charge/Roundabout (not in weakness list).
    // Base 0.5. Charge reduces time modifier but doesn't add score in this mock logic unless weak.
    // Actually mock logic: if usedLoadout... hasWeakness...
    // l2 has NO weakness match.
    // Score = 0.5.
    // Charge logic: timeModifier -= 0.2.

    const result = await api.calculatePath('The Root Pack', 'l2');

    expect(result.efficiencyScore).toBe(0.5);
    expect(result.strategyLabel).not.toBe('S-Rank Strategy');
  });

  it('should provide specific advice for high efficiency', async () => {
    const result = await api.calculatePath('The Root Pack', 'l1');
    expect(result.aiAdvice).toContain('perfectly suited');
  });

  it('should provide specific advice for low efficiency', async () => {
    const result = await api.calculatePath('The Root Pack', 'l2');
    expect(result.aiAdvice).toContain('Consider switching');
  });
});
