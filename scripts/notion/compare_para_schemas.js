const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const targets = [
  {
    name: 'Notes [PARA] -> Notes [PT]',
    oldId: '37b78c4c-e388-810e-a8ac-000bd48e2a2c',
    newId: '37b78c4c-e388-81de-8816-000bf8f8c872'
  },
  {
    name: 'Tasks [PARA] -> Tasks [UT]',
    oldId: '37b78c4c-e388-8170-939d-000bd17662b9',
    newId: '37b78c4c-e388-8105-a5b2-000b5faa01a6'
  },
  {
    name: 'Projects [PARA] -> Projects [UT]',
    oldId: '37b78c4c-e388-815e-9f66-000be5b4d839',
    newId: '37b78c4c-e388-81f4-836c-000bebfc9b81'
  },
  {
    name: 'Areas [PARA] -> Areas [PT]',
    oldId: '37b78c4c-e388-8141-b4d2-000b7865a5d2',
    newId: '37b78c4c-e388-81c6-ac4b-000b70cbdb57'
  }
];

async function compare() {
  for (const target of targets) {
    console.log(`\n========================================`);
    console.log(`Comparing property IDs for: ${target.name}`);
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
