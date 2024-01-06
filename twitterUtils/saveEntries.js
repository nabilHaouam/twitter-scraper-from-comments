const fs = require('fs').promises;
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
const dbModule = require("../db.js");
dbModule.connectToMongoDB(mongoURI);
async function saveEntriesToDB(username, entries) {
  try {
    const db = await dbModule.getDb();

    for (const entry of entries) {
      const collectionName = username.replace(/\s+/g, '_'); // Replace spaces with underscores
      const collection = await db.collection(collectionName);

      // Create a new document for each entry
      const document = { username: username, entry: entry };
      await collection.insertOne(document);

      console.log(`Entry saved to MongoDB collection: ${collectionName}`);
    }
  } catch (error) {
    console.error('Error saving entries to MongoDB:', error);
  }
}

async function saveEntriesToFile(newEntries) {
    try {
      // Read existing file content
      const existingContent = await fs.readFile('usersEntries.json', 'utf-8');
      const existingEntries = JSON.parse(existingContent);
  
      // Find unique new entries by comparing with existing entries
      const uniqueNewEntries = newEntries.filter(newEntry => !existingEntries.some(existingEntry => existingEntry.entryId === newEntry.entryId));
  
      // Merge unique new entries with existing entries
      const updatedEntries = [...existingEntries, ...uniqueNewEntries];
  
      // Save the updated entries to the file
      const jsonContent = JSON.stringify(updatedEntries, null, 2);
      await fs.writeFile('usersEntries.json', jsonContent);
  
      console.log('Users entries saved to usersEntries.json');
    } catch (error) {
      console.error('Error saving file:', error);
    }
}


async function saveEntries(username,entries) {
  await saveEntriesToDB(username, entries);
}

module.exports = {
    saveEntries: saveEntries
};