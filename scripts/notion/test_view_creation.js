const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function test() {
  console.log('=== TESTING VIEW CREATION UNDER INLINE DB ===');
  try {
    const res = await notion.views.create({
      database_id: '37b78c4c-e388-81dd-a587-f997a59103eb', // Task Inbox block
      data_source_id: '37b78c4c-e388-8105-a5b2-000b5faa01a6', // Tasks [UT]
      name: 'Inbox',
      type: 'list',
      filter: {
        property: 'oHKB', // Status
        status: {
          does_not_equal: 'Done'
        }
      }
    });
    console.log('✅ Successfully created view:', JSON.stringify(res, null, 2));
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

test();
