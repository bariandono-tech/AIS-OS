const { Client } = require('@notionhq/client');
const fs = require('fs');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const dbIds = [
  // Databases on Databases [PT]
  { id: '67f78c4c-e388-821f-9263-81d511dcb2f2', label: 'Tasks [PT]' },
  { id: '8a378c4c-e388-830b-8154-017b0a0c96f7', label: 'Notes [PT]' },
  { id: '3fb78c4c-e388-8219-9430-01612e494abc', label: 'Projects [PT]' },
  { id: 'bf978c4c-e388-822b-adba-017759df1259', label: 'Areas/Resources [PT]' },
  
  // Databases on Databases [PARA]
  { id: '17f78c4c-e388-82e6-befb-01f49d5ebe82', label: 'Tasks [PARA]' },
  { id: '38e78c4c-e388-82e4-a66e-818769620475', label: 'Notes [PARA]' },
  { id: '27778c4c-e388-8281-bb8c-014bab2582d7', label: 'Projects [PARA]' },
  { id: '0f378c4c-e388-8253-b33e-815844282c1a', label: 'Areas/Resources [PARA]' },

  // Databases on main PARA page (Inbox/linked databases)
  { id: '56478c4c-e388-8229-a3bf-0183167627e6', label: 'Task Inbox (PARA Page)' },
  { id: 'f7178c4c-e388-83c3-8a1e-01668083929e', label: 'Note Inbox (PARA Page)' },
  { id: 'a3178c4c-e388-822e-bab7-01b31e24d84c', label: 'Projects (PARA Page)' },
  { id: 'b4f78c4c-e388-82b2-8ec9-010f02bbf1dd', label: 'Areas & Resources (PARA Page)' },

  // Databases on PARA Dashboard
  { id: '56478c4c-e388-82fd-b772-011124a16063', label: 'Tasks (PARA Dashboard)' },
  { id: '97b78c4c-e388-82ce-8135-012d7be5194f', label: 'Notes (PARA Dashboard)' },
  { id: '81c78c4c-e388-8298-a64a-817e80b92fa3', label: 'Projects (PARA Dashboard)' },
  { id: 'f8178c4c-e388-82c2-a9a7-013cdfb5c53a', label: 'Areas & Resources (PARA Dashboard)' }
];

const tjKeywords = [
  'thomas', 'frank', 'tj', 'copyright', 'college info', 'geek', 
  'collegeinfo', 'martin', 'boer', 'template', 'creator', 'customizer',
  'streaming setup', 'portfolio website'
];

function checkTJText(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return tjKeywords.some(kw => lower.includes(kw));
}

async function getBlockChildren(blockId) {
  try {
    const response = await notion.blocks.children.list({ block_id: blockId, page_size: 100 });
    return response.results;
  } catch (error) {
    return [];
  }
}

async function scanPageBlocks(pageId, pageTitle) {
  const blocks = await getBlockChildren(pageId);
  const issues = [];
  for (const block of blocks) {
    let text = '';
    if (block.type === 'paragraph') text = block.paragraph.rich_text.map(t => t.plain_text).join('');
    else if (block.type === 'callout') text = block.callout.rich_text.map(t => t.plain_text).join('');
    else if (block.type === 'quote') text = block.quote.rich_text.map(t => t.plain_text).join('');
    else if (block.type === 'synced_block') text = '[Synced Block]';

    if (checkTJText(text) || block.type === 'synced_block') {
      issues.push({ id: block.id, type: block.type, text });
    }
  }
  return issues;
}

async function runAudit() {
  console.log('Auditing PARA databases...');
  let report = '=================== DATABASE AUDIT REPORT ===================\n\n';

  for (const dbInfo of dbIds) {
    report += `Database Label: ${dbInfo.label}\n`;
    report += `Database View ID: ${dbInfo.id}\n`;
    
    try {
      const db = await notion.databases.retrieve({ database_id: dbInfo.id });
      report += `Database Title: ${db.title.map(t => t.plain_text).join('')}\n`;
      
      const dataSourceId = db.data_sources && db.data_sources.length > 0 ? db.data_sources[0].id : dbInfo.id;
      report += `Underlying Data Source ID: ${dataSourceId}\n`;
      
      // Query items
      const queryResponse = await notion.dataSources.query({ data_source_id: dataSourceId });
      report += `Items Found: ${queryResponse.results.length}\n`;
      
      for (const item of queryResponse.results) {
        let title = 'Untitled';
        const props = item.properties || {};
        for (const key of Object.keys(props)) {
          if (props[key].type === 'title') {
            title = props[key].title.map(t => t.plain_text).join('');
          }
        }
        
        report += `  - Item ID: ${item.id}\n`;
        report += `    Item Title: "${title}"\n`;
        
        const isTJItem = checkTJText(title);
        if (isTJItem) {
          report += `    [FLAGGED: Item title contains TJ keywords]\n`;
        }

        // Scan the blocks inside this database page
        const pageIssues = await scanPageBlocks(item.id, title);
        if (pageIssues.length > 0) {
          report += `    Page Content Issues:\n`;
          pageIssues.forEach(issue => {
            report += `      * ID: ${issue.id} | Type: ${issue.type} | Info: "${issue.text}"\n`;
          });
        }
      }
    } catch (error) {
      report += `Status: FAILED/NOT ACCESSIBLE (${error.message})\n`;
    }
    report += `------------------------------------------------------------\n`;
  }
  
  fs.writeFileSync('databases_audit.txt', report, 'utf-8');
  console.log('Database audit finished. Written to databases_audit.txt');
}

runAudit();
