const {
  getBrowser, 
  startChrome, 
  pageWithDefaultProfile
} = require('./lib/chrome');
const {observeAddedNodes} = require('./lib/observe-added-nodes');
const {scrollWhileChanging} = require('./lib/scroll');

const GROUPS_URL = 'https://www.facebook.com/groups';

(async () => {
  const [,,path] = process.argv;

  const chrome = await startChrome();
  const browser = await getBrowser(chrome);
  const page = await pageWithDefaultProfile(browser);

  page.setViewport({ width: 1280, height: 926 });
  
  await page.goto(`${GROUPS_URL}/${path}/`);

  await page.evaluate(() => {
    window.onNodeAdded = node => {
      if (node.id && node.id.startsWith('mall_post_')) {
        const permalinkId = node.id.replace(/:.*/, '')
          .replace('mall_post_', '');
        const timestamp = node.querySelector('abbr').dataset.utime;
        console.log(`permalink/${permalinkId}, ${timestamp}`);
      }
    }
  })
  await observeAddedNodes(page, '[aria-label="News Feed"]');

  const detectChanges = (onChange) => 
    page.on('console', async (msg) => {
      if (msg._text && msg._text.startsWith('permalink')) {
        const [permalink, timestamp] = msg._text.split(',');
        const date = new Date(timestamp * 1000).toISOString();
        console.log(`${date}, ${GROUPS_URL}/${path}/${permalink}`);
        onChange();
      }
    });
    
  await scrollWhileChanging(page, 10, detectChanges)
    
  await browser.close();
})();
