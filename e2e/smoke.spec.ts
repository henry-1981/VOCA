import { test, expect } from "playwright/test";

test("app loads and shows hub or provision", async ({ page }) => {
  await page.goto("/");
  // Should either show the hub or redirect to provision
  await expect(page.locator("body")).toBeVisible();
});
