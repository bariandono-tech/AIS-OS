const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const paraBlocks = [
  '37b78c4c-e388-81dd-a587-f997a59103eb',
  '37b78c4c-e388-812c-9aa8-e1b7637f164d',
  '37b78c4c-e388-81cf-814d-c720f22404ce',
  '37b78c4c-e388-8138-983c-e2952c25f545'
];

async function inspect() {
  for (const id of paraBlocks) {
    console.log(`\n========================================`);
    console.log(`Inspecting Block ID: ${id}`);
    console.log(`========================================`);
    try {
      const block = await notion.blocks.retrieve({ block_id: id });
      console.log(`Block Type: ${block.type}`);
      if (block.type === 'child_database') {
        const db = await notion.databases.retrieve({ database_id: id });
        console.log(`Database Title:`, db.title.map(t => t.plain_text).join(''));
        console.log(`Is Inline: ${db.is_inline}`);
        
        // Let's query the views of this database block!
        try {
          const viewsRes = await notion.views.list({ data_source_id: id });
          console.log(`Views under this database block ID itself (as data source): ${viewsRes.results.length}`);
        } catch (ve) {
          console.log(`Failed to list views under this block ID as data source: ${ve.message}`);
        }
        
        // Let's check if there are data sources listed on this database
        if (db.data_sources) {
          console.log(`Data Sources:`, JSON.stringify(db.data_sources, null, 2));
          if (db.data_sources.length > 0) {
            const dsId = db.data_sources[0].id;
            try {
              const viewsRes = await notion.views.list({ data_source_id: dsId });
              console.log(`Views under data source ID ${dsId}: ${viewsRes.results.length}`);
              for (const v of viewsRes.results) {
                console.log(`  - View: "${v.name}" | ID: ${v.id} | Parent DB Block: ${v.parent.database_id}`);
              }
            } catch (ve) {
              console.log(`Failed to list views under data source ${dsId}: ${ve.message}`);
            }
          }
        }
      } else {
        console.log(JSON.stringify(block, null, 2));
      }
    } catch (e) {
      console.error(`Error:`, e.message);
    }
  }
}

inspect();
