const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const databases = [
  { id: '17f78c4c-e388-82e6-befb-01f49d5ebe82', name: 'Tasks [PARA]' },
  { id: '38e78c4c-e388-82e4-a66e-818769620475', name: 'Notes [PARA]' },
  { id: '27778c4c-e388-8281-bb8c-014bab2582d7', name: 'Projects [PARA]' },
  { id: '0f378c4c-e388-8253-b33e-815844282c1a', name: 'Areas/Resources [PARA]' }
];

async function printSchemas() {
  for (const dbInfo of databases) {
    console.log(`\n========================================`);
    console.log(`Schema for database: ${dbInfo.name} (${dbInfo.id})`);
    console.log(`========================================`);
    try {
      const db = await notion.databases.retrieve({ database_id: dbInfo.id });
      const props = db.properties;
      for (const propName of Object.keys(props)) {
        const prop = props[propName];
        console.log(`- Property: "${propName}" | Type: ${prop.type}`);
        if (prop.type === 'select') {
          console.log(`  Options:`, prop.select.options.map(o => o.name));
        } else if (prop.type === 'multi_select') {
          console.log(`  Options:`, prop.multi_select.options.map(o => o.name));
        } else if (prop.type === 'status') {
          console.log(`  Groups/Options:`, prop.status.options.map(o => o.name));
        } else if (prop.type === 'relation') {
          console.log(`  Relation Database:`, prop.relation.database_id);
        }
      }
    } catch (error) {
      console.error(`Failed to retrieve schema for ${dbInfo.name}:`, error.message);
    }
  }
}

printSchemas();
