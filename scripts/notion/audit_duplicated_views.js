const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const ROOT_PAGE_ID = process.env.NOTION_PAGE_ID || '37b78c4ce38880fca6c9e71935752566';

async function getBlockChildren(blockId) {
  try {
    const response = await notion.blocks.children.list({ block_id: blockId, page_size: 100 });
    return response.results;
  } catch (error) {
    return [];
  }
}

async function scanPageRecursive(blockId, path = '', visited = new Set()) {
  if (visited.has(blockId)) return;
  visited.add(blockId);

  const children = await getBlockChildren(blockId);
  for (const block of children) {
    let currentPath = path;
    if (block.type === 'child_page') {
      currentPath = path ? `${path} -> ${block.child_page.title}` : block.child_page.title;
      console.log(`Scanning Sub-Page: [${currentPath}] (${block.id})`);
      await scanPageRecursive(block.id, currentPath, visited);
    } else if (block.type === 'child_database') {
      try {
        const db = await notion.databases.retrieve({ database_id: block.id });
        const title = db.title.map(t => t.plain_text).join('') || 'Untitled';
        const dsId = db.data_sources && db.data_sources.length > 0 ? db.data_sources[0].id : 'None';
        console.log(`  🔍 FOUND VIEW: "${title}" | ID: ${block.id}`);
        console.log(`     Location: ${path}`);
        console.log(`     Underlying Data Source ID: ${dsId}`);
        
        // Print warning if it points to a retired database (or if it doesn't belong to the duplicated workspace)
        if (dsId !== 'None') {
          if (!dsId.startsWith('37b78c4c-e388-')) {
            console.log(`     ⚠️ WARNING: Points to original/non-duplicated data source!`);
          } else {
            console.log(`     ✅ OK: Points to duplicated data source.`);
          }
        }
      } catch (err) {
        console.log(`  ❌ Failed to retrieve database view ${block.id}: ${err.message}`);
      }
    } else if (block.has_children && ['column_list', 'column', 'synced_block', 'toggle', 'callout'].includes(block.type)) {
      await scanPageRecursive(block.id, path, visited);
    }
  }
}

async function run() {
  console.log(`=== STARTING FULL WORKSPACE AUDIT FOR ${ROOT_PAGE_ID} ===`);
  await scanPageRecursive(ROOT_PAGE_ID, 'MAX Brain (1)');
  console.log(`=== AUDIT COMPLETE ===`);
}

run();
