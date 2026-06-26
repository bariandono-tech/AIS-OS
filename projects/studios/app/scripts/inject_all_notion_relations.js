import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const CONTENT_DB_ID = process.env.NOTION_CONTENT_DB_ID;

// Use fetch natively to avoid Notion Client SDK compatibility issues
const headers = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

// MASTER TREE MAP UNTUK SELURUH KONTEN
const masterTreeMap = {
  "Flashcard": [], 
  "Ringkasan": ["Flashcard"],
  "Catatan": ["Flashcard"],
  "Coretax": ["Ringkasan"],
  "Mind Map": ["Coretax"],
  "Referensi": ["Flashcard"],

  // Hukum Syariah
  "Pengantar": [],
  "Fiqh": ["Pengantar"],
  "Akad-Akad": ["Fiqh"],
  "Flashcard": ["Fiqh"],
  "Mind Map": ["Fiqh"],
  "Murabahah": ["Akad-Akad"],
  "Musyarakah": ["Akad-Akad"],
  "Referensi": ["Flashcard"],
  "Studi Kasus": ["Murabahah", "Musyarakah", "Mind Map"]
};

async function run() {
  console.log('🛠️ [MASTER SYNC] Menyuntikkan Relasi Peta (Prerequisites) ke Notion...');
  
  // 1. Fetch all pages in Content Items database
  const contentRes = await fetch(`https://api.notion.com/v1/databases/${CONTENT_DB_ID}/query`, {
    method: 'POST',
    headers,
    body: JSON.stringify({})
  });
  
  const contentData = await contentRes.json();
  const pages = contentData.results || [];
  
  const pageMap = {}; // name -> page ID
  
  pages.forEach(p => {
    const title = p.properties.Name?.title[0]?.plain_text;
    const stackId = p.properties['Area/Resource']?.relation[0]?.id;
    if (title && stackId) {
      pageMap[title] = { id: p.id, stackId };
    }
  });

  console.log(`\n📚 Ditemukan ${pages.length} materi di Notion. Memetakan ke struktur...`);

  // Helper to find ID safely. We must also scope it by Stack so "Flashcard" for Pajak doesn't mix with "Flashcard" for Syariah!
  // To do this, we'll separate the maps.

  const pajakMap = {
    "Flashcard": [], 
    "Ringkasan": ["Flashcard"],
    "Catatan": ["Flashcard"],
    "Coretax": ["Ringkasan"],
    "Mind Map": ["Coretax"],
    "Referensi": ["Flashcard"]
  };

  const syariahMap = {
    "Pengantar": [],
    "Fiqh": ["Pengantar"],
    "Akad-Akad": ["Fiqh"],
    "Flashcard": ["Fiqh"],
    "Mind Map": ["Fiqh"],
    "Murabahah": ["Akad-Akad"],
    "Musyarakah": ["Akad-Akad"],
    "Referensi": ["Flashcard"],
    "Studi Kasus": ["Murabahah", "Musyarakah", "Mind Map"]
  };

  const findId = (titleQuery, stackTitleKeyword) => {
    // 1. Find stack ID first based on any page that matches the stack
    let targetStackId = null;
    for (const [title, data] of Object.entries(pageMap)) {
      if (title.toLowerCase().includes(stackTitleKeyword.toLowerCase())) {
        targetStackId = data.stackId;
        break;
      }
    }
    
    // 2. Find the page within that stack
    for (const [title, data] of Object.entries(pageMap)) {
      if (data.stackId === targetStackId && title.toLowerCase().includes(titleQuery.toLowerCase())) {
        return data.id;
      }
    }
    return null;
  };

  let successCount = 0;

  const processMap = async (map, stackKeyword) => {
    for (const [titleQuery, prereqTitles] of Object.entries(map)) {
      const pageId = findId(titleQuery, stackKeyword);
      if (!pageId) {
        console.log(`⚠️ (Skip) Materi tidak ditemukan di Notion [${stackKeyword}]: ${titleQuery}`);
        continue;
      }

      const prereqIds = prereqTitles.map(t => findId(t, stackKeyword)).filter(Boolean);
      const relationData = prereqIds.map(id => ({ id }));

      const patchRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          properties: {
            "Prerequisites": { relation: relationData }
          }
        })
      });

      if (patchRes.ok) {
        console.log(`✅ Sukses: [${titleQuery}] terhubung ke ${prereqTitles.length} dependensi.`);
        successCount++;
      } else {
        console.error(`❌ Gagal update [${titleQuery}]`);
      }
    }
  };

  console.log("Memproses Akuntansi Pajak...");
  await processMap(pajakMap, "Pajak");
  console.log("Memproses Hukum Syariah...");
  await processMap(syariahMap, "Syariah");

  console.log(`\n🎉 SELESAI! ${successCount} node telah ditanamkan struktur relasinya langsung ke jantung Notion!`);
  console.log('Silakan jalankan: node scripts/sync_notion_to_supabase.js');
}

run();
