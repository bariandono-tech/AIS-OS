const { Client } = require('@notionhq/client');
const fs = require('fs');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PARA_PAGE_ID = '7fc78c4c-e388-8315-b9d2-014194f6db5c'; // "PARA"

const tjKeywords = [
  'thomas', 'frank', 'tj', 'copyright', 'college info', 'geek', 
  'collegeinfo', 'martin', 'boer', 'template', 'creator', 'customizer'
];

function checkTJText(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return tjKeywords.some(kw => lower.includes(kw));
}

function getRichText(richTextArray) {
  if (!richTextArray || richTextArray.length === 0) return { plain: '', hasNoAccess: false, relativeLinks: [], tjLinks: [] };
  
  let plain = '';
  let hasNoAccess = false;
  const relativeLinks = [];
  const tjLinks = [];

  for (const item of richTextArray) {
    const itemText = item.plain_text || '';
    plain += itemText;
    
    if (itemText.toLowerCase().includes('no access')) {
      hasNoAccess = true;
    }
    if (item.type === 'mention' && item.mention && item.mention.type === 'page') {
      if (item.plain_text === 'No access') {
        hasNoAccess = true;
      }
    }

    if (item.text && item.text.link && item.text.link.url) {
      const url = item.text.link.url;
      if (url.startsWith('/')) {
        relativeLinks.push(url);
      }
      if (url.toLowerCase().includes('thomasjfrank') || url.toLowerCase().includes('collegeinfogeek')) {
        tjLinks.push(url);
      }
    }
  }

  return { plain, hasNoAccess, relativeLinks, tjLinks };
}

async function getBlockChildren(blockId) {
  let results = [];
  let hasMore = true;
  let startCursor = undefined;
  
  while (hasMore) {
    try {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: startCursor,
        page_size: 100
      });
      results = results.concat(response.results);
      hasMore = response.has_more;
      startCursor = response.next_cursor;
    } catch (error) {
      console.error(`Error listing children for block ${blockId}:`, error.message);
      break;
    }
  }
  return results;
}

const auditedBlocks = [];
const pagesToScan = [];

