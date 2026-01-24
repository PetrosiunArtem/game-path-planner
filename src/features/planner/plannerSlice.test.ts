import plannerReducer, { clearResult, calculateBossPath } from './plannerSlice';
import { PathResult } from '../../api/mockApi';

describe('planner reducer', () => {
  const initialState = {
    currentResult: null,
    status: 'idle' as const,
    history: [],
  };

  const mockResult: PathResult = {
    id: '1',
    goalName: 'Sample Boss',
    estimatedTimeMinutes: 10,
    attemptsEstimation: 2,
    recommendedLoadoutId: 'l1',
    steps: ['Step 1'],
    efficiencyScore: 0.8,
    strategyLabel: 'Solid',
    aiAdvice: 'Good luck',
  };

  it('should handle initial state', () => {
    expect(plannerReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearResult', () => {
    const stateWithResult = { ...initialState, currentResult: mockResult };
    const actual = plannerReducer(stateWithResult, clearResult());
    expect(actual.currentResult).toBeNull();
  });

  it('should handle calculateBossPath.pending', () => {
    const action = { type: calculateBossPath.pending.type };
    const state = plannerReducer(initialState, action);
    expect(state.status).toBe('loading');
  });

  it('should handle calculateBossPath.fulfilled', () => {
    const action = { type: calculateBossPath.fulfilled.type, payload: mockResult };
    const state = plannerReducer(initialState, action);
    expect(state.status).toBe('succeeded');
    expect(state.currentResult).toEqual(mockResult);
    expect(state.history).toHaveLength(1);
    expect(state.history[0]).toEqual(mockResult);
  });
});
