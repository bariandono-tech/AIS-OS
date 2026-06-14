const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const NOTE_ID = '37e78c4c-e388-8147-878b-ec7be03968c4';

async function checkNote() {
  console.log(`Retrieving details for note page: ${NOTE_ID}...`);
  try {
    const page = await notion.pages.retrieve({ page_id: NOTE_ID });
    console.log(JSON.stringify(page.properties, null, 2));
  } catch (error) {
    console.error('Error retrieving note properties:', error.message);
  }
}

checkNote();
