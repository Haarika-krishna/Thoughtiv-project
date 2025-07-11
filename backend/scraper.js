const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteerExtra.use(StealthPlugin());
puppeteerExtra.puppeteer = puppeteer;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeGoogleMaps(keyword, location, limit = 10) {
  const browser = await puppeteerExtra.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
      '--window-size=1600,1200'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1200 });

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  );

  try {
    console.log("🚀 Launching Google Maps...");
    await page.goto('https://www.google.com/maps', { waitUntil: 'networkidle2', timeout: 60000 });

    await page.type('#searchboxinput', `${keyword} in ${location}`, { delay: 100 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('#searchbox-searchbutton')
    ]);

    await page.waitForSelector('.Nv2PK', { timeout: 30000 });

    const results = [];
    const seenTitles = new Set();
    let retries = 0;

    while (results.length < limit && retries < 20) {
      const newData = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.Nv2PK')).map(el => {
          const title = el.querySelector('.qBF1Pd')?.innerText || 'No title';

          const address = Array.from(el.querySelectorAll('.W4Efsd span span'))
            .map(span => span.innerText?.trim())
            .filter(text =>
              text &&
              text.length > 10 &&
              text.includes(',') &&
              text.split(',').length >= 2 &&
              !text.match(/^[₹$€¥]/) &&
              !text.match(/^Open|Closed|Opens|Closes|Hours|AM|PM/i) &&
              !/^\d+(\.\d+)?$/.test(text) &&
              text !== '·'
            )
            .sort((a, b) => b.length - a.length)[0] || 'No address';

          return { title, address };
        });
      });

      for (const item of newData) {
        if (!seenTitles.has(item.title) && results.length < limit) {
          seenTitles.add(item.title);
          results.push({ ...item, phone: 'Pending' });
          console.log(`✅ Collected ${results.length}: ${item.title}`);
        }
      }

      if (results.length >= limit) break;

      await page.evaluate(() => {
        const scrollable = document.querySelector('div[role="feed"]');
        if (scrollable) scrollable.scrollBy(0, 500);
      });
      await delay(2000);
      retries++;
    }

    // ✅ Extract phone numbers safely using title-matching
    for (let i = 0; i < results.length; i++) {
      try {
        const cards = await page.$$('.Nv2PK');
        let targetCard = null;

        for (const card of cards) {
          const cardTitle = await card.$eval('.qBF1Pd', el => el.innerText.trim());
          if (cardTitle === results[i].title) {
            targetCard = card;
            break;
          }
        }

        if (!targetCard) {
          console.log(`⚠️ Could not find matching card for: ${results[i].title}`);
          results[i].phone = 'No phone';
          continue;
        }

        const clickAndWait = async () => {
          await targetCard.click();
          await page.waitForSelector('.DUwDvf', { timeout: 10000 });
          await delay(1500);
        };

        await Promise.race([
          clickAndWait(),
          delay(15000)
        ]);

        const phone = await page.evaluate(() => {
          const raw = (
            document.querySelector('[data-tooltip="Copy phone number"]')?.innerText ||
            document.querySelector('.UsdlK')?.innerText || ''
          );
          return raw.replace(/^[^\d+]+/, '').trim() || 'No phone';
        });

        results[i].phone = phone;

        const backBtn = await page.$('button[jsaction="pane.back"]');
        if (backBtn) {
          await backBtn.click();
          await page.waitForSelector('.Nv2PK', { timeout: 10000 });
          await delay(1000);
        }
      } catch (err) {
        console.log(`⚠️ Failed to get phone for ${results[i].title}`);
        results[i].phone = 'No phone';
      }
    }

    console.log(`🎯 Total results collected: ${results.length}`);
    return results.slice(0, limit);
  } catch (err) {
    console.error("🔥 Scraping failed:", err.message);
    return [];
  } finally {
    try {
      await browser.close();
      console.log("🛑 Browser closed");
    } catch (closeErr) {
      console.error("❌ Failed to close browser:", closeErr.message);
    }
  }
}

module.exports = scrapeGoogleMaps;
