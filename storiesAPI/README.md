# Take Home Test from LeanIX

> Prepare REST API in Node.js which will on request to GET /stories scrape and return JSON array with summary of the 5 latest stories from the webpage [https://www.cnet.com/](https://www.cnet.com).
> 
> Each summary of the story should include:
> * News header
> * A short summary of the article
>*  Category in which the story was published
>* Tags with which the story is tagged
>* Author of the story
>* URL to the story
>* When the story was published
>* URL to the main image in the article
>* URL to full page screenshot image of story (optional)
>* URL to PDF file of print of story (optional)
>
>
>For scraping use Puppeteer library 
([https://github.com/GoogleChrome/puppeteer](https://github.com/GoogleChrome/puppeteer)).
>
>Publish your code on GitHub and send a link to the repository.


## Solution

The created solution consists of the server created using express and scraper that is used to create JSON with summaries. The solution structure is the following:

* *server.js* - that contains code for creating a server and /stories route at which each GET request will call the scraper script.

* *pageControler.js* - script that will create browser instance needed by puppeteer library and it will create JSON file when scraping has finished.

* *pageScraper.js* - includes code that is used by scraper to scrape stories from the website and create JSON file (./summaries.json). File summaries.json will be created during the execution of the script.

There is also a *package.json* file in a solution that has metadata relevant to the project. 

Screenshots and .pdf files of the articles and stored in folders *pngs* and *pdfs*, respectively.

## Installation and running the app

Download the project or clone it from the git repository and use 
`npm run server` to start the server. Go to the [localhost:8080/stories](http://localhost:8080/stories) and the script will start its execution. Eventually, summaries.json will be created and the content of that file will also be added on the /stories page.

Prior to executing the npm command, node.js, npm, puppeteer and express must be installed. Visit [node.js](https://nodejs.org/en/download/) website to download and install the node.js and npm (14.17.0 node.js version is used with npm version 6.14.13). Use `npm install puppeteer` to install puppeteer and `npm install express` to install express. 