import { expect } from "@playwright/test";

export const signIn = async (page) => {
  await page.goto("http://localhost:3000/");
  await expect(page.getByText(/Sign In/)).toBeVisible();
  await page.locator('[name="email"]').fill("nft_test_user@gmail.com");
  await page.locator('[name="password"]').fill("NFTemplateTest!123");
  await page.locator('[automation-id="btn-sign-in"]').click();
};

export const signOut = async (page) => {
  await page.locator('[automation-id="btn-sign-out"]').click();
};
