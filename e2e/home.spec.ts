import { test, expect } from "@playwright/test";

test.describe("NOVA STELYA Homepage E2E", () => {
  test("should load successfully and show main heading", async ({ page }) => {
    await page.goto("/");
    
    // Check main title is visible and contains correct text
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Натяжні Стелі");
  });

  test("should toggle language via language selector", async ({ page }) => {
    await page.goto("/");
    
    // Check language selector link for RU
    const ruSelector = page.locator("a", { hasText: /^RU$/ });
    await expect(ruSelector).toBeVisible();
    
    // Click and verify path prefix updates to /ru
    await ruSelector.click();
    await expect(page).toHaveURL(/\/ru$/);

    // Main heading should now contain Russian text
    const heading = page.locator("h1");
    await expect(heading).toContainText("Натяжные Потолки");
  });

  test("should select a city and navigate to its hub page on prefix-less UK", async ({ page }) => {
    await page.goto("/");
    
    // Open city selector dropdown
    const citySelector = page.locator("button", { hasText: "Вся Україна" });
    await expect(citySelector).toBeVisible();
    await citySelector.click();

    // Select Kyiv
    const kyivItem = page.locator("li", { hasText: /^Київ$/ });
    await expect(kyivItem).toBeVisible();
    await kyivItem.click();

    // Verify url changes to /kyiv (no prefix)
    await expect(page).toHaveURL(/\/kyiv$/);

    // Verify Kyiv title is rendered
    const heading = page.locator("h1");
    await expect(heading).toContainText("Натяжні Стелі у Києві");

    // Content should be present, not null
    const subtext = page.locator("p", { hasText: /філіалу NOVA STELYA/ });
    await expect(subtext).toBeVisible();
  });

  test("should navigate to a service page inside a city on UK locale", async ({ page }) => {
    await page.goto("/kyiv");

    // Find and click a service details button
    const serviceCard = page.locator("div").filter({ hasText: "Матові" }).first();
    const serviceLink = serviceCard.locator("a").first();
    await expect(serviceLink).toBeVisible();
    await serviceLink.click();

    // URL should be /kyiv/matte-ceilings
    await expect(page).toHaveURL(/\/kyiv\/matte-ceilings$/);

    // Heading should be local
    const heading = page.locator("h1");
    await expect(heading).toContainText("Матові натяжні стелі");
    await expect(heading).toContainText("у Києві");
  });

  test("should remove city context when selecting Whole Ukraine", async ({ page }) => {
    await page.goto("/kyiv/matte-ceilings");

    // Open city selector and select "Вся Україна"
    const citySelector = page.locator("button", { hasText: "Київ" });
    await expect(citySelector).toBeVisible();
    await citySelector.click();

    const wholeUkraineItem = page.locator("li", { hasText: "Вся Україна" });
    await expect(wholeUkraineItem).toBeVisible();
    await wholeUkraineItem.click();

    // URL should revert to general /matte-ceilings
    await expect(page).toHaveURL(/\/matte-ceilings$/);

    // Heading should update
    const heading = page.locator("h1");
    await expect(heading).toContainText("Матові натяжні стелі");
  });

  test("should switch languages correctly on city pages", async ({ page }) => {
    await page.goto("/kyiv");

    // Switch to RU
    const ruSelector = page.locator("a", { hasText: /^RU$/ });
    await ruSelector.click();

    await expect(page).toHaveURL(/\/ru\/kyiv$/);
    const heading = page.locator("h1");
    await expect(heading).toContainText("Натяжные Потолки в Киеве");

    // Switch back to UK
    const ukSelector = page.locator("a", { hasText: /^UK$/ });
    await ukSelector.click();
    await expect(page).toHaveURL(/\/kyiv$/);
  });
});
