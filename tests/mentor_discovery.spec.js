import { test, expect } from '@playwright/test';
import { clickAndCheckTab } from './helpers/mentoring.js';

test.describe('Mentor Discovery', {
    tag: ['@mentoring', '@mentor-discovery'],
}, () => {

    test('MNT_MDK_001 - Find mentor by VALID nama mentor', async ({ page }, testInfo) => {
        console.log(`[DEBUG] Now running ${testInfo.title}`);
        await page.goto('/mentoring');

        const searchTerm = 'Mentor';
        await page.getByRole('textbox', { name: 'Cari berdasarkan nama,' }).click();
        await page.getByRole('textbox', { name: 'Cari berdasarkan nama,' }).fill(searchTerm);
        await expect(
            page.locator(
                `//a[starts-with(@href, '/mentoring/')][contains(normalize-space(.), "${searchTerm}")]`
            ).first()).toContainText(searchTerm, { ignoreCase: true });
    });

    test('MNT_MDK_002 - Find mentor by VALID pengalaman', async ({ page }, testInfo) => {
        console.log(`[DEBUG] Now running ${testInfo.title}`);
        const searchInput = page.getByPlaceholder('Cari berdasarkan nama');
        const searchTerm = 'Mobile';
        const expectedApiUrlPath = '/v2/mentoring/mentor/list';

        await page.goto('/mentoring');

        const responsePromise = page.waitForResponse(response => {
            const url = new URL(response.url());
            if (url.pathname !== expectedApiUrlPath) {
                return false;
            }

            if (url.searchParams.get('search')?.toLowerCase() !== searchTerm.toLowerCase()) {
                return false;
            }

            if (response.request().method() !== 'GET') {
                return false;
            }
            if (!response.ok()) {
                return false;
            }

            console.log(`---> Matched Response URL: ${response.url()}`);
            return true;
        },
        );

        await searchInput.click();
        await searchInput.fill(searchTerm);

        console.log('Waiting for API response...');
        const response = await responsePromise;
        console.log(`<<< Received API response: ${response.status()} ${response.url()}`);

        const responseBody = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(responseBody?.data?.docs).toBeDefined();
        expect(Array.isArray(responseBody.data.docs)).toBe(true);

        expect(responseBody.data.docs.length).toBeGreaterThan(0);

        for (const doc of responseBody.data.docs) {
            expect(doc).toBeDefined();
            const hasMatchingExpertise = doc.expertises?.some(expertise =>
                expertise?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            ) ?? false;

            const nameMatches = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
            const roleMatches = doc.roleName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;

            expect(
                hasMatchingExpertise || nameMatches || roleMatches,
                `Mentor ${doc.name} (ID: ${doc.id}) in the response should have expertise, name, or role relevant to "${searchTerm}". Found: expertises=${JSON.stringify(doc.expertises)}, name=${doc.name}, role=${doc.roleName}`
            ).toBe(true);
        }
    });

    test('MNT_MDK_003 - Find mentor by VALID nama perusahaan', async ({ page }, testInfo) => {
        console.log(`[DEBUG] Now running ${testInfo.title}`);
        let find_textbox = "//input[@id='searchMentor']";
        await page.goto('/mentoring');
        await page.locator(
            find_textbox
        ).click();
        await page.locator(
            find_textbox
        ).fill('Tokopedia');
        await expect(page.locator("//a[starts-with(@href, '/mentoring/')][contains(normalize-space(.), 'Tokopedia')]")
            .first())
            .toContainText('Tokopedia', { ignoreCase: true });
    });

    test('MNT_MDK_004 - Find mentor by VALID topik keahlian', async ({ page }, testInfo) => {
        console.log(`[DEBUG] Now running ${testInfo.title}`);
        let find_textbox = "//input[@id='searchMentor']";
        let keyword = 'Topic 1';
        await page.goto('/mentoring');
        await page.locator(
            find_textbox
        ).click();
        await page.locator(
            find_textbox
        ).fill(keyword);
        await expect(page.locator(`//a[starts-with(@href, '/mentoring/')][contains(normalize-space(.), '${keyword}')]`)
            .first())
            .toContainText(keyword, { ignoreCase: true });
    });

    test('MNT_MDK_005 - Find mentor by VALID pendidikan', async ({ page }, testInfo) => {
        console.log(`[DEBUG] Now running ${testInfo.title}`);
        let find_textbox = "//input[@id='searchMentor']";
        let keyword = "University of Indonesia";
        await page.goto('/mentoring');

        await expect(clickAndCheckTab(page, 'Akademik (S1 & S2)')).toBeTruthy();

        await page.locator(
            find_textbox
        ).click();
        await page.locator(
            find_textbox
        ).fill(keyword);
        await expect(page.locator(`//a[starts-with(@href, '/mentoring/')][contains(normalize-space(.), '${keyword}')]`)
            .first())
            .toContainText(keyword, { ignoreCase: true });
    });

    test('MNT_MDK_006 - Find mentor by INVALID keyword', async ({ page }, testInfo) => {
        console.log(`[DEBUG] Now running ${testInfo.title}`);
        let find_textbox = "//input[@id='searchMentor']";
        let keyword = '123;>=-';
        let result = "Tidak ada hasil pencarian ditemukan";
        await page.goto('/mentoring');
        await page.locator(
            find_textbox
        ).click();
        await page.locator(
            find_textbox
        ).fill(keyword);
        await expect(page.locator('//*[@id="__next"]//main//h3')).toContainText('Tidak ada hasil pencarian ditemukan');
    });

    test('MNT_MDC_001 - Find mentor by VALID tab', async ({ page }, testInfo) => {
        console.log(`[DEBUG] Now running ${testInfo.title}`);
        let find_textbox = "//input[@id='searchMentor']";
        await page.goto('/mentoring');

        await expect(clickAndCheckTab(page, 'Akademik (S1 & S2)')).toBeTruthy();

        let major_icon = page.locator(`//a[starts-with(@href, '/mentoring/')]//*[name()="svg"]/*[name()="g"][@clip-path="url(#clip0_2002_7835)"]`)
        let uni_icon = page.locator(`//a[starts-with(@href, '/mentoring/')]//*[name()="svg"]/*[name()="mask"][@id="path-1-outside-1_5796_13198"]`)
        let mentor_card = page.locator(`//a[starts-with(@href, '/mentoring/') and not(contains(@href, 'my-session'))]`)

        const mentorCount = await mentor_card.count();
        await expect(major_icon).toHaveCount(mentorCount);
        await expect(uni_icon).toHaveCount(mentorCount);
    });

    test('MNT_MDC_002 - Find mentor by VALID category in Karier tab', async ({ page }, testInfo) => {
        console.log(`[DEBUG] Now running ${testInfo.title}`);
        const searchTerm = 'Sales & Ops';
        const searchInput = page.locator(`//a[normalize-space(text())="${searchTerm}"]`);
        const expectedApiUrlPath = '/v2/mentoring/mentor/list';

        await page.goto('/mentoring');

        const responsePromise = page.waitForResponse(response => {
            const url = new URL(response.url());
            if (url.pathname !== expectedApiUrlPath) {
                return false;
            }


            if (response.request().method() !== 'GET') {
                return false;
            }
            if (!response.ok()) {
                return false;
            }

            console.log(`---> Matched Response URL: ${response.url()}`);
            return true;
        },
        );

        await searchInput.click();

        console.log('Waiting for API response...');
        const response = await responsePromise;
        console.log(`<<< Received API response: ${response.status()} ${response.url()}`);

        const responseBody = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(responseBody?.data?.docs).toBeDefined();
        expect(Array.isArray(responseBody.data.docs)).toBe(true);

        expect(responseBody.data.docs.length).toBeGreaterThan(0);

        for (const doc of responseBody.data.docs) {
            expect(doc).toBeDefined();
            const hasMatchingExpertise = doc.expertises?.some(expertise =>
                expertise?.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) ?? false;

            expect(
                hasMatchingExpertise,
                `Mentor ${doc.name} (ID: ${doc.id}) in the response should have expertise, name, or role relevant to "${searchTerm}". Found: expertises=${JSON.stringify(doc.expertises)}`
            ).toBe(true);
        }
    });

    test('MNT_MDC_003 - Find mentor by VALID category in Akademik tab', async ({ page }, testInfo) => {
        console.log(`[DEBUG] Now running ${testInfo.title}`);
        const expectedApiUrlPath = '/v2/mentoring/mentor/list';

        await page.goto('/mentoring');

        await expect(clickAndCheckTab(page, 'Akademik (S1 & S2)')).toBeTruthy();
        const searchTerm = 'Leadership Program';
        const searchInput = page.locator(`//a[normalize-space(text())="${searchTerm}"]`);
        const searchInputHref = await searchInput.getAttribute('href');
        const regex = /mCategory=(.*?)(?:&|$)/;
        const match = searchInputHref.match(regex);
        const searchInputUUID = match ? match[1] : null;
        console.log(`[DEBUG] Search input UUID: ${searchInputUUID}`)
        expect(searchInputUUID).not.toBeNull();

        const responsePromise = page.waitForResponse(response => {
            const url = new URL(response.url());
            if (url.pathname !== expectedApiUrlPath) {
                return false;
            }


            if (response.request().method() !== 'GET') {
                return false;
            }
            if (!response.ok()) {
                return false;
            }

            console.log(`---> Matched Response URL: ${response.url()}`);
            return true;
        },
        );

        await searchInput.click();

        console.log('Waiting for API response...');
        const response = await responsePromise;
        console.log(`<<< Received API response: ${response.status()} ${response.url()}`);

        const responseBody = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(responseBody?.data?.docs).toBeDefined();
        expect(Array.isArray(responseBody.data.docs)).toBe(true);

        expect(responseBody.data.docs.length).toBeGreaterThan(0);

        for (const doc of responseBody.data.docs) {
            expect(doc).toBeDefined();
            const resultMatching = doc.academicExpertiseCategoryIds?.some(category =>
                category?.includes(searchInputUUID)
            ) ?? false;

            expect(
                resultMatching,
                `Mentor ${doc.name} (ID: ${doc.id}) in the response should have expertise, name, or role relevant to "${searchInputUUID}". Found: ${resultMatching} in ${JSON.stringify(doc.expertises)}`
            ).toBe(true);
        }
    });

    test('MNT_MDC_005 - Sort mentor list', async ({ page }, testInfo) => {
        console.log(`[DEBUG] Now running ${testInfo.title}`);
        await page.goto('/mentoring');
        const expectedApiUrlPath = '/v2/mentoring/mentor/list';

        const responsePromise = page.waitForResponse(response => {
            const url = new URL(response.url());
            if (url.pathname !== expectedApiUrlPath) {
                return false;
            }


            if (response.request().method() !== 'GET') {
                return false;
            }
            if (!response.ok()) {
                return false;
            }

            console.log(`---> Matched Response URL: ${response.url()}`);
            return true;
        },
        );

        await page.locator('div').filter({ hasText: /^Ketersediaan Terdekat$/ }).nth(2).click();
        await page.getByText('Terbaru', { exact: true }).click();

        console.log('Waiting for API response...');
        const response = await responsePromise;
        console.log(`<<< Received API response: ${response.status()} ${response.url()}`);

        const responseBody = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(responseBody?.data?.docs).toBeDefined();
        expect(Array.isArray(responseBody.data.docs)).toBe(true);

        expect(responseBody.data.docs.length).toBeGreaterThan(0);

        const createdAtList = [];
        for (const doc of responseBody.data.docs) {
            expect(doc).toBeDefined();
            createdAtList.push(doc.createdAt);
        }

        for (let i = 1; i < createdAtList.length; i++) {
            expect(new Date(createdAtList[i - 1]).getTime()).toBeGreaterThanOrEqual(new Date(createdAtList[i]).getTime(),
                `createdAt values are not sorted correctly. ${createdAtList[i - 1]} should be >= ${createdAtList[i]}`);
        }
    });
    
    test.afterEach(async ({ page }) => {
        await page.close();
    });

});