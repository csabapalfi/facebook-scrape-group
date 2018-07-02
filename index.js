const fs = require('fs');
const puppeteer = require('puppeteer');

const util = require('util');
const {exec} = require('child_process');

const [,,path,sinceDate] = process.argv;

function extractItems() {
//   const extractedElements = document.querySelectorAll('a[href^="https://www.facebook.com/photo.php"]');
  let earliestDate = new Date();
  const extractedElements = document.querySelectorAll('.timestampContent');
  const items = [];
  for (let element of extractedElements) {
    const time = new Date(element.parentNode.dataset.utime * 1000);
    console.log(earliestDate, time);
    if (time < earliestDate) {
        earliestDate = time;
        console.log('Updated earliest', earliestDate);
    }
    const formattedTime = time.toLocaleString('en-GB')
    const link = element.parentNode.parentNode.href
    items.push(`<li><a href=${link}>${formattedTime}</a></li>`);
  }
  console.log('Returning earliest', earliestDate);
  return [earliestDate.getTime(), items];
}

let i = 1;

const formatDate = (date) => date.toLocaleString('en-GB');

async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  since,
  scrollDelay = 1000,
) {
  let items = [];
  let earliestDate = new Date();
  try {
    let previousHeight;
    while (earliestDate > since) {
    console.log(i, '.'); i++;
      [time, items] = await page.evaluate(extractItems, earliestDate);
      const date =new Date(time);
      console.log(formatDate(date), formatDate(earliestDate),  items.length);
      if (date < earliestDate) {
        earliestDate = date;
        console.log('Updated earliest date', formatDate(date));
      }
      //else {
      //   console.log('Earliest date reached', formatDate(date));
      //   break;
      // }
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch(e) {
      console.log(e);
  }
  return items;
}

(async () => {
  const {stdout: browserWSEndpoint} = await util.promisify(exec)('./chrome.sh');

  const browser =  await puppeteer.connect({browserWSEndpoint});
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  await page.goto(`https://www.facebook.com/groups/${path}/`);

  const items = await scrapeInfiniteScrollItems(page, extractItems, new Date(`${sinceDate}T00:00:00`));

  fs.writeFileSync('./posts.html', items.join('\n') + '\n');

  await browser.close();
})();