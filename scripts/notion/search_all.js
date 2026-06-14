const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function runSearch() {
  console.log('Searching workspace for "Skripsi" and "Deviasi"...');
  try {
    const response = await notion.search({
      query: 'Skripsi',
      page_size: 50
    });
    console.log(`Found ${response.results.length} search results for "Skripsi":`);
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
      } else if (item.title && Array.isArray(item.title)) {
        title = item.title.map(t => t.plain_text).join('');
      }
      console.log(`${index + 1}. [${item.object}] "${title}" (ID: ${item.id})`);
    });

    const response2 = await notion.search({
      query: 'Deviasi',
      page_size: 50
    });
    console.log(`\nFound ${response2.results.length} search results for "Deviasi":`);
    response2.results.forEach((item, index) => {
      let title = 'Untitled';
      if (item.properties) {
        for (const key in item.properties) {
          const prop = item.properties[key];
          if (prop.type === 'title' && prop.title && Array.isArray(prop.title)) {
            title = prop.title.map(t => t.plain_text).join('');
            break;
          }
        }
      } else if (item.title && Array.isArray(item.title)) {
        title = item.title.map(t => t.plain_text).join('');
      }
      console.log(`${index + 1}. [${item.object}] "${title}" (ID: ${item.id})`);
    });

  } catch (error) {
    console.error('Error during search:', error);
  }
}

runSearch();
