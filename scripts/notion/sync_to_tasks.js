const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const TASKS_DATABASE_ID = '37c78c4c-e388-8191-b128-dbab3b886793'; // Tasks database ID
const DAILY_SYNC_PROJECT_ID = '37e78c4c-e388-80e4-ae54-f6ead1158289'; // daily-sync project ID
const TARGET_DATE = '2026-06-17';
const TARGET_DATE_LABEL = '17 Juni 2026';

function parseMarkdownToRichText(text) {
  const richText = [];
  const tokenRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|[^\*_`]+)/g;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    const part = match[0];
    if (part.startsWith('**') && part.endsWith('**')) {
      richText.push({
        type: 'text',
        text: { content: part.slice(2, -2) },
        annotations: { bold: true }
      });
    } else if (part.startsWith('*') && part.endsWith('*')) {
      richText.push({
        type: 'text',
        text: { content: part.slice(1, -1) },
        annotations: { italic: true }
      });
    } else if (part.startsWith('`') && part.endsWith('`')) {
      richText.push({
        type: 'text',
        text: { content: part.slice(1, -1) },
        annotations: { code: true }
      });
    } else {
      richText.push({
        type: 'text',
        text: { content: part }
      });
    }
  }

  if (richText.length === 0) {
    richText.push({
      type: 'text',
      text: { content: text }
    });
  }

  return richText;
}

async function sync() {
  console.log(`Reading work-log.md...`);
  const workLogPath = path.join(__dirname, '..', '..', 'projects', 'studios', 'work-log.md');
  if (!fs.existsSync(workLogPath)) {
    console.error(`Error: Could not find work-log.md at ${workLogPath}`);
    return;
  }

  const content = fs.readFileSync(workLogPath, 'utf-8');
  const lines = content.split(/\r?\n/);

  let isTargetSection = false;
  const sectionLines = [];

  for (const line of lines) {
    if (line.startsWith(`## ${TARGET_DATE}`)) {
      isTargetSection = true;
      sectionLines.push(line);
      continue;
    } else if (line.startsWith('## ') && !line.startsWith(`## ${TARGET_DATE}`) && isTargetSection) {
      break;
    }

    if (isTargetSection) {
      sectionLines.push(line);
    }
  }

  if (sectionLines.length === 0) {
    console.error(`Error: Could not find entry for ${TARGET_DATE} in work-log.md`);
    return;
  }

  console.log(`Parsing ${TARGET_DATE} entry...`);
  
  let taskTitle = `${TARGET_DATE_LABEL}`;
  const blocks = [];

  for (let i = 0; i < sectionLines.length; i++) {
    const line = sectionLines[i].trim();
    if (!line) continue;

    if (line.startsWith('### ')) {
      const currentTitleSub = line.slice(4).trim();
      taskTitle = `${TARGET_DATE_LABEL} — ${currentTitleSub}`;
      continue;
    }

    if (line.startsWith('**') && line.endsWith(':**')) {
      const headerText = line.slice(2, -3);
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: headerText } }]
        }
      });
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const itemText = line.slice(2);
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: parseMarkdownToRichText(itemText)
        }
      });
    } else {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: parseMarkdownToRichText(line)
        }
      });
    }
  }

  console.log(`Creating task page in database: "${taskTitle}"...`);

  try {
    const newPage = await notion.pages.create({
      parent: { database_id: TASKS_DATABASE_ID },
      properties: {
        Name: {
          title: [
            {
              type: 'text',
              text: { content: taskTitle }
            }
          ]
        },
        Project: {
          relation: [
            { id: DAILY_SYNC_PROJECT_ID }
          ]
        },
        Status: {
          status: {
            name: 'Done'
          }
        },
        Due: {
          date: {
            start: TARGET_DATE
          }
        }
      },
      children: blocks
    });

    console.log(`Success! Task page created successfully: ${newPage.url}`);
  } catch (error) {
    console.error('Error creating page in Notion:', error);
  }
}

sync();
