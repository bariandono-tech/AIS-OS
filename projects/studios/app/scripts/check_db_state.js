import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: stacks } = await supabase.from('stacks').select('id, slug, title');
  const { data: contents, error } = await supabase.from('content_items').select('id, stack_id, title');
  
  const result = {
    error: error?.message,
    stacksCount: stacks?.length,
    contentsCount: contents?.length,
    stacks: stacks,
    contents: contents
  };
  
  fs.writeFileSync(resolve(__dirname, 'db_check.json'), JSON.stringify(result, null, 2));
}

run();
