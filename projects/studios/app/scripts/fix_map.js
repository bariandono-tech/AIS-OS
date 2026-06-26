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

async function fixMap() {
  console.log('🔄 Memulihkan Peta Dependensi (Prerequisites & Recommended) ke Supabase...');
  
  const { data: dbContents, error } = await supabase.from('content_items').select('id, title');
  
  if (error || !dbContents) {
    console.error('❌ Gagal membaca data dari Supabase:', error);
    return;
  }
  
  const titleToUUID = {};
  dbContents.forEach(item => { titleToUUID[item.title] = item.id; });
  
  const mockIdToUUID = {};
  mockContents.forEach(mockItem => { 
    if (titleToUUID[mockItem.title]) {
      mockIdToUUID[mockItem.id] = titleToUUID[mockItem.title]; 
    }
  });

  let count = 0;
  for (const mockItem of mockContents) {
    const supabaseId = mockIdToUUID[mockItem.id];
    if (!supabaseId) continue;
    
    const newPrereqs = (mockItem.prerequisites || []).map(mockId => mockIdToUUID[mockId]).filter(Boolean);
    const newRecomms = (mockItem.recommended || []).map(mockId => mockIdToUUID[mockId]).filter(Boolean);
    
    const { error: updateError } = await supabase
      .from('content_items')
      .update({ prerequisites: newPrereqs, recommended: newRecomms })
      .eq('id', supabaseId);
      
    if (!updateError) {
      console.log(`✅ Dipulihkan: ${mockItem.title}`);
      count++;
    }
  }
  
  console.log(`\n🎉 Selesai! ${count} node berhasil dirajut petanya.`);
  console.log('Silakan REFRESH (F5) browser Anda sekarang!');
}

fixMap();
