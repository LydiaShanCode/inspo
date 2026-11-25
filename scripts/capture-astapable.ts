import { chromium } from 'playwright';
import path from 'path';

async function captureScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  try {
    console.log('Navigating to https://astapable.com/about...');
    await page.goto('https://astapable.com/about', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Wait a bit for any animations
    await page.waitForTimeout(2000);

    // 1. Hero screenshot (top of page)
    console.log('Capturing hero screenshot...');
    await page.screenshot({
      path: path.join(process.cwd(), 'public/uploads/astapable-about-hero.png'),
      type: 'png',
    });

    // 2. Scroll to toolkit section and capture
    console.log('Capturing toolkit/bento section...');
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 0.8);
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(process.cwd(), 'public/uploads/astapable-about-2.png'),
      type: 'png',
    });

    // 3. Full page screenshot
    console.log('Capturing full page...');
    await page.screenshot({
      path: path.join(process.cwd(), 'public/uploads/astapable-about-fullpage.png'),
      type: 'png',
      fullPage: true,
    });

    console.log('✓ All screenshots captured successfully');
  } catch (error) {
    console.error('Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureScreenshots();
