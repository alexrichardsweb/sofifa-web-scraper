# SoFIFA Web Scraper

Due to a lack of any FIFA career mode player API (as far as I know) this is a tool that will scrape data from the player list on https://sofifa.com/ for use in personal projects. 

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

`startPage` - Set the page number you'd like the scraper to start from, the players are **ordered by potential** as this is the most common search criteria for Career Mode

`numPages` - The number of pages you'd like to scrape. There are currently 60 players per page on SoFIFA, so the default of 150 pages would give you data on the 9000 players with the most potential in game.

`dbVersion` - set to false for latest DB, or set the selected DB on SoFIFA in your browser, and use the number set to the `r` parameter in the URL, e.g. `200061` from `r=200061`  

`splitFiles` - Setting this to `true` will split the .json output files by page e.g. `players_page_1.json`

Advanced options 

### How long will it take?

During testing the average 

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
  - Pace (GK Diving)
  - Shooting (GK Handling)
  - Passing (GK Kicking)
  - Dribbling (GK Reflexes)
  - Defending
  - Physical (GK Positioning)
