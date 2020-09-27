/* 
    More info on the settings below can be found here:
    https://github.com/alexrichardsweb/sofifa-web-scraper
*/

/* ------ Your Settings Here ------ */

const startPage = 1; // Page to start from
const numPages = 150;  // The number of pages of players you want 
const dbVersion = false; // Get number from r parameter in URL - e.g. 200061 from 'r=200061', set to false for latest DB
const splitFiles = false; // Set to true to split files by page

/* ------ End Settings ------ */

const perPage = 60; // Only change if SoFIFA have changed their number of players per page

const puppeteer = require("puppeteer");
const baseUrl = 'https://sofifa.com/players?type=all&col=pt&sort=desc&currency=GBP&engine=frostbite&layout=new&showCol%5B%5D=ae&showCol%5B%5D=hi&showCol%5B%5D=pf&showCol%5B%5D=oa&showCol%5B%5D=pt&showCol%5B%5D=vl&showCol%5B%5D=wg&showCol%5B%5D=rc&showCol%5B%5D=wk&showCol%5B%5D=sk&showCol%5B%5D=pac&showCol%5B%5D=aw&showCol%5B%5D=dw&showCol%5B%5D=sho&showCol%5B%5D=pas&showCol%5B%5D=dri&showCol%5B%5D=def&showCol%5B%5D=phy';
const options = { headless: true }; // Set to false if having issues running the web scraper, or to debug
const selector = "table tbody tr"; // Each instance from which data will be scraped e.g. every table row. Changing this will break things
let players = [];
let playerCount = 0;
(async function () {
    // Set Browser and Page objects
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    for (let i = (startPage - 1); i < ((startPage - 1) + numPages); i++) {
        
        let url = baseUrl;

        // Set Database
        url += dbVersion ? '&set=true&r=' + dbVersion : '';
        // Set Offset
        url += (i > 0) ? '&offset=' + i * perPage : '';

        // Go to Page
        await page.goto(url);
        const playerPage = await page.$$eval(selector, (nodes) => {
            return nodes.map((node) => {

                /* 
                    Comment out/remove any data you don't need below to reduce file size
                    Be sure to also comment out/remove the property from the player object
                */

                // URLs
                const playerUrl = node.querySelector(".col-name > a.tooltip").getAttribute('href');
                const teamUrl = node.querySelector(".col-name > div > a").getAttribute('href');

                // Basic Player Info
                const name = node.querySelector(".col-name > a > div").textContent;
                const age = node.querySelector(".col-ae").textContent; 
                const club = node.querySelector(".col-name > div > a").textContent
                const ovr = node.querySelector(".col-oa .p").textContent; 
                const pot = node.querySelector(".col-pt .p").textContent; 

                // Images
                const nationImg = node.querySelector(".col-name > a > div > img").getAttribute('data-src');
                const teamImg = node.querySelector(".col-name > div img").getAttribute('data-src');
                const playerImg = node.querySelector(".col-avatar img").getAttribute('data-src');

                // Body
                const height = node.querySelector(".col-hi").textContent; 
                const foot = node.querySelector(".col-pf").textContent; 

                // Financial
                const value = node.querySelector(".col-vl").textContent; 
                const wage = node.querySelector(".col-wg").textContent; 
                const clause = node.querySelector(".col-rc").textContent; 

                // Weak foot/Skill Moves
                const weak = node.querySelector(".col-wk").textContent.replace(' ', ''); 
                const skill = node.querySelector(".col-sk").textContent;

                // Work Rates
                const aw = node.querySelector(".col-aw").textContent; 
                const dw = node.querySelector(".col-dw").textContent; 

                // Total stats
                const pac = node.querySelector(".col-pac").textContent; 
                const sho = node.querySelector(".col-sho").textContent; 
                const pas = node.querySelector(".col-pas").textContent; 
                const dri = node.querySelector(".col-dri").textContent; 
                const def = node.querySelector(".col-def").textContent; 
                const phy = node.querySelector(".col-phy").textContent; 

                // Positions
                const positionNodes = node.querySelectorAll(".col-name .pos");
                let positions = [];
                for (position of positionNodes) {
                    positions.push(position.textContent); 
                }


                // Player Object
                // If you have removed data from above, remove it from here too
                return {
                    name: name, 
                    positions: positions,
                    age: age,
                    ovr: ovr,
                    pot: pot,
                    club: club,
                    height: height,
                    foot: foot,
                    value: value,
                    wage: wage,
                    clause: clause,
                    weak_foot: weak,
                    skill_moves: skill, 
                    attacking_workrate: aw,
                    defensive_workrate: dw,
                    stats: {
                            pac: pac,
                            sho: sho,
                            pas: pas,
                            dri: dri,
                            def: def,
                            phy: phy,
                    },
                    images: {
                            headshot: playerImg,
                            nation: nationImg,
                            team: teamImg,
                    },
                    urls: {
                            player: playerUrl,
                            team: teamUrl,
                    }
                };
            });
        });

        players.push(playerPage);

        // Basic progress updates in the console, can be removed
        playerCount += perPage;
        console.log('Players Added: ' + playerCount + '/' + (numPages * perPage)); 
        
        // Save page to its own file (if splitFiles is true)
        if (splitFiles) {
            let playerPageData = setPlayerPageData(playerPage);
            saveToFile(playerPageData, (i + 1));
        }
    }
    
    players = [].concat(...players);

    if (!splitFiles) {
        let playerData = setPlayerData(players);
        saveToFile(playerData);
    }

    await browser.close();
})();

function saveToFile(data, page) {
    const fs = require('fs');
    let fn = __dirname + '/output/';
    fn += splitFiles ? 'pages/players_page_' + page : 'players';
    let jsonData = JSON.stringify(data);

    fs.writeFile(fn + ".json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function setPlayerData() {
    const date = new Date();

    let playerData = {
        "lastUpdated": date.toLocaleString(),
        "dbVersion": dbVersion ? dbVersion : 'Latest',
        "playerCount": perPage * numPages,
        "players": players,
    }

    return playerData;
}

function setPlayerPageData(players) {
    const date = new Date();

    let playerPageData = {
        "lastUpdated": date.toLocaleString(),
        "dbVersion": dbVersion ? dbVersion : 'Latest',
        "playerCount": perPage,
        "players": players,
    }

    return playerPageData;

}
