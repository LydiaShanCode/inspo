import { chromium } from 'playwright';
import path from 'path';

async function captureHeyclicky() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.heyclicky.com/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Try to find footer element and screenshot it
    const footer = await page.locator('footer').first();
    if (await footer.count() > 0) {
      await footer.screenshot({ 
        path: path.join(process.cwd(), 'public/uploads/heyclicky-footer.png'),
        type: 'png'
      });
      console.log('Footer screenshot saved');
    } else {
      // Fallback: screenshot bottom portion of page
      const viewportHeight = page.viewportSize()?.height || 800;
      await page.screenshot({
        path: path.join(process.cwd(), 'public/uploads/heyclicky-footer.png'),
        type: 'png',
        clip: {
          x: 0,
          y: await page.evaluate(() => document.body.scrollHeight - 800),
          width: 1920,
          height: 800
        }
      });
      console.log('Bottom section screenshot saved');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

captureHeyclicky();
