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

async function getStacks() {
  const res = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_STACKS_DB_ID}/query`, {
    method: 'POST',
    headers
  });
  const data = await res.json();
  data.results.forEach(page => {
    const title = page.properties.Name?.title[0]?.plain_text;
    console.log(`Stack: ${title} -> ID: ${page.id}`);
  });
}

getStacks();
