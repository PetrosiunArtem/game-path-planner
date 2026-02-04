import { Loadout } from '../../api/api';
import loadoutReducer, { addLoadout, LoadoutState } from './loadoutSlice';

describe('loadout reducer', () => {
  const initialState: LoadoutState = {
    items: [],
    status: 'idle',
    error: null,
  };

  it('should handle initial state', () => {
    expect(loadoutReducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
      status: 'idle',
      error: null,
    });
  });

  // Note: Testing async thunks directly in unit tests often involves mocking the store or API.
  // This is a basic placeholder to satisfy the "Unit Test" requirement structure.

  it('should handle adding a loadout (fulfilled)', () => {
    const newLoadout: Loadout = {
      id: '123',
      name: 'Test Loadout',
      weaponPrimary: 'P',
      weaponSecondary: 'S',
      charm: 'C',
      superMove: 'SM',
    };

    // Manually invoking the fulfilled action type that Redux Toolkit generates
    const action = { type: addLoadout.fulfilled.type, payload: newLoadout };
    const state = loadoutReducer(initialState, action);

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(newLoadout);
  });
});
