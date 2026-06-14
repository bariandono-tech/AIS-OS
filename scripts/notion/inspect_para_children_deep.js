const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PARA_PAGE_ID = '7fc78c4c-e388-8315-b9d2-014194f6db5c'; // "PARA"

async function getBlockChildren(blockId) {
  try {
    const response = await notion.blocks.children.list({ block_id: blockId, page_size: 100 });
    return response.results;
  } catch (error) {
    return [];
  }
}

async function deepScan(blockId, depth = 0) {
  const children = await getBlockChildren(blockId);
  const indent = '  '.repeat(depth);
  
  for (const block of children) {
    let detail = '';
    if (block.type === 'paragraph') {
      detail = `"${block.paragraph.rich_text.map(t => t.plain_text).join('')}"`;
    } else if (block.type === 'callout') {
      const text = block.callout.rich_text.map(t => t.plain_text).join('');
      const icon = block.callout.icon ? JSON.stringify(block.callout.icon) : 'null';
      detail = `[Callout Icon: ${icon}] "${text}"`;
    } else if (block.type === 'child_page') {
      detail = `"${block.child_page.title}"`;
    } else if (block.type === 'child_database') {
      detail = `"${block.child_database.title}"`;
    } else if (block.type === 'synced_block') {
      detail = `(Original: ${block.synced_block.synced_from ? block.synced_block.synced_from.block_id : 'Self'})`;
    }
    
    console.log(`${indent}- Block ID: ${block.id} | Type: ${block.type} | HasChildren: ${block.has_children} | Detail: ${detail}`);
    
    if (block.has_children) {
      await deepScan(block.id, depth + 1);
    }
  }
}

async function run() {
  console.log(`Deep scanning PARA page (${PARA_PAGE_ID})...`);
  await deepScan(PARA_PAGE_ID);
}

run();
