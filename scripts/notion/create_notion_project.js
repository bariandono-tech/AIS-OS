const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const PROJECTS_DATABASE_ID = '37c78c4c-e388-81a6-bbae-fd09329c9804'; // Projects database ID
const AREA_PAGE_ID = '37c78c4c-e388-8162-814b-ef33783d7ab3'; // Pendidikan & Akuntansi area ID

async function createProject() {
  console.log('Creating new project in Notion...');
  try {
    const response = await notion.pages.create({
      parent: { database_id: PROJECTS_DATABASE_ID },
      properties: {
        Name: {
          title: [
            {
              type: 'text',
              text: { content: 'Jasa PPT & Layouting Skripsi Akuntansi' }
            }
          ]
        },
        Status: {
          status: {
            name: 'Doing'
          }
        },
        Area: {
          relation: [
            { id: AREA_PAGE_ID }
          ]
        }
      }
    });
    console.log(`Success! Project page created: ${response.url}`);
  } catch (error) {
    console.error('Error creating project page:', error.message);
  }
}

createProject();
