import dotenv from 'dotenv';
import { Client } from '@notionhq/client';
import { createClient } from '@supabase/supabase-js';
import {
  blocksToMarkdown,
  blocksToResume,
  blocksToBrainstorm,
  blocksToFlashcards,
  blocksToReferences
} from './notionParser.js';

dotenv.config();

const requiredEnv = [
  'NOTION_TOKEN',
  'NOTION_STACKS_DB_ID',
  'NOTION_CONTENT_DB_ID',
  'VITE_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingEnv = requiredEnv.filter(k => !process.env[k]);
if (missingEnv.length > 0) {
  console.error('❌ Missing environment variables in .env:', missingEnv.join(', '));
  process.exit(1);
}

// Clients initialization
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// safe property extractors
function getTitleProperty(page, propName) {
  const prop = page.properties[propName];
  if (!prop || prop.type !== 'title') return '';
  return prop.title.map(t => t.plain_text).join('');
}

function getRichTextProperty(page, propName) {
  const prop = page.properties[propName];
  if (!prop || prop.type !== 'rich_text') return '';
  return prop.rich_text.map(t => t.plain_text).join('');
}

function getCheckboxProperty(page, propName) {
  const prop = page.properties[propName];
  if (!prop || prop.type !== 'checkbox') return false;
  return prop.checkbox;
}

function getNumberProperty(page, propName) {
  const prop = page.properties[propName];
  if (!prop || prop.type !== 'number') return 0;
  return prop.number || 0;
}

function getSelectProperty(page, propName) {
  const prop = page.properties[propName];
  if (!prop || prop.type !== 'select') return '';
  return prop.select?.name || '';
}

function getRelationProperty(page, propName) {
  const prop = page.properties[propName];
  if (!prop || prop.type !== 'relation') return [];
  return prop.relation.map(r => r.id);
}

function getPageIcon(page) {
  if (!page.icon) return '📚';
  if (page.icon.type === 'emoji') return page.icon.emoji;
  if (page.icon.type === 'external') return page.icon.external.url;
  if (page.icon.type === 'file') return page.icon.file.url;
  return '📚';
}

async function syncEngine() {
  console.log('🔄 Starting Notion to Supabase Sync Engine...');
  console.log('-------------------------------------------');

  try {
    // 1. Sync Stacks
    console.log('Fetching Stacks from Notion...');
    const stackPages = [];
    let hasMoreStacks = true;
    let stackCursor = undefined;

    while (hasMoreStacks) {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_STACKS_DB_ID,
        start_cursor: stackCursor
      });
      stackPages.push(...response.results);
      hasMoreStacks = response.has_more;
      stackCursor = response.next_cursor;
    }

    console.log(`Retrieved ${stackPages.length} Stacks from Notion. Syncing to Supabase...`);

    const stackMap = {}; // store colors & slug for content items mapping

    for (const page of stackPages) {
      const id = page.id;
      const title = getTitleProperty(page, 'Name') || getTitleProperty(page, 'Title') || 'Mata Kuliah';
      const slug = getRichTextProperty(page, 'Slug') || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const description = getRichTextProperty(page, 'Description');
      const icon = getPageIcon(page);
      const color = getRichTextProperty(page, 'Color') || '#6c5ce7';
      const is_published = getCheckboxProperty(page, 'Is Published');

      stackMap[id] = { color, slug, title };

      const { error } = await supabase
        .from('stacks')
        .upsert({
          id,
          slug,
          title,
          description,
          icon,
          color,
          is_published,
          created_at: page.created_time
        });

      if (error) {
        console.error(`❌ Error syncing Stack ${title}:`, error.message);
      } else {
        console.log(`✅ Synced Stack: "${title}" (${slug})`);
      }
    }

    // 2. Sync Content Items
    console.log('\nFetching Content Items from Notion...');
    const contentPages = [];
    let hasMoreContent = true;
    let contentCursor = undefined;

    while (hasMoreContent) {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_CONTENT_DB_ID,
        start_cursor: contentCursor
      });
      contentPages.push(...response.results);
      hasMoreContent = response.has_more;
      contentCursor = response.next_cursor;
    }

    console.log(`Retrieved ${contentPages.length} Content Items from Notion. Syncing to Supabase...`);

    for (const page of contentPages) {
      const id = page.id;
      const title = getTitleProperty(page, 'Name') || getTitleProperty(page, 'Title') || 'Materi Belajar';
      const order_index = getNumberProperty(page, 'Order Index');
      const is_published = getCheckboxProperty(page, 'Is Published');
      const type = getSelectProperty(page, 'Type');
      
      const stackRelations = getRelationProperty(page, 'Stack');
      if (!stackRelations.length) {
        console.warn(`⚠️ Skipped: Content item "${title}" has no Stack relation.`);
        continue;
      }
      
      const stack_id = stackRelations[0];
      const stackInfo = stackMap[stack_id];
      const stackColor = stackInfo?.color || '#6c5ce7';

      // Parse body & details based on type
      let body = {};
      let childFlashcards = [];
      let childReferences = [];

      try {
        if (type === 'resume') {
          body = await blocksToResume(notion, id);
        } else if (type === 'notes') {
          body = { markdown: await blocksToMarkdown(notion, id) };
        } else if (type === 'brainstorm') {
          body = await blocksToBrainstorm(notion, id, stackColor);
        } else if (type === 'flashcard') {
          childFlashcards = await blocksToFlashcards(notion, id);
        } else if (type === 'reference') {
          childReferences = await blocksToReferences(notion, id);
        }
      } catch (parseErr) {
        console.error(`❌ Error parsing blocks for "${title}":`, parseErr.message);
        continue;
      }

      // Upsert parent content item
      const { error: contentErr } = await supabase
        .from('content_items')
        .upsert({
          id,
          stack_id,
          type,
          title,
          body,
          order_index,
          is_published,
          created_at: page.created_time
        });

      if (contentErr) {
        console.error(`❌ Error syncing content item "${title}":`, contentErr.message);
        continue;
      }

      // Sync linked tables for specific types
      if (type === 'flashcard') {
        // Clear old flashcards
        const { error: delErr } = await supabase
          .from('flashcards')
          .delete()
          .eq('content_item_id', id);

        if (delErr) {
          console.error(`❌ Error clearing old flashcards for "${title}":`, delErr.message);
        }

        // Insert new ones if any
        if (childFlashcards.length > 0) {
          const { error: insErr } = await supabase
            .from('flashcards')
            .insert(childFlashcards.map(fc => ({
              content_item_id: id,
              front: fc.front,
              back: fc.back,
              tags: fc.tags
            })));

          if (insErr) {
            console.error(`❌ Error inserting flashcards for "${title}":`, insErr.message);
          } else {
            console.log(`✅ Synced flashcard deck: "${title}" (${childFlashcards.length} cards)`);
          }
        } else {
          console.log(`✅ Synced flashcard deck: "${title}" (empty deck)`);
        }
      } else if (type === 'reference') {
        // Clear old references
        const { error: delErr } = await supabase
          .from('references')
          .delete()
          .eq('content_item_id', id);

        if (delErr) {
          console.error(`❌ Error clearing old references for "${title}":`, delErr.message);
        }

        // Insert new ones if any
        if (childReferences.length > 0) {
          const { error: insErr } = await supabase
            .from('references')
            .insert(childReferences.map(ref => ({
              content_item_id: id,
              url: ref.url,
              ref_type: ref.ref_type,
              title: ref.title,
              description: ref.description
            })));

          if (insErr) {
            console.error(`❌ Error inserting references for "${title}":`, insErr.message);
          } else {
            console.log(`✅ Synced references: "${title}" (${childReferences.length} links)`);
          }
        } else {
          console.log(`✅ Synced references: "${title}" (empty list)`);
        }
      } else {
        console.log(`✅ Synced content item: "${title}" (${type})`);
      }
    }

    console.log('\n-------------------------------------------');
    console.log('🎉 Notion to Supabase Sync completed successfully!');
  } catch (err) {
    console.error('\n❌ Fatal sync engine failure:', err.message);
    process.exit(1);
  }
}

// Run engine
syncEngine();
