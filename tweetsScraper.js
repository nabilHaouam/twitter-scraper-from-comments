const puppeteer = require('puppeteer');
const fs = require('fs').promises;
require('dotenv').config();
const config = require('./config.json');
const {authenticateToTwitter} = require('./twitterUtils/authenticateToTwitter.js')
const {keepScrollingDown }= require('./twitterUtils/keepScrollingDown.js')
const {navigateToPage} = require('./twitterUtils/navigateToPage.js')
const {setupRequestInterceptorTweets} = require('./twitterUtils/setupRequestInterceptorTweets.js')


let keepScrolling;




async function main() {
  const browser = await puppeteer.launch({headless: config.headless});
  const page = await browser.newPage();  
  const username = config.username;

  if (!username) {
    console.error('Error: Please provide a username in the config file.');
    process.exit(1);
  }
  //authentication cookie
  await authenticateToTwitter(page, browser)
  const profileUrl = `https://twitter.com/${username}`
  await navigateToPage( page, profileUrl);
  await setupRequestInterceptorTweets(page,keepScrolling, username, config.tweetsMaxScrolls);

  keepScrolling = await keepScrollingDown(page)
}

main();