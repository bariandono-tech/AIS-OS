const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const CALLOUT_BLOCK_ID = '86c78c4c-e388-8321-a4e0-01a9a574a957';

async function cleanCalloutChildren() {
  console.log(`Retrieving child blocks for callout ${CALLOUT_BLOCK_ID}...`);
  try {
    const response = await notion.blocks.children.list({ block_id: CALLOUT_BLOCK_ID });
    console.log(`Found ${response.results.length} child blocks.`);
    
    for (const child of response.results) {
      let content = '';
      if (child.type === 'paragraph') {
        content = child.paragraph.rich_text.map(t => t.plain_text).join('');
      } else if (child.type === 'toggle') {
        content = child.toggle.rich_text.map(t => t.plain_text).join('');
      } else {
        content = `[Type: ${child.type}]`;
      }
      console.log(`- Deleting child ID: ${child.id} | Type: ${child.type} | Content: "${content}"`);
      await notion.blocks.delete({ block_id: child.id });
    }
    console.log('✅ Successfully deleted all child blocks of the Callout banner!');
  } catch (error) {
    console.error('Error cleaning callout children:', error.message);
  }
}

cleanCalloutChildren();
