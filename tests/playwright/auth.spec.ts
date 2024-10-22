import { test, expect } from "@playwright/test";
import { signIn, signOut } from "./utils";

test("sign in and sign out", async ({ page }) => {
  await signIn(page);
  await page.locator('[automation-id="btn-user-menu"]').click();
  await expect(page.getByText(/nft_test_user@gmail.com/)).toBeVisible();
  await page.locator('[automation-id="btn-user-menu"]').click();
  await signOut(page);
  await expect(page.getByText(/Sign In/)).toBeVisible();
});
