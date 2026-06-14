const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const AREAS_DATABASE_ID = '37c78c4c-e388-81b1-b1bf-000b2abc3efc';

async function listAreas() {
  console.log(`Querying Areas database: ${AREAS_DATABASE_ID}...`);
  try {
    const response = await notion.dataSources.query({ data_source_id: AREAS_DATABASE_ID });
    console.log(`Found ${response.results.length} areas:`);
    response.results.forEach((item, index) => {
      let title = 'Untitled';
      const props = item.properties || {};
      for (const key of Object.keys(props)) {
        if (props[key].type === 'title') {
          title = props[key].title.map(t => t.plain_text).join('');
          break;
        }
      }
      console.log(`${index + 1}. Area: "${title}" | ID: ${item.id}`);
    });
  } catch (error) {
    console.error('Error querying areas:', error.message);
  }
}

listAreas();
