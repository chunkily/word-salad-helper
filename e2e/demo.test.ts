import { expect, test } from '@playwright/test';

test.describe('Word Salad Input Grid', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('desktop: typing letters fills grid and auto-advances', async ({ page }) => {
		const tile00 = page.locator('#tile-0-0');
		const tile01 = page.locator('#tile-0-1');

		await tile00.click();
		await page.keyboard.press('A');

		await expect(tile00).toHaveValue('A');
		await expect(tile01).toBeFocused();
	});

	test('desktop: backspace navigates backward', async ({ page }) => {
		const tile00 = page.locator('#tile-0-0');
		const tile01 = page.locator('#tile-0-1');

		await tile01.click();
		await page.keyboard.press('Backspace');

		await expect(tile00).toBeFocused();
	});

	test('desktop: arrow keys navigate grid', async ({ page }) => {
		const tile00 = page.locator('#tile-0-0');
		const tile01 = page.locator('#tile-0-1');
		const tile10 = page.locator('#tile-1-0');

		await tile00.click();

		await page.keyboard.press('ArrowRight');
		await expect(tile01).toBeFocused();

		await page.keyboard.press('ArrowLeft');
		await expect(tile00).toBeFocused();

		await page.keyboard.press('ArrowDown');
		await expect(tile10).toBeFocused();
	});

	test('mobile: typing with virtual keyboard works', async ({ page, isMobile }) => {
		test.skip(!isMobile, 'Mobile-only test');

		const tile00 = page.locator('#tile-0-0');
		await tile00.click();
		await tile00.fill('B');

		await expect(tile00).toHaveValue('B');
	});

	test('mobile: can fill entire grid', async ({ page, browserName }) => {
		test.skip(browserName !== 'chromium', 'Mobile emulation test');

		// Test with mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				const tile = page.locator(`#tile-${i}-${j}`);
				await tile.click();
				await tile.fill(String.fromCharCode(65 + i * 4 + j)); // A, B, C, ...
			}
		}

		// Verify all filled
		await expect(page.locator('#tile-0-0')).toHaveValue('A');
		await expect(page.locator('#tile-3-3')).toHaveValue('P');
	});

	test('only accepts letters', async ({ page }) => {
		const tile00 = page.locator('#tile-0-0');

		await tile00.click();
		await page.keyboard.press('1');
		await expect(tile00).toHaveValue('');

		await page.keyboard.press('A');
		await expect(tile00).toHaveValue('A');
	});
});
