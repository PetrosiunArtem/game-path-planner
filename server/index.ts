import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { calculateCombatPath } from './plannerLogic.js';
import pool from './db.js';

interface LoadoutRow {
    id: string;
    name: string;
    weapon_primary: string;
    weapon_secondary: string;
    charm: string;
    super_move: string;
}

interface WeaponRow {
    id: string;
    name: string;
    type: string;
    damage: number;
    owned: boolean;
    cost: number;
}

interface SkillRow {
    id: string;
    name: string;
    level: number;
    max_level: number;
    cost: number;
}

interface LevelRow {
    id: string;
    name: string;
    status: string;
    coins_collected: number;
    total_coins: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.use((_req: Request, _res: Response, next: NextFunction) => {
    next();
});

const mapLoadout = (row: LoadoutRow) => ({
    id: row.id,
    name: row.name,
    weaponPrimary: row.weapon_primary,
    weaponSecondary: row.weapon_secondary,
    charm: row.charm,
    superMove: row.super_move
});

app.get('/api/loadouts', async (_req: Request, res: Response) => {
    try {
        const result = await pool.query<LoadoutRow>('SELECT * FROM loadouts');
        res.json(result.rows.map(mapLoadout));
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.post('/api/loadouts', async (req: Request, res: Response) => {
    const { name, weaponPrimary, weaponSecondary, charm, superMove } = req.body;
    try {
        const id = uuidv4();
        const result = await pool.query<LoadoutRow>(
            'INSERT INTO loadouts (id, name, weapon_primary, weapon_secondary, charm, super_move) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, name, weaponPrimary, weaponSecondary, charm, superMove]
        );
        res.status(201).json(mapLoadout(result.rows[0]));
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.put('/api/loadouts/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, weaponPrimary, weaponSecondary, charm, superMove } = req.body;
    try {
        const result = await pool.query<LoadoutRow>(
            'UPDATE loadouts SET name = $1, weapon_primary = $2, weapon_secondary = $3, charm = $4, super_move = $5 WHERE id = $6 RETURNING *',
            [name, weaponPrimary, weaponSecondary, charm, superMove, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Loadout not found' });
        res.json(mapLoadout(result.rows[0]));
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.get('/api/profile', async (_req: Request, res: Response) => {
    try {
        const weaponsResult = await pool.query<WeaponRow>('SELECT * FROM weapons');
        const skillsResult = await pool.query<SkillRow>('SELECT * FROM skills');
        const bossesResult = await pool.query<{ id: string, name: string, defeated: boolean, difficulty: string }>('SELECT * FROM bosses');
        const levelsResult = await pool.query<LevelRow>('SELECT * FROM levels');

        res.json({
            weapons: weaponsResult.rows.map((w) => ({
                ...w,
                cost: w.cost || 0
            })),
            skills: skillsResult.rows.map((s) => ({
                ...s,
                maxLevel: s.max_level,
                cost: s.cost || 1
            })),
            bosses: bossesResult.rows,
            levels: levelsResult.rows.map((l) => ({
                ...l,
                coinsCollected: l.coins_collected,
                totalCoins: l.total_coins
            })),
        });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.put('/api/profile', async (req: Request, res: Response) => {
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
                await client.query(
                    'UPDATE levels SET status = $1, coins_collected = $2, total_coins = $3 WHERE id = $4',
                    [l.status, l.coinsCollected || 0, l.totalCoins || 5, l.id]
                );
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

app.get('/api/logs', async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM logs ORDER BY date DESC, id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.post('/api/logs', async (req: Request, res: Response) => {
    const { type, title, description, completed } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO logs (type, title, description, completed) VALUES ($1, $2, $3, $4) RETURNING *',
            [type, title, description, completed || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.put('/api/logs/:id/toggle', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE logs SET completed = NOT completed WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Log not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.post('/api/calculate-path', async (req: Request, res: Response) => {
    const { bossName, loadoutId } = req.body;
    try {
        const loadoutResult = await pool.query<LoadoutRow>('SELECT * FROM loadouts WHERE id = $1', [loadoutId]);
        const skillsResult = await pool.query<SkillRow>('SELECT * FROM skills');
        const bossesResult = await pool.query<{ name: string, difficulty: string, defeated: boolean }>('SELECT * FROM bosses WHERE name = $1', [bossName]);
        const weaponsResult = await pool.query<WeaponRow>('SELECT * FROM weapons');
        const levelsResult = await pool.query<LevelRow>('SELECT * FROM levels');

        const usedLoadout = loadoutResult.rows[0];
        const skills = skillsResult.rows;
        const targetBoss = bossesResult.rows[0];
        const weapons = weaponsResult.rows;
        const levels = levelsResult.rows;

        const result = calculateCombatPath({
            bossName,
            bossDifficulty: targetBoss?.difficulty || 'Medium',
            isBossDefeated: targetBoss?.defeated || false,
            loadout: usedLoadout ? {
                weapon_primary: usedLoadout.weapon_primary,
                weapon_secondary: usedLoadout.weapon_secondary,
                charm: usedLoadout.charm
            } : null,
            skills: skills.map((s) => ({
                name: s.name,
                level: s.level,
                maxLevel: s.max_level,
                cost: s.cost || 1
            })),
            weapons: weapons.map((w) => ({
                name: w.name,
                owned: w.owned,
                cost: w.cost || 0
            })),
            levels: levels.map((l) => ({
                name: l.name,
                status: l.status,
                coinsCollected: l.coins_collected,
                totalCoins: l.total_coins
            }))
        });

        if (result) {
            res.json({
                ...result,
                recommendedLoadoutId: loadoutId
            });
        } else {
            res.status(400).json({ error: 'Incomplete data for calculation' });
        }
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export { app };

if (process.env.NODE_ENV !== 'test') {
    app.get(/^(?!\/api).+/, (_req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
