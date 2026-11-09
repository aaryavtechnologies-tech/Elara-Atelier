import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 900})
        page = await context.new_page()

        print("1. Loading index.html...")
        await page.goto('http://localhost:8080/index.html', wait_until='networkidle')

        services_section = page.locator('#services-highlight')
        await services_section.scroll_into_view_if_needed()
        await page.wait_for_timeout(500)
        await services_section.screenshot(path='C:/Users/Admin/.gemini/antigravity/brain/284c27d0-e9a3-4f2d-af6d-ad92836ae74a/preview_new_covers_home.png')
        print("Captured preview_new_covers_home.png")

        print("2. Testing Makeup Services redirection...")
        makeup_card = page.locator('.service-circle-card[data-category="makeup"]')
        await makeup_card.click()
        await page.wait_for_load_state('networkidle')
        await page.wait_for_timeout(800)
        print(f"Landed on: {page.url}")

        await page.screenshot(path='C:/Users/Admin/.gemini/antigravity/brain/284c27d0-e9a3-4f2d-af6d-ad92836ae74a/preview_services_makeup_new_cover.png')
        print("Captured preview_services_makeup_new_cover.png")

        await browser.close()
        print("Test finished successfully!")

asyncio.run(run())
