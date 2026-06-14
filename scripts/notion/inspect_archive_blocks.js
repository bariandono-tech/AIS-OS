const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const archiveBlocks = [
  '37b78c4c-e388-81de-ac60-fe1ddf17863d',
  '37b78c4c-e388-816e-8b09-f23289554a61',
  '37b78c4c-e388-81fc-8b45-c7e5f56901ec',
  '37b78c4c-e388-81e1-bffa-c843bb5c8d78'
];

async function inspect() {
  for (const id of archiveBlocks) {
    console.log(`\n========================================`);
    console.log(`Inspecting Block ID: ${id}`);
    console.log(`========================================`);
    try {
      const db = await notion.databases.retrieve({ database_id: id });
      console.log(`Database Title:`, db.title.map(t => t.plain_text).join(''));
      
      const viewsRes = await notion.views.list({ data_source_id: id });
      console.log(`Views found: ${viewsRes.results.length}`);
      for (const v of viewsRes.results) {
        console.log(`  - View: "${v.name}" | ID: ${v.id}`);
        console.log(`    Filter:`, JSON.stringify(v.filter, null, 2));
      }
    } catch (e) {
      console.error(`Error:`, e.message);
    }
  }
}

inspect();
