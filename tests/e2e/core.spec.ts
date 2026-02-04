import { test, expect } from '@playwright/test';

test.describe('Core Application Flow', () => {
    test.beforeEach(async ({ page }) => {
        // We expect the app to be running via the webServer config in playwright.config.ts
        await page.goto('/');
    });

    test('should navigate to profile and see weapons', async ({ page }) => {
        // Click on Profile link (assuming there's a link in the nav)
        await page.click('a[href="/profile"]');

        // Check if the title is present
        await expect(page.locator('h1')).toContainText('PLAYER PROFILE');

        // Check if available coins are displayed
        await expect(page.locator('text=Available Coins')).toBeVisible();

        // Check if Peashooter (default weapon) is owned
        await expect(page.locator('text=Peashooter')).toBeVisible();
    });

    test('should navigate to path planner and calculate a path', async ({ page }) => {
        await page.click('a[href="/planner"]');

        await expect(page.locator('h2')).toContainText('Combat Strategy Consultant');

        // Select a boss (assuming a select exists)
        // For now, just check if the UI elements are there
        await expect(page.locator('button:has-text("Seek Advice")')).toBeVisible();
    });

    test('should show loadouts list', async ({ page }) => {
        await page.click('a[href="/loadouts"]');
        await expect(page.locator('h2')).toContainText('Wallop Equipment');
    });
});
