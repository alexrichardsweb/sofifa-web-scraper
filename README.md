# SoFIFA Web Scraper

Due to a lack of any FIFA career mode player API (as far as I know) this is a tool that will scrape data from the player list on https://sofifa.com/.

Please note that this data should be for personal use only. 

### How to use

* Install Puppeteer via NPM or yarn https://pptr.dev/
* In the terminal, navigate to the web scraper's directory and run `node scraper.js`

### Available Options

Options are set in `scrapers.js` using your code editor. Default options are:

```
const startPage = 1;
const numPages = 150;
const dbVersion = false;
const splitFiles = false;
```

This will give you the first 150 pages players by potential, in a single `players.json` file (which can be seen in output as an example file) 

`startPage` - Set the page number you'd like the scraper to start from, the players are **ordered by potential** as this is the most common search criteria for Career Mode

`numPages` - The number of pages you'd like to scrape. There are currently 60 players per page on SoFIFA, so the default of 150 pages would give you data on the 9000 players with the most potential in game.

`dbVersion` - set to false for latest DB, or set the selected DB on SoFIFA in your browser, and use the number set to the `r` parameter in the URL, e.g. `200061` from `r=200061`  

`splitFiles` - Setting this to `true` will split the .json output files by page e.g. `players_page_1.json`

**Other Configurables**

You can also choose which data you'd like to removing the relevant lines of code from `scrapers.js` - There are basic instructions within the file on how to do this. It's recommended that you remove any information that you wont be needing to reduce the filesize.

As with all options, be careful if you are not familiar with code as any hint of an issue will cause the scraper to not work.

### How long will it take?

During testing the average times were

```
Per player - 0.03 seconds
Per page (60 players) - 1.8 seconds
Per 1000 players - 30 seconds
Per 100 pages (6000 players) - 3 minutes
```

### What data is scraped?

- Name 
- Positions
- Age
- Club
- Overall
- Potential
- Height
- Foot
- Weak Foot ★
- Skill Moves ★
- Financial 
  - Value
  - Wage
  - Release Clause
- Workrates
  - Attacking
  - Defending
- Stat Totals (with GK equivalents)
  - Pace (*GK Diving*)
  - Shooting (*GK Handling*)
  - Passing (*GK Kicking*)
  - Dribbling (*GK Reflexes*)
  - Defending
  - Physical (*GK Positioning*)
- URLs (sofifa.com)
  - Player URL
  - Team URL 
- Imagery
  - Player headshot
  - Club badge
  - Nation flag
 
### Debugging

If the scraper fails on first run, try setting `headless` to `false`, this will open up Chromium when the scraper is run and allow you to check that the URL is being accessed correctly.
