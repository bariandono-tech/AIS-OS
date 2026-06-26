import { Client } from '@notionhq/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const STACKS_DB_ID = process.env.NOTION_STACKS_DB_ID;
const CONTENT_DB_ID = process.env.NOTION_CONTENT_DB_ID;

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Format Notion ID (without hyphens) to standard UUID (with hyphens)
function formatUUID(notionId) {
  if (!notionId) return null;
  const clean = notionId.replace(/-/g, '');
  if (clean.length !== 32) return null;
  return `${clean.substr(0, 8)}-${clean.substr(8, 4)}-${clean.substr(12, 4)}-${clean.substr(16, 4)}-${clean.substr(20)}`;
}

function getPropValue(page, propName, type) {
  const prop = page.properties[propName];
  if (!prop) return null;
  
  try {
    switch (type) {
      case 'title': return prop.title[0]?.plain_text || '';
      case 'rich_text': return prop.rich_text[0]?.plain_text || '';
      case 'checkbox': return prop.checkbox || false;
      case 'number': return prop.number || 0;
      case 'multi_select': return prop.multi_select.map(s => s.name)[0] || 'notes';
      case 'relation': return prop.relation.length > 0 ? formatUUID(prop.relation[0].id) : null;
      case 'relation_array': return prop.relation.map(r => formatUUID(r.id)).filter(Boolean);
      case 'status': return prop.status?.name === 'Done';
      default: return null;
    }
  } catch (e) {
    return type === 'relation_array' ? [] : null;
  }
}

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

async function sync() {
  console.log('🚀 Memulai Sinkronisasi: Notion -> Supabase');

  // 1. Fetch Stacks (Areas)
  console.log('📦 Mengambil data Stacks dari Notion...');
  const stacksResults = await queryNotionDB(STACKS_DB_ID);
  
  // Bersihkan Supabase terlebih dahulu agar sinkronisasi selalu bersih
  console.log('🧹 Membersihkan data lama di Supabase...');
  await supabase.from('content_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('stacks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const seenSlugs = new Set();
  const stacksData = stacksResults.map(page => {
    let baseSlug = getPropValue(page, 'Name', 'title').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (!baseSlug) baseSlug = 'untitled';
    
    let finalSlug = baseSlug;
    let counter = 1;
    while (seenSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    seenSlugs.add(finalSlug);

    return {
      id: formatUUID(page.id),
      title: getPropValue(page, 'Name', 'title').trim() || 'Untitled',
      slug: finalSlug,
      description: 'Disinkronkan dari Notion',
      icon: '📚',
      color: '#free',
      is_published: getPropValue(page, 'StudiOS', 'checkbox') || true
    };
  });

  console.log(`Meng-upsert ${stacksData.length} Stacks ke Supabase...`);
  const { error: errStacks } = await supabase.from('stacks').upsert(stacksData);
  if (errStacks) {
    console.error('❌ Gagal upsert Stacks:', errStacks.message);
    return; // Berhenti jika Stacks gagal, karena Content Items bergantung padanya
  }
  console.log('✅ Stacks tersinkronisasi!');

  // 2. Fetch Content Items (Notes)
  console.log('\n📄 Mengambil data Content Items dari Notion...');
  const contentResults = await queryNotionDB(CONTENT_DB_ID);
  const contentData = contentResults.map(page => {
    const item = {
      id: formatUUID(page.id),
      stack_id: getPropValue(page, 'Area/Resource', 'relation'),
      title: getPropValue(page, 'Name', 'title'),
      type: getPropValue(page, 'Tags', 'multi_select') || 'notes',
      order_index: getPropValue(page, 'Order Index', 'number'),
      is_published: getPropValue(page, 'StudiOS', 'checkbox') || true,
      body: { sections: [{ type: "text", content: "Diambil dari Notion: " + getPropValue(page, 'Name', 'title') }] }
    };
    
    const prereqs = getPropValue(page, 'Prerequisites', 'relation_array');
    if (prereqs && prereqs.length > 0) item.prerequisites = prereqs;
    
    const recomms = getPropValue(page, 'Recommended', 'relation_array');
    if (recomms && recomms.length > 0) item.recommended = recomms;
    
    return item;
  }).filter(c => c.stack_id); // Ensure it has a parent stack

  console.log(`Meng-upsert ${contentData.length} Content Items ke Supabase...`);
  const { error: errContent } = await supabase.from('content_items').upsert(contentData);
  
  if (errContent) {
    console.error('❌ Gagal upsert Content Items:', errContent.message);
    if (errContent.message.includes('column') || errContent.message.includes('does not exist')) {
      console.log('\n⚠️ SEPERTINYA TABEL ANDA KEKURANGAN KOLOM! Silakan jalankan SQL Script di Supabase Dashboard.');
    }
  } else {
    console.log('✅ Content Items tersinkronisasi!');
  }

  console.log('\n🎉 Sinkronisasi Selesai!');
}

sync();
