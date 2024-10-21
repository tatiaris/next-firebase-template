import { test, expect } from '@playwright/test';
import { signIn, signOut } from './utils';

test('sign in and sign out', async ({ page }) => {
  await signIn(page);
  await expect(page.getByText(/nft_test_user@gmail.com/)).toBeVisible();
  await signOut(page);
  await expect(page.getByText(/Sign In/)).toBeVisible();
});
