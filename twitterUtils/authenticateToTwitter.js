const puppeteer = require('puppeteer');
require('dotenv').config();
const authToken = process.env.TWITTER_AUTH_TOKEN; 
async function authenticateToTwitter (page, browser) {
  if (!authToken) {
    console.error('Authentication token not found in environment variables.');
    await browser.close();
    return;
  }
  
  const cookie = {
    name: 'auth_token',
    value: authToken,
    domain: '.twitter.com',
    secure: true,
    path: '/',
  };
  
  await page.setCookie(cookie);

}
module.exports = {
    authenticateToTwitter: authenticateToTwitter
};