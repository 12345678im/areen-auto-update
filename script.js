import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

(async () => {
  const phones = (await fs.readFile('phones.txt', 'utf8')).split('\n').filter(Boolean);

  const successPath = path.resolve('success.txt');
  const failedPath = path.resolve('failed.txt');

  const browser = await chromium.launch();

  for (const phone of phones) {
    const page = await browser.newPage();

    try {
      await page.goto('https://update.areen.net/', { waitUntil: 'networkidle' });

      await page.waitForSelector('#mobileNumber', { timeout: 30000 });
      await page.fill('#mobileNumber', phone);

      const value = await page.inputValue('#mobileNumber');
      if (value !== phone) {
        console.error(`❌ لم يتم إدخال الرقم بشكل صحيح: ${phone}`);
        await fs.appendFile(failedPath, phone + '\n');
        await page.close();
        continue;
      }

      await page.waitForSelector('#submitBtn', { timeout: 10000, state: 'visible' });
      await page.click('#submitBtn');
      console.log(`📤 إرسال: ${phone}`);

      try {
        await page.waitForSelector('#result .alert', { timeout: 10000 });
        const resultText = await page.textContent('#result .alert');

        if (resultText.includes('Done') || resultText.includes('تم') || resultText.includes('בוצע')) {
          console.log(`✅ تم بنجاح: ${phone}`);
          await fs.appendFile(successPath, phone + '\n');
        } else {
          console.warn(`⚠️ رسالة غير متوقعة: ${phone} → ${resultText}`);
          await fs.appendFile(failedPath, phone + '\n');
        }

      } catch (error) {
        console.error(`❌ لم تظهر رسالة النجاح: ${phone}`);
        await fs.appendFile(failedPath, phone + '\n');
      }

    } catch (err) {
      console.error(`❌ فشل في معالجة الرقم: ${phone} | الخطأ: ${err.message}`);
      await fs.appendFile(failedPath, phone + '\n');
    }

    await page.close();

    // الانتظار 5 دقائق قبل الرقم التالي (يمكن تعديل الوقت حسب الحاجة)
    await new Promise(res => setTimeout(res, 5 * 60 * 1000));
  }

  await browser.close();
})();
