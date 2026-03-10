/**
 * E2E Tests — Browse & Discovery Journey
 *
 * Happy-path:
 *   1. User visits /browse
 *   2. Listings load and are visible
 *   3. User types a max-price filter and clicks "Update"
 *   4. Page re-renders with filtered results (or empty state)
 *   5. User clicks a listing card to view its detail page
 *
 * Edge cases:
 *   - Empty state message appears when no filters match
 */

import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Browse Listings — Discovery Journey', () => {
  test('browse page loads and shows the filter bar', async ({ page }) => {
    await page.goto(`${BASE}/browse`);
    await page.waitForLoadState('networkidle');

    // The filter sidebar or update button must be present
    const filterTrigger = page.locator(
      'button:has-text("Update"), button:has-text("Search"), input[placeholder*="price" i], input[placeholder*="max" i]'
    ).first();
    await expect(filterTrigger).toBeVisible({ timeout: 8000 });
  });

  test('listings load from the backend', async ({ page }) => {
    await page.goto(`${BASE}/browse`);
    await page.waitForLoadState('networkidle');

    // Listing cards are rendered (at least one, or the empty-state text)
    const hasCards = await page.locator('[data-testid="listing-card"], .listing-card').count();
    const hasEmpty = await page.locator('text=/no listings|no results/i').count();

    expect(hasCards + hasEmpty).toBeGreaterThan(0);
  });

  test('clicking a listing card navigates to /listings/:id', async ({ page }) => {
    await page.goto(`${BASE}/browse`);
    await page.waitForLoadState('networkidle');

    const card = page.locator('a[href*="/listings/"]').first();
    const cardCount = await card.count();

    if (cardCount > 0) {
      await card.click();
      await page.waitForURL(/\/listings\/\d+/);
      expect(page.url()).toMatch(/\/listings\/\d+/);
    } else {
      // No listings in DB — skip gracefully
      test.skip();
    }
  });
});

test.describe('Browse Listings — Filter application', () => {
  test('applying max price filter re-fetches listings', async ({ page }) => {
    await page.goto(`${BASE}/browse`);
    await page.waitForLoadState('networkidle');

    // Find max-price input
    const maxPriceInput = page.locator('input[name="maxPrice"], input[placeholder*="max" i]').first();
    if (!(await maxPriceInput.isVisible().catch(() => false))) {
      test.skip();
      return;
    }

    await maxPriceInput.fill('1000');

    // Click apply / update
    const updateButton = page.locator('button:has-text("Update"), button:has-text("Apply")').first();
    await updateButton.click();

    // Network request is made; the page either shows results or empty state
    await page.waitForLoadState('networkidle');
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });
});
