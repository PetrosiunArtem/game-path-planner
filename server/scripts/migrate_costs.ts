import pool from '../db.js';

async function migrate() {
    console.log('Running migration: adding costs to weapons and skills...');
    try {
        // Add cost to weapons
        await pool.query('ALTER TABLE weapons ADD COLUMN IF NOT EXISTS cost INTEGER DEFAULT 4');

        // Add cost to skills
        await pool.query('ALTER TABLE skills ADD COLUMN IF NOT EXISTS cost INTEGER DEFAULT 1');

        // Update some specific costs for variety
        await pool.query("UPDATE weapons SET cost = 4 WHERE id IN ('2', '3', '4', '5', '6')");
        await pool.query("UPDATE weapons SET cost = 0 WHERE id = '1'"); // Peashooter is free
        await pool.query("UPDATE weapons SET cost = 5 WHERE id IN ('7', '8', '9')"); // DLC weapons more expensive

        console.log('Migration successful: Cost columns added and initialized.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

migrate();
