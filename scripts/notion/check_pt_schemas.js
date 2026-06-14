const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const dataSources = [
  { id: 'd3078c4c-e388-82ba-b06e-87afad95803d', name: 'Tasks [PT]' },
  { id: 'a2b78c4c-e388-82df-a6b2-079f51483cc1', name: 'Notes [PT]' },
  { id: '45078c4c-e388-83e2-aad8-07f4d8067fb9', name: 'Projects [PT]' },
  { id: '69978c4c-e388-8338-90a8-07d890c07aad', name: 'Areas/Resources [PT]' }
];

async function checkPTSchemas() {
  for (const ds of dataSources) {
    console.log(`\n========================================`);
    console.log(`Schema for: ${ds.name} (${ds.id})`);
    console.log(`========================================`);
    try {
      const response = await notion.dataSources.retrieve({ data_source_id: ds.id });
      const props = response.properties;
      for (const propName of Object.keys(props)) {
        const prop = props[propName];
        console.log(`- Property: "${propName}" | Type: ${prop.type}`);
        if (prop.type === 'status') {
          console.log(`  Status Options:`, prop.status.options.map(o => o.name));
        } else if (prop.type === 'select') {
          console.log(`  Select Options:`, prop.select.options.map(o => o.name));
        } else if (prop.type === 'multi_select') {
          console.log(`  Multi-select Options:`, prop.multi_select.options.map(o => o.name));
        }
      }
    } catch (e) {
      console.error(`Error for ${ds.name}:`, e.message);
    }
  }
}

checkPTSchemas();
