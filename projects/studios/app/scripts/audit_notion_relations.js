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

const CONTENT_DB_ID = process.env.NOTION_CONTENT_DB_ID;

async function run() {
  console.log('🔍 Mengaudit database Notion (Content Items)...');
  
  const contentRes = await fetch(`https://api.notion.com/v1/databases/${CONTENT_DB_ID}/query`, {
    method: 'POST',
    headers,
    body: JSON.stringify({})
  });
  
  const contentData = await contentRes.json();
  const pages = contentData.results || [];
  
  const items = pages.map(p => {
    const title = p.properties.Name?.title[0]?.plain_text || 'Untitled';
    const prereqs = p.properties.Prerequisites?.relation?.length || 0;
    return { title, prereqs, id: p.id };
  });

  console.log(`\nDitemukan ${items.length} materi di Notion.`);
  console.log('--------------------------------------------------');
  items.sort((a,b) => a.title.localeCompare(b.title)).forEach(i => {
    console.log(`- ${i.title.padEnd(50)} : ${i.prereqs} Prerequisites`);
  });
  console.log('--------------------------------------------------');
}

run();
