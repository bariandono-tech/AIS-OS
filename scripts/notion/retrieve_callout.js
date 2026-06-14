const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const CALLOUT_BLOCK_ID = '86c78c4c-e388-8321-a4e0-01a9a574a957';

async function retrieveCallout() {
  try {
    const block = await notion.blocks.retrieve({ block_id: CALLOUT_BLOCK_ID });
    console.log(JSON.stringify(block, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

retrieveCallout();
