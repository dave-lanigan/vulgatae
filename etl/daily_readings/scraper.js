const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeLatinMassReadings() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://latinmasshelper.com/readings/', { 
      waitUntil: 'networkidle2' 
    });
    
    // Extract data from the page
    const readings = await page.evaluate(() => {
      const readingElements = document.querySelectorAll('.reading'); // Adjust selector
      const results = [];
      
      readingElements.forEach(element => {
        const title = element.querySelector('h3')?.textContent.trim() || '';
        const content = element.querySelector('p')?.textContent.trim() || '';
        
        results.push({
          title,
          content
        });
      });
      
      return results;
    });
    
    // Save to JSON
    fs.writeFileSync('readings.json', JSON.stringify(readings, null, 2));
    console.log(`Scraped ${readings.length} readings`);
    
  } catch (error) {
    console.error('Error scraping:', error);
  } finally {
    await browser.close();
  }
}

scrapeLatinMassReadings();
