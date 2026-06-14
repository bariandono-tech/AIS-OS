const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const NEW_PARA_PAGE_ID = '37b78c4c-e388-816c-9350-e7ade82553f9'; // Duplicated PARA page

async function getBlockChildren(blockId) {
  try {
    const response = await notion.blocks.children.list({ block_id: blockId, page_size: 100 });
    return response.results;
  } catch (error) {
    return [];
  }
}

async function scanDeep(blockId, depth = 0) {
  const children = await getBlockChildren(blockId);
  for (const block of children) {
    if (block.type === 'child_database') {
      try {
        const db = await notion.databases.retrieve({ database_id: block.id });
        console.log(`${'  '.repeat(depth)}- Database View ID: ${block.id} | Title: "${db.title.map(t => t.plain_text).join('')}"`);
        console.log(`${'  '.repeat(depth)}  Data Sources:`, JSON.stringify(db.data_sources, null, 2));
      } catch (err) {
        console.log(`${'  '.repeat(depth)}- Database View (Retrieval Failed) ID: ${block.id} | Err: ${err.message}`);
      }
    }
    
    if (block.has_children && ['toggle', 'column_list', 'column', 'synced_block'].includes(block.type)) {
      await scanDeep(block.id, depth + 1);
    }
  }
}

async function run() {
  console.log(`Deep scanning the new duplicated PARA page: ${NEW_PARA_PAGE_ID}...`);
  await scanDeep(NEW_PARA_PAGE_ID);
}

run();
