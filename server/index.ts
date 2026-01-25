import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pool from './db';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Log all requests
app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Loadouts
const mapLoadout = (row: any) => ({
    ...row,
    weaponPrimary: row.weapon_primary,
    weaponSecondary: row.weapon_secondary,
    superMove: row.super_move
});

app.get('/api/loadouts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM loadouts');
        res.json(result.rows.map(mapLoadout));
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.post('/api/loadouts', async (req, res) => {
    const { name, weaponPrimary, weaponSecondary, charm, superMove } = req.body;
    try {
        const id = uuidv4();
        const result = await pool.query(
            'INSERT INTO loadouts (id, name, weapon_primary, weapon_secondary, charm, super_move) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, name, weaponPrimary, weaponSecondary, charm, superMove]
        );
        res.status(201).json(mapLoadout(result.rows[0]));
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.put('/api/loadouts/:id', async (req, res) => {
    const { id } = req.params;
    const { name, weaponPrimary, weaponSecondary, charm, superMove } = req.body;
    try {
        const result = await pool.query(
            'UPDATE loadouts SET name = $1, weapon_primary = $2, weapon_secondary = $3, charm = $4, super_move = $5 WHERE id = $6 RETURNING *',
            [name, weaponPrimary, weaponSecondary, charm, superMove, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Loadout not found' });
        res.json(mapLoadout(result.rows[0]));
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.delete('/api/loadouts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM loadouts WHERE id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Loadout not found' });
        res.json({ id });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Profile (Combined weapons, skills, bosses, levels)
app.get('/api/profile', async (req, res) => {
    try {
        const weapons = await pool.query('SELECT * FROM weapons');
        const skills = await pool.query('SELECT * FROM skills');
        const bosses = await pool.query('SELECT * FROM bosses');
        const levels = await pool.query('SELECT * FROM levels');

        res.json({
            weapons: weapons.rows,
            skills: skills.rows.map(s => ({ ...s, maxLevel: s.max_level })),
            bosses: bosses.rows,
            levels: levels.rows,
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: (err as Error).message });
    }
});

app.put('/api/profile', async (req, res) => {
    const { weapons, skills, bosses, levels } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        if (weapons) {
            for (const w of weapons) {
                await client.query('UPDATE weapons SET owned = $1 WHERE id = $2', [w.owned, w.id]);
            }
        }
        if (skills) {
            for (const s of skills) {
                await client.query('UPDATE skills SET level = $1 WHERE id = $2', [s.level, s.id]);
            }
        }
        if (bosses) {
            for (const b of bosses) {
                await client.query('UPDATE bosses SET defeated = $1 WHERE id = $2', [b.defeated, b.id]);
            }
        }
        if (levels) {
            for (const l of levels) {
                await client.query('UPDATE levels SET status = $1 WHERE id = $2', [l.status, l.id]);
            }
        }

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: (err as Error).message });
    } finally {
        client.release();
    }
});

// Planner Logic (Moved to backend)
const BOSS_DATA: Record<string, { weaknesses: string[]; tips: string[]; resistances?: string[] }> = {
    'The Root Pack': {
        weaknesses: ['Peashooter', 'Spread'],
        tips: ['Stay in the center for the potato', 'Use Spread for the onion', 'Parry the tears'],
    },
    'Goopy Le Grande': {
        weaknesses: ['Spread', 'Chaser'],
        tips: ['Duck when he punches', 'Keep moving in phase 2', 'Stay under the tombstone'],
    },
    'Ribby and Croaks': {
        weaknesses: ['Spread', 'Roundabout'],
        tips: ['Duck the fireflies', 'Parry the pink punches', 'Use Roundabout for the slot machine'],
    },
    'Hilda Berg': {
        weaknesses: ['Peashooter', 'Chaser'],
        tips: ['Save your super for the moon phase', 'Watch out for the UFO beams', 'Maintain distance in bull form'],
    },
    'Cagney Carnation': {
        weaknesses: ['Lobber', 'Roundabout'],
        tips: ['Stay on the top platforms during phase 2', 'Use Lobber from the platforms for max DPS', 'Watch for the boomerang seeds'],
    },
    'Baroness Von Bon Bon': {
        weaknesses: ['Charge', 'Spread'],
        tips: ['Use Charge for the small minions', 'Spread is effective when the castle is close', 'Save Super Art for the final head-chase phase'],
    },
    'King Dice': {
        weaknesses: ['Chaser', 'Roundabout'],
        tips: ['Focus on the dice timing', 'Chaser is great for the parry-march', 'Save your super for the final phase'],
    },
    'The Devil': {
        weaknesses: ['Spread', 'Charge'],
        tips: ['Stay under his eyes during phase 1', 'Use Spread for max DPS in phase 2', 'Parry the tears'],
    },
};

const STRATEGY_TIERS = [
    { threshold: 0.9, label: 'S-Rank Strategy' },
    { threshold: 0.7, label: 'Solid Plan' },
    { threshold: 0.4, label: 'Risky Setup' },
    { threshold: 0, label: 'Underprepared' },
];

app.post('/api/calculate-path', async (req, res) => {
    const { bossName, loadoutId } = req.body;
    try {
        const loadoutResult = await pool.query('SELECT * FROM loadouts WHERE id = $1', [loadoutId]);
        const usedLoadout = loadoutResult.rows[0];
        const bossInfo = BOSS_DATA[bossName] || {
            weaknesses: [],
            tips: ['Stay focused!', 'Watch attack patterns.'],
        };

        let score = 0.5;
        let timeModifier = 1.0;
        let advice = '';

        if (usedLoadout) {
            const weapons = [usedLoadout.weapon_primary, usedLoadout.weapon_secondary];
            const hasWeakness = weapons.some(w => bossInfo.weaknesses.includes(w));

            // Influence logic
            const hasChaser = weapons.includes('Chaser');
            const hasSpread = weapons.includes('Spread');
            const hasCharge = weapons.includes('Charge');
            const hasRoundabout = weapons.includes('Roundabout');
            const hasSmokeBomb = usedLoadout.charm === 'Smoke Bomb';
            const hasCoffee = usedLoadout.charm === 'Coffee';

            // Score (Efficiency/Probability)
            if (hasWeakness) score += 0.2;
            if (hasChaser) score += 0.15; // Stability
            if (hasSmokeBomb) score += 0.2; // Survival
            if (bossName === 'Cagney Carnation' && weapons.includes('Lobber')) score += 0.25;

            // Time Modifier (DPS/Speed)
            if (hasCharge) timeModifier -= 0.2;
            if (hasSpread) timeModifier -= 0.1;
            if (hasChaser) timeModifier += 0.15; // Chaser is lower DPS
            if (hasCoffee) timeModifier -= 0.05; // Faster Supers

            // Tactical Advice Logic
            if (hasSmokeBomb) {
                advice = 'Smoke Bomb equipped. Your dodge window is significantly increased, allowing for aggressive repositioning.';
            }

            if (hasChaser) {
                advice += ' Chaser provides consistent damage while focusing on evasion. Strategy: "Safe & Slow".';
            } else if (hasCharge) {
                advice += ' Charge shot requires high precision but offers devastating output. Focus on timing.';
            }

            if (bossName === 'Hilda Berg' && (hasRoundabout || weapons.includes('Peashooter'))) {
                advice = 'Hilda often moves out of range; Roundabout or Peashooter are excellent for maintaining pressure.';
            }

            if (!advice) {
                advice = hasWeakness
                    ? `The ${usedLoadout.weapon_primary} is well-suited for this target's patterns.`
                    : 'Your current weapons are neutral against this target. Precision will be key.';
            }
        }

        const efficiencyScore = Math.min(1, score);
        const tier = STRATEGY_TIERS.find((t) => efficiencyScore >= t.threshold) || STRATEGY_TIERS[3];
        const attempts = Math.max(1, Math.round(10 * (1.1 - efficiencyScore)));

        res.json({
            id: uuidv4(),
            goalName: `Defeat ${bossName}`,
            estimatedTimeMinutes: Math.round(25 * timeModifier),
            attemptsEstimation: attempts,
            recommendedLoadoutId: loadoutId,
            steps: bossInfo.tips,
            efficiencyScore: efficiencyScore,
            strategyLabel: tier.label,
            aiAdvice: advice || (
                efficiencyScore > 0.8
                    ? 'Your loadout is perfectly suited for this encounter. Aggressive play is recommended.'
                    : 'Consider switching to weapons with higher spread or homing for this boss.'
            ),
        });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
