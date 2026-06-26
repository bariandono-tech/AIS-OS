import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { contentItems as mockContents } from '../src/data/mockData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function restore() {
  console.log('🔄 Memulihkan Peta Dependensi (Prerequisites & Recommended) ke Supabase...');

  // 1. Ambil semua content_items dari Supabase
  const { data: dbContents, error } = await supabase.from('content_items').select('id, title');
  if (error) {
    console.error('Error fetching dbContents:', error);
    return;
  }

  // Buat mapping judul -> UUID baru di Supabase
  const titleToUUID = {};
  dbContents.forEach(item => {
    titleToUUID[item.title] = item.id;
  });

  // Buat mapping ID mock (c1, c2, dll) -> UUID Supabase
  const mockIdToUUID = {};
  mockContents.forEach(mockItem => {
    if (titleToUUID[mockItem.title]) {
      mockIdToUUID[mockItem.id] = titleToUUID[mockItem.title];
    }
  });

  // 2. Persiapkan data update
  let updatedCount = 0;
  for (const mockItem of mockContents) {
    const supabaseId = mockIdToUUID[mockItem.id];
    if (!supabaseId) continue;

    // Konversi array ID mock ke array UUID Supabase
    const newPrereqs = (mockItem.prerequisites || []).map(mockId => mockIdToUUID[mockId]).filter(Boolean);
    const newRecomms = (mockItem.recommended || []).map(mockId => mockIdToUUID[mockId]).filter(Boolean);

    // Jika ada dependensi, update ke Supabase
    if (newPrereqs.length > 0 || newRecomms.length > 0) {
      const { error: updateErr } = await supabase
        .from('content_items')
        .update({ 
          prerequisites: newPrereqs,
          recommended: newRecomms
        })
        .eq('id', supabaseId);
      
      if (updateErr) {
        console.error(`Gagal update dependensi untuk ${mockItem.title}:`, updateErr);
      } else {
        console.log(`✅ Dipulihkan: ${mockItem.title}`);
        updatedCount++;
      }
    }
  }

  console.log(`\n🎉 Selesai! Berhasil memulihkan dependensi untuk ${updatedCount} konten.`);
}

restore();
