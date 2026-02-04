import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// Setup dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import pool from '../db.js';

async function migrate() {
    console.log('Running migration...');
    try {
        await pool.query('ALTER TABLE levels ADD COLUMN IF NOT EXISTS coins_collected INTEGER DEFAULT 0');
        await pool.query('ALTER TABLE levels ADD COLUMN IF NOT EXISTS total_coins INTEGER DEFAULT 5');
        console.log('Migration successful: Columns added.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

migrate();
