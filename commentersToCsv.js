const fs = require('fs').promises;
const DataFrame = require('dataframe-js').DataFrame;
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
const dbModule = require('./db.js');

async function exportCollectionsToCsv() {
  try {
    // Connect to MongoDB
    await dbModule.connectToMongoDB(mongoURI);
    const db = dbModule.getDb();

    const collections = await db.listCollections().toArray();
    const filteredCollections = collections.filter(collection => collection.name.includes('Commenters'));

    // Create the output directory if it doesn't exist
    await fs.mkdir('./output', { recursive: true });

    for (const collection of filteredCollections) {
      const collectionName = collection.name;
      const document = await db.collection(collectionName).findOne();

      if (document && document.entries && document.entries.length > 0) {
        const csvFilename = `./output/${collectionName}.csv`;

        const entriesDataFrame = new DataFrame(document.entries.map(entry => organizeToCsv(entry)));

        // Write DataFrame to CSV
        await fs.writeFile(csvFilename, entriesDataFrame.toCSV(), 'utf-8');
        console.log(`CSV file created for collection "${csvFilename}" with ${document.entries.length} entries`);
      } else {
        console.log(`No valid data found in collection "${collectionName}"`);
      }
    }
  } catch (error) {
    console.error('Error exporting collections to CSV:', error);
  } finally {
    // Close the MongoDB connection
    dbModule.closeDb();
  }
}

function organizeToCsv(jsonData) {
  const result = jsonData.content.itemContent.tweet_results.result.core.user_results.result;
  const professional = result.professional;
  const entities = result.legacy.entities;
  const urlInfo = entities && entities.url && entities.url.urls[0];

  const description = result.legacy.description;

  // Use a regular expression to find an email in the description
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = description.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : '';

  return {
    id: result.id,
    name: result.legacy.name,
    screen_name: result.legacy.screen_name,
    description: result.legacy.description,
    location: result.legacy.location,
    display_url: urlInfo ? urlInfo.display_url : '',
    expanded_url: urlInfo ? urlInfo.expanded_url : '',
    url: urlInfo ? urlInfo.url : '',
    followers_count: result.legacy.followers_count,
    friends_count: result.legacy.friends_count,
    statuses_count: result.legacy.statuses_count,
    verified: result.legacy.verified,
    professional_type: professional ? professional.professional_type : '',
    category_name: professional && professional.category[0] ? professional.category[0].name : '',
    profile_link: `https://twitter.com/${result.legacy.screen_name}`,
    email: email
  };
}

exportCollectionsToCsv();