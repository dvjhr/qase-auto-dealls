import { test, expect } from '@playwright/test';
import { clickAndCheckTab } from './helpers/mentoring.js';
import { time } from 'console';

test.describe('Mentor Discovery', {
    tag: ['@mentoring', '@mentor_discovery'],
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

        // *** Start waiting for the specific response BEFORE the actions that trigger it ***
        const responsePromise = page.waitForResponse(response => {
            // 1. Check if the URL path matches exactly
            const url = new URL(response.url()); // Use URL object for easier parsing
            if (url.pathname !== expectedApiUrlPath) {
                return false; // Not the correct API endpoint path
            }

            // 2. Check if the search parameter matches the term we entered
            // Use searchParams.get() for reliable parameter checking
            if (url.searchParams.get('search')?.toLowerCase() !== searchTerm.toLowerCase()) {
                return false; // Search term doesn't match what we typed
            }

            // 3. Optional: Check method and status
            if (response.request().method() !== 'GET') {
                return false; // Not a GET request
            }
            // We might want to wait even if the response is not ok() yet,
            // and check ok() status later in the assertions.
            // But filtering here ensures we wait *only* for a successful search request.
            if (!response.ok()) {
                return false; // Not a successful response (2xx status)
            }

            // If all checks pass, this is the response we are waiting for
            console.log(`---> Matched Response URL: ${response.url()}`); // Add logging for debugging
            return true;
        },
            // Optional: Add a timeout if needed, otherwise uses test timeout
            // { timeout: 10000 }
        );

        // *** Perform the actions that should trigger the network request ***
        await searchInput.click();
        await searchInput.fill(searchTerm);
        // The fill action (often with a debounce) triggers the API call.
        // The listener started above is now active and waiting.

        // *** Wait for the API call (that was triggered by fill) to complete ***
        console.log('Waiting for API response...');
        const response = await responsePromise;
        console.log(`<<< Received API response: ${response.status()} ${response.url()}`);

        // Parse the JSON body of the response
        const responseBody = await response.json();

        // *** Assertion 2: Verify relevance based on 'expertises', 'name', or 'roleName' ***
        expect(response.ok()).toBeTruthy(); // Ensure the specific response we waited for was successful
        expect(responseBody?.data?.docs).toBeDefined(); // Basic structure check
        expect(Array.isArray(responseBody.data.docs)).toBe(true);

        // Ensure there are results before iterating
        expect(responseBody.data.docs.length).toBeGreaterThan(0);

        for (const doc of responseBody.data.docs) {
            expect(doc).toBeDefined();
            const hasMatchingExpertise = doc.expertises?.some(expertise =>
                expertise?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            ) ?? false; // Use optional chaining and nullish coalescing for safety

            const nameMatches = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
            const roleMatches = doc.roleName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;

            // Assert that *at least one* of these conditions is true for *each* returned mentor
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

        // Click on the "Akademik (S1 & S2)" link
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

        // Click on the "Akademik (S1 & S2)" link
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

        // *** Start waiting for the specific response BEFORE the actions that trigger it ***
        const responsePromise = page.waitForResponse(response => {
            // 1. Check if the URL path matches exactly
            const url = new URL(response.url()); // Use URL object for easier parsing
            if (url.pathname !== expectedApiUrlPath) {
                return false; // Not the correct API endpoint path
            }

            // // 2. Check if the search parameter matches the term we entered
            // // Use searchParams.get() for reliable parameter checking
            // if (url.searchParams.get('search')?.toLowerCase() !== searchTerm.toLowerCase()) {
            //     return false; // Search term doesn't match what we typed
            // }

            // 3. Optional: Check method and status
            if (response.request().method() !== 'GET') {
                return false; // Not a GET request
            }
            // We might want to wait even if the response is not ok() yet,
            // and check ok() status later in the assertions.
            // But filtering here ensures we wait *only* for a successful search request.
            if (!response.ok()) {
                return false; // Not a successful response (2xx status)
            }

            // If all checks pass, this is the response we are waiting for
            console.log(`---> Matched Response URL: ${response.url()}`); // Add logging for debugging
            return true;
        },
            // Optional: Add a timeout if needed, otherwise uses test timeout
            // { timeout: 10000 }
        );

        // *** Perform the actions that should trigger the network request ***
        let index = 0;
        let flag = false;
        let searchVal = '';
        while (!flag) {
            await searchInput.click();
            console.log(`Search input class: ${await searchInput.getAttribute('class')}`);
            searchVal = await searchInput.getAttribute('class');
            if (searchVal.toString().includes('text-tertiary-violet-50')) {
                flag = true;
            }
            await page.waitForTimeout(1000);
            index++
        }
        await page.waitForURL('**/mentoring?mCategory=*');
        await expect(page.url()).toContain('mCategory');
        await page.waitForLoadState()
        // await expect(await searchInput.getAttribute('class')).toContain('text-tertiary-violet-50');
        // await searchInput.fill(searchTerm);
        // The fill action (often with a debounce) triggers the API call.
        // The listener started above is now active and waiting.

        // *** Wait for the API call (that was triggered by fill) to complete ***
        console.log('Waiting for API response...');
        const response = await responsePromise;
        console.log(`<<< Received API response: ${response.status()} ${response.url()}`);

        // Parse the JSON body of the response
        const responseBody = await response.json();

        // *** Assertion 2: Verify relevance based on 'expertises', 'name', or 'roleName' ***
        expect(response.ok()).toBeTruthy(); // Ensure the specific response we waited for was successful
        expect(responseBody?.data?.docs).toBeDefined(); // Basic structure check
        expect(Array.isArray(responseBody.data.docs)).toBe(true);

        // Ensure there are results before iterating
        expect(responseBody.data.docs.length).toBeGreaterThan(0);

        for (const doc of responseBody.data.docs) {
            expect(doc).toBeDefined();
            const hasMatchingExpertise = doc.expertises?.some(expertise =>
                expertise?.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) ?? false; // Use optional chaining and nullish coalescing for safety

            // Assert that *at least one* of these conditions is true for *each* returned mentor
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
        console.log(`Search input UUID: ${searchInputUUID}`)
        expect(searchInputUUID).not.toBeNull();

        // *** Start waiting for the specific response BEFORE the actions that trigger it ***
        const responsePromise = page.waitForResponse(response => {
            // 1. Check if the URL path matches exactly
            const url = new URL(response.url()); // Use URL object for easier parsing
            if (url.pathname !== expectedApiUrlPath) {
                return false; // Not the correct API endpoint path
            }

            // // 2. Check if the search parameter matches the term we entered
            // // Use searchParams.get() for reliable parameter checking
            // if (url.searchParams.get('search')?.toLowerCase() !== searchTerm.toLowerCase()) {
            //     return false; // Search term doesn't match what we typed
            // }

            // 3. Optional: Check method and status
            if (response.request().method() !== 'GET') {
                return false; // Not a GET request
            }
            // We might want to wait even if the response is not ok() yet,
            // and check ok() status later in the assertions.
            // But filtering here ensures we wait *only* for a successful search request.
            if (!response.ok()) {
                return false; // Not a successful response (2xx status)
            }

            // If all checks pass, this is the response we are waiting for
            console.log(`---> Matched Response URL: ${response.url()}`); // Add logging for debugging
            return true;
        },
            // Optional: Add a timeout if needed, otherwise uses test timeout
            // { timeout: 10000 }
        );

        // *** Perform the actions that should trigger the network request ***
        await searchInput.click();
        // await searchInput.fill(searchTerm);
        // The fill action (often with a debounce) triggers the API call.
        // The listener started above is now active and waiting.

        // *** Wait for the API call (that was triggered by fill) to complete ***
        console.log('Waiting for API response...');
        const response = await responsePromise;
        console.log(`<<< Received API response: ${response.status()} ${response.url()}`);

        // Parse the JSON body of the response
        const responseBody = await response.json();

        // *** Assertion 2: Verify relevance based on 'expertises', 'name', or 'roleName' ***
        expect(response.ok()).toBeTruthy(); // Ensure the specific response we waited for was successful
        expect(responseBody?.data?.docs).toBeDefined(); // Basic structure check
        expect(Array.isArray(responseBody.data.docs)).toBe(true);

        // Ensure there are results before iterating
        expect(responseBody.data.docs.length).toBeGreaterThan(0);

        for (const doc of responseBody.data.docs) {
            expect(doc).toBeDefined();
            const resultMatching = doc.academicExpertiseCategoryIds?.some(category =>
                category?.includes(searchInputUUID)
            ) ?? false; // Use optional chaining and nullish coalescing for safety

            // Assert that *at least one* of these conditions is true for *each* returned mentor
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

        // *** Start waiting for the specific response BEFORE the actions that trigger it ***
        const responsePromise = page.waitForResponse(response => {
            // 1. Check if the URL path matches exactly
            const url = new URL(response.url()); // Use URL object for easier parsing
            if (url.pathname !== expectedApiUrlPath) {
                return false; // Not the correct API endpoint path
            }

            // // 2. Check if the search parameter matches the term we entered
            // // Use searchParams.get() for reliable parameter checking
            // if (url.searchParams.get('search')?.toLowerCase() !== searchTerm.toLowerCase()) {
            //     return false; // Search term doesn't match what we typed
            // }

            // 3. Optional: Check method and status
            if (response.request().method() !== 'GET') {
                return false; // Not a GET request
            }
            // We might want to wait even if the response is not ok() yet,
            // and check ok() status later in the assertions.
            // But filtering here ensures we wait *only* for a successful search request.
            if (!response.ok()) {
                return false; // Not a successful response (2xx status)
            }

            // If all checks pass, this is the response we are waiting for
            console.log(`---> Matched Response URL: ${response.url()}`); // Add logging for debugging
            return true;
        },
            // Optional: Add a timeout if needed, otherwise uses test timeout
            // { timeout: 10000 }
        );

        await page.locator('div').filter({ hasText: /^Ketersediaan Terdekat$/ }).nth(2).click();
        await page.getByText('Terbaru', { exact: true }).click();

        // *** Wait for the API call (that was triggered by fill) to complete ***
        console.log('Waiting for API response...');
        const response = await responsePromise;
        console.log(`<<< Received API response: ${response.status()} ${response.url()}`);

        // Parse the JSON body of the response
        const responseBody = await response.json();

        // *** Assertion 2: Verify relevance based on 'expertises', 'name', or 'roleName' ***
        expect(response.ok()).toBeTruthy(); // Ensure the specific response we waited for was successful
        expect(responseBody?.data?.docs).toBeDefined(); // Basic structure check
        expect(Array.isArray(responseBody.data.docs)).toBe(true);

        // Ensure there are results before iterating
        expect(responseBody.data.docs.length).toBeGreaterThan(0);

        const createdAtList = [];
        for (const doc of responseBody.data.docs) {
            expect(doc).toBeDefined();
            createdAtList.push(doc.createdAt);
        }

        // Verify that the createdAt values are sorted from latest to earliest
        for (let i = 1; i < createdAtList.length; i++) {
            expect(new Date(createdAtList[i - 1]).getTime()).toBeGreaterThanOrEqual(new Date(createdAtList[i]).getTime(),
                `createdAt values are not sorted correctly. ${createdAtList[i - 1]} should be >= ${createdAtList[i]}`);
        }
    });
    
    test.afterEach(async ({ page }) => {
        await page.close();
    });

});