const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const pages = [
  { id: '37b78c4c-e388-808c-9d19-c867c724579b', name: 'MAX Brain (Home)' },
  { id: '87c78c4c-e388-8395-9e96-81d536d668b3', name: 'Pro Tasks (Dashboard)' },
  { id: '59778c4c-e388-8296-9659-01c023b2e89c', name: 'Pro Notes (Dashboard)' },
  { id: '7fc78c4c-e388-8315-b9d2-014194f6db5c', name: 'PARA' },
  { id: '4ca78c4c-e388-8271-ba7b-8185a2e248c7', name: 'PARA Dashboard' },
  
  // Tasks pages
  { id: 'f8a78c4c-e388-8263-8e5e-018bf33eb388', name: 'Tasks: Inbox' },
  { id: '15678c4c-e388-82b6-83b6-810b867a5ccd', name: 'Tasks: Today' },
  { id: '38b78c4c-e388-8369-9fea-011bf3bffa31', name: 'Tasks: Next 7 Days' },
  { id: 'aa078c4c-e388-83dd-aed3-8150dbdda7f7', name: 'Tasks: Projects' },
  { id: '3c178c4c-e388-833c-bc7c-014138023870', name: 'Tasks: Task Journal' },
  { id: '77c78c4c-e388-82f9-a425-01e4e3bf25e0', name: 'Tasks: Someday' },
  { id: 'a2b78c4c-e388-8346-a6e9-81fbd708c79b', name: 'Tasks: Priority View' },
  { id: '23878c4c-e388-835d-b05d-018b0a5d1b7d', name: 'Tasks: All Tasks' },
  { id: '7ea78c4c-e388-8352-9cd4-817c030f62b9', name: 'Tasks: Recurring tasks' },
  { id: 'b3a78c4c-e388-821d-a45c-01e486566520', name: 'Tasks: Project Template' },
  { id: '54278c4c-e388-83b6-9b9a-011d138c803f', name: 'Tasks: Databases' },
  
  // Notes pages
  { id: '31c78c4c-e388-82a2-a289-01ab8478bcfa', name: 'Notes: Journal' },
  { id: '35378c4c-e388-83b1-839a-81c309ceffca', name: 'Notes: Note Board' },
  { id: '00178c4c-e388-82f1-ab0d-01e5a1c2a8d2', name: 'Notes: All Notes' },
  { id: 'b9478c4c-e388-83ee-a8f4-81fa89afb4f4', name: 'Notes: Meeting Notes' },
  { id: 'c9378c4c-e388-8266-843b-019d719ace1a', name: 'Notes: Databases' },
  { id: '89e78c4c-e388-83dd-90e7-81e98bd325ac', name: 'Notes: Notes Inbox' },
  { id: '76f78c4c-e388-831c-a5d4-01adc5786e6d', name: 'Notes: Notes Tags' },
  
  // PARA subpages
  { id: '8fa78c4c-e388-83fe-8226-010af7352492', name: 'PARA: Archive' },
  { id: '94378c4c-e388-8340-aec4-019869a0478b', name: 'PARA: Databases' }
];

async function getBlockChildren(blockId) {
  try {
    const response = await notion.blocks.children.list({ block_id: blockId, page_size: 100 });
    return response.results;
  } catch (error) {
    return [];
  }
}

async function scanPageBlocks(blockId, pageName, depth = 0) {
  if (depth > 6) return; // limit depth
  const children = await getBlockChildren(blockId);
  
  for (const block of children) {
    if (block.type === 'callout') {
      const text = block.callout.rich_text.map(t => t.plain_text).join('');
      const hasTF = text.toLowerCase().includes('thomas') || text.toLowerCase().includes('frank') || text.toLowerCase().includes('duplicate') || text.toLowerCase().includes('brain');
      
      console.log(`\nFound Callout in "${pageName}"`);
      console.log(`- Block ID: ${block.id}`);
      console.log(`- Text Content: "${text}"`);
      console.log(`- Icon:`, JSON.stringify(block.callout.icon));
      console.log(`- HasChildren: ${block.has_children}`);
      console.log(`- Flagged: ${hasTF}`);
    }
    
    // Check if the block has children and is a container we scan
    if (block.has_children && ['toggle', 'column_list', 'column', 'synced_block'].includes(block.type)) {
      await scanPageBlocks(block.id, pageName, depth + 1);
    }
  }
}

async function runScan() {
  console.log('Scanning all pages for callout blocks...');
  for (const page of pages) {
    await scanPageBlocks(page.id, page.name, 0);
  }
  console.log('\nScan finished!');
}

runScan();
