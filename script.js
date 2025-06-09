import { chromium } from 'playwright';
import fs from 'fs/promises';

(async () => {
  const phones = (await fs.readFile('phones.txt', 'utf8')).split('\n').filter(Boolean);

  for (const phone of phones) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://update.areen.net/', { waitUntil: 'networkidle' });

    await page.waitForSelector('#mobileNumber', { timeout: 30000 });

    await page.fill('#mobileNumber', phone);
    await page.click('#submitBtn');

    // ✅ تم إصلاح الخطأ هنا باستخدام backticks
    console.log(`Submitted for: ${phone}`);

    await browser.close();

    await new Promise(res => setTimeout(res, 5 * 60 * 1000));
  }
})();
