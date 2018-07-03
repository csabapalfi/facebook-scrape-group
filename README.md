# Scrape facebook group post permalinks with puppeteer and MutationObserver

This is a one night hack that I used to scrape 5K+ permalink ids from a secret facebook group we use to share photos with family.

It became an annoyance that there was no way to search posts by date and manually scrolling back over 2-3 years is not an option.

## Usage

⚠️ Danger: this script kills all running Chrome instances. This is required to enable remote debugging to allow Puppeteer to connect to your main Chrome that's assumed to be logged in to facebook.

```sh
npm start -- <groupid> | tee permalinks.txt
```

Output is in the format `permalink/id`. Just append that to your group URL and voila:

`https://www.facebook.com/groups/<group-id>/permalink/<post-id>`

...that post from 2014 is available to you again.

## Setup

```sh
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install
```

* [PUPPETEER_SKIP_CHROMIUM_DOWNLOAD](https://pptr.dev/#?product=Puppeteer&version=v1.1.0&show=api-environment-variables) to skip downloading Chromium as we'll use Chrome that's presumable already installed and logged in to facebook
* also we rely on puppeteer@1.1 as that works with current stable Chrome 67 at the time of writing this

## How

This script:

* kills all running Chrome instances
* starts up Chrome with remote debugging enabled
* connects to that with Puppeteer
* registers a MutationObserver and starts scrolling
* for each node (post) added tries to grab the permalink id