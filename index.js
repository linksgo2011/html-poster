const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({
  width: 800,
  height: 1150,
  deviceScaleFactor: 1,
});

  await page.goto('file:///Users/nlin/www/poster-by-html/templates/default.html');
  await page.screenshot({ path: 'output.png' });

  await browser.close();
})();