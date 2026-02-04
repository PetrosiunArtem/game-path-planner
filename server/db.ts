import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.AMVERA_POSTGRES_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL,
});

export default pool;
