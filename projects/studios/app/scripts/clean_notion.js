import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

async function queryNotionDB(dbId) {
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    }
  });
  const data = await res.json();
  if (data.object === 'error') {
    throw new Error(data.message);
  }
  return data.results;
}

async function archivePage(pageId) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      archived: true
    })
  });
  if (!res.ok) {
    console.error(`Gagal menghapus halaman ${pageId}`);
  }
}

async function clean() {
  console.log('🧹 Membersihkan duplikat di Notion...');
  
  // 1. Bersihkan Content Items
  console.log('Mengambil semua Content Items...');
  const contents = await queryNotionDB(process.env.NOTION_CONTENT_DB_ID);
  console.log(`Ditemukan ${contents.length} Content Items. Menghapus...`);
  for (const page of contents) {
    await archivePage(page.id);
  }

  // 2. Bersihkan Stacks
  console.log('\nMengambil semua Stacks...');
  const stacks = await queryNotionDB(process.env.NOTION_STACKS_DB_ID);
  console.log(`Ditemukan ${stacks.length} Stacks. Menghapus...`);
  for (const page of stacks) {
    await archivePage(page.id);
  }

  console.log('\n✅ Semua data di Notion berhasil dibersihkan!');
  console.log('Selanjutnya, jalankan:');
  console.log('1. node scripts/push_mock_to_notion.js');
  console.log('2. node scripts/sync_notion_to_supabase.js');
}

clean();
