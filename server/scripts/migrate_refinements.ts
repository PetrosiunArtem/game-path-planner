import pool from '../db.js';

async function migrate() {
    console.log('Running refinement migration: updating costs...');
    try {
        // Weapons cost 3-4 coins
        await pool.query("UPDATE weapons SET cost = 3 WHERE id IN ('2', '4', '6', '8')");
        await pool.query("UPDATE weapons SET cost = 4 WHERE id IN ('3', '5', '7', '9')");
        await pool.query("UPDATE weapons SET cost = 0 WHERE id = '1'"); // Peashooter is free

        // Skills cost 0
        await pool.query('UPDATE skills SET cost = 0');

        console.log('Migration successful: Costs updated.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

migrate();
