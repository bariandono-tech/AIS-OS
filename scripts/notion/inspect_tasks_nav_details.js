const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const BLOCK_ID = '37b78c4c-e388-812b-968b-ede6af7f0cfb'; // Column list inside nav toggle

async function inspect(blockId, depth = 0) {
  try {
    const res = await notion.blocks.children.list({ block_id: blockId });
    for (const block of res.results) {
      let text = '';
      if (block.type === 'paragraph') text = block.paragraph.rich_text.map(t => t.plain_text).join('');
      else if (block.type === 'bulleted_list_item') text = block.bulleted_list_item.rich_text.map(t => t.plain_text).join('');
      else if (block.type === 'toggle') text = block.toggle.rich_text.map(t => t.plain_text).join('');
      
      console.log(`${'  '.repeat(depth)}- Block ID: ${block.id} | Type: ${block.type} | Text: "${text}"`);
      
      if (block.has_children) {
        await inspect(block.id, depth + 1);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

console.log(`=== Inspecting children of ${BLOCK_ID} ===`);
inspect(BLOCK_ID);
