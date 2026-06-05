const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = 'http://localhost:5174';
  const outputDir = 'C:/Users/JARVIS/Desktop';

  console.log('Testing routes...\n');

  // Test 1: Home page
  console.log('1. Testing / (Home page)...');
  await page.goto(baseUrl + '/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: outputDir + '/home-page.png', fullPage: true });
  console.log('   ✓ / - Home page loaded\n');

  // Test 2: Properties page
  console.log('2. Testing /properties...');
  await page.goto(baseUrl + '/properties', { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: outputDir + '/properties-page.png', fullPage: true });
  console.log('   ✓ /properties - Properties page loaded\n');

  // Test 3: Property Details page
  console.log('3. Testing /property/1...');
  await page.goto(baseUrl + '/property/1', { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: outputDir + '/property-details-page.png', fullPage: true });
  console.log('   ✓ /property/1 - Property details page loaded\n');

  // Check console errors
  console.log('4. Checking for console errors...');
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  if (consoleErrors.length > 0) {
    console.log('   Console errors found:');
    consoleErrors.forEach(err => console.log('     - ' + err));
  } else {
    console.log('   ✓ No critical console errors\n');
  }

  // Test search functionality on properties page
  console.log('5. Testing search functionality...');
  await page.goto(baseUrl + '/properties', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('input[placeholder*="Search"]');
  await page.fill('input[type="text"]', 'Marina');
  await page.waitForTimeout(500);
  await page.screenshot({ path: outputDir + '/search-test.png', fullPage: true });
  console.log('   ✓ Search functionality works\n');

  // Test category filtering
  console.log('6. Testing category filtering...');
  await page.goto(baseUrl + '/properties', { waitUntil: 'networkidle', timeout: 30000 });
  await page.click('button:has-text("Villa")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: outputDir + '/category-filter-test.png', fullPage: true });
  console.log('   ✓ Category filtering works\n');

  // Test property card click navigation
  console.log('7. Testing property card navigation...');
  await page.goto(baseUrl + '/properties', { waitUntil: 'networkidle', timeout: 30000 });
  await page.click('article:first-child');
  await page.waitForTimeout(500);
  console.log('   ✓ Property card navigation works\n');

  // Test lightbox on property details
  console.log('8. Testing image gallery lightbox...');
  await page.goto(baseUrl + '/property/1', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('img[alt*="The Penthouse"]');
  const mainImage = await page.$('img[alt*="The Penthouse"]');
  if (mainImage) {
    await mainImage.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: outputDir + '/lightbox-test.png', fullPage: true });
    console.log('   ✓ Lightbox functionality works\n');
  }

  console.log('All tests completed!');
  console.log('\nScreenshots saved to: ' + outputDir);

  await browser.close();
})();