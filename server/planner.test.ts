import { calculateCombatPath } from './plannerLogic';

describe('Monte-Carlo Combat Simulation Engine [Scientific Full Model]', () => {
    const highStats = [
        { name: 'Accuracy', level: 10 },
        { name: 'Survival', level: 10 },
        { name: 'Pattern Recognition', level: 10 },
        { name: 'Parry Skill', level: 10 },
        { name: 'Movement', level: 10 },
    ];

    test('Speedrun profile should achieve S-Rank Grade on Easy boss', () => {
        const result = calculateCombatPath({
            bossName: 'The Root Pack',
            bossDifficulty: 'Easy',
            isBossDefeated: false,
            loadout: { weapon_primary: 'Spread', weapon_secondary: 'Charge', charm: 'Smoke Bomb' },
            skills: highStats,
            ownedWeaponNames: ['Spread', 'Charge', 'Peashooter'],
        });

        // Easy boss with max stats should be Grade S or A
        expect(['Grade S', 'Grade A']).toContain(result.strategyLabel);
        console.log(`Speedrun Quality vs Root Pack: ${result.strategyLabel}`);
    });

    test('Experienced profile should show realistic win rates on Hard boss', () => {
        const result = calculateCombatPath({
            bossName: 'Grim Matchstick',
            bossDifficulty: 'Hard',
            isBossDefeated: false,
            loadout: { weapon_primary: 'Lobber', weapon_secondary: 'Charge', charm: 'Smoke Bomb' },
            skills: highStats,
            ownedWeaponNames: ['Lobber', 'Charge', 'Peashooter'],
        });

        // Hard boss with max stats should be winnable but challenging
        expect(result.efficiencyScore).toBeGreaterThan(0.4);
        console.log(`Experienced quality vs Grim Matchstick: ${result.efficiencyScore * 100}% [${result.strategyLabel}]`);
    });
});
