const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const TASKS_DATABASE_ID = '37c78c4c-e388-8191-b128-dbab3b886793'; // Tasks master database ID
const TASKS_DATASOURCE_ID = '37c78c4c-e388-8127-a0dc-000b8c3aa481'; // Tasks [UT] Data Source ID
const FALLBACK_PROJECT_ID = '37e78c4c-e388-80e4-ae54-f6ead1158289'; // daily-sync project ID

// Helper to convert YYYY-MM-DD to Indonesian Date Label (e.g., "22 Juni 2026")
function getIndonesianDateLabel(dateStr) {
  const [year, month, day] = dateStr.split('-');
  const months = {
    '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April',
    '05': 'Mei', '06': 'Juni', '07': 'Juli', '08': 'Agustus',
    '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember'
  };
  const monthName = months[month] || month;
  return `${parseInt(day, 10)} ${monthName} ${year}`;
}

// Get target date from command line arguments, default to today in local time
function getTargetDate() {
  const argDate = process.argv[2];
  if (argDate && /^\d{4}-\d{2}-\d{2}$/.test(argDate)) {
    return argDate;
  }
  
  // Calculate today's date in local system time
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Convert markdown inline formatting into Notion rich_text
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

// Check if a task for the project and date already exists in Tasks [UT]
async function checkIfTaskExists(projectId, targetDate) {
  try {
    const response = await notion.dataSources.query({
      data_source_id: TASKS_DATASOURCE_ID,
      filter: {
        and: [
          {
            property: 'Project',
            relation: {
              contains: projectId
            }
          },
          {
            property: 'Due',
            date: {
              equals: targetDate
            }
          }
        ]
      }
    });
    return response.results.length > 0 ? response.results[0] : null;
  } catch (error) {
    console.warn(`⚠️ Warning: Duplicate check failed (${error.message}). Continuing sync.`);
    return null;
  }
}

async function syncProjectWorklog(projectFolder, mapping, targetDate, targetDateLabel) {
  const workLogPath = path.join(__dirname, '..', '..', 'projects', projectFolder, 'work-log.md');
  if (!fs.existsSync(workLogPath)) {
    return;
  }

  console.log(`\n------------------------------------------------------------`);
  console.log(`📁 Scanning [${projectFolder}] work-log.md...`);
  
  const content = fs.readFileSync(workLogPath, 'utf-8');
  const lines = content.split(/\r?\n/);
  
  let isTargetSection = false;
  const sectionLines = [];

  for (const line of lines) {
    if (line.startsWith(`## ${targetDate}`)) {
      isTargetSection = true;
      sectionLines.push(line);
      continue;
    } else if (line.startsWith('## ') && !line.startsWith(`## ${targetDate}`) && isTargetSection) {
      break;
    }

    if (isTargetSection) {
      sectionLines.push(line);
    }
  }

  if (sectionLines.length === 0) {
    console.log(`ℹ️ No entry found for ${targetDate} in ${projectFolder}/work-log.md.`);
    return;
  }

  console.log(`📝 Entry found for ${targetDate}. Parsing content...`);
  
  // Resolve Notion Project ID from mapping, fallback to daily-sync if not mapped
  const projConfig = mapping[projectFolder] || {};
  const projectId = projConfig.project_id || FALLBACK_PROJECT_ID;
  const projectName = mapping[projectFolder] ? projectFolder : `${projectFolder} (Fallback to daily-sync)`;
  
  // Check for duplicates
  console.log(`🔍 Checking if task already exists in Notion...`);
  const existingTask = await checkIfTaskExists(projectId, targetDate);
  if (existingTask) {
    console.log(`⏭️ Task already exists in Notion: ${existingTask.url}. Skipping to prevent duplication.`);
    return;
  }

  let taskTitle = `${targetDateLabel}`;
  const blocks = [];

  for (let i = 0; i < sectionLines.length; i++) {
    const line = sectionLines[i].trim();
    if (!line) continue;

    if (line.startsWith('### ')) {
      const currentTitleSub = line.slice(4).trim();
      taskTitle = `${targetDateLabel} — ${currentTitleSub}`;
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

  // Prepend project context in the title if it fell back to daily-sync
  if (projectId === FALLBACK_PROJECT_ID) {
    taskTitle = `[${projectFolder}] ${taskTitle}`;
  }

  console.log(`🚀 Creating task page: "${taskTitle}" for project "${projectName}"...`);

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
            { id: projectId }
          ]
        },
        Status: {
          status: {
            name: 'Done'
          }
        },
        Due: {
          date: {
            start: targetDate
          }
        }
      },
      children: blocks
    });

    console.log(`✅ Success! Task created successfully: ${newPage.url}`);
  } catch (error) {
    console.error(`❌ Error creating task page in Notion for ${projectFolder}:`, error.message);
  }
}

async function main() {
  const targetDate = getTargetDate();
  const targetDateLabel = getIndonesianDateLabel(targetDate);
  console.log(`=== STARTING DYNAMIC WORKLOG SYNC ===`);
  console.log(`📅 Target Date : ${targetDate} (${targetDateLabel})`);

  // Load project mapping configuration
  const mappingPath = path.join(__dirname, 'projects_mapping.json');
  let mapping = {};
  if (fs.existsSync(mappingPath)) {
    try {
      mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
    } catch (err) {
      console.error('❌ Error parsing projects_mapping.json:', err.message);
      process.exit(1);
    }
  } else {
    console.log('⚠️ Warning: projects_mapping.json not found. Fallbacks will be used.');
  }

  // Scan projects directory
  const projectsDir = path.join(__dirname, '..', '..', 'projects');
  if (!fs.existsSync(projectsDir)) {
    console.error(`❌ Projects directory not found at: ${projectsDir}`);
    process.exit(1);
  }

  const items = fs.readdirSync(projectsDir);
  const projectFolders = items.filter(item => {
    const fullPath = path.join(projectsDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  console.log(`📂 Found ${projectFolders.length} project folders in workspace.`);

  for (const folder of projectFolders) {
    await syncProjectWorklog(folder, mapping, targetDate, targetDateLabel);
  }

  console.log(`\n=== DYNAMIC WORKLOG SYNC COMPLETED ===`);
}

main();
