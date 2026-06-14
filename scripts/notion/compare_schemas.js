const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const targets = [
  {
    name: 'Notes',
    oldId: '37b78c4c-e388-81f1-be3d-000b4b1c3009',
    newId: '37b78c4c-e388-81de-8816-000bf8f8c872'
  },
  {
    name: 'Tasks',
    oldId: '37b78c4c-e388-81aa-95cd-000bd9800292',
    newId: '37b78c4c-e388-8105-a5b2-000b5faa01a6'
  },
  {
    name: 'Projects',
    oldId: '37b78c4c-e388-81e0-af96-000b7901ce71',
    newId: '37b78c4c-e388-81f4-836c-000bebfc9b81'
  }
];

async function compare() {
  for (const target of targets) {
    console.log(`\n========================================`);
    console.log(`Comparing property IDs for ${target.name}`);
    console.log(`========================================`);
    try {
      const oldDs = await notion.dataSources.retrieve({ data_source_id: target.oldId });
      const newDs = await notion.dataSources.retrieve({ data_source_id: target.newId });
      
      const oldProps = oldDs.properties;
      const newProps = newDs.properties;
      
      console.log('Old properties:');
      for (const name of Object.keys(oldProps)) {
        console.log(`  - "${name}" | ID: ${encodeURIComponent(oldProps[name].id)} | Type: ${oldProps[name].type}`);
      }
      
      console.log('\nNew properties:');
      for (const name of Object.keys(newProps)) {
        console.log(`  - "${name}" | ID: ${encodeURIComponent(newProps[name].id)} | Type: ${newProps[name].type}`);
      }
    } catch (err) {
      console.error(`Error comparing ${target.name}:`, err.message);
    }
  }
}

compare();
