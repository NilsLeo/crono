/**
 * Playwright code generator for Cronometer custom recipes scraping.
 *
 * Recipe names live in div.gwt-Label elements inside div[role="button"]
 * rows within the scrollable list on the #custom-recipes page.
 *
 * Returns { success: true, recipes: [{ name }] }
 */
export function buildRecipesCode(): string {
  return `
    await page.goto('https://cronometer.com/#custom-recipes', { waitUntil: 'domcontentloaded', timeout: 15000 });

    const url = page.url();
    if (url.includes('/login') || url.includes('/signin')) {
      return { success: false, error: 'Not logged in. Login may have failed.' };
    }

    // Wait for the GWT widget to render the recipe list.
    // The search input appears before list items finish rendering, so we wait
    // for an actual recipe row to be present before scraping.
    await page.waitForSelector('input[placeholder*="recipes"]', { timeout: 10000 });
    await page.waitForSelector('div[role="button"] .gwt-Label', { timeout: 10000 }).catch(() => {});

    const recipes = await page.evaluate(() => {
      // Recipe rows are div[role="button"] elements containing a div.gwt-Label child
      const rows = Array.from(document.querySelectorAll('div[role="button"]'));
      return rows
        .map((row) => {
          const label = row.querySelector('.gwt-Label');
          return label ? { name: label.textContent?.trim() ?? '' } : null;
        })
        .filter((r) => r !== null && r.name.length > 0);
    });

    return { success: true, recipes };
  `;
}
