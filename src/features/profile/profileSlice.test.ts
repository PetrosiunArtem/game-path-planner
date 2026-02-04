import { configureStore } from '@reduxjs/toolkit';
import { api } from '../../api/mockApi';
import profileReducer, {
    fetchProfile,
    toggleWeapon,
    updateSkillLevel,
    toggleBoss,
    cycleLevelStatus,
} from './profileSlice';
import { RootState } from '../../app/store';

// Mock the API
jest.mock('../../api/mockApi', () => ({
    api: {
        getProfile: jest.fn(),
        updateProfile: jest.fn(),
    },
}));

const mockProfile = {
    weapons: [
        { id: '1', name: 'Peashooter', type: 'Standard', damage: 45, owned: true },
        { id: '2', name: 'Spread', type: 'Short Range', damage: 62, owned: false },
    ],
    skills: [{ id: '1', name: 'Accuracy', level: 5, maxLevel: 10 }],
    bosses: [{ id: '1', name: 'The Root Pack', defeated: false, difficulty: 'Easy' as const }],
    levels: [{ id: '1', name: 'Forest Follies', status: 'locked' as const }],
};

describe('profileSlice Async Thunks', () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                profile: profileReducer,
            } as any, // Cast to any to avoid recursive type issues in test setup with partial reducers
        });
        jest.clearAllMocks();
    });

    it('should handle fetchProfile', async () => {
        (api.getProfile as jest.Mock).mockResolvedValue(mockProfile);

        await store.dispatch(fetchProfile() as any);

        const state = (store.getState() as RootState).profile;
        expect(state.status).toBe('succeeded');
        expect(state.weapons).toEqual(mockProfile.weapons);
        expect(state.skills).toEqual(mockProfile.skills);
    });

    it('should handle toggleWeapon', async () => {
        // Setup initial state
        (api.getProfile as jest.Mock).mockResolvedValue(mockProfile);
        await store.dispatch(fetchProfile() as any);

        const updatedProfile = {
            ...mockProfile,
            weapons: [
                { id: '1', name: 'Peashooter', type: 'Standard', damage: 45, owned: true },
                { id: '2', name: 'Spread', type: 'Short Range', damage: 62, owned: true }, // Toggled to true
            ],
        };
        (api.updateProfile as jest.Mock).mockResolvedValue(updatedProfile);

        await store.dispatch(toggleWeapon('2') as any);

        const state = (store.getState() as RootState).profile;
        expect(api.updateProfile).toHaveBeenCalled();
        expect(state.weapons[1].owned).toBe(true);
    });

    it('should handle updateSkillLevel', async () => {
        (api.getProfile as jest.Mock).mockResolvedValue(mockProfile);
        await store.dispatch(fetchProfile() as any);

        const updatedProfile = {
            ...mockProfile,
            skills: [{ id: '1', name: 'Accuracy', level: 6, maxLevel: 10 }],
        };
        (api.updateProfile as jest.Mock).mockResolvedValue(updatedProfile);

        await store.dispatch(updateSkillLevel({ id: '1', delta: 1 }) as any);

        const state = (store.getState() as RootState).profile;
        expect(state.skills[0].level).toBe(6);
    });

    it('should handle toggleBoss', async () => {
        (api.getProfile as jest.Mock).mockResolvedValue(mockProfile);
        await store.dispatch(fetchProfile() as any);

        const updatedProfile = {
            ...mockProfile,
            bosses: [{ id: '1', name: 'The Root Pack', defeated: true, difficulty: 'Easy' as const }],
        };
        (api.updateProfile as jest.Mock).mockResolvedValue(updatedProfile);

        await store.dispatch(toggleBoss('1') as any);

        const state = (store.getState() as RootState).profile;
        expect(state.bosses[0].defeated).toBe(true);
    });

    it('should handle cycleLevelStatus', async () => {
        (api.getProfile as jest.Mock).mockResolvedValue(mockProfile);
        await store.dispatch(fetchProfile() as any);

        const updatedProfile = {
            ...mockProfile,
            levels: [{ id: '1', name: 'Forest Follies', status: 'available' as const }],
        };
        (api.updateProfile as jest.Mock).mockResolvedValue(updatedProfile);

        await store.dispatch(cycleLevelStatus('1') as any);

        const state = (store.getState() as RootState).profile;
        expect(state.levels[0].status).toBe('available');
    });
});
