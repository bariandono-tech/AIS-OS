const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const CALLOUT_BLOCK_ID = '86c78c4c-e388-8321-a4e0-01a9a574a957';

const pagesToArchive = [
  { id: '22278c4c-e388-8387-8ee2-01621febaccd', name: 'Task: Task with Sub-Tasks' },
  { id: 'db978c4c-e388-83ee-914e-81fa811a1a2a', name: 'Note: Free Upgrade' },
  { id: '3f878c4c-e388-83fb-80c5-01345f255657', name: 'Note: Meeting @Today' },
  { id: '00878c4c-e388-8347-a9ba-81ce86c06f11', name: 'Note: Journal @Today' },
  { id: '47978c4c-e388-824f-b31d-81b9ae8583f5', name: 'Tag: Ultimate Notes Tutorials' }
];

async function runCleanup() {
  console.log('=== RUNNING REMAINING TF CLEANUP ===');
  
  // 1. Delete the welcome Callout block
  console.log(`\n🗑️ Deleting welcome callout block: ${CALLOUT_BLOCK_ID}...`);
  try {
    await notion.blocks.delete({ block_id: CALLOUT_BLOCK_ID });
    console.log('✅ Successfully deleted the callout block from the PARA page!');
  } catch (error) {
    console.error('❌ Failed to delete callout block:', error.message);
  }

  // 2. Archive remaining tutorial pages in databases
  console.log('\n🗂️ Archiving remaining tutorial pages...');
  for (const pageInfo of pagesToArchive) {
    try {
      await notion.pages.update({
        page_id: pageInfo.id,
        archived: true
      });
      console.log(`✅ Archived page: "${pageInfo.name}" (${pageInfo.id})`);
    } catch (error) {
      console.error(`❌ Failed to archive page "${pageInfo.name}":`, error.message);
    }
  }

  console.log('\n=== CLEANUP COMPLETED ===');
}

runCleanup();
