// Types
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

// Profile types
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

// API Service
// Fallback Data
const fallbackProfile: ProfileData = {
  weapons: [
    { id: 'w1', name: 'Peashooter', type: 'Standard', damage: 10, owned: true, cost: 0 },
    { id: 'w2', name: 'Spread', type: 'Spread', damage: 15, owned: false, cost: 4 },
    { id: 'w3', name: 'Chaser', type: 'Homing', damage: 8, owned: true, cost: 4 },
  ],
  skills: [
    { id: 's1', name: 'Health', level: 3, maxLevel: 5, cost: 1 },
    { id: 's2', name: 'Super Meter', level: 2, maxLevel: 5, cost: 1 },
  ],
  bosses: [
    { id: 'b1', name: 'The Root Pack', defeated: true, difficulty: 'Easy' },
    { id: 'b2', name: 'Goopy Le Grande', defeated: true, difficulty: 'Easy' },
    { id: 'b3', name: 'Hilda Berg', defeated: false, difficulty: 'Medium' },
    { id: 'b4', name: 'Cagney Carnation', defeated: false, difficulty: 'Medium' },
  ],
  levels: [
    { id: 'l1', name: 'Inkwell Isle I', status: 'available', coinsCollected: 0, totalCoins: 5 },
    { id: 'l2', name: 'Inkwell Isle II', status: 'locked', coinsCollected: 0, totalCoins: 5 },
  ],
};

const fallbackLoadouts: Loadout[] = [
  { id: 'default', name: 'Default Setup', weaponPrimary: 'Peashooter', weaponSecondary: 'Spread', charm: 'Smoke Bomb', superMove: 'Super Art I' }
];

// API Service
export const api = {
  // Loadouts CRUD
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
      console.warn('API Error, simulating creation:', error);
      return { ...loadout, id: 'temp-' + Date.now() };
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

  // Profile CRUD
  async getProfile(): Promise<ProfileData> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return await response.json();
    } catch (error) {
      console.warn('API Error (getProfile), using fallback:', error);
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
      console.warn('API Error (updateProfile), simulating success:', error);
      return profile;
    }
  },

  // Planner Logic (Moved to backend)
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
      console.warn('API Error (calculatePath), using fallback simulation:', error);
      // Fallback simulation result
      return {
        id: 'sim-fallback',
        goalName: bossName,
        estimatedTimeMinutes: 5,
        attemptsEstimation: 12,
        recommendedLoadoutId: loadoutId,
        steps: [
          'Phase 1: Dodge initial attacks using Smoke Bomb.',
          'Phase 2: Use Spread for high DPS during close encounters.',
          'Phase 3: Activate Super Art I for finishing blow.'
        ],
        efficiencyScore: 0.85,
        strategyLabel: 'Aggressive Rush',
        aiAdvice: 'Keep moving and use your dash invincibility frames.',
        simulationTranscript: [
          'Initializing combat simulation...',
          'Analyzing movement patterns...',
          'Simulation complete.'
        ],
        monteCarloDistribution: [0, 5, 20, 50, 80, 70, 40, 10, 5, 0]
      };
    }
  },

  // Logs API
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
      return { ...log, id: 'temp-log', date: new Date().toISOString() };
    }
  },

  async toggleLog(id: string): Promise<ProgressItem> {
    const response = await fetch(`${API_BASE_URL}/logs/${id}/toggle`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to toggle log status');
    return await response.json();
  },
};
