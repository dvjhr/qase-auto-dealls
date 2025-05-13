import { test, expect } from '@playwright/test';
import { loginWithCred } from './helpers/login.js';

test.describe('View Mentoring Session', {
    tag: ['@mentoring', '@view_mentoring_session'],
}, () => {
    
    test('MNT_VMS_001 - View mentoring booking status WITHOUT login', async ({ page }, testInfo) => {
        console.log(`[DEBUG] Now running ${testInfo.title}`);
        await page.goto('/mentoring');
        
        const searchTerm = 'Sesi Saya';
        await page.locator(`//a[normalize-space(text()) = "${searchTerm}"]`).click();
        
        await page.waitForURL('**/mentoring/my-session')
        expect(await page.url()).toContain('/mentoring/my-session');
        await expect(page.locator('[id="__next"]')).toContainText('Jadwalkan Sesi Mentoring Pertama Anda');
        await expect(page.getByRole('img', { name: 'Empty Mentor' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Eksplor Mentor' })).toBeVisible();
    });
    
    test('MNT_VMS_002 - View mentoring booking status WITH login and empty session', async ({ page }, testInfo) => {
        console.log(`[DEBUG] Now running ${testInfo.title}`);
        let login = await loginWithCred(page, "bopam88678@deusa7.com", "12345678");
        expect(login).toBeTruthy();
        
        await expect(page.locator(`//a[normalize-space(@href) = '/notifications']/following-sibling::div`)).toBeVisible();
        await page.goto('/mentoring');
        
        const searchTerm = 'Sesi Saya';
        await page.locator(`//a[normalize-space(text()) = "${searchTerm}"]`).click();
        
        await page.waitForURL('**/mentoring/my-session')
        console.log(`[DEBUG] ${await page.url()}`)
        expect(await page.url()).toContain('/mentoring/my-session');
        await expect(page.locator('[id="__next"]')).toContainText('Anda tidak memiliki sesi mentoring yang akan datang');
        await expect(page.getByRole('img', { name: 'Empty Mentor' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Explore Mentor' })).toBeVisible();
    });
    
    test('MNT_VMS_003 - View mentoring booking status WITH login and not empty session', async ({ page }, testInfo) => {
        console.log(`[DEBUG] Now running ${testInfo.title}`);
        let login = await loginWithCred(page, "hatodo6957@bamsrad.com", "12345678");
        expect(login).toBeTruthy();
    
        await expect(page.locator(`//a[normalize-space(@href) = '/notifications']/following-sibling::div`)).toBeVisible();
        await page.goto('/mentoring');
    
        const searchTerm = 'Sesi Saya';
        await page.locator(`//a[normalize-space(text()) = "${searchTerm}"]`).click();
    
        await page.waitForURL('**/mentoring/my-session')
        console.log(`[DEBUG] ${await page.url()}`)
        expect(await page.url()).toContain('/mentoring/my-session');

        let sessionCard = page.locator(`//div[normalize-space(@role)='presentation']`)
        await sessionCard.first().waitFor({ state: 'visible' });
        let sessionStatus = await sessionCard.count();
        console.log(`[DEBUG] Sesion status count: ${sessionStatus}`);
        expect(sessionStatus).toBeGreaterThan(0);
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });
});