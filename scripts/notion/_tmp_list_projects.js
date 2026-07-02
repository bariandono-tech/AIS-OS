const { Client } = require('@notionhq/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PROJECTS_DB = '37c78c4c-e388-81a6-bbae-fd09329c9804';
(async () => {
  // find the data source under the Projects database
  const db = await notion.databases.retrieve({ database_id: PROJECTS_DB });
  const dsId = db.data_sources?.[0]?.id;
  console.log('DATA_SOURCE_ID:', dsId);
  const res = await notion.dataSources.query({ data_source_id: dsId, page_size: 100 });
  for (const p of res.results) {
    const t = p.properties?.Name?.title?.[0]?.plain_text || '(untitled)';
    console.log(p.id, '|', t);
  }
})().catch(e => console.error('ERR', e.message));
