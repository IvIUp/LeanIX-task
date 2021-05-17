const puppeteer = require('puppeteer');
const pageScraper = require('./pageScraper');
const fs = require('fs');


async function scrapeAll() {
    let browser;

    try {
        browser = await startBrowser();
        await pageScraper.scraper(browser); // Use the browser instance to start scraping articles
    } catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }

    console.log('Closing the browser');
    await browser.close(); // Close browser when finished with sraping

}

async function startBrowser() {

    let browser;

    try {

        // Create an instance of a browser
        console.log("Opening the browser\n");
        browser = await puppeteer.launch({//headless: false
        });
    } catch (err) {
        console.log("Failed in opening the browser:", err);
    }

    return browser;
}

function writeJSON(res) {

    // Reading data from the summaries.json file
    // and putting those data on the /stories.
    fs.readFile(__dirname + '/summaries.json', 'utf8', function (err, data) {
        let stories = JSON.parse(data);
        res.send(JSON.stringify(stories, null, 4));
        console.log("Created JSON on with summary of the 5 latest stories at localhost:8080/stories");
    });
}


module.exports = {
    scrapeAll,
    writeJSON
};
