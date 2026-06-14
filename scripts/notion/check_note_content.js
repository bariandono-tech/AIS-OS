const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const NOTE_ID = '37e78c4c-e388-8147-878b-ec7be03968c4';

async function checkNoteContent() {
  console.log(`Retrieving content blocks for note: ${NOTE_ID}...`);
  try {
    const response = await notion.blocks.children.list({ block_id: NOTE_ID });
    console.log(JSON.stringify(response.results, null, 2));
  } catch (error) {
    console.error('Error retrieving note content:', error.message);
  }
}

checkNoteContent();
