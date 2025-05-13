import { expect } from '@playwright/test';

/**
 * Clicks a tab with the given name and asserts it becomes highlighted.
 * Only works for mentoring page tabs.
 * 
 * @param {import('@playwright/test').Page} page - Playwright page instance
 * @param {string} tabText - Visible text of the tab to click
 */
export async function clickAndCheckTab(page, tabText) {
    //   const tab = page.getByRole('link', { name: tabText });
    const tab = page.locator(`//a[normalize-space(text()) = "${tabText}"]`);
    const highlightedClassRegex = /!text-tertiary-violet-50 bg-tertiary-violet-0/;

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        await tab.click();
        attempts++;
        try {
            await expect(tab).toHaveClass(highlightedClassRegex, { timeout: 1000 });
            return;
        } catch {
        }
    }

    console.log(tab.getAttribute('class'));
    await expect(tab).toHaveClass(highlightedClassRegex);
    if (attempts === maxAttempts && !tab.getAttribute('class').match(highlightedClassRegex)) {
        console.error(`Tab "${tabText}" did not become highlighted after ${maxAttempts} attempts.`);
    }
}
