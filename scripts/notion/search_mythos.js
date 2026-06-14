const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function searchMythos() {
  console.log('Searching for "Mythos" in the workspace...');
  try {
    const response = await notion.search({
      query: 'Mythos',
      page_size: 10
    });
    
    console.log(`Found ${response.results.length} results:`);
    response.results.forEach((item, index) => {
      let title = 'Untitled';
      if (item.object === 'page') {
        if (item.properties) {
          for (const key in item.properties) {
            const prop = item.properties[key];
            if (prop.type === 'title' && prop.title && Array.isArray(prop.title)) {
              title = prop.title.map(t => t.plain_text).join('');
              break;
            }
          }
        }
      } else if (item.object === 'database') {
        if (item.title && Array.isArray(item.title)) {
          title = item.title.map(t => t.plain_text).join('');
        }
      }
      console.log(`${index + 1}. Object: "${item.object}" | Title: "${title}" | ID: ${item.id} | URL: ${item.url}`);
    });
  } catch (error) {
    console.error('Error searching Notion:', error.message);
  }
}

searchMythos();
