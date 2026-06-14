const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PARA_DASHBOARD_ID = '4ca78c4c-e388-8271-ba7b-8185a2e248c7'; // "PARA Dashboard"

function getRichText(richTextArray) {
  if (!richTextArray || richTextArray.length === 0) return '';
  return richTextArray.map(t => t.plain_text).join('');
}

async function getBlockChildren(blockId) {
  try {
    const response = await notion.blocks.children.list({ block_id: blockId });
    return response.results;
  } catch (error) {
    return [];
  }
}

async function printBlockInfo(block, prefix, depth) {
  const indent = '  '.repeat(depth);
  let detailText = '';
  let hasChildren = block.has_children;

  switch (block.type) {
    case 'paragraph':
      detailText = `[Paragraf] "${getRichText(block.paragraph.rich_text)}"`;
      break;
    case 'heading_1':
      detailText = `[Heading 1] "# ${getRichText(block.heading_1.rich_text)}"`;
      break;
    case 'heading_2':
      detailText = `[Heading 2] "## ${getRichText(block.heading_2.rich_text)}"`;
      break;
    case 'heading_3':
      detailText = `[Heading 3] "### ${getRichText(block.heading_3.rich_text)}"`;
      break;
    case 'bulleted_list_item':
      detailText = `[Bullet List] • ${getRichText(block.bulleted_list_item.rich_text)}`;
      break;
    case 'numbered_list_item':
      detailText = `[Number List] 1. ${getRichText(block.numbered_list_item.rich_text)}`;
      break;
    case 'to_do':
      const checked = block.to_do.checked ? '[x]' : '[ ]';
      detailText = `[To-Do] ${checked} ${getRichText(block.to_do.rich_text)}`;
      break;
    case 'child_page':
      detailText = `[Sub-Halaman] 📄 "${block.child_page.title}"`;
      break;
    case 'child_database':
      detailText = `[Database] 🗄️ "${block.child_database.title}"`;
      break;
    case 'divider':
      detailText = `[Divider] ------------------------`;
      break;
    case 'callout':
      detailText = `[Callout] "${getRichText(block.callout.rich_text)}"`;
      break;
    case 'toggle':
      detailText = `[Toggle] "${getRichText(block.toggle.rich_text)}"`;
      break;
    case 'column_list':
      detailText = `[Column List] (Kumpulan Kolom)`;
      break;
    case 'column':
      detailText = `[Column] (Kolom)`;
      break;
    default:
      detailText = `[Tipe: ${block.type}]`;
      break;
  }

  console.log(`${indent}${prefix} ID: ${block.id}`);
  console.log(`${indent}   Tipe & Isi: ${detailText}`);

  if (hasChildren && ['toggle', 'column_list', 'column'].includes(block.type)) {
    const children = await getBlockChildren(block.id);
    for (let j = 0; j < children.length; j++) {
      await printBlockInfo(children[j], `${prefix}.${j + 1}`, depth + 1);
    }
  }
}

async function deepInspectParaDashboard() {
  console.log('Menghubungkan ke Notion...');
  try {
    const mainBlocks = await getBlockChildren(PARA_DASHBOARD_ID);
    console.log(`\n======================================================`);
    console.log(`🔍 DEEP INSPECT STRUKTUR HALAMAN: "PARA Dashboard"`);
    console.log(`======================================================\n`);
    for (let i = 0; i < mainBlocks.length; i++) {
      const block = mainBlocks[i];
      await printBlockInfo(block, `${i + 1}.`, 0);
    }
    console.log(`======================================================\n`);
  } catch (error) {
    console.error(error);
  }
}

deepInspectParaDashboard();
