/**
 * E2E Tests — Authentication Journey
 *
 * path flow:
 *   1. User visits home page
 *   2. Clicks "Sign Up" / navigates to /register
 *   3. Fills in email (student domain) + password
 *   4. Submits — expects redirect to /verify page
 *
 * Edge-case flows:
 *   - Non-student email is rejected with an error message
 *   - Short password shows inline validation
 *   - Already-registered email returns a server error toast
 */

import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

// ── helpers 

async function goToRegister(page: import('@playwright/test').Page) {
  await page.goto(`${BASE}/register`);
  await page.waitForLoadState('networkidle');
}

// ── tests 

test.describe('Registration Flow', () => {
  test('register page loads and shows the email input', async ({ page }) => {
    await goToRegister(page);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('rejects a non-student email with an inline message', async ({ page }) => {
    await goToRegister(page);

    await page.fill('input[type="email"]', 'nonuniversity@gmail.com');
    await page.fill('input[type="password"]', 'Password123!');

    // Submit the form
    await page.click('button[type="submit"]');

    // Assert — should see a rejection message (server or client-side)
    await expect(
      page.locator('text=/student|university|edu|not allowed/i').first()
    ).toBeVisible({ timeout: 6000 });
  });

  test('valid student email advances to verify page', async ({ page }) => {
    // Note: this will hit the real backend.
    // Use a unique email each run to avoid "already registered" conflicts.
    const uniqueEmail = `test_${Date.now()}@uoregon.edu`;
    await goToRegister(page);

    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', 'ValidPass123!');
    // fill confirm-password if present
    const confirmInput = page.locator('input[name="confirmPassword"], input[placeholder*="confirm" i]');
    if (await confirmInput.isVisible().catch(() => false)) {
      await confirmInput.fill('ValidPass123!');
    }

    await page.click('button[type="submit"]');

    // Assert — either redirected to /verify or a verify message is visible
    await expect(
      page.locator('text=/verify|check your email|code/i').first()
    ).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Login Flow', () => {
  test('login page loads with email and password inputs', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto(`${BASE}/login`);

    await page.fill('input[type="email"]', 'wrong@uoregon.edu');
    await page.fill('input[type="password"]', 'WrongPassword!');
    await page.click('button[type="submit"]');

    // Assert — toast or inline error should appear
    await expect(
      page.locator('text=/invalid|incorrect|not found|credentials/i').first()
    ).toBeVisible({ timeout: 6000 });
  });
});
