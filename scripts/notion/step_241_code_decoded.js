"const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// ID Data Source
const TASKS_DS_ID = '2f478c4c-e388-834f-b422-071d016f010e';
const PROJECTS_DS_ID = 'de578c4c-e388-823f-a4f9-87a57a699fdb'; // DIPERBAIKI (sebelumnya typo 83f9)

// ID Database
const REAL_TASKS_DB_ID = '81078c4c-e388-8214-91de-81bfd90e33bf';
const REAL_PROJECTS_DB_ID = '3ed78c4c-e388-83e4-a2c5-81543469dd41';

const TUTORIAL_KEYWORDS = [
  'ultimate tasks',
  'welcome to',
  'want a full',
  'second brain',
  'recurring tasks',
  'capture tasks',
  'customize',
  'notion expert',
  'sub-tasks',
  'get started',
  'thomas frank'
];

function getRichText(richTextArray) {
  if (!richTextArray || richTextArray.length === 0) return '';
  return richTextArray.map(t => t.plain_text).join('');
}

function isTutorialItem(title) {
  if (!title) return false;
  const lowerTitle = title.toLowerCase();
  return TUTORIAL_KEYWORDS.some(kw => lowerTitle.includes(kw));
}

// Helper untuk membuat page dengan parent yang tepat (robust fallback)
async function createPageInDatabase(parentDbId, parentDsId, properties) {
  try {
    return await notion.pages.create({
      parent: { database_id: parentDbId },
      properties: properties
    });
  } catch (err) {
    console.log(`Peringatan: Gagal menggunakan database_id (${err.message}). Mencoba menggunakan data_source_id...`);
    return await notion.pages.create({
      parent: { 
        type: 'data_source_id',
        data_source_id: parentDsId 
      },
      properties: properties
    });
  }
}

async function runCleanupAndPopulate() {
  console.log('Menghubungkan ke Notion...');
  try {
    // ==========================================
    // LAKUKAN PEMBERSIHAN (ARCHIVE DUMMY DATA LAMA)
    // ==========================================
    console.log('\
--- TAHAP 1: PEMBERSIHAN DUMMY DATA LAMA ---');

    // 1. Ambil & hapus proyek dummy lama
    const pr
<truncated 6749 bytes>