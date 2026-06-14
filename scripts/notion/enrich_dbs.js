const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function enrichNotes() {
  console.log('=== UPDATING NOTES [PT] SCHEMA ===');
  try {
    const res = await notion.dataSources.update({
      data_source_id: '37b78c4c-e388-81de-8816-000bf8f8c872',
      properties: {
        'Type': {
          select: {
            options: [
              { name: 'Book' },
              { name: 'Idea' },
              { name: 'Journal' },
              { name: 'Lecture' },
              { name: 'Meeting' },
              { name: 'Plan' },
              { name: 'Recipe' },
              { name: 'Reference' },
              { name: 'Voice Note' },
              { name: 'Web Clip' },
              { name: 'Article' },
              { name: 'Note' }
            ]
          }
        },
        'Favorite': {
          checkbox: {}
        },
        'Tag': {
          relation: {
            database_id: '37b78c4c-e388-817b-bad1-f047a8ad3f7e',
            data_source_id: '37b78c4c-e388-8184-ad58-000b82a159e8',
            single_property: {}
          }
        },
        'Note Date': {
          date: {}
        },
        'Audio File': {
          files: {}
        },
        'File Name': {
          rich_text: {}
        },
        'Duration (Seconds)': {
          number: {}
        },
        // Re-route Project relation to Projects [UT]
        'Project': {
          relation: {
            database_id: '37b78c4c-e388-81f1-b4d3-c461fd861441',
            data_source_id: '37b78c4c-e388-81f4-836c-000bebfc9b81',
            single_property: {}
          }
        }
      }
    });
    console.log('✅ Notes [PT] updated successfully!');
  } catch (error) {
    console.error('❌ Failed to update Notes [PT]:', error.message);
  }
}

enrichNotes();
