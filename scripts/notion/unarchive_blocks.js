const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const oldBlocks = [
  '37b78c4c-e388-81dd-a587-f997a59103eb', // Task Inbox
  '37b78c4c-e388-812c-9aa8-e1b7637f164d', // Note Inbox
  '37b78c4c-e388-81cf-814d-c720f22404ce', // Projects
  '37b78c4c-e388-8138-983c-e2952c25f545'  // Areas & Resources
];

async function unarchive() {
  console.log('=== UNARCHIVING PARA BLOCKS ===');
  for (const id of oldBlocks) {
    try {
      console.log(`Unarchiving block ${id}...`);
      await notion.blocks.update({
        block_id: id,
        archived: false
      });
      console.log(`✅ Unarchived block ${id}`);
    } catch (e) {
      console.error(`❌ Failed for block ${id}:`, e.message);
    }
  }
}

unarchive();
