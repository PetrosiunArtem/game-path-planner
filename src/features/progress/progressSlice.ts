import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api, ProgressItem } from '../../api/api';

export interface ProgressState {
    items: ProgressItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProgressState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchLogs = createAsyncThunk('progress/fetchLogs', async () => {
    return await api.getLogs();
});

export const addLogEntry = createAsyncThunk(
    'progress/addLog',
    async (entry: Omit<ProgressItem, 'id' | 'date'>) => {
        return await api.createLog(entry);
    }
);

export const toggleLogStatus = createAsyncThunk(
    'progress/toggleLog',
    async (id: string) => {
        return await api.toggleLog(id);
    }
);

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLogs.fulfilled, (state, action: PayloadAction<ProgressItem[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchLogs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch logs';
            })
            .addCase(addLogEntry.fulfilled, (state, action: PayloadAction<ProgressItem>) => {
                state.items.unshift(action.payload);
            })
            .addCase(toggleLogStatus.fulfilled, (state, action: PayloadAction<ProgressItem>) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export default progressSlice.reducer;
