const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const PAGE_1_ID = '37c78c4c-e388-8149-ba66-fbd0ea94aaf8';
const PAGE_2_ID = '37c78c4c-e388-810e-8d4d-c9081730a8d7';

async function checkPages() {
  for (const pageId of [PAGE_1_ID, PAGE_2_ID]) {
    console.log(`\n=================== Page ID: ${pageId} ===================`);
    try {
      const page = await notion.pages.retrieve({ page_id: pageId });
      console.log('Parent object:', page.parent);
      console.log('Page properties:');
      for (const [key, value] of Object.entries(page.properties)) {
        console.log(`- ${key} (type: ${value.type}):`, JSON.stringify(value).substring(0, 200));
      }
    } catch (error) {
      console.error(`Error retrieving page ${pageId}:`, error.message);
    }
  }
}

checkPages();
