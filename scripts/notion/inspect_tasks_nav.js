const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PRO_TASKS_PAGE_ID = '37b78c4c-e388-8184-b1ab-ce02d9f593b8';

async function inspect() {
  console.log(`=== INSPECTING PRO TASKS PAGE BLOCKS: ${PRO_TASKS_PAGE_ID} ===`);
  try {
    const res = await notion.blocks.children.list({ block_id: PRO_TASKS_PAGE_ID });
    console.log(`Found ${res.results.length} blocks:`);
    for (const block of res.results) {
      console.log(`- ID: ${block.id} | Type: ${block.type} | HasChildren: ${block.has_children}`);
      if (block.type === 'toggle') {
        console.log(`  Toggle text: "${block.toggle.rich_text.map(t => t.plain_text).join('')}"`);
        const subRes = await notion.blocks.children.list({ block_id: block.id });
        console.log(`  Toggle children count: ${subRes.results.length}`);
        for (const sub of subRes.results) {
          console.log(`    - ID: ${sub.id} | Type: ${sub.type}`);
          if (sub.type === 'paragraph') {
            console.log(`      Text: "${sub.paragraph.rich_text.map(t => t.plain_text).join('')}"`);
          } else if (sub.type === 'bulleted_list_item') {
            console.log(`      Bullet: "${sub.bulleted_list_item.rich_text.map(t => t.plain_text).join('')}"`);
          } else if (sub.type === 'toggle') {
            console.log(`      Sub-Toggle: "${sub.toggle.rich_text.map(t => t.plain_text).join('')}"`);
            const subSub = await notion.blocks.children.list({ block_id: sub.id });
            for (const s of subSub.results) {
              console.log(`        - ID: ${s.id} | Type: ${s.type}`);
              if (s.type === 'bulleted_list_item') {
                console.log(`          Bullet: "${s.bulleted_list_item.rich_text.map(t => t.plain_text).join('')}"`);
              }
            }
          }
        }
      } else if (block.type === 'paragraph') {
        console.log(`  Paragraph text: "${block.paragraph.rich_text.map(t => t.plain_text).join('')}"`);
      } else if (block.type === 'column_list') {
        const colList = await notion.blocks.children.list({ block_id: block.id });
        for (const col of colList.results) {
          const colBlocks = await notion.blocks.children.list({ block_id: col.id });
          for (const cb of colBlocks.results) {
            console.log(`  - Block inside column: Type: ${cb.type} | ID: ${cb.id}`);
            if (cb.type === 'toggle') {
              console.log(`    Toggle text: "${cb.toggle.rich_text.map(t => t.plain_text).join('')}"`);
              const subRes = await notion.blocks.children.list({ block_id: cb.id });
              for (const sub of subRes.results) {
                console.log(`      - ID: ${sub.id} | Type: ${sub.type}`);
                if (sub.type === 'bulleted_list_item') {
                  console.log(`        Bullet: "${sub.bulleted_list_item.rich_text.map(t => t.plain_text).join('')}"`);
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

inspect();
