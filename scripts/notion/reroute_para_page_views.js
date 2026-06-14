const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const viewsToCreate = [
  {
    name: 'Note Inbox',
    parentDbBlock: '37b78c4c-e388-812c-9aa8-e1b7637f164d',
    dsId: '37b78c4c-e388-81de-8816-000bf8f8c872', // Notes [PT]
    viewName: 'Inbox',
    viewType: 'list',
    filter: {
      property: 'pqQj', // Archive
      checkbox: {
        equals: false
      }
    }
  },
  {
    name: 'Projects',
    parentDbBlock: '37b78c4c-e388-81cf-814d-c720f22404ce',
    dsId: '37b78c4c-e388-81f4-836c-000bebfc9b81', // Projects [UT]
    viewName: 'Active',
    viewType: 'list',
    filter: {
      property: 'pU\\f', // Archived
      checkbox: {
        equals: false
      }
    }
  },
  {
    name: 'Areas & Resources',
    parentDbBlock: '37b78c4c-e388-8138-983c-e2952c25f545',
    dsId: '37b78c4c-e388-81c6-ac4b-000b70cbdb57', // Areas [PT]
    viewName: 'Areas',
    viewType: 'list',
    filter: {
      property: 'srwY', // Archive
      checkbox: {
        equals: false
      }
    }
  }
];

async function createViews() {
  console.log('=== CREATING VIEWS FOR PARA PAGE BLOCKS ===');
  for (const target of viewsToCreate) {
    try {
      console.log(`Creating view for ${target.name} under parent block ${target.parentDbBlock}...`);
      const res = await notion.views.create({
        database_id: target.parentDbBlock,
        data_source_id: target.dsId,
        name: target.viewName,
        type: target.viewType,
        filter: target.filter
      });
      console.log(`✅ Successfully created view: ${res.id}`);
    } catch (e) {
      console.error(`❌ Failed for ${target.name}:`, e.message);
    }
  }
  console.log('=== DONE ===');
}

createViews();
