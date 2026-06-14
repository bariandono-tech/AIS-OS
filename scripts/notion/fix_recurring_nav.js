const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const BLOCK_ID = '37b78c4c-e388-8198-9a64-dd490e808014'; // Recurring tasks paragraph block in Column 1

async function fixNav() {
  console.log(`=== FIXING NAVIGATION ON RECURRING TASKS PAGE ===`);
  try {
    const res = await notion.blocks.update({
      block_id: BLOCK_ID,
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: 'All Tasks',
              link: {
                url: 'https://app.notion.com/p/37b78c4ce38881e88575fd67fd54b3bf'
              }
            }
          }
        ]
      }
    });
    console.log('✅ Successfully updated navigation item to All Tasks!');
  } catch (error) {
    console.error('❌ Failed to update navigation:', error.message);
  }
}

fixNav();
