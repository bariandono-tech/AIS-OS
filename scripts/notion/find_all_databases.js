const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function findAllDatabases() {
  console.log('Searching for all data sources in workspace...');
  try {
    const response = await notion.search({
      filter: {
        value: 'data_source',
        property: 'object'
      }
    });
    
    console.log(`Found ${response.results.length} data sources:`);
    for (const db of response.results) {
      const title = db.title ? db.title.map(t => t.plain_text).join('') : 'Untitled';
      console.log(`\n========================================`);
      console.log(`Title: "${title}" | ID: ${db.id}`);
      console.log(`Parent:`, JSON.stringify(db.parent, null, 2));
      
      try {
        const queryRes = await notion.dataSources.query({ data_source_id: db.id });
        console.log(`- Item Count: ${queryRes.results.length}`);
        if (queryRes.results.length > 0) {
          console.log(`  Sample item titles:`, queryRes.results.slice(0, 3).map(item => {
            const props = item.properties || {};
            for (const key of Object.keys(props)) {
              if (props[key].type === 'title') {
                return props[key].title.map(t => t.plain_text).join('');
              }
            }
            return 'Untitled';
          }));
        }
      } catch (err) {
        console.log(`- Query Failed: ${err.message}`);
      }
    }
  } catch (error) {
    console.error('Error searching databases:', error.message);
  }
}

findAllDatabases();
