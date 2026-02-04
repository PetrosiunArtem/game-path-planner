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
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
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
}

export interface ProfileData {
  weapons: Weapon[];
  skills: Skill[];
  bosses: Boss[];
  levels: Level[];
}

const API_BASE_URL = 'http://localhost:3000/api';

// API Service
export const api = {
  // Loadouts CRUD
  async getLoadouts(): Promise<Loadout[]> {
    const response = await fetch(`${API_BASE_URL}/loadouts`);
    if (!response.ok) throw new Error('Failed to fetch loadouts');
    return response.json();
  },

  async createLoadout(loadout: Omit<Loadout, 'id'>): Promise<Loadout> {
    const response = await fetch(`${API_BASE_URL}/loadouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loadout),
    });
    if (!response.ok) throw new Error('Failed to create loadout');
    return response.json();
  },

  async updateLoadout(loadout: Loadout): Promise<Loadout> {
    const response = await fetch(`${API_BASE_URL}/loadouts/${loadout.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loadout),
    });
    if (!response.ok) throw new Error('Failed to update loadout');
    return response.json();
  },

  async deleteLoadout(id: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/loadouts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete loadout');
    const result = await response.json();
    return result.id;
  },

  // Profile CRUD
  async getProfile(): Promise<ProfileData> {
    const response = await fetch(`${API_BASE_URL}/profile`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async updateProfile(profile: ProfileData): Promise<ProfileData> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return profile;
  },

  // Planner Logic (Moved to backend)
  async calculatePath(bossName: string, loadoutId: string): Promise<PathResult> {
    const response = await fetch(`${API_BASE_URL}/calculate-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bossName, loadoutId }),
    });
    if (!response.ok) throw new Error('Failed to calculate path');
    return response.json();
  },

  // Logs API
  async getLogs(): Promise<ProgressItem[]> {
    const response = await fetch(`${API_BASE_URL}/logs`);
    if (!response.ok) throw new Error('Failed to fetch logs');
    return response.json();
  },

  async createLog(log: Omit<ProgressItem, 'id' | 'date'>): Promise<ProgressItem> {
    const response = await fetch(`${API_BASE_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
    if (!response.ok) throw new Error('Failed to create log entry');
    return response.json();
  },

  async toggleLog(id: string): Promise<ProgressItem> {
    const response = await fetch(`${API_BASE_URL}/logs/${id}/toggle`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to toggle log status');
    return response.json();
  },
};
