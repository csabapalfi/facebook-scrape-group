async function scrollToBottom(page) {
  let previousHeight;
  try {
    previousHeight = await page.evaluate(
      'document.body.scrollHeight'
    );
    await page.evaluate(
      'window.scrollTo(0, document.body.scrollHeight)'
    );
    await page.waitForFunction(
      `document.body.scrollHeight > ${previousHeight}`,
      {timeout: 600000}
    ).catch(e => console.log('scroll failed'));
    await page.waitFor(1000);
  } catch(e) {
    console.log(e);
  }
}

async function scrollWhileChanging(page, minScrolls, detectChanges) {
  let initialScrolls = minScrolls;
  let changesSinceLastScroll = 0;

  detectChanges(() => changesSinceLastScroll++);
    
  const shouldScroll = () => 
    changesSinceLastScroll > 0 || 
    initialScrolls > 0;
  
  while(shouldScroll()) {
    if (initialScrolls > 0) {
      initialScrolls--;
    }
    changesSinceLastScroll = 0;
    await scrollToBottom(page);
  }
}

module.exports = {
  scrollToBottom,
  scrollWhileChanging
}