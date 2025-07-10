const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteerExtra.use(StealthPlugin());
puppeteerExtra.puppeteer = puppeteer;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Render-specific browser configuration
async function createBrowser() {
  // Try multiple possible Chrome paths on Render
  const possiblePaths = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/chrome',
    puppeteer.executablePath()
  ].filter(Boolean);

  for (const path of possiblePaths) {
    try {
      const browser = await puppeteerExtra.launch({
        headless: 'new',
        executablePath: path,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
      console.log(`✅ Browser launched successfully at ${path}`);
      return browser;
    } catch (err) {
      console.log(`⚠️ Failed to launch with ${path}, trying next...`);
    }
  }
  throw new Error('Could not find Chrome in any standard location');
}

async function scrapeGoogleMaps(keyword, location, limit = 10) {
  let browser;
  try {
    browser = await createBrowser();
    const page = await browser.newPage();
    
    // [REST OF YOUR ORIGINAL SCRAPING LOGIC HERE]
    // ... (keep all your existing scraping code exactly as is)

    return results.slice(0, limit);
  } catch (err) {
    console.error("🔥 Scraping failed:", err);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = scrapeGoogleMaps;