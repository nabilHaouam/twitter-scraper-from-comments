const puppeteer = require('puppeteer');
async function navigateToProfile(username, page) {
    await page.goto(`https://twitter.com/${username}`);
}

module.exports = {
    navigateToProfile: navigateToProfile
};