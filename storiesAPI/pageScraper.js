const fs = require('fs');

const scraperObject = {

    url: 'http://www.cnet.com',

    async scraper(browser) {

        // Create new tab in the browser and load main page onto it
        let page = await browser.newPage();
        console.log(`Opening ${this.url}\n`);
        await page.goto(this.url);
        await page.waitForSelector('.responsiveLatest.fd-refresh');

        // Sscrape main page for the data 
        let latestStoriesURLs = await page.$$eval('div.latestScrollItems > .row.item', (stories) => {
            // Sometimes image is not shown in the article, 
            // so the image URL from the article preview is taken
            let imageURL =stories.map((story) => story.children['1'].querySelector('a > img').src);
            let latestURL = stories.map((story) => story.children['1'].querySelector('h3 > a').href);
            let titles = stories.map((story) => story.children['1'].querySelector('h3 > a').innerHTML);
            return [latestURL, imageURL, titles];
        });

        console.log('Scraping following stories:');
        for (let i = 0; i < 5; i++) {
            console.log('\t' + latestStoriesURLs[2][i]);
        }

        
        // Function that scrapes each article 
        async function scrapeEachPage(storyURL, imageURL, title) {
            let storyPage = await browser.newPage();
            console.log(`Opening ${storyURL}`);
            await storyPage.goto(storyURL);
            storySummary = {};
            console.log('Reading data from the article');

            storySummary['title'] = title;
            
            try {
                storySummary['summary'] = await storyPage.$eval('.c-head_dek', summary => summary.innerHTML);
            } catch (err) {
                console.log('Could not find the summary of the article:', err);
                storySummary['summary'] = null;
            }

            try {
                let category = storyURL.split('/')[3];
                category = category.replace('-', ' '); // Remove '-' in between words
                category = category.charAt(0).toUpperCase() + category.slice(1) // Make first latter uppercase
                storySummary['category'] = category;
            } catch (err) {
                console.log('Could not find categories of the aricle:', err);
                storySummary['category'] = null;
            }

            try {
                allTags = await storyPage.$$eval('.row.tagList.desktop > a', (tags) => tags.map((tag) => tag.innerText));
                var index = allTags.findIndex(e => e === '');
                if (index !== -1) {
                    allTags = allTags.slice(0, index) // Remove tags that are not from the main story (if they exist)
                };
                storySummary['tags'] = allTags.toString();
            } catch (err) {
                console.log('Could not find tags of the aricle:', err);
                storySummary['tags'] = null;
            }

            try {
                storySummary['author'] = await storyPage.$eval('.author', author => author.innerHTML);
            } catch (err) {
                console.log('Could not find the author of the aricle:', err);
                storySummary['author'] = null;
            }

            storySummary['storyURL'] = storyURL;


            try {
                storySummary['date'] = await storyPage.$eval('time', date => date.innerHTML);
            } catch (err) {
                console.log('Could not find when the article was published:', err);
                storySummary['date'] = null;
            }

            storySummary['imageURL'] = imageURL;


            let fileLocation = storySummary['title'].substring(0, 20).replace(':', '');

            try {
                pngLocation = `${__dirname}/pngs/${fileLocation}... .png`;
                await storyPage.screenshot({ path: pngLocation, fullPage: true });
                storySummary['screenshot'] = pngLocation;
            } catch (err) {
                console.log('Could not create the screenshot of the page:', err);
                storySummary['screenshot'] = null;
            }

            try {
                pdfLocation = `${__dirname}/pdfs/${fileLocation}... .pdf`;
                pdfLocation.replace(':', '');
                await storyPage.pdf({ path: pdfLocation });
                storySummary['pdf'] = pdfLocation;
            } catch (err) {
                console.log('Could not create the pdf of the page:', err);
                storySummary['pdf'] = null;
            }

            console.log(`Closing ${storyURL}\n`);
            await storyPage.close();

            return storySummary;

        };


        let storySummaries = {};
        for (i = 0; i < 5; i++) { // Go through five latest articles
            storySummaries[`article ${i + 1}`] = await scrapeEachPage(
                latestStoriesURLs[0][i],
                latestStoriesURLs[1][i],
                latestStoriesURLs[2][i]
            );
        }
        console.log(storySummaries);

        // Creating JSON that constains summary of all scraped articles
        // and save that JSON at ./summaries.json
        fs.writeFile('summaries.json', JSON.stringify(storySummaries, null, 4), 'utf8',
            function (err) {
                if (err) {
                    return console.log(`Error while creating JSON: ${err}`);
                }
                console.log("JSON has been created and saved at './summaries.json");
            }
        );

    }
}

module.exports = scraperObject;