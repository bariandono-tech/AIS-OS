const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const NEW_DB_ID = '37b78c4c-e388-81dd-a587-f997a59103eb'; // New database view ID

async function retrieveNewDB() {
  try {
    const db = await notion.databases.retrieve({ database_id: NEW_DB_ID });
    console.log('Success! Duplicated Database Info:');
    console.log(JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

retrieveNewDB();
