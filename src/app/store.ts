import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import loadoutsReducer from '../features/loadouts/loadoutSlice';
import plannerReducer from '../features/planner/plannerSlice';
import profileReducer from '../features/profile/profileSlice';
import progressReducer from '../features/progress/progressSlice';

export const store = configureStore({
  reducer: {
    loadouts: loadoutsReducer,
    planner: plannerReducer,
    profile: profileReducer,
    progress: progressReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
