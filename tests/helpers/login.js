/**
 * Login using specified credentials.
 * 
 * @param {import('@playwright/test').Page} page - Playwright page instance
 * @param {string} username - username to login
 * @param {string} password - password to login
 */
export async function loginWithCred(page, username, password) {
    let status = false;
    await page.goto('/sign-in', {waitUntil: 'load'});
    await page.getByRole('textbox', { name: 'Enter your email' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(username);
    await page.locator('div').filter({ hasText: /^PasswordForgot Password\?\*$/ }).locator('span').nth(1).click();
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    // if (await expect(page.locator('.ant-message-notice-content')).toBeVisible()) {
    //     throw new Error("[LOGIN] Login failed!");
    //     return status;
    // }
    status = true;
    return status;
}
