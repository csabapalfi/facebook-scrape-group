const { getBrowser, startChrome } = require('./chrome')
const [,,path] = process.argv;

let mutationsSinceLastScroll = 0;
let initialScrolls = 10;

function registerMutationObserver() {
    const target = document.querySelector('[aria-label="News Feed"]');
    const observer = new MutationObserver(
        (records = []) => records.forEach(
            (({addedNodes = []}) => addedNodes.forEach(
                node => {
                    if (node.id && node.id.startsWith('mall_post_')) {
                        const permalinkId = node.id
                            .replace(/:.*/, '').replace('mall_post_', '');
                        console.log(`permalink/${permalinkId}`);
                    }
                }
            ))
        )
    );
    observer.observe(target, {childList: true});
}

async function scroll(page, scrollDelay = 1000) {
    let previousHeight;
    try {
        while (mutationsSinceLastScroll > 0 || initialScrolls > 0) {
            mutationsSinceLastScroll = 0;
            initialScrolls--;
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
            await page.waitFor(scrollDelay);
        }
    } catch(e) {
        console.log(e);
    }
}

(async () => {
    const chrome = await startChrome();
    const browser = await getBrowser(chrome);

    const allPages = await browser.pages()
    page = allPages[0]

    page.setViewport({ width: 1280, height: 926 });

    await page.goto(`https://www.facebook.com/groups/${path}/`);

    await page.evaluate(registerMutationObserver);

    page.on('console', async (msg) => {
        if (msg._text && msg._text.startsWith('permalink')) {
            console.log(msg._text);
            mutationsSinceLastScroll++;
        }
    });

    await scroll(page);

    await browser.close();
})();
