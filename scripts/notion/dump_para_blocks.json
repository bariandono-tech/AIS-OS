const { Client } = require('@notionhq/client');
const fs = require('fs');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PARA_PAGE_ID = '7fc78c4c-e388-8315-b9d2-014194f6db5c'; // "PARA"

async function dumpBlocks() {
  try {
    const response = await notion.blocks.children.list({ block_id: PARA_PAGE_ID, page_size: 100 });
    fs.writeFileSync('para_blocks.json', JSON.stringify(response.results, null, 2), 'utf8');
    console.log('Successfully wrote para_blocks.json');
  } catch (error) {
    console.error('Error dumping blocks:', error.message);
  }
}

dumpBlocks();
