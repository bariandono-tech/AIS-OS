const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PAGE_ID = '37b78c4c-e388-810c-a33e-d394fe476c47'; // All Notes page

async function inspect() {
  console.log(`Inspecting blocks on page ${PAGE_ID}...`);
  try {
    const res = await notion.blocks.children.list({ block_id: PAGE_ID });
    console.log(`Found ${res.results.length} children blocks:`);
    for (const block of res.results) {
      console.log(`- ID: ${block.id} | Type: ${block.type} | HasChildren: ${block.has_children}`);
      if (block.type === 'child_database') {
        console.log(`  Child Database Title: "${block.child_database.title}"`);
        try {
          const db = await notion.databases.retrieve({ database_id: block.id });
          console.log(`  Database retrieved: Title="${db.title.map(t => t.plain_text).join('')}"`);
          console.log(`  Data Sources:`, JSON.stringify(db.data_sources, null, 2));
        } catch (e) {
          console.log(`  Database retrieve failed:`, e.message);
        }
      } else if (block.type === 'link_to_database') {
        console.log(`  Link To Database Details:`, JSON.stringify(block.link_to_database, null, 2));
      } else {
        console.log(`  Details:`, JSON.stringify(block[block.type], null, 2));
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

inspect();
