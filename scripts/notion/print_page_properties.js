const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const dataSources = [
  { id: '91d78c4c-e388-83f0-806c-87099cc6c471', name: 'Tasks [PARA] Data Source' },
  { id: 'd6d78c4c-e388-83a3-9e0a-8746e586bf8a', name: 'Notes [PARA] Data Source' },
  { id: 'bdc78c4c-e388-83c7-9254-87b192111ae3', name: 'Projects [PARA] Data Source' },
  { id: '7be78c4c-e388-8228-9bcc-87b7d45a5578', name: 'Areas/Resources [PARA] Data Source' }
];

async function inspectProperties() {
  for (const ds of dataSources) {
    console.log(`\n========================================`);
    console.log(`Inspecting page properties for: ${ds.name} (${ds.id})`);
    console.log(`========================================`);
    try {
      const response = await notion.dataSources.query({ data_source_id: ds.id, page_size: 1 });
      if (response.results.length === 0) {
        console.log('No pages found in this database.');
        continue;
      }
      const page = response.results[0];
      const props = page.properties;
      for (const propName of Object.keys(props)) {
        const prop = props[propName];
        console.log(`- Property: "${propName}" | Type: ${prop.type}`);
        console.log(`  Value:`, JSON.stringify(prop, null, 2));
      }
    } catch (error) {
      console.error(`Failed to query data source ${ds.name}:`, error.message);
    }
  }
}

inspectProperties();
