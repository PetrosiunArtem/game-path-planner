import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api, ProfileData, Weapon, Skill, Boss, Level } from '../../api/mockApi';

export type { Weapon, Skill, Boss, Level };

export interface ProfileState extends ProfileData {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileState = {
  weapons: [],
  skills: [],
  bosses: [],
  levels: [],
  status: 'idle',
  error: null,
};

// Async Thunks
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  return await api.getProfile();
});

export const updateProfileData = createAsyncThunk(
  'profile/updateProfile',
  async (profile: ProfileData) => {
    return await api.updateProfile(profile);
  }
);

export const updateLevelCoins = createAsyncThunk(
  'profile/updateLevelCoins',
  async ({ id, delta }: { id: string; delta: number }, { getState }) => {
    const state = getState() as { profile: ProfileState };
    const profile = state.profile;

    const newLevels = profile.levels.map((l) => {
      if (l.id === id) {
        const newCoins = Math.max(0, Math.min(l.totalCoins, (l.coinsCollected || 0) + delta));
        return { ...l, coinsCollected: newCoins };
      }
      return l;
    });

    const newProfile: ProfileData = {
      weapons: profile.weapons,
      skills: profile.skills,
      bosses: profile.bosses,
      levels: newLevels,
    };
    return await api.updateProfile(newProfile);
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Helper to modify local state (can be used by optimistic UI)
    localToggleWeapon: (state, action: PayloadAction<string>) => {
      const weapon = state.weapons.find((w) => w.id === action.payload);
      if (weapon) weapon.owned = !weapon.owned;
    },
    localUpdateSkill: (state, action: PayloadAction<{ id: string; delta: number }>) => {
      const skill = state.skills.find((s) => s.id === action.payload.id);
      if (skill) {
        const newLevel = skill.level + action.payload.delta;
        skill.level = Math.max(0, Math.min(skill.maxLevel, newLevel));
      }
    },
    localToggleBoss: (state, action: PayloadAction<string>) => {
      const boss = state.bosses.find((b) => b.id === action.payload);
      if (boss) boss.defeated = !boss.defeated;
    },
    localCycleLevel: (state, action: PayloadAction<string>) => {
      const level = state.levels.find((l) => l.id === action.payload);
      if (level) {
        const statuses: Level['status'][] = ['locked', 'available', 'completed'];
        const idx = statuses.indexOf(level.status);
        level.status = statuses[(idx + 1) % statuses.length];
      }
    },
    localUpdateLevelCoins: (state, action: PayloadAction<{ id: string; delta: number }>) => {
      const level = state.levels.find((l) => l.id === action.payload.id);
      if (level) {
        const newCoins = level.coinsCollected + action.payload.delta;
        level.coinsCollected = Math.max(0, Math.min(level.totalCoins, newCoins));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.weapons = action.payload.weapons;
        state.skills = action.payload.skills;
        state.bosses = action.payload.bosses;
        state.levels = action.payload.levels;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch profile';
      })
      .addCase(updateProfileData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfileData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update state to confirm sync
        state.weapons = action.payload.weapons;
        state.skills = action.payload.skills;
        state.bosses = action.payload.bosses;
        state.levels = action.payload.levels;
      })
      .addMatcher(
        (action) =>
          [
            toggleWeapon.fulfilled.type,
            updateSkillLevel.fulfilled.type,
            toggleBoss.fulfilled.type,
            cycleLevelStatus.fulfilled.type,
            updateLevelCoins.fulfilled.type,
          ].includes(action.type),
        (state, action: PayloadAction<ProfileData>) => {
          state.status = 'succeeded';
          state.weapons = action.payload.weapons;
          state.skills = action.payload.skills;
          state.bosses = action.payload.bosses;
          state.levels = action.payload.levels;
        }
      );
  },
});

// Thunk Wrappers
export const toggleWeapon = createAsyncThunk(
  'profile/toggleWeapon',
  async (id: string, { getState }) => {
    const state = getState() as { profile: ProfileState };
    const profile = { ...state.profile };
    const newWeapons = profile.weapons.map((w) => (w.id === id ? { ...w, owned: !w.owned } : w));

    const newProfile: ProfileData = {
      weapons: newWeapons,
      skills: profile.skills,
      bosses: profile.bosses,
      levels: profile.levels,
    };

    return await api.updateProfile(newProfile);
  }
);

export const updateSkillLevel = createAsyncThunk(
  'profile/updateSkillLevel',
  async ({ id, delta }: { id: string; delta: number }, { getState }) => {
    const state = getState() as { profile: ProfileState };
    const profile = state.profile;
    const newSkills = profile.skills.map((s) => {
      if (s.id === id) {
        const newLevel = Math.max(0, Math.min(s.maxLevel, s.level + delta));
        return { ...s, level: newLevel };
      }
      return s;
    });

    const newProfile: ProfileData = {
      weapons: profile.weapons,
      skills: newSkills,
      bosses: profile.bosses,
      levels: profile.levels,
    };
    return await api.updateProfile(newProfile);
  }
);

export const toggleBoss = createAsyncThunk(
  'profile/toggleBoss',
  async (id: string, { getState }) => {
    const state = getState() as { profile: ProfileState };
    const profile = state.profile;
    const newBosses = profile.bosses.map((b) =>
      b.id === id ? { ...b, defeated: !b.defeated } : b
    );

    const newProfile: ProfileData = {
      weapons: profile.weapons,
      skills: profile.skills,
      bosses: newBosses,
      levels: profile.levels,
    };
    return await api.updateProfile(newProfile);
  }
);

export const cycleLevelStatus = createAsyncThunk(
  'profile/cycleLevelStatus',
  async (id: string, { getState }) => {
    const state = getState() as { profile: ProfileState };
    const profile = state.profile;
    const statuses: Level['status'][] = ['locked', 'available', 'completed'];

    const newLevels = profile.levels.map((l) => {
      if (l.id === id) {
        const idx = statuses.indexOf(l.status);
        const nextStatus = statuses[(idx + 1) % statuses.length];
        return { ...l, status: nextStatus };
      }
      return l;
    });

    const newProfile: ProfileData = {
      weapons: profile.weapons,
      skills: profile.skills,
      bosses: profile.bosses,
      levels: newLevels,
    };
    return await api.updateProfile(newProfile);
  }
);

export const { localToggleWeapon, localUpdateLevelCoins } = profileSlice.actions;
export default profileSlice.reducer;
