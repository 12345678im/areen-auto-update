import { chromium } from 'playwright';
import fs from 'fs/promises';

(async () => {
  const phones = (await fs.readFile('phones.txt', 'utf8')).split('\n').filter(Boolean);

  for (const phone of phones) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://update.areen.net/', { waitUntil: 'networkidle' });

    // انتظر حتى يظهر حقل رقم الجوال الصحيح
    await page.waitForSelector('#mobileNumber', { timeout: 30000 });

    // أدخل الرقم
    await page.fill('#mobileNumber', phone);

    // اضغط زر الإرسال
    await page.click('#submitBtn');

    console.log(Submitted for: ${phone});

    await browser.close();

    // انتظر 5 دقائق
    await new Promise(res => setTimeout(res, 5 * 60 * 1000));
  }
})();
