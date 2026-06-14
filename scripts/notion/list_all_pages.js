const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function listAllPages() {
  console.log('Searching for all pages in the workspace...');
  try {
    const response = await notion.search({
      filter: {
        value: 'page',
        property: 'object'
      },
      page_size: 100
    });
    
    console.log(`Found ${response.results.length} pages:`);
    response.results.forEach((item, index) => {
      let title = 'Untitled';
      if (item.properties) {
        for (const key in item.properties) {
          const prop = item.properties[key];
          if (prop.type === 'title' && prop.title && Array.isArray(prop.title)) {
            title = prop.title.map(t => t.plain_text).join('');
            break;
          }
        }
      }
      console.log(`${index + 1}. Title: "${title}" | ID: ${item.id} | Parent: ${JSON.stringify(item.parent)}`);
    });
  } catch (error) {
    console.error('Error listing pages:', error.message);
  }
}

listAllPages();
