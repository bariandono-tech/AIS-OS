import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

async function checkNotion() {
  const res = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_CONTENT_DB_ID}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28'
    }
  });
  const data = await res.json();
  console.log("NOTION DB PROPERTIES:", Object.keys(data.properties || {}));
}

checkNotion();
