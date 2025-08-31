import { chromium } from 'playwright';
import fs from 'fs';

async function scrapeLatinMassReadings() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://latinmasshelper.com/readings/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Extract readings
    const readings = await page.$$eval('selector-here', elements => {
      return elements.map(el => ({
        title: el.querySelector('h3')?.textContent?.trim() || '',
        content: el.querySelector('p')?.textContent?.trim() || ''
      }));
    });
    
    // Save data
    fs.writeFileSync('readings.json', JSON.stringify(readings, null, 2));
    console.log(`Scraped ${readings.length} readings`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

scrapeLatinMassReadings();
