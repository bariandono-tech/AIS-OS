const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATA_SOURCE_ID = 'bdc78c4c-e388-83c7-9254-87b192111ae3'; // Data source for Projects [PARA]

async function testQuery() {
  console.log(`Querying data source: ${DATA_SOURCE_ID}...`);
  try {
    const response = await notion.dataSources.query({ data_source_id: DATA_SOURCE_ID });
    console.log(`Success! Found ${response.results.length} items.`);
    for (const page of response.results) {
      console.log(`- Page ID: ${page.id}`);
      const props = page.properties;
      for (const key of Object.keys(props)) {
        if (props[key].type === 'title') {
          console.log(`    Title (${key}):`, props[key].title.map(t => t.plain_text).join(''));
        }
      }
    }
  } catch (error) {
    console.error('Failed to query data source:', error.message);
  }
}

testQuery();
