import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

async function queryNotionDB(dbId) {
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    }
  });
  const data = await res.json();
  if (data.object === 'error') {
    throw new Error(data.message);
  }
  return data.results;
}

async function run() {
  const contentResults = await queryNotionDB(process.env.NOTION_CONTENT_DB_ID);
  if (contentResults.length > 0) {
    console.log(JSON.stringify(contentResults[0].properties, null, 2));
  } else {
    console.log("No content items found.");
  }
}

run();
