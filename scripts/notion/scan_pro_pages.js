const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PRO_NOTES_ID = '59778c4c-e388-8296-9659-01c023b2e89c';
const PRO_TASKS_ID = '87c78c4c-e388-8395-9e96-81d536d668b3';

async function scanPage(pageId, pageName) {
  console.log(`\nScanning ${pageName} (${pageId}):`);
  try {
    const response = await notion.blocks.children.list({ block_id: pageId });
    for (const block of response.results) {
      if (block.type === 'child_page') {
        console.log(`- Sub-Page: "${block.child_page.title}" | ID: ${block.id}`);
      } else if (block.type === 'child_database') {
        try {
          const db = await notion.databases.retrieve({ database_id: block.id });
          const dsId = db.data_sources && db.data_sources.length > 0 ? db.data_sources[0].id : 'None';
          console.log(`- Database: "${db.title.map(t => t.plain_text).join('')}" | ID: ${block.id} | Data Source: ${dsId}`);
        } catch (e) {
          console.log(`- Database (Retrieval Failed): ID: ${block.id} | Err: ${e.message}`);
        }
      } else {
        // Look for column lists or other structures that might contain subpages/dbs
        if (block.has_children && ['column_list', 'column', 'synced_block'].includes(block.type)) {
          const subResp = await notion.blocks.children.list({ block_id: block.id });
          for (const sub of subResp.results) {
            if (sub.type === 'child_page') {
              console.log(`  - Sub-Page: "${sub.child_page.title}" | ID: ${sub.id}`);
            } else if (sub.type === 'child_database') {
              try {
                const db = await notion.databases.retrieve({ database_id: sub.id });
                const dsId = db.data_sources && db.data_sources.length > 0 ? db.data_sources[0].id : 'None';
                console.log(`  - Database: "${db.title.map(t => t.plain_text).join('')}" | ID: ${sub.id} | Data Source: ${dsId}`);
              } catch (e) {
                console.log(`  - Database (Retrieval Failed): ID: ${sub.id} | Err: ${e.message}`);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning ${pageName}:`, error.message);
  }
}

async function run() {
  await scanPage(PRO_NOTES_ID, 'Pro Notes');
  await scanPage(PRO_TASKS_ID, 'Pro Tasks');
}

run();
