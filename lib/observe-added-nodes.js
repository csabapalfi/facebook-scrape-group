
const observeAddedNodes = async (page, selector) => {
  await page.evaluate((selector) => {
    const target = document.querySelector(selector);
    const observer = new MutationObserver(
      (records = []) => records.forEach(
        ({addedNodes = []}) => 
          // Functions are not Serializable by puppeteer.evaluate
          // so no way to parametrize this with the onNodeAdded callback
          // hence the need to pre-define onNodeAdded on window :(
          addedNodes.forEach(window.onNodeAdded)
      )
    );
    observer.observe(target, {childList: true});
  }, selector);
}

module.exports = {observeAddedNodes};