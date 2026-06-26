import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { contentItems as mockContents } from '../src/data/mockData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const CONTENT_DB_ID = process.env.NOTION_CONTENT_DB_ID;
const headers = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

async function createRelationProperties() {
  console.log('1️⃣ Memastikan kolom Prerequisites & Recommended ada di Notion...');
  const res = await fetch(`https://api.notion.com/v1/databases/${CONTENT_DB_ID}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      properties: {
        "Prerequisites": {
          relation: {
            database_id: CONTENT_DB_ID,
            type: "single_property",
            single_property: {}
          }
        },
        "Recommended": {
          relation: {
            database_id: CONTENT_DB_ID,
            type: "single_property",
            single_property: {}
          }
        }
      }
    })
  });
  
  if (!res.ok) {
    const error = await res.json();
    if (error.message.includes('already exists')) {
      console.log('✅ Kolom sudah ada di Notion.');
    } else {
      console.error('❌ Gagal membuat kolom:', error);
    }
  } else {
    console.log('✅ Berhasil membuat/memastikan kolom relasi di Notion!');
  }
}

async function fetchNotionPages() {
  const res = await fetch(`https://api.notion.com/v1/databases/${CONTENT_DB_ID}/query`, {
    method: 'POST',
    headers
  });
  const data = await res.json();
  return data.results;
}

async function updatePageRelation(pageId, propName, relatedPageIds) {
  const relationData = relatedPageIds.map(id => ({ id }));
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      properties: {
        [propName]: {
          relation: relationData
        }
      }
    })
  });
  if (!res.ok) {
    const error = await res.json();
    console.error(`❌ Gagal update ${propName} untuk ${pageId}:`, error);
  }
}

async function run() {
  await createRelationProperties();
  
  console.log('2️⃣ Mengambil data halaman Notion saat ini...');
  const pages = await fetchNotionPages();
  
  // Buat mapping judul ke Notion Page ID
  const titleToNotionId = {};
  pages.forEach(p => {
    const titleObj = p.properties['Name'] || p.properties['title'];
    const title = titleObj?.title?.[0]?.plain_text;
    if (title) titleToNotionId[title] = p.id;
  });

  // Buat mapping mock ID (c1, c2) ke Notion Page ID
  const mockIdToNotionId = {};
  mockContents.forEach(mockItem => {
    if (titleToNotionId[mockItem.title]) {
      mockIdToNotionId[mockItem.id] = titleToNotionId[mockItem.title];
    }
  });

  console.log('3️⃣ Menyambungkan tali dependensi (Prerequisites & Recommended) di Notion...');
  let count = 0;
  for (const mockItem of mockContents) {
    const pageId = mockIdToNotionId[mockItem.id];
    if (!pageId) continue;

    const prereqs = (mockItem.prerequisites || []).map(mId => mockIdToNotionId[mId]).filter(Boolean);
    const recomms = (mockItem.recommended || []).map(mId => mockIdToNotionId[mId]).filter(Boolean);

    let updated = false;
    if (prereqs.length > 0) {
      await updatePageRelation(pageId, 'Prerequisites', prereqs);
      updated = true;
    }
    if (recomms.length > 0) {
      await updatePageRelation(pageId, 'Recommended', recomms);
      updated = true;
    }
    
    if (updated) {
      console.log(`✅ Sukses menyambungkan relasi untuk: ${mockItem.title}`);
      count++;
    }
  }

  console.log(`\n🎉 Selesai! ${count} materi berhasil dirajut petanya.`);
  console.log('Silakan cek Notion Anda, kolom Prerequisites pasti sudah terisi!');
  console.log('Terakhir, jangan lupa jalankan sinkronisasi ke Supabase: node scripts/sync_notion_to_supabase.js');
}

run();
