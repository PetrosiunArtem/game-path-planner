
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Loadout {
  id: string;
  name: string;
  weaponPrimary: string;
  weaponSecondary: string;
  charm: string;
  superMove: string;
}

export interface PathResult {
  id: string;
  goalName: string;
  estimatedTimeMinutes: number;
  attemptsEstimation: number;
  recommendedLoadoutId: string | null;
  steps: string[];
  efficiencyScore: number; // 0 to 1
  strategyLabel: string;
  aiAdvice: string;
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

// Initial Data
const INITIAL_LOADOUTS: Loadout[] = [
  {
    id: '1',
    name: 'Standard Peashooter',
    weaponPrimary: 'Peashooter',
    weaponSecondary: 'Spread',
    charm: 'Smoke Bomb',
    superMove: 'Energy Beam',
  },
];

const INITIAL_PROFILE: ProfileData = {
  weapons: [
    { id: '1', name: 'Peashooter', type: 'Standard', damage: 45, owned: true },
    { id: '2', name: 'Spread', type: 'Short Range', damage: 62, owned: false },
    { id: '3', name: 'Chaser', type: 'Homing', damage: 30, owned: false },
    { id: '4', name: 'Lobber', type: 'Medium Range', damage: 55, owned: false },
    { id: '5', name: 'Charge', type: 'Charge Shot', damage: 85, owned: false },
    { id: '6', name: 'Roundabout', type: 'Long Range', damage: 48, owned: false },
  ],
  skills: [
    { id: '1', name: 'Accuracy', level: 5, maxLevel: 10 },
    { id: '2', name: 'Parry Skill', level: 3, maxLevel: 10 },
    { id: '3', name: 'Survival', level: 7, maxLevel: 10 },
    { id: '4', name: 'Movement', level: 4, maxLevel: 10 },
    { id: '5', name: 'Pattern Recognition', level: 2, maxLevel: 10 },
  ],
  bosses: [
    { id: '1', name: 'The Root Pack', defeated: true, difficulty: 'Easy' },
    { id: '2', name: 'Goopy Le Grande', defeated: true, difficulty: 'Easy' },
    { id: '3', name: 'Hilda Berg', defeated: false, difficulty: 'Medium' },
    { id: '4', name: 'Cagney Carnation', defeated: false, difficulty: 'Medium' },
    { id: '5', name: 'Baroness Von Bon Bon', defeated: false, difficulty: 'Hard' },
    { id: '6', name: 'Grim Matchstick', defeated: false, difficulty: 'Hard' },
    { id: '7', name: 'King Dice', defeated: false, difficulty: 'Extreme' },
    { id: '8', name: 'The Devil', defeated: false, difficulty: 'Extreme' },
  ],
  levels: [
    { id: '1', name: 'Forest Follies', status: 'completed' },
    { id: '2', name: 'Treetop Trouble', status: 'completed' },
    { id: '3', name: 'Funfair Fever', status: 'available' },
    { id: '4', name: 'Funhouse Frazzle', status: 'available' },
    { id: '5', name: 'Rugged Ridge', status: 'locked' },
    { id: '6', name: 'Perilous Piers', status: 'locked' },
  ]
};

// Mock Delay Helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// LocalStorage Helper
const getLoadoutsFromStorage = (): Loadout[] => {
  const data = localStorage.getItem('ppp_loadouts');
  if (!data) {
    localStorage.setItem('ppp_loadouts', JSON.stringify(INITIAL_LOADOUTS));
    return INITIAL_LOADOUTS;
  }
  return JSON.parse(data);
};

const saveLoadoutsToStorage = (loadouts: Loadout[]) => {
  localStorage.setItem('ppp_loadouts', JSON.stringify(loadouts));
};

const getProfileFromStorage = (): ProfileData => {
  const data = localStorage.getItem('ppp_profile');
  if (!data) {
    localStorage.setItem('ppp_profile', JSON.stringify(INITIAL_PROFILE));
    return INITIAL_PROFILE;
  }
  return JSON.parse(data);
};

const saveProfileToStorage = (profile: ProfileData) => {
  localStorage.setItem('ppp_profile', JSON.stringify(profile));
};

// Synergies and boss data for "AI" Advisor
const BOSS_DATA: Record<string, { weaknesses: string[], tips: string[] }> = {
  'The Root Pack': {
    weaknesses: ['Peashooter', 'Spread'],
    tips: ['Stay in the center for the potato', 'Use Spread for the onion', 'Parry the tears']
  },
  'Goopy Le Grande': {
    weaknesses: ['Spread', 'Chaser'],
    tips: ['Duck when he punches', 'Keep moving in phase 2', 'Stay under the tombstone']
  },
  // Add more as needed
};

const STRATEGY_TIERS = [
  { threshold: 0.9, label: 'S-Rank Strategy', color: 'text-yellow-400' },
  { threshold: 0.7, label: 'Solid Plan', color: 'text-green-400' },
  { threshold: 0.4, label: 'Risky Setup', color: 'text-orange-400' },
  { threshold: 0, label: 'Underprepared', color: 'text-red-400' }
];

// API Service
export const api = {
  // Loadouts CRUD
  async getLoadouts(): Promise<Loadout[]> {
    await delay(300); // Reduced delay
    return getLoadoutsFromStorage();
  },

  async createLoadout(loadout: Omit<Loadout, 'id'>): Promise<Loadout> {
    await delay(300);
    const newLoadout = { ...loadout, id: uuidv4() };
    const loadouts = getLoadoutsFromStorage();
    loadouts.push(newLoadout);
    saveLoadoutsToStorage(loadouts);
    return newLoadout;
  },

  async updateLoadout(loadout: Loadout): Promise<Loadout> {
    await delay(300);
    const loadouts = getLoadoutsFromStorage();
    const index = loadouts.findIndex((l) => l.id === loadout.id);
    if (index !== -1) {
      loadouts[index] = loadout;
      saveLoadoutsToStorage(loadouts);
      return loadout;
    }
    throw new Error('Loadout not found');
  },

  async deleteLoadout(id: string): Promise<string> {
    await delay(300);
    const loadouts = getLoadoutsFromStorage();
    const filtered = loadouts.filter((l) => l.id !== id);
    saveLoadoutsToStorage(filtered);
    return id;
  },

  // Profile CRUD
  async getProfile(): Promise<ProfileData> {
    await delay(300);
    return getProfileFromStorage();
  },

  async updateProfile(profile: ProfileData): Promise<ProfileData> {
    await delay(300);
    saveProfileToStorage(profile);
    return profile;
  },

  // Planner Logic (Mock AI)
  async calculatePath(bossName: string, loadoutId: string): Promise<PathResult> {
    await delay(600);

    const loadouts = getLoadoutsFromStorage();
    const usedLoadout = loadouts.find(l => l.id === loadoutId);
    const bossInfo = BOSS_DATA[bossName] || { weaknesses: [], tips: ['Stay focused!', 'Watch attack patterns.'] };

    let score = 0.5; // Base score
    let timeModifier = 1.0;

    if (usedLoadout) {
      // Calculate synergy
      const hasWeakness = bossInfo.weaknesses.includes(usedLoadout.weaponPrimary) ||
        bossInfo.weaknesses.includes(usedLoadout.weaponSecondary);

      if (hasWeakness) score += 0.3;
      if (usedLoadout.charm === 'Smoke Bomb') score += 0.1;

      // Specific weapon logic
      if (usedLoadout.weaponPrimary === 'Charge') timeModifier -= 0.2;
    }

    const efficiencyScore = Math.min(1, score);
    const tier = STRATEGY_TIERS.find(t => efficiencyScore >= t.threshold) || STRATEGY_TIERS[3];
    const attempts = Math.max(1, Math.round(10 * (1.1 - efficiencyScore)));

    return {
      id: uuidv4(),
      goalName: `Defeat ${bossName}`,
      estimatedTimeMinutes: Math.round(25 * timeModifier),
      attemptsEstimation: attempts,
      recommendedLoadoutId: loadoutId,
      steps: bossInfo.tips,
      efficiencyScore: efficiencyScore,
      strategyLabel: tier.label,
      aiAdvice: efficiencyScore > 0.8
        ? "Your loadout is perfectly suited for this encounter. Aggressive play is recommended."
        : "Consider switching to weapons with higher spread or homing for this boss."
    };
  }
};
