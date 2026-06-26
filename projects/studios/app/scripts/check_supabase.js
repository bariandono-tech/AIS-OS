import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  console.log("Checking Supabase 'stacks' table...");
  const { data: stacks, error: errStacks } = await supabase.from('stacks').select('*').limit(1);
  if (errStacks) console.error("Error reading stacks:", errStacks.message);
  else console.log("Stacks table exists! Data:", stacks);

  console.log("\nChecking Supabase 'content_items' table...");
  const { data: items, error: errItems } = await supabase.from('content_items').select('*').limit(1);
  if (errItems) console.error("Error reading content_items:", errItems.message);
  else console.log("Content_items table exists! Data:", items);
}

check();
