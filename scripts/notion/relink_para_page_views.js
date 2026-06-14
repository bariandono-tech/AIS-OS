const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const PARA_PAGE_ID = '37b78c4c-e388-816c-9350-e7ade82553f9';

// Old blocks to delete
const oldBlocks = [
  '37b78c4c-e388-81dd-a587-f997a59103eb', // Task Inbox
  '37b78c4c-e388-812c-9aa8-e1b7637f164d', // Note Inbox
  '37b78c4c-e388-81cf-814d-c720f22404ce', // Projects
  '37b78c4c-e388-8138-983c-e2952c25f545'  // Areas & Resources
];

// New master database sources
const targets = [
  {
    name: 'Task Inbox',
    dsId: '37b78c4c-e388-8105-a5b2-000b5faa01a6', // Tasks [UT]
    viewName: 'Inbox',
    viewType: 'list',
    filter: {
      property: 'oHKB', // Status
      status: {
        does_not_equal: 'Done'
      }
    }
  },
  {
    name: 'Note Inbox',
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

async function relink() {
  console.log('=== RELINKING MAIN PARA PAGE VIEWS ===');
  
  // 1. Delete the old blocks
  for (const blockId of oldBlocks) {
    try {
      console.log(`Deleting block: ${blockId}...`);
      await notion.blocks.delete({ block_id: blockId });
      console.log(`✅ Deleted block ${blockId}`);
    } catch (err) {
      console.error(`❌ Failed to delete block ${blockId}:`, err.message);
    }
  }
  
  // 2. Append new link_to_database blocks and create views
  console.log('\nAppending new linked database views...');
  for (const target of targets) {
    try {
      console.log(`Adding linked view for ${target.name} pointing to data source ${target.dsId}...`);
      
      const response = await notion.blocks.children.append({
        block_id: PARA_PAGE_ID,
        children: [
          {
            object: 'block',
            type: 'link_to_database',
            link_to_database: {
              type: 'database_id',
              database_id: target.dsId
            }
          }
        ]
      });
      
      const dbBlock = response.results[0];
      console.log(`✅ Created linked database block: ${dbBlock.id}`);
      
      // Create the view
      console.log(`Creating view "${target.viewName}" under database block ${dbBlock.id}...`);
      const newView = await notion.views.create({
        database_id: dbBlock.id,
        data_source_id: target.dsId,
        name: target.viewName,
        type: target.viewType,
        filter: target.filter
      });
      console.log(`✅ Successfully created view: ${newView.id}`);
      
    } catch (err) {
      console.error(`❌ Failed to add linked database for ${target.name}:`, err.message);
    }
  }
  
  console.log('\n=== RELINKING COMPLETE ===');
}

relink();
