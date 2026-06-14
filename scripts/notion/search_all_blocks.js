const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const ROOT_PAGE_ID = '37b78c4ce388808c9d19c867c724579b'; // MAX Brain

const keywords = ['thomas', 'frank', 'duplicate', 'brain (new)', 'follow me on twitter'];

function matchKeywords(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw));
}

async function getBlockChildren(blockId) {
  try {
    const response = await notion.blocks.children.list({ block_id: blockId, page_size: 100 });
    return response.results;
  } catch (error) {
    return [];
  }
}

async function scanDeep(blockId, path = 'MAX Brain', depth = 0) {
  if (depth > 8) return; // safety depth limit
  const children = await getBlockChildren(blockId);
  
  for (const block of children) {
    let text = '';
    let description = '';
    
    if (block.type === 'paragraph') {
      text = block.paragraph.rich_text.map(t => t.plain_text).join('');
      description = `[Paragraph] "${text}"`;
    } else if (block.type === 'callout') {
      text = block.callout.rich_text.map(t => t.plain_text).join('');
      description = `[Callout] "${text}"`;
    } else if (block.type === 'toggle') {
      text = block.toggle.rich_text.map(t => t.plain_text).join('');
      description = `[Toggle] "${text}"`;
    } else if (block.type === 'child_page') {
      text = block.child_page.title;
      description = `[Child Page] "${text}"`;
    } else if (block.type === 'child_database') {
      text = block.child_database.title;
      description = `[Child DB] "${text}"`;
    } else if (block.type === 'quote') {
      text = block.quote.rich_text.map(t => t.plain_text).join('');
      description = `[Quote] "${text}"`;
    } else if (block.type === 'heading_1') {
      text = block.heading_1.rich_text.map(t => t.plain_text).join('');
      description = `[H1] "${text}"`;
    } else if (block.type === 'heading_2') {
      text = block.heading_2.rich_text.map(t => t.plain_text).join('');
      description = `[H2] "${text}"`;
    } else if (block.type === 'heading_3') {
      text = block.heading_3.rich_text.map(t => t.plain_text).join('');
      description = `[H3] "${text}"`;
    } else if (block.type === 'bulleted_list_item') {
      text = block.bulleted_list_item.rich_text.map(t => t.plain_text).join('');
      description = `[Bullet List] "${text}"`;
    } else if (block.type === 'numbered_list_item') {
      text = block.numbered_list_item.rich_text.map(t => t.plain_text).join('');
      description = `[Numbered List] "${text}"`;
    }

    if (matchKeywords(text)) {
      console.log(`\n🚨 MATCH FOUND at path: ${path}`);
      console.log(`- Block ID: ${block.id}`);
      console.log(`- Type: ${block.type}`);
      console.log(`- Detail: ${description}`);
      console.log(`- HasChildren: ${block.has_children}`);
    }

    // Recursively scan if the block has children and is a container
    if (block.has_children && block.type !== 'child_database') {
      let nextPath = path;
      if (block.type === 'child_page') {
        nextPath = `${path} > Page: "${block.child_page.title}"`;
      } else {
        nextPath = `${path} > [${block.type}]`;
      }
      await scanDeep(block.id, nextPath, depth + 1);
    }
  }
}

async function run() {
  console.log(`Searching all blocks starting from MAX Brain (${ROOT_PAGE_ID})...`);
  await scanDeep(ROOT_PAGE_ID, 'MAX Brain', 0);
  console.log('\nSearch completed!');
}

run();
