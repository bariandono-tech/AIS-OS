const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const viewIds = [
  '37b78c4c-e388-818c-a800-000c6c79770c',
  '37b78c4c-e388-81cf-864c-000c77e8167c'
];

async function inspectViews() {
  for (const id of viewIds) {
    console.log(`\n========================================`);
    console.log(`Inspecting View ID: ${id}`);
    console.log(`========================================`);
    try {
      const view = await notion.views.retrieve({ view_id: id });
      console.log(JSON.stringify(view, null, 2));
    } catch (e) {
      console.error(`Error retrieving view ${id}:`, e.message);
    }
  }
}

inspectViews();
