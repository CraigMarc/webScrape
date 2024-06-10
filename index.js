// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

const fs = require('fs')


// scrape title and urls

const scrapeData = async (page) => {
 
  return page.$$eval("span.titleline", (titles) => {
   
    return titles.slice(0, 10).map((card) => {
     
      const title = card.querySelector("a");
    
      const formatText = (element) => element && element.innerText.trim();
      return {
        title: formatText(title),
        url: title.href
      };
    });
  });
};

// save to file

const saveDataToFile = (data, fileName) => {
 
  //FileSaver.saveAs([data], fileName);
  fs.writeFileSync(fileName, data);
  console.log("Data saved to:", fileName);
};

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  const articles = await scrapeData(page);

// convert json to csv

let json = articles
let fields = Object.keys(json[0])
let replacer = function(key, value) { return value === null ? '' : value } 
let csv = json.map(function(row){
  return fields.map(function(fieldName){
    return JSON.stringify(row[fieldName], replacer)
  }).join(',')
})
csv.unshift(fields.join(','))
 csv = csv.join('\r\n');

saveDataToFile(csv, 'titlesCsv.csv')

}

(async () => {
  await saveHackerNewsArticles();
})();
