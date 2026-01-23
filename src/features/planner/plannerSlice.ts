import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, PathResult } from '../../api/mockApi';

export interface PlannerState {
  currentResult: PathResult | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  history: PathResult[];
}

const initialState: PlannerState = {
  currentResult: null,
  status: 'idle',
  history: [],
};

export const calculateBossPath = createAsyncThunk(
  'planner/calculatePath',
  async ({ bossName, loadoutId }: { bossName: string; loadoutId: string }) => {
    const response = await api.calculatePath(bossName, loadoutId);
    return response;
  }
);

export const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    clearResult: (state) => {
      state.currentResult = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateBossPath.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(calculateBossPath.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentResult = action.payload;
        state.history.push(action.payload);
      })
      .addCase(calculateBossPath.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { clearResult } = plannerSlice.actions;

export default plannerSlice.reducer;

