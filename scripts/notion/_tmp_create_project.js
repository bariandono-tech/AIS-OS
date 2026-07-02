const { Client } = require('@notionhq/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PROJECTS_DATABASE_ID = '37c78c4c-e388-81a6-bbae-fd09329c9804';
const AREA_PAGE_ID = '37c78c4c-e388-8162-814b-ef33783d7ab3'; // Pendidikan & Akuntansi
(async () => {
  const res = await notion.pages.create({
    parent: { database_id: PROJECTS_DATABASE_ID },
    properties: {
      Name: { title: [{ type: 'text', text: { content: 'Audit Revisi Proposal' } }] },
      Status: { status: { name: 'Doing' } },
      Area: { relation: [{ id: AREA_PAGE_ID }] }
    }
  });
  console.log('PROJECT_ID:', res.id);
  console.log('URL:', res.url);
})().catch(e => console.error('ERR', e.message));
