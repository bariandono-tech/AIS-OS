import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const headers = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};
const STACKS_DB_ID = process.env.NOTION_STACKS_DB_ID;
const CONTENT_DB_ID = process.env.NOTION_CONTENT_DB_ID;

async function run() {
  console.log('🔍 Mengambil data "Hukum Syariah" dari Notion...');
  
  // 1. Get Stack ID
  const stacksRes = await fetch(`https://api.notion.com/v1/databases/${STACKS_DB_ID}/query`, {
    method: 'POST',
    headers
  });
  const stacksData = await stacksRes.json();
  let syariahStackId = null;
  for (const page of stacksData.results || []) {
    const title = page.properties.Name?.title[0]?.plain_text;
    if (title && title.includes('Syariah')) {
      syariahStackId = page.id;
      break;
    }
  }

  if (!syariahStackId) {
    console.error('❌ Tidak menemukan Stack "Hukum Syariah"!');
    return;
  }

  // 2. Fetch all pages in Hukum Syariah
  const contentRes = await fetch(`https://api.notion.com/v1/databases/${CONTENT_DB_ID}/query`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      filter: {
        property: 'Area/Resource',
        relation: { contains: syariahStackId }
      }
    })
  });
  const contentData = await contentRes.json();
  const pages = contentData.results || [];
  const pageMap = {}; // name -> page ID
  
  pages.forEach(p => {
    const title = p.properties.Name?.title[0]?.plain_text;
    if (title) {
      // normalize name to match easily
      const normalized = title.split('—')[0].split(':')[0].trim();
      pageMap[normalized] = p.id;
      pageMap[title] = p.id; // full title fallback
    }
  });

  console.log(`Ditemukan ${pages.length} materi di Hukum Syariah.`);

  // 3. Define the tree structure (Title -> Array of Prerequisite Titles)
  const treeMap = {
    "Pengantar Hukum Syariah": [],
    "Fiqh Muamalah Dasar": ["Pengantar Hukum Syariah"],
    "Ringkasan Akad-Akad": ["Fiqh Muamalah Dasar"],
    "Flashcard": ["Fiqh Muamalah Dasar"],
    "Mind Map": ["Fiqh Muamalah Dasar"],
    "Akad Murabahah (Jual Beli)": ["Ringkasan Akad-Akad"],
    "Akad Musyarakah (Kerjasama)": ["Ringkasan Akad-Akad"],
    "Referensi Kajian & Fatwa": ["Flashcard"],
    "Studi Kasus Perbankan Syariah": ["Akad Murabahah (Jual Beli)", "Akad Musyarakah (Kerjasama)", "Mind Map"]
  };

  // Helper to find Notion ID by partial or full title
  const findId = (titleQuery) => {
    for (const [title, id] of Object.entries(pageMap)) {
      if (title.includes(titleQuery)) return id;
    }
    return null;
  };

  // 4. Update order_index and Prerequisites for all nodes
  let index = 1;
  for (const [titleQuery, prereqTitles] of Object.entries(treeMap)) {
    const pageId = findId(titleQuery);
    if (!pageId) {
      console.log(`⚠️ Tidak menemukan materi: ${titleQuery}`);
      continue;
    }

    const prereqIds = prereqTitles.map(t => findId(t)).filter(Boolean);
    const relationData = prereqIds.map(id => ({ id }));

    // Patch Notion page
    await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        properties: {
          "Order Index": { number: index++ },
          "Prerequisites": { relation: relationData }
        }
      })
    });

    console.log(`✅ Update: ${titleQuery} -> terhubung ke ${prereqTitles.length} prerequisites.`);
  }

  console.log('\n🎉 Selesai! Struktur pohon sempurna untuk Hukum Syariah telah dibentuk di Notion!');
  console.log('Silakan jalankan: node scripts/sync_notion_to_supabase.js');
}

run();
