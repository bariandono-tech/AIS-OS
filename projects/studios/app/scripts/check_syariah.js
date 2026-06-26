import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSyariah() {
  const { data } = await supabase.from('content_items')
    .select('title, prerequisites, recommended')
    .eq('stack_id', '38978c4c-e388-812e-9d29-c89b3ab6f2b0'); // ID for Hukum Syariah (Wait, let's just query by stack_id from stacks table)
    
  const { data: stacks } = await supabase.from('stacks').select('id, title').ilike('title', '%Syariah%');
  if (stacks && stacks.length > 0) {
    const { data: contents } = await supabase.from('content_items')
      .select('title, prerequisites, recommended')
      .eq('stack_id', stacks[0].id);
    
    console.log("Syariah Contents:");
    console.log(JSON.stringify(contents, null, 2));
  }
}

checkSyariah();
