const puppeteer = require('puppeteer');
require('dotenv').config();
const config = require('./config.json');
const mongoURI = process.env.MONGO_URI;
const dbModule = require("./db.js");
const {authenticateToTwitter} = require('./twitterUtils/authenticateToTwitter.js')
const {keepScrollingDown }= require('./twitterUtils/keepScrollingDown.js')
const {navigateToPage} = require('./twitterUtils/navigateToPage.js')
const {setupRequestInterceptorCommenters} = require('./twitterUtils/setupRequestInterceptorCommenters.js')

async function getTweetsIds(){
    await dbModule.connectToMongoDB(mongoURI); 
    const db = await dbModule.getDb()
    const tweets = await db.collection(config.username).findOne({ username: config.username })
   
    const tweetIds = []
    for (const tweet of tweets.entries) {
        console.log("itemContent: "+ tweet.content.itemContent)
        if (tweet.content.itemContent){
            const idStr = tweet.content.itemContent.tweet_results.result.legacy.id_str;
            tweetIds.push(idStr)
        }
        else {
            tweet.content.items.forEach(item => {
                const idStr = item["item"]["itemContent"]["tweet_results"]["result"]["legacy"]["id_str"];
                tweetIds.push(idStr)
            });
           
        }
        
    }
    return tweetIds
}


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let keepScrolling;
const username = config.username;

if (!username) {
  console.error('Error: Please provide a username in the config file.');
  process.exit(1);
}
const collectionName = username+"Commenters"
async function getCommenters(){
    const tweetsIds = await getTweetsIds()
    console.log(tweetsIds)
    for (const id of tweetsIds){
        await sleep(10000)
        const browser = await puppeteer.launch({headless: config.headless});
        const page = await browser.newPage();  
        
        //authentication cookie
        await authenticateToTwitter(page, browser)
        const tweetUrl = `https://twitter.com/${username}/status/${id}`
        await navigateToPage( page, tweetUrl);
        
        await setupRequestInterceptorCommenters(page,keepScrolling, collectionName, config.commentsMaxScrolls);
        keepScrolling = await keepScrollingDown(page)
    }
    
}
getCommenters()