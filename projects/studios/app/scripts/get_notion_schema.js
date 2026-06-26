import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const STACKS_DB_ID = process.env.NOTION_STACKS_DB_ID;
const CONTENT_DB_ID = process.env.NOTION_CONTENT_DB_ID;

async function fetchSchema() {
  console.log('Mengambil skema (kolom) dari Notion Database Anda...');
  
  try {
    const stacksDb = await notion.databases.retrieve({ database_id: STACKS_DB_ID });
    console.log('--- RAW STACKS DB ---');
    console.log(JSON.stringify(stacksDb, null, 2).substring(0, 500) + '...');
    
    const contentDb = await notion.databases.retrieve({ database_id: CONTENT_DB_ID });
    console.log('--- RAW CONTENT DB ---');
    console.log(JSON.stringify(contentDb, null, 2).substring(0, 500) + '...');

    const schemaInfo = {
      stacks_properties: stacksDb.properties ? Object.keys(stacksDb.properties).map(k => ({
        name: k,
        type: stacksDb.properties[k].type
      })) : 'NO PROPERTIES FOUND',
      content_properties: contentDb.properties ? Object.keys(contentDb.properties).map(k => ({
        name: k,
        type: contentDb.properties[k].type
      })) : 'NO PROPERTIES FOUND'
    };

    const outputPath = resolve(__dirname, '../notion_schema.json');
    fs.writeFileSync(outputPath, JSON.stringify(schemaInfo, null, 2));
    
    console.log('✅ Berhasil! Skema telah disimpan ke file: notion_schema.json');
    console.log('\nKolom di Stacks DB:');
    console.table(schemaInfo.stacks_properties);
    console.log('\nKolom di Content DB:');
    console.table(schemaInfo.content_properties);
    
  } catch (error) {
    console.error('❌ Gagal mengambil skema:', error.message);
  }
}

fetchSchema();
