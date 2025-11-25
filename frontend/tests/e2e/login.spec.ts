import { test, expect } from '@playwright/test'

test.describe('Giriş sayfası', () => {
    test('başlık ve form öğeleri görünüyor', async ({ page }) => {
        await page.goto('/login')

        await expect(page.getByRole('heading', { name: /Tekrar hoş geldin/i })).toBeVisible()
        await expect(page.getByLabel(/email/i)).toBeVisible()
        await expect(page.getByLabel(/şifre/i)).toBeVisible()
        await expect(page.getByRole('button', { name: /giriş yap/i })).toBeVisible()
    })
})

