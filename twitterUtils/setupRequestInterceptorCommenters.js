const puppeteer = require('puppeteer');
require('dotenv').config();
const config = require('../config.json');
const {saveEntries} = require('./saveEntries')


let responses = [];
let usersEntries = [];
let count = 0;
const requestUrlStart = "https://twitter.com/i/api/graphql/-H4B_lJDEA-O_7_qWaRiyg/TweetDetail?"
async function setupRequestInterceptorCommenters(page,scrollInterval, collectionName, maxScrolls) {
    
    console.log(scrollInterval) 
    page.setRequestInterception(true);
  
    page.on('request', (request) => {
      request.continue();
    });
  
    page.on('response', async (response) => {
      const url = response.url();
    
      if (url.startsWith(requestUrlStart)) {
        const responseData = {
          url: url,
          status: response.status(),
          content: await response.text(),
        };
    
        try {
          responseData.parsedContent = JSON.parse(responseData.content);
        } catch (error) {
          console.error('Error parsing JSON:', error.message);
        }
    
        responses.push(responseData);
    
        if (responseData.parsedContent && responseData.parsedContent.data) {
            const entries = responseData.parsedContent.data.threaded_conversation_with_injections_v2.instructions.filter(entry => entry.type === 'TimelineAddEntries')
            .map(instruction => instruction.entries)
            .flat();
          //this to remove the top and bottom cursor entries because they are not users 
          const filteredEntries = entries.filter(entry => 
            !entry.entryId.startsWith('cursor-') && !entry.entryId.startsWith('who-to-follow')
          );

          usersEntries = usersEntries.concat(...filteredEntries);
          count++;
          
          await saveEntries(collectionName, filteredEntries);
          if (count >= maxScrolls) {
              console.log(`Reached ${maxScrolls} scrolls. Stopping scrolling.`);
              clearInterval(scrollInterval);
    
            }
        }
      }
    });
  }

  module.exports = {
    setupRequestInterceptorCommenters: setupRequestInterceptorCommenters
};