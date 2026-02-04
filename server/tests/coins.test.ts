import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import request from 'supertest';
import { app } from '../index'; // Adjust path if necessary

describe('Coin Tracking Integration Tests', () => {
    it('should update coin counts for a level and persist in database', async () => {
        // 1. Get initial profile
        const initialRes = await request(app).get('/api/profile');
        expect(initialRes.status).toBe(200);
        const levels = initialRes.body.levels;
        const levelId = 'l1'; // Assuming l1 exists from seed
        const initialLevel = levels.find((l: any) => l.id === levelId);
        expect(initialLevel).toBeDefined();

        // 2. Update coins for level l1
        const newCoins = 3;
        const updatedLevels = levels.map((l: any) =>
            l.id === levelId ? { ...l, coinsCollected: newCoins } : l
        );

        const updateRes = await request(app)
            .put('/api/profile')
            .send({ levels: updatedLevels });
        expect(updateRes.status).toBe(200);

        // 3. Verify persistence
        const verifyRes = await request(app).get('/api/profile');
        expect(verifyRes.status).toBe(200);
        const verifyLevel = verifyRes.body.levels.find((l: any) => l.id === levelId);
        expect(verifyLevel.coinsCollected).toBe(newCoins);
    });
});
