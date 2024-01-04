const puppeteer = require('puppeteer');
const fs = require('fs').promises;
require('dotenv').config();
const config = require('./config.json');
const {authenticateToTwitter} = require('./twitterUtils/authenticateToTwitter.js')
const {keepScrollingDown }= require('./twitterUtils/keepScrollingDown.js')
const {navigateToProfile} = require('./twitterUtils/navigateToProfile.js')
const {setupRequestInterceptor} = require('./twitterUtils/setupRequestInterceptor.js')


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
  await navigateToProfile(username, page);
  await setupRequestInterceptor(page,keepScrolling, username, config.tweetsMaxScrolls);

  keepScrolling = await keepScrollingDown(page)
}

main();