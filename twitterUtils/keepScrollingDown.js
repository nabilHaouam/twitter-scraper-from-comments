const puppeteer = require('puppeteer');
const config = require('../config.json');

let scrollInterval;
let lastHeight = 0;
let consecutiveSameHeightCount = 0;
const maxConsecutiveSameHeightCount = 3; 

async function keepScrollingDown(page) {
  scrollInterval = setInterval(async () => {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    const newHeight = await page.evaluate(() => document.body.scrollHeight);
    if (newHeight === lastHeight) {
      consecutiveSameHeightCount++;
    } else {
      consecutiveSameHeightCount = 0;
    }

    if (consecutiveSameHeightCount >= maxConsecutiveSameHeightCount) {
      // No more new content is being loaded, close the page
      clearInterval(scrollInterval);
      await page.close();
    }

    lastHeight = newHeight;
  }, config.scrollInterval); 

  return scrollInterval;
}

module.exports = {
  keepScrollingDown: keepScrollingDown
};