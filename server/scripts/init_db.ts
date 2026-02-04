import pool from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function init() {
    console.log('Starting Database Initialization...');
    try {
        // 1. Read and execute schema.sql
        const schemaPath = path.join(__dirname, '../schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema.sql...');
        await pool.query(schema);
        console.log('Schema created successfully.');

        // 2. Run refinements migration logic
        console.log('Running refinement migration...');
        // Weapons cost 3-4 coins
        await pool.query("UPDATE weapons SET cost = 3 WHERE id IN ('2', '4', '6', '8')");
        await pool.query("UPDATE weapons SET cost = 4 WHERE id IN ('3', '5', '7', '9')");
        await pool.query("UPDATE weapons SET cost = 0 WHERE id = '1'"); // Peashooter is free
        await pool.query('UPDATE skills SET cost = 0');
        console.log('Refinements applied successfully.');

        console.log('Database initialization complete.');
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

init();
