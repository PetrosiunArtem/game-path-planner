export interface Loadout {
  id: string;
  name: string;
  weaponPrimary: string;
  weaponSecondary: string;
  charm: string;
  superMove: string;
}

export interface ProgressItem {
  id: string;
  type: 'weapon' | 'boss' | 'level' | 'achievement';
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface PathResult {
  id: string;
  goalName: string;
  estimatedTimeMinutes: number;
  attemptsEstimation: number;
  recommendedLoadoutId: string | null;
  steps: string[];
  progressionTips?: string[];
  efficiencyScore: number;
  strategyLabel: string;
  aiAdvice: string;
  simulationTranscript?: string[];
  factorImpacts?: { factor: string; impact: number; type: 'positive' | 'negative' }[];
  monteCarloDistribution?: number[];
}

export interface Weapon {
  id: string;
  name: string;
  type: string;
  damage: number;
  owned: boolean;
  cost: number;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  cost: number;
}

export interface Boss {
  id: string;
  name: string;
  defeated: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
}

export interface Level {
  id: string;
  name: string;
  status: 'locked' | 'available' | 'completed';
  coinsCollected: number;
  totalCoins: number;
}

export interface ProfileData {
  weapons: Weapon[];
  skills: Skill[];
  bosses: Boss[];
  levels: Level[];
}

const isProd = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
const API_BASE_URL = isProd ? `${window.location.origin}/api` : 'http://localhost:3000/api';

const fallbackProfile: ProfileData = {
  weapons: [
    { id: '1', name: 'Peashooter', type: 'Standard', damage: 30, owned: true, cost: 0 },
  ],
  skills: [],
  bosses: [],
  levels: [],
};

const fallbackLoadouts: Loadout[] = [
  { id: 'default', name: 'Default Setup', weaponPrimary: 'Peashooter', weaponSecondary: 'Spread', charm: 'Smoke Bomb', superMove: 'Super Art I' }
];

const fallbackPathResult: PathResult = {
  id: 'sim-fallback',
  goalName: 'Unknown Encounter',
  estimatedTimeMinutes: 30,
  attemptsEstimation: 5,
  recommendedLoadoutId: null,
  steps: ['Observe boss patterns', 'Conserve HP in early phases', 'Deliver final blow'],
  efficiencyScore: 0.5,
  strategyLabel: 'Cautious Approach',
  aiAdvice: 'Tactical link unstable. Recommending defensive playstyle until data sync is restored.'
};

export const api = {
  async getLoadouts(): Promise<Loadout[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/loadouts`);
      if (!response.ok) throw new Error('Failed to fetch loadouts');
      return await response.json();
    } catch (error) {
      console.warn('API Error (getLoadouts), using fallback:', error);
      return fallbackLoadouts;
    }
  },

  async createLoadout(loadout: Omit<Loadout, 'id'>): Promise<Loadout> {
    try {
      const response = await fetch(`${API_BASE_URL}/loadouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loadout),
      });
      if (!response.ok) throw new Error('Failed to create loadout');
      return await response.json();
    } catch (error) {
      return { ...loadout, id: 'temp-' + Date.now() } as Loadout;
    }
  },

  async updateLoadout(loadout: Loadout): Promise<Loadout> {
    try {
      const response = await fetch(`${API_BASE_URL}/loadouts/${loadout.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loadout),
      });
      if (!response.ok) throw new Error('Failed to update loadout');
      return await response.json();
    } catch (error) {
      return loadout;
    }
  },

  async deleteLoadout(id: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/loadouts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete loadout');
      const result = await response.json();
      return result.id;
    } catch (error) {
      return id;
    }
  },

  async getProfile(): Promise<ProfileData> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return await response.json();
    } catch (error) {
      return fallbackProfile;
    }
  },

  async updateProfile(profile: ProfileData): Promise<ProfileData> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return profile;
    } catch (error) {
      return profile;
    }
  },

  async calculatePath(bossName: string, loadoutId: string): Promise<PathResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/calculate-path`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bossName, loadoutId }),
      });
      if (!response.ok) throw new Error('Failed to calculate path');
      return await response.json();
    } catch (error) {
      return fallbackPathResult;
    }
  },

  async getLogs(): Promise<ProgressItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/logs`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  async createLog(log: Omit<ProgressItem, 'id' | 'date'>): Promise<ProgressItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      if (!response.ok) throw new Error('Failed to create log entry');
      return await response.json();
    } catch (error) {
      return { ...log, id: 'temp-' + Date.now(), date: new Date().toISOString() } as ProgressItem;
    }
  },

  async toggleLog(id: string): Promise<ProgressItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/${id}/toggle`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to toggle log status');
      return await response.json();
    } catch (error) {
      throw error; // Or return a mock if toggle fails
    }
  },
};
