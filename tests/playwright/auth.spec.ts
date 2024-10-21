import { test, expect } from '@playwright/test';
import { signIn, signOut } from './utils';

test('sign in and sign out', async ({ page }) => {
  await signIn(page);
  await expect(page.getByText(/rt_template-testing@gmail.com/)).toBeVisible();
  await signOut(page);
  await expect(page.getByText(/Sign In/)).toBeVisible();
});
