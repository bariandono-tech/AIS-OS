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

async function checkDb() {
  const { data: stacks } = await supabase.from('stacks').select('id, title').ilike('title', '%Syariah%');
  if (!stacks || stacks.length === 0) {
    console.log("Hukum Syariah stack not found");
    return;
  }

  const stackId = stacks[0].id;
  const { data: items } = await supabase.from('content_items')
    .select('id, title, prerequisites, order_index')
    .eq('stack_id', stackId);

  console.log("=== HUKUM SYARIAH IN SUPABASE ===");
  items.forEach(item => {
    console.log(`[${item.order_index}] ${item.title}`);
    console.log(`  ID: ${item.id}`);
    console.log(`  Prereqs:`, item.prerequisites);
  });
}

checkDb();
