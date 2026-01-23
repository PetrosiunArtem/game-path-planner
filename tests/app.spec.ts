
import { test, expect } from '@playwright/test';

test.describe('Game Path Planner', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load home page and navigate to Profile', async ({ page }) => {
        await expect(page).toHaveTitle(/Game Path Planner/);
        await page.click('text=Profile');
        await expect(page).toHaveURL(/.*profile/);
        await expect(page.locator('main h1')).toContainText('Player Profile');
    });

    test('should allow toggling weapon ownership', async ({ page }) => {
        await page.goto('/profile');

        try {
            await expect(page.locator('text=Spread')).toBeVisible({ timeout: 5000 });
        } catch (e) {
            console.log('DEBUG: TIMEOUT WAITING FOR SPREAD');
            console.log('PAGE CONTENT DUMP START');
            console.log(await page.content());
            console.log('PAGE CONTENT DUMP END');
            throw e;
        }

        const spreadCard = page.locator('div.border.rounded-lg').filter({ hasText: 'Spread' }).last();
        await spreadCard.click();
        const checkmark = spreadCard.locator('.bg-\\[\\#00d4ff\\]');
        await expect(checkmark).toBeVisible();
    });

    test('should update skill level', async ({ page }) => {
        await page.goto('/profile');
        await expect(page.locator('text=Accuracy')).toBeVisible({ timeout: 10000 });

        const skillCard = page.locator('div.border.rounded-lg').filter({ hasText: 'Accuracy' }).last();
        await expect(skillCard).toContainText('Level 5/10');
        await skillCard.getByRole('button', { name: '+' }).click();
        await expect(skillCard).toContainText('Level 6/10');
    });

    test('should allow calculating a path in Planner', async ({ page }) => {
        await page.goto('/planner');

        // Wait for page load
        await expect(page.locator('main h1')).toContainText('Tactical Planner');

        // Verify Boss Select (starts with value, so placeholder might be gone)
        // We just ensure we can click the calculate button, or change selection if needed.
        // For this test, we accept the defaults if they are valid.

        // Wait for loadouts to load ensuring the second dropdown is populated
        await expect(page.getByRole('combobox').nth(1)).not.toBeDisabled();

        await page.click('text=Initialize Battle Simulation');
        await expect(page.locator('text=Live Intelligence')).toBeVisible({ timeout: 10000 });
    });
});
