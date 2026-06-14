const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const VIEW_BLOCK_ID = '37b78c4c-e388-81dd-a587-f997a59103eb'; // Task Inbox view on duplicated PARA page

async function inspectViewBlock() {
  try {
    const block = await notion.blocks.retrieve({ block_id: VIEW_BLOCK_ID });
    console.log(JSON.stringify(block, null, 2));
  } catch (error) {
    console.error('Error retrieving view block:', error.message);
  }
}

inspectViewBlock();
