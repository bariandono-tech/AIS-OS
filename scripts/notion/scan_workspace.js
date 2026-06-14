const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const ROOT_PAGE_ID = process.env.NOTION_PAGE_ID || '37b78c4ce388808c9d19c867c724579b';

async function scanRoot() {
  console.log(`Scanning child blocks of Root Page: ${ROOT_PAGE_ID}...`);
  try {
    const response = await notion.blocks.children.list({ block_id: ROOT_PAGE_ID });
    for (const block of response.results) {
      let title = '';
      if (block.type === 'child_page') {
        title = block.child_page.title;
        console.log(`- Page: "${title}" | ID: ${block.id}`);
      } else if (block.type === 'child_database') {
        title = block.child_database.title;
        console.log(`- Database: "${title}" | ID: ${block.id}`);
      } else {
        console.log(`- Block: [${block.type}] | ID: ${block.id}`);
      }
    }
  } catch (error) {
    console.error('Error scanning root:', error);
  }
}

scanRoot();
