const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function runSearch() {
  const queries = ['AIS OS', 'Twitter', 'Pendidikan', 'Jasa PPT', 'Skripsi', 'Notes', 'Worklog', 'Task'];
  for (const q of queries) {
    console.log(`\nSearching workspace for "${q}"...`);
    try {
      const response = await notion.search({
        query: q,
        page_size: 10
      });
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
        console.log(`${index + 1}. [${item.object}] "${title}" (ID: ${item.id}) | Parent: ${JSON.stringify(item.parent)}`);
      });
    } catch (error) {
      console.error(`Error searching "${q}":`, error.message);
    }
  }
}

runSearch();
