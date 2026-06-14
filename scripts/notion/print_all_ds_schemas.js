const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const dataSources = [
  { id: '91d78c4c-e388-83f0-806c-87099cc6c471', name: 'Tasks [PARA]' },
  { id: 'd6d78c4c-e388-83a3-9e0a-8746e586bf8a', name: 'Notes [PARA]' },
  { id: 'bdc78c4c-e388-83c7-9254-87b192111ae3', name: 'Projects [PARA]' },
  { id: '7be78c4c-e388-8228-9bcc-87b7d45a5578', name: 'Areas/Resources [PARA]' }
];

async function printAllSchemas() {
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

printAllSchemas();
