/**
 * Login using specified credentials.
 * 
 * @param {import('@playwright/test').Page} page - Playwright page instance
 * @param {string} username - username to login
 * @param {string} password - password to login
 */
export async function loginWithCred(page, username, password) {
    let status = false;

    await page.goto('/sign-in', { waitUntil: 'load' });

    await page.getByRole('textbox', { name: 'Enter your email' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(username);

    await page.locator('div').filter({ hasText: /^PasswordForgot Password\?\*$/ }).locator('span').nth(1).click();
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    const modalMessage = page.locator(`//div[@class='ant-message']//span/..`)
    await modalMessage.first().waitFor({ state: 'visible' });
    
    let modalMessageType = await modalMessage.locator('span').first().getAttribute('class');
    if (modalMessageType.includes('anticon-close-circle')) {
        console.log(`[DEBUG] ${await modalMessage.innerText()}`);
        status = false;
        throw new Error("[LOGIN] Login failed!");
    } else if (modalMessageType.includes('anticon-check-circle')) {
        console.log(`[DEBUG] ${await modalMessage.innerText()}`);
        console.log(`[LOGIN] Login success!`);
        status = true;
    }
    
    return status;
}
