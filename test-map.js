const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching Chromium...');
  const browser = await puppeteer.launch({ 
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  
  const page = await browser.newPage();
  
  // Capture console errors
  const errors = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error' || type === 'warning') {
      errors.push(`${type.toUpperCase()}: ${text}`);
      console.log(`${type.toUpperCase()}: ${text}`);
    }
  });
  
  page.on('pageerror', err => {
    errors.push(`PAGE ERROR: ${err.message}`);
    console.log(`PAGE ERROR: ${err.message}`);
  });
  
  console.log('Loading http://localhost:8081/');
  const response = await page.goto('http://localhost:8081/', { waitUntil: 'networkidle0', timeout: 30000 });
  console.log(`Status: ${response.status()}`);
  
  // Wait for map to render
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Check if homelandData exists
  const dataExists = await page.evaluate(() => {
    return typeof window.homelandData !== 'undefined';
  });
  
  console.log('\n=== Results ===');
  console.log('homelandData exists:', dataExists);
  
  if (dataExists) {
    const buffaloInfo = await page.evaluate(() => {
      const data = window.homelandData;
      if (!data || !data.buffaloHerds) return null;
      return {
        count: data.buffaloHerds.features.length,
        features: data.buffaloHerds.features.map(f => ({
          name: f.properties.name,
          type: f.geometry.type,
          coords: f.geometry.coordinates ? f.geometry.coordinates.length : 0
        }))
      };
    });
    console.log('Buffalo Herds:', JSON.stringify(buffaloInfo, null, 2));
  }
  
  // Check if Leaflet map container exists
  const mapExists = await page.evaluate(() => {
    return document.getElementById('map') !== null;
  });
  console.log('Map container exists:', mapExists);
  
  // Take screenshot
  await page.screenshot({ path: 'test-map.png', fullPage: true });
  console.log('\nScreenshot saved to test-map.png');
  
  await browser.close();
  
  if (errors.length > 0) {
    console.log('\n⚠️  ERRORS FOUND:', errors.length);
    for (const err of errors) {
      console.log('  -', err);
    }
    process.exit(1);
  } else {
    console.log('\n✓ No errors detected!');
    process.exit(0);
  }
})();
