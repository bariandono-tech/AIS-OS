const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function searchPages() {
  console.log('Searching for pages...');
  try {
    const response = await notion.search({
      filter: {
        value: 'page',
        property: 'object'
      }
    });
    
    console.log(`Found ${response.results.length} pages:`);
    for (const item of response.results) {
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
      
      const lower = title.toLowerCase();
      if (lower.includes('ultimate') || lower.includes('brain') || lower.includes('task') || lower.includes('note') || lower.includes('para')) {
        console.log(`- Page: "${title}" | ID: ${item.id} | Parent: ${JSON.stringify(item.parent)}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

searchPages();
