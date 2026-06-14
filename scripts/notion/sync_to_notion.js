const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const NOTES_DATABASE_ID = '37c78c4c-e388-81b0-bf1f-dca07fba6f3f'; // Pro Max Notes (Database ID)
const AREA_PAGE_ID = '37c78c4c-e388-8162-814b-ef33783d7ab3'; // Pendidikan & Akuntansi area ID

// Get project name from command line arguments (default to 'sieka-rudenim')
const projectArg = process.argv[2] || 'sieka-rudenim';

let PROJECT_PAGE_ID = '37c78c4c-e388-8149-ba66-fbd0ea94aaf8'; // Default: Skripsi Deviasi Anggaran project
let workLogFolder = 'sieka-rudenim';

if (projectArg === 'jasa-ppt' || projectArg === 'jasa-ppt-akuntansi') {
  PROJECT_PAGE_ID = '37f78c4c-e388-81d1-837a-dad887723e8e'; // Jasa PPT & Layouting Skripsi Akuntansi
  workLogFolder = 'jasa-ppt-akuntansi';
}


// Helper to convert Markdown inline formatting (bold, italic, code) into Notion rich_text
function parseMarkdownToRichText(text) {
  const richText = [];
  // Regular expression to match bold (**), italic (* or _), code (`), and plain text
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
  console.log(`Reading work-log.md for project [${workLogFolder}]...`);
  const workLogPath = path.join(__dirname, '..', '..', 'projects', workLogFolder, 'work-log.md');
  if (!fs.existsSync(workLogPath)) {
    console.error(`Error: Could not find work-log.md at ${workLogPath}`);
    return;
  }

  const content = fs.readFileSync(workLogPath, 'utf-8');
  const lines = content.split(/\r?\n/);

  // Extract the 2026-06-14 section
  let isTargetSection = false;
  const sectionLines = [];

  for (const line of lines) {
    if (line.startsWith('## 2026-06-14')) {
      isTargetSection = true;
      continue;
    } else if (line.startsWith('## ') && isTargetSection) {
      break; // End of section
    }

    if (isTargetSection) {
      sectionLines.push(line);
    }
  }

  if (sectionLines.length === 0) {
    console.error('Error: Could not find entry for 2026-06-14 in work-log.md');
    return;
  }

  console.log('Parsing 2026-06-14 entry...');
  
  let noteTitle = '14 Juni 2026';
  const blocks = [];
  let currentTitleSub = '';

  for (let i = 0; i < sectionLines.length; i++) {
    const line = sectionLines[i].trim();
    if (!line) continue;

    if (line.startsWith('### ')) {
      currentTitleSub = line.slice(4).trim();
      noteTitle = `14 Juni 2026 — ${currentTitleSub}`;
      continue;
    }

    if (line.startsWith('**') && line.endsWith(':**')) {
      // Heading section (e.g. **Dikerjakan:**)
      const headerText = line.slice(2, -3);
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: headerText } }]
        }
      });
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Bulleted list item
      const itemText = line.slice(2);
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: parseMarkdownToRichText(itemText)
        }
      });
    } else {
      // Regular paragraph
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: parseMarkdownToRichText(line)
        }
      });
    }
  }

  console.log(`Creating page in database: "${noteTitle}"...`);

  try {
    const newPage = await notion.pages.create({
      parent: { database_id: NOTES_DATABASE_ID },
      properties: {
        Name: {
          title: [
            {
              type: 'text',
              text: { content: noteTitle }
            }
          ]
        },
        Project: {
          relation: [
            { id: PROJECT_PAGE_ID }
          ]
        },
        'Area/Resource': {
          relation: [
            { id: AREA_PAGE_ID }
          ]
        },
        'Note Date': {
          date: {
            start: '2026-06-14'
          }
        }
      },
      children: blocks
    });

    console.log(`Success! Note page created successfully: ${newPage.url}`);
  } catch (error) {
    console.error('Error creating page in Notion:', error);
  }
}

sync();
