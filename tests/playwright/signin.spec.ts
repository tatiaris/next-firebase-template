import { test, expect } from '@playwright/test';
import { signIn } from './utils';

test('sign in', async ({ page }) => {
  await signIn(page);
  await expect(page.getByText(/rt_template-testing@gmail.com/)).toBeVisible();
});
