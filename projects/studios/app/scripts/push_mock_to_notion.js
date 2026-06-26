import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import { stacks, contentItems, flashcards, references } from '../src/data/mockData.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const STACKS_DB_ID = process.env.NOTION_STACKS_DB_ID;
const CONTENT_DB_ID = process.env.NOTION_CONTENT_DB_ID;

// Helper to chunk text safely for Notion blocks (limit 2000 chars)
function createTextBlocks(text) {
  if (!text) return [];
  const str = String(text);
  const chunks = str.match(/[\s\S]{1,1900}/g) || [];
  return chunks.map(chunk => ({
    object: 'block',
    type: 'paragraph',
    paragraph: { rich_text: [{ type: 'text', text: { content: chunk } }] }
  }));
}

function createCodeBlock(text, language = 'markdown') {
  if (!text) return [];
  const str = String(text);
  const chunks = str.match(/[\s\S]{1,1900}/g) || [];
  return chunks.map(chunk => ({
    object: 'block',
    type: 'code',
    code: { rich_text: [{ type: 'text', text: { content: chunk } }], language }
  }));
}

function createHeading(text, level = 2) {
  const type = `heading_${level}`;
  return {
    object: 'block',
    type: type,
    [type]: { rich_text: [{ type: 'text', text: { content: text } }] }
  };
}

async function pushData() {
  console.log('🚀 Memulai Ulang Injeksi Mock Data dengan Property Mapping...');
  
  if (!process.env.NOTION_TOKEN || !STACKS_DB_ID || !CONTENT_DB_ID) {
    console.error('❌ Error: Konfigurasi Notion di .env belum lengkap.');
    return;
  }

  // Simpan mapping ID lokal -> ID Notion agar bisa direlasikan
  const stackNotionIds = {};

  console.log(`\n📦 MENGIRIM STACKS (Areas/Resources)...`);
  for (const stack of stacks) {
    try {
      // Masukkan sisa info panjang ke dalam body page
      const children = [
        createHeading('Metadata Lokal', 2),
        ...createTextBlocks(`ID Asli: ${stack.id}`),
        ...createTextBlocks(`Slug: ${stack.slug}`),
        createHeading('Deskripsi Lengkap', 2),
        ...createTextBlocks(stack.description),
      ];

      const response = await notion.pages.create({
        parent: { database_id: STACKS_DB_ID },
        icon: { type: 'emoji', emoji: stack.icon || '📚' },
        properties: {
          "Name": { title: [{ text: { content: stack.title } }] },
          "StudiOS": { checkbox: true },
          "Color": { rich_text: [{ text: { content: stack.color || '' } }] },
          "Description": { rich_text: [{ text: { content: stack.description ? stack.description.substring(0, 2000) : '' } }] },
          "Type": { status: { name: "Area" } }
        },
        children
      });
      
      stackNotionIds[stack.id] = response.id;
      console.log(`✅ [Stack] Terkirim lengkap dengan Centang & Tipe: ${stack.title}`);
    } catch (err) {
      console.error(`❌ Gagal mengirim Stack: ${stack.title} - ${err.body ? JSON.stringify(err.body) : err.message}`);
    }
  }

  console.log(`\n📄 MENGIRIM CONTENT ITEMS (Notes)...`);
  for (const item of contentItems) {
    try {
      const parentStackNotionId = stackNotionIds[item.stack_id];
      
      // Kumpulkan flashcard & referensi yang berelasi dengan konten ini
      const relatedFlashcards = flashcards.filter(f => f.content_item_id === item.id);
      const relatedRefs = references.filter(r => r.content_item_id === item.id);

      const children = [
        createHeading('Metadata Struktural', 2),
        ...createTextBlocks(`ID Konten: ${item.id}`),
        ...createTextBlocks(`Prasyarat (Prerequisites): ${item.prerequisites && item.prerequisites.length > 0 ? item.prerequisites.join(', ') : 'Tidak ada'}`),
        
        createHeading('Isi Konten (Full Data)', 2),
        ...createCodeBlock(JSON.stringify(item.body, null, 2), 'json'),
      ];

      if (relatedFlashcards.length > 0) {
        children.push(createHeading(`Flashcards (${relatedFlashcards.length})`, 2));
        relatedFlashcards.forEach(f => {
          children.push(...createTextBlocks(`Q: ${f.front}\nA: ${f.back}\nTags: ${f.tags.join(', ')}\n---`));
        });
      }

      if (relatedRefs.length > 0) {
        children.push(createHeading(`Referensi Eksternal (${relatedRefs.length})`, 2));
        relatedRefs.forEach(r => {
          children.push(...createTextBlocks(`Judul: ${r.title}\nURL: ${r.url}\nTipe: ${r.ref_type}\nDesc: ${r.description}\n---`));
        });
      }

      // Siapkan properties untuk tabel Notes [PT]
      const properties = {
        "Name": { title: [{ text: { content: item.title } }] },
        "StudiOS": { checkbox: true },
        "Order Index": { number: item.order_index || 1 },
      };

      // Set Tags berdasarkan type
      if (item.type) {
        properties["Tags"] = { multi_select: [{ name: item.type }] };
      }

      // Set Relation ke Area jika ada
      if (parentStackNotionId) {
        properties["Area/Resource"] = { relation: [{ id: parentStackNotionId }] };
      }

      await notion.pages.create({
        parent: { database_id: CONTENT_DB_ID },
        properties,
        children
      });
      console.log(`✅ [Content] Terkirim & Direlasikan ke Area: ${item.title}`);
    } catch (err) {
      console.error(`❌ Gagal mengirim Content: ${item.title} - ${err.body ? JSON.stringify(err.body) : err.message}`);
    }
  }

  console.log('\n🎉 Selesai! Semua properti seperti Centang StudiOS, Tipe, Warna, Relasi, dan Order Index telah dipetakan sempurna.');
}

pushData();
