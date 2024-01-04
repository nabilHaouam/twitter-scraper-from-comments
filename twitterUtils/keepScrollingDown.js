const puppeteer = require('puppeteer');
const config = require('../config.json');

let scrollInterval;
async function keepScrollingDown(page) {
    scrollInterval = setInterval(async () => {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    }, config.scrollInterval);
  
    return scrollInterval;
  }
  
  module.exports = {
    keepScrollingDown: keepScrollingDown
  };