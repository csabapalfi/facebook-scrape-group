const {
  getBrowser, 
  startChrome, 
  pageWithDefaultProfile
} = require('./lib/chrome');
const {observeAddedNodes} = require('./lib/observe-added-nodes');
const {scrollWhileChanging} = require('./lib/scroll');

(async () => {
  const [,,path] = process.argv;

  const chrome = await startChrome();
  const browser = await getBrowser(chrome);
  const page = await pageWithDefaultProfile(browser);

  page.setViewport({ width: 1280, height: 926 });
  
  await page.goto(`https://www.facebook.com/groups/${path}/`);

  await page.evaluate(() => {
    window.onNodeAdded = node => {
      if (node.id && node.id.startsWith('mall_post_')) {
        const permalinkId = node.id.replace(/:.*/, '')
          .replace('mall_post_', '');

          // FIXME const author = node.querySelector('.profileLink').text;
        // FIXME const datetime = node.querySelector('.timestamp').title;
        console.log(`permalink/${permalinkId}`);
      }
    }
  })
  await observeAddedNodes(page, '[aria-label="News Feed"]');

  const detectChanges = (onChange) => 
    page.on('console', async (msg) => {
      if (msg._text && msg._text.startsWith('permalink')) {
        console.log(msg._text);
        onChange();
      }
    });
    
  await scrollWhileChanging(page, 10, detectChanges)
    
  await browser.close();
})();
