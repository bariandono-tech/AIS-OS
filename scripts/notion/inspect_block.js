const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const BLOCK_ID = 'a9678c4c-e388-821e-bfbe-81e192cbf0de';

async function inspectBlock() {
  console.log(`Inspecting children of block ${BLOCK_ID}...`);
  try {
    const response = await notion.blocks.children.list({ block_id: BLOCK_ID });
    console.log(`Found ${response.results.length} children:`);
    for (const child of response.results) {
      console.log(`- ID: ${child.id} | Type: ${child.type}`);
      if (child.type === 'paragraph') {
        console.log(`  Content: "${child.paragraph.rich_text.map(t => t.plain_text).join('')}"`);
        console.log(`  Rich Text JSON:`, JSON.stringify(child.paragraph.rich_text, null, 2));
      } else if (child.type === 'callout') {
        console.log(`  Content: "${child.callout.rich_text.map(t => t.plain_text).join('')}"`);
      } else {
        console.log(`  JSON:`, JSON.stringify(child[child.type], null, 2));
      }
    }
  } catch (error) {
    console.error('Error inspecting block:', error);
  }
}

inspectBlock();
