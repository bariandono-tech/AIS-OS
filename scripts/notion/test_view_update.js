const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const VIEW_ID = '37b78c4c-e388-81dd-a587-f997a59103eb'; // Task Inbox view on PARA
const NEW_DS_ID = '37b78c4c-e388-8170-939d-000bd17662b9'; // Tasks [PARA] data source

async function testViewUpdate() {
  console.log('Testing updating data_sources on a database view...');
  try {
    const res = await notion.databases.update({
      database_id: VIEW_ID,
      data_sources: [
        {
          data_source_id: NEW_DS_ID
        }
      ]
    });
    console.log('Success updating database view data sources!');
    console.log('New data sources:', JSON.stringify(res.data_sources, null, 2));
  } catch (err) {
    console.error('Failed to update database view:', err.message);
  }
}

testViewUpdate();
