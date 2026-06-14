const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const ROOT_PAGE_ID = process.env.NOTION_PAGE_ID || '37b78c4ce38880fca6c9e71935752566';

async function inspectRoot() {
  console.log(`Inspecting blocks on ROOT PAGE: ${ROOT_PAGE_ID}...`);
  try {
    const res = await notion.blocks.children.list({ block_id: ROOT_PAGE_ID });
    console.log(`Found ${res.results.length} children blocks:`);
    for (const block of res.results) {
      console.log(`- ID: ${block.id} | Type: ${block.type} | HasChildren: ${block.has_children}`);
      if (block.type === 'child_page') {
        console.log(`  Child Page Title: "${block.child_page.title}"`);
      } else if (block.type === 'child_database') {
        console.log(`  Child Database Title: "${block.child_database.title}"`);
      } else if (block.type === 'paragraph') {
        console.log(`  Paragraph: "${block.paragraph.rich_text.map(t => t.plain_text).join('')}"`);
      } else if (block.type === 'callout') {
        console.log(`  Callout: "${block.callout.rich_text.map(t => t.plain_text).join('')}"`);
      } else {
        console.log(`  Details:`, JSON.stringify(block[block.type], null, 2));
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

inspectRoot();
