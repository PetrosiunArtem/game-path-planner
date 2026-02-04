import { api } from './mockApi';

describe('Path Planner API Integration', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  it('should call backend for path calculation and return results', async () => {
    const mockResult = {
      id: 'test-uuid',
      goalName: 'Defeat The Root Pack',
      estimatedTimeMinutes: 20,
      attemptsEstimation: 3,
      recommendedLoadoutId: 'l1',
      steps: ['Test step'],
      efficiencyScore: 0.9,
      strategyLabel: 'S-Rank Strategy',
      aiAdvice: 'Test advice'
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResult,
    });

    const result = await api.calculatePath('The Root Pack', 'l1');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/calculate-path'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ bossName: 'The Root Pack', loadoutId: 'l1' })
      })
    );
    expect(result).toEqual(mockResult);
    expect(result.strategyLabel).toBe('S-Rank Strategy');
  });

  it('should return fallback data when API returns non-ok response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const result = await api.calculatePath('Boss', 'Loadout');
    expect(result).toBeDefined();
    expect(result.id).toBe('sim-fallback');
    expect(result.strategyLabel).toBeDefined();
  });
});
