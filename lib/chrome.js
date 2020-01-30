// https://github.com/GoogleChrome/chrome-launcher/issues/172 
// https://gist.github.com/VikramTiwari/9fe97f990d17ada231dee35eea128480

const os = require('os')
const { launch } = require('chrome-launcher')
const puppeteer = require('puppeteer')
const profileId = 'Profile 1'

async function startChrome() {
  const chrome = await launch({
    ignoreDefaultFlags: true,
    chromePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    chromeFlags: [
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-ipc-flooding-protection',
      '--disable-renderer-backgrounding',
      '--enable-automation',
      '--no-first-run',
      `--profile-directory=${profileId}`
    ],
    startingUrl: 'chrome-search://local-ntp/local-ntp.html',
    userDataDir: `/Users/${
      os.userInfo().username
    }/Library/Application Support/Google/Chrome`
  })
  return chrome
}

async function getBrowser(chrome) {
  let browser = {}
  browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${chrome.port}`,
    defaultViewport: null
  })
  return browser
}


async function pageWithDefaultProfile(browser) {
  const allPages = await browser.pages();
  return allPages[0];
}

module.exports = {
  getBrowser,
  startChrome,
  pageWithDefaultProfile
}