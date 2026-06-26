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
  console.log('🔍 Mencari Stack "Hukum Syariah" di Notion...');
  
  // 1. Get Hukum Syariah Stack ID
  const stacksRes = await fetch(`https://api.notion.com/v1/databases/${STACKS_DB_ID}/query`, {
    method: 'POST',
    headers
  });
  const stacksData = await stacksRes.json();
  let syariahStackId = null;
  
  for (const page of stacksData.results) {
    const title = page.properties.Name?.title[0]?.plain_text;
    if (title && title.includes('Syariah')) {
      syariahStackId = page.id;
      break;
    }
  }
  
  if (!syariahStackId) {
    console.error('❌ Tidak menemukan Stack dengan kata "Syariah" di namanya.');
    return;
  }
  console.log(`✅ Ditemukan Stack "Hukum Syariah" (${syariahStackId})`);
  
  // 2. Define Dummy Content
  const dummyNodes = [
    { id: "n1", title: "Pengantar Hukum Syariah", order: 1, prereqs: [] },
    { id: "n2", title: "Fiqh Muamalah Dasar", order: 2, prereqs: ["n1"] },
    { id: "n3", title: "Akad Murabahah (Jual Beli)", order: 3, prereqs: ["n2"] },
    { id: "n4", title: "Akad Musyarakah (Kerjasama)", order: 4, prereqs: ["n2"] },
    { id: "n5", title: "Studi Kasus Perbankan Syariah", order: 5, prereqs: ["n3", "n4"] }
  ];
  
  console.log('📝 Membuat materi dami di Notion...');
  const notionIds = {}; // Map local id to Notion page ID
  
  // Create pages first without prerequisites
  for (const node of dummyNodes) {
    const res = await fetch(`https://api.notion.com/v1/pages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        parent: { database_id: CONTENT_DB_ID },
        properties: {
          "Name": { title: [{ text: { content: node.title } }] },
          "Area/Resource": { relation: [{ id: syariahStackId }] },
          "Tags": { multi_select: [{ name: "notes" }] },
          "Order Index": { number: node.order },
          "StudiOS": { checkbox: true }
        }
      })
    });
    const data = await res.json();
    if (data.id) {
      notionIds[node.id] = data.id;
      console.log(`✅ Berhasil membuat: ${node.title}`);
    } else {
      console.error(`❌ Gagal membuat ${node.title}:`, data);
    }
  }
  
  // 3. Update Prerequisites Relations
  console.log('\n🔗 Menghubungkan relasi peta di Notion...');
  for (const node of dummyNodes) {
    if (node.prereqs.length === 0) continue;
    
    const relationData = node.prereqs.map(pId => ({ id: notionIds[pId] }));
    const pageId = notionIds[node.id];
    
    const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        properties: {
          "Prerequisites": { relation: relationData }
        }
      })
    });
    
    if (res.ok) {
      console.log(`✅ Berhasil menyambungkan: ${node.title}`);
    } else {
      const err = await res.json();
      console.error(`❌ Gagal menyambungkan ${node.title}:`, err);
    }
  }
  
  console.log('\n🎉 SEMUA SELESAI!');
  console.log('Silakan jalankan: node scripts/sync_notion_to_supabase.js');
}

run();
