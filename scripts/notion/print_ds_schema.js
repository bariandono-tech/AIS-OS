const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DS_ID = 'bdc78c4c-e388-83c7-9254-87b192111ae3'; // Projects [PARA] data source

async function testRetrieve() {
  try {
    const response = await notion.dataSources.retrieve({ data_source_id: DS_ID });
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Failed to retrieve data source:', error.message);
  }
}

testRetrieve();
