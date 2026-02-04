import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, Loadout } from '../../api/api';

export interface LoadoutState {
  items: Loadout[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: LoadoutState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchLoadouts = createAsyncThunk('loadouts/fetchLoadouts', async () => {
  const response = await api.getLoadouts();
  return response;
});

export const addLoadout = createAsyncThunk(
  'loadouts/addLoadout',
  async (loadout: Omit<Loadout, 'id'>) => {
    const response = await api.createLoadout(loadout);
    return response;
  }
);

export const editLoadout = createAsyncThunk('loadouts/editLoadout', async (loadout: Loadout) => {
  const response = await api.updateLoadout(loadout);
  return response;
});

export const removeLoadout = createAsyncThunk('loadouts/removeLoadout', async (id: string) => {
  await api.deleteLoadout(id);
  return id;
});

export const loadoutSlice = createSlice({
  name: 'loadouts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchLoadouts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLoadouts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchLoadouts.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Failed to fetch loadouts';
      })
      // Add
      .addCase(addLoadout.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Edit
      .addCase(editLoadout.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Remove
      .addCase(removeLoadout.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default loadoutSlice.reducer;