async function scanBlock(blockId, path = 'PARA') {
  const children = await getBlockChildren(blockId);
  
  for (const block of children) {
    let blockInfo = {
      id: block.id,
      type: block.type,
      path: path,
      has_children: block.has_children,
      details: '',
      hasTJKeywords: false,
      hasNoAccess: false,
      relativeLinks: [],
      tjLinks: []
    };

    let textData = null;

    switch (block.type) {
      case 'paragraph':
        textData = getRichText(block.paragraph.rich_text);
        blockInfo.details = `[Paragraph] "${textData.plain}"`;
        break;
      case 'heading_1':
        textData = getRichText(block.heading_1.rich_text);
        blockInfo.details = `[H1] "${textData.plain}"`;
        break;
      case 'heading_2':
        textData = getRichText(block.heading_2.rich_text);
        blockInfo.details = `[H2] "${textData.plain}"`;
        break;
      case 'heading_3':
        textData = getRichText(block.heading_3.rich_text);
        blockInfo.details = `[H3] "${textData.plain}"`;
        break;
      case 'bulleted_list_item':
        textData = getRichText(block.bulleted_list_item.rich_text);
        blockInfo.details = `[Bulleted Item] "${textData.plain}"`;
        break;
      case 'numbered_list_item':
        textData = getRichText(block.numbered_list_item.rich_text);
        blockInfo.details = `[Numbered Item] "${textData.plain}"`;
        break;
      case 'to_do':
        textData = getRichText(block.to_do.rich_text);
        blockInfo.details = `[To-Do] [${block.to_do.checked ? 'x' : ' '}] "${textData.plain}"`;
        break;
      case 'toggle':
        textData = getRichText(block.toggle.rich_text);
        blockInfo.details = `[Toggle] "${textData.plain}"`;
        break;
      case 'callout':
        textData = getRichText(block.callout.rich_text);
        blockInfo.details = `[Callout] "${textData.plain}"`;
        break;
      case 'quote':
        textData = getRichText(block.quote.rich_text);
        blockInfo.details = `[Quote] "${textData.plain}"`;
        break;
      case 'child_page':
        blockInfo.details = `[Sub-Page] "${block.child_page.title}"`;
        pagesToScan.push({ id: block.id, title: block.child_page.title, path: `${path} > ${block.child_page.title}` });
        break;
      case 'child_database':
        blockInfo.details = `[Database] "${block.child_database.title}"`;
        break;
      case 'synced_block':
        blockInfo.details = `[Synced Block] (Original ID: ${block.synced_block.synced_from ? block.synced_block.synced_from.block_id : 'Self'})`;
        break;
      case 'column_list':
        blockInfo.details = `[Column List]`;
        break;
      case 'column':
        blockInfo.details = `[Column]`;
        break;
      case 'divider':
        blockInfo.details = `[Divider]`;
        break;
      default:
        blockInfo.details = `[Type: ${block.type}]`;
        break;
    }

    if (textData) {
      blockInfo.hasTJKeywords = checkTJText(textData.plain);
      blockInfo.hasNoAccess = textData.hasNoAccess;
      blockInfo.relativeLinks = textData.relativeLinks;
      blockInfo.tjLinks = textData.tjLinks;
    } else {
      if (block.type === 'bookmark') {
        const url = block.bookmark.url || '';
        blockInfo.details = `[Bookmark] "${url}"`;
        blockInfo.hasTJKeywords = checkTJText(url);
        if (url.toLowerCase().includes('thomasjfrank') || url.toLowerCase().includes('collegeinfogeek')) {
          blockInfo.tjLinks.push(url);
        }
      }
    }

    auditedBlocks.push(blockInfo);

    // Recursively scan containers
    if (block.has_children && ['toggle', 'column_list', 'column', 'synced_block', 'callout'].includes(block.type)) {
      await scanBlock(block.id, `${path} > [${block.type}]`);
    }
  }
}

async function runAudit() {
  console.log(`Starting audit starting from main PARA page (ID: ${PARA_PAGE_ID})...`);
  
  // Scan main PARA page
  await scanBlock(PARA_PAGE_ID, 'PARA');

  // Scan any discovered sub-pages
  let pageIndex = 0;
  while (pageIndex < pagesToScan.length) {
    const page = pagesToScan[pageIndex];
    console.log(`Scanning sub-page: "${page.title}" (ID: ${page.id}) at path: ${page.path}...`);
    await scanBlock(page.id, page.path);
    pageIndex++;
  }

  let outputText = '=================== FULL AUDIT STRUCT REPORT ===================\n';
  outputText += `Total blocks scanned: ${auditedBlocks.length}\n\n`;

  auditedBlocks.forEach((b, idx) => {
    outputText += `${idx + 1}. Path: ${b.path}\n`;
    outputText += `   ID: ${b.id}\n`;
    outputText += `   Type: ${b.type}\n`;
    outputText += `   Details: ${b.details}\n`;
    if (b.hasTJKeywords) outputText += `   [FLAGGED: TJ KEYWORDS]\n`;
    if (b.hasNoAccess) outputText += `   [FLAGGED: NO ACCESS]\n`;
    if (b.relativeLinks.length > 0) outputText += `   [FLAGGED: RELATIVE LINKS: ${b.relativeLinks.join(', ')}]\n`;
    if (b.tjLinks.length > 0) outputText += `   [FLAGGED: TJ LINKS: ${b.tjLinks.join(', ')}]\n`;
    outputText += `----------------------------------------------------\n`;
  });

  fs.writeFileSync('audit_structure.txt', outputText, 'utf-8');
  console.log('Saved structure audit to audit_structure.txt');
}

runAudit();
