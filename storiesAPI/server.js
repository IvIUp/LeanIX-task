const scraper = require('./pageController');
var express = require('express'),
    app = express(),
    port = process.env.PORT || 8080;

// Starts a server and listen on port 8080 for connections
app.listen(port, function (err) {
    if (err) {
        console.log(err);
    }
    console.log("Server started on port", port);
});

// Create localhost:8080/stories route 
// Start the sraper script when GET request arrives on the /stories
app.get('/stories', async function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    // Start the browser and create a browser instance
    // that will be used by scraper
    await scraper.scrapeAll();

    // Write JSON data on the /stories
    scraper.writeJSON(res);

})
