import { expect } from '@playwright/test';

/**
 * Clicks a tab with the given name and asserts it becomes highlighted.
 * Only works for mentoring page tabs.
 * 
 * @param {import('@playwright/test').Page} page - Playwright page instance
 * @param {string} tabText - Visible text of the tab to click
 */
export async function clickAndCheckTab(page, tabText) {
    const tab = page.locator(`//a[normalize-space(text()) = "${tabText}"]`);
    const highlightedClassRegex = /!text-tertiary-violet-50 bg-tertiary-violet-0/;

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        await tab.click();
        attempts++;
        try {
            await expect(tab).toHaveClass(highlightedClassRegex, { timeout: 1000 });
            return true;
        } catch {
            console.log(`Attempt ${attempts} failed, retrying...`);
            await page.waitForTimeout(500);
        }
    }

    // Final assertion to fail the test if not highlighted
    await expect(tab).toHaveClass(highlightedClassRegex);
    console.log(`Final class retrieved: ${tab.getAttribute('class')}`);
    return false;
}
