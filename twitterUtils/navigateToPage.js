const puppeteer = require('puppeteer');
async function navigateToPage(page, url) {
    await page.goto(url);
}

module.exports = {
    navigateToPage: navigateToPage
};