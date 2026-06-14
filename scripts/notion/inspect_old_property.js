const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DS_ID = '37b78c4c-e388-81f1-be3d-000b4b1c3009'; // Notes (Ultimate)

async function inspect() {
  try {
    const res = await notion.dataSources.retrieve({ data_source_id: DS_ID });
    console.log('Properties in Notes (Ultimate):');
    for (const key of Object.keys(res.properties)) {
      const prop = res.properties[key];
      console.log(`- Name: "${key}" | ID: "${prop.id}" | Type: ${prop.type}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

inspect();
