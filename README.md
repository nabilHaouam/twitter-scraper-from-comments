# twitter-scraper-from-comments

This project is a Twitter scraper that retrieves tweets based and their commenters profiles

## Instructions

Follow these steps to get started with the project:

### 1. Clone the Repository

```bash
git clone https://github.com/nabilHaouam/twitter-scraper-from-comments.git
2. Install Dependencies
Navigate to the project directory and install the required dependencies using npm.

cd twitter-scraper-from-comments
npm install

3. Create an Environment File
Create a .env file in the project root and add the following environment variables:

TWITTER_AUTH_TOKEN=your_twitter_auth_token
MONGO_URI=your_mongo_db_uri
Replace your_twitter_auth_token with your Twitter authentication token, and your_mongo_db_uri with your MongoDB connection URI.

4. Configure with config.js
Modify the config.js file to suit your preferences:

scrolls: Number of times to scroll the Twitter search results page. (1 scroll gives you 20 results)
scrollInterval: Time interval between each scroll in milliseconds. (e.g., 1000 means 1 second)
5. Run the Scraper
Run the tweets scraper using the following command:

node tweetsScraper.js
The scraper will navigate to Twitter, perform the search, scroll through the results, and save tweets to the specified destination (MongoDB or JSON file).

Feel free to explore and modify other modules to fit your specific use case.

Happy scraping!