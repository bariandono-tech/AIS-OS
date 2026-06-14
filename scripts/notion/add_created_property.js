const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function addCreated() {
  console.log('=== ADDING CREATED PROPERTY TO NOTES [PT] ===');
  try {
    const res = await notion.dataSources.update({
      data_source_id: '37b78c4c-e388-81de-8816-000bf8f8c872',
      properties: {
        'Created': {
          created_time: {}
        }
      }
    });
    console.log('✅ Successfully added Created property to Notes [PT]!');
  } catch (error) {
    console.error('❌ Failed to add Created property:', error.message);
  }
}

addCreated();
