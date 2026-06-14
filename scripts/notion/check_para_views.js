const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const views = [
  { id: 'f2d78c4c-e388-82d0-8ccb-811c7ce4f37a', label: 'Task Inbox (PARA page)' },
  { id: 'f7178c4c-e388-83c3-8a1e-01668083929e', label: 'Note Inbox (PARA page)' },
  { id: 'a3178c4c-e388-822e-bab7-01b31e24d84c', label: 'Projects (PARA page)' },
  { id: 'b4f78c4c-e388-82b2-8ec9-010f02bbf1dd', label: 'Areas & Resources (PARA page)' }
];

async function checkViews() {
  for (const view of views) {
    console.log(`\nChecking: ${view.label} (ID: ${view.id})`);
    try {
      const db = await notion.databases.retrieve({ database_id: view.id });
      console.log(`- Title:`, db.title.map(t => t.plain_text).join(''));
      console.log(`- Data Sources:`, JSON.stringify(db.data_sources, null, 2));
    } catch (e) {
      console.error(`- Error:`, e.message);
    }
  }
}

checkViews();
