# Scrape facebook group post permalinks

...with puppeteer and MutationObserver

This is a one (now three) night hack that I used to scrape 8K+ permalink ids from a secret facebook group we use to share photos with family. It became an annoyance that there was no way to search posts by date and manually scrolling back over 2-3 years is not an option.

## UPDATE: this is much easier via the Graph API

See [api.js](api.js) that I'm yet to document here but pretty straightforward. You just need the numeric group id and an access token. (See also [Graph API Explorer here](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bgroup-id%7D%2Ffeed&version=v3.0))

The API also supports specifying date ranges as UNIX timestamps (e.g. `?since=1420070400&until=1430070400`) so there's no need to paginate through the whole feed to get to dates years ago.

## Requirements

* MacOS
* Google Chrome installed (and logged in to facebook)
* `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn`

> [PUPPETEER_SKIP_CHROMIUM_DOWNLOAD](https://pptr.dev/#?product=Puppeteer&version=v2.1.0&show=api-environment-variables) to skip downloading Chromium since we'll use your default Chrome anyway

## Usage

### 1. Quit Google Chrome (if you have it running) 

* This is required to start a new Chrome instance with remote debugging enabled to allow Puppeteer to connect to it.
* This Chrome instance will use your default profile that's assumed to be logged in to facebook.

### 2. Start the script

```sh
node index.js <groupid> | tee permalinks.csv
```

* Output is simply CSV: `<ISO date>, <facebook post URL>` (one per line).
* ...that post from 2014 is available to you again if you were patient enough.

## How

This script:

* starts up Chrome with your default profile (and remote debugging enabled)
* connects to Chrome with Puppeteer
* goes to your facebook group page
* registers a MutationObserver and starts scrolling
* for each node (post) added tries to grab the permalink id

## Caveats

* it's just a one (OK, now three) night hack, quality is like that :D
* permalinks for posts on the first page are not captured