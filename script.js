import { chromium } from 'playwright';
import fs from 'fs/promises';

(async () => {
  const phones = (await fs.readFile('phones.txt', 'utf8')).split('\n').filter(Boolean);

  for (const phone of phones) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://update.areen.net/');

    await page.fill('input[name="mobile"]', phone);

    await page.click('button[type="submit"]');

    console.log(`Submitted for: ${phone}`);

    await browser.close();

    await new Promise(res => setTimeout(res, 5 * 60 * 1000));
  }
})();
