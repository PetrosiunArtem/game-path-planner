import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';
import request from 'supertest';

// Setup dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });
process.env.NODE_ENV = 'test';

// Import app after env vars
import { app } from '../index.js'; // Use .js extension for TSX resolution if needed, or try without

async function runTests() {
    console.log('🚀 Starting Coin Tracking Integration Tests...');

    try {
        // 1. Get initial profile
        console.log('Step 1: Fetching initial profile...');
        const initialRes = await request(app).get('/api/profile');
        assert.strictEqual(initialRes.status, 200, 'Using status 200');

        const levels = initialRes.body.levels;
        if (!levels || levels.length === 0) {
            console.error('No levels found in DB. Seed data might be missing.');
            process.exit(1);
        }
        const initialLevel = levels[0];
        const levelId = initialLevel.id;

        assert.ok(initialLevel, `Level ${levelId} found`);
        console.log(`Initial coins for ${levelId}: ${initialLevel.coinsCollected}`);

        // 2. Update coins
        const newCoins = 3; // Ensure this is different from initial if possible, or just set strictly
        console.log(`Step 2: Updating coins to ${newCoins}...`);

        const updatedLevels = levels.map((l: any) =>
            l.id === levelId ? { ...l, coinsCollected: newCoins } : l
        );

        const updateRes = await request(app)
            .put('/api/profile')
            .send({ levels: updatedLevels });

        assert.strictEqual(updateRes.status, 200, 'Update status 200');

        // 3. Verify persistence
        console.log('Step 3: Verifying persistence...');
        const verifyRes = await request(app).get('/api/profile');
        assert.strictEqual(verifyRes.status, 200);

        const verifyLevel = verifyRes.body.levels.find((l: any) => l.id === levelId);
        assert.strictEqual(verifyLevel.coinsCollected, newCoins, 'Coins should be updated in DB');

        console.log('✅ ALL TESTS PASSED');
        process.exit(0);
    } catch (err) {
        console.error('❌ TEST FAILED');
        console.error(err);
        process.exit(1);
    }
}

runTests();
