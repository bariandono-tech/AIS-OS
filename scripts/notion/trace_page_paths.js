const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const NEW_ROOT_ID = '37b78c4c-e388-80fc-a6c9-e71935752566'; // Duplicated root
// Let's retrieve all pages and databases first to build a parent-child map
async function tracePaths() {
  try {
    const parentMap = new Map();
    const itemTitles = new Map();
    const itemTypes = new Map();

    // 1. Search for all pages
    console.log('Searching for all pages...');
    const pageResponse = await notion.search({
      filter: { value: 'page', property: 'object' },
      page_size: 100
    });
    
    for (const page of pageResponse.results) {
      let title = 'Untitled';
      if (page.properties) {
        for (const key in page.properties) {
          const prop = page.properties[key];
          if (prop.type === 'title' && prop.title && Array.isArray(prop.title)) {
            title = prop.title.map(t => t.plain_text).join('');
            break;
          }
        }
      }
      itemTitles.set(page.id, title);
      itemTypes.set(page.id, 'page');
      
      if (page.parent) {
        if (page.parent.type === 'page_id') {
          parentMap.set(page.id, page.parent.page_id);
        } else if (page.parent.type === 'workspace') {
          parentMap.set(page.id, 'workspace');
        } else if (page.parent.type === 'block_id') {
          parentMap.set(page.id, page.parent.block_id);
        } else if (page.parent.type === 'data_source_id') {
          parentMap.set(page.id, page.parent.data_source_id);
        }
      }
    }

    // 2. Search for all databases (views/data sources)
    console.log('Searching for all databases/data sources...');
    const dbResponse = await notion.search({
      filter: { value: 'data_source', property: 'object' },
      page_size: 100
    });

    for (const db of dbResponse.results) {
      const title = db.title ? db.title.map(t => t.plain_text).join('') : 'Untitled';
      itemTitles.set(db.id, title);
      itemTypes.set(db.id, 'database');
      
      if (db.parent) {
        if (db.parent.type === 'page_id') {
          parentMap.set(db.id, db.parent.page_id);
        } else if (db.parent.type === 'block_id') {
          parentMap.set(db.id, db.parent.block_id);
        } else if (db.parent.type === 'database_id') {
          parentMap.set(db.id, db.parent.database_id);
        } else if (db.parent.type === 'workspace') {
          parentMap.set(db.id, 'workspace');
        }
      }
    }

    // Trace helper
    function getRootAndPath(itemId) {
      let current = itemId;
      const path = [];
      let iterations = 0;
      
      while (current && current !== 'workspace' && iterations < 20) {
        const title = itemTitles.get(current) || `[Block ID: ${current}]`;
        const type = itemTypes.get(current) || 'block';
        path.unshift(`${type} "${title}" (${current})`);
        
        const parent = parentMap.get(current);
        if (!parent) {
          // Try retrieving the block parent via API if not in search
          try {
            // This is synchronous in our loop but we're in a script, it's fine
            break;
          } catch (e) {
            break;
          }
        }
        current = parent;
        iterations++;
      }
      return { root: current, path: path.join(' -> ') };
    }

    console.log('\n=== TRACING PAGE ANCESTRY ===');
    const newRootItems = [];
    const oldRootItems = [];
    const otherItems = [];

    for (const page of pageResponse.results) {
      const { root, path } = getRootAndPath(page.id);
      const title = itemTitles.get(page.id);
      
      // We will check if the path contains the duplicate root ID or original root
      if (path.includes(NEW_ROOT_ID)) {
        newRootItems.push({ id: page.id, title, path });
      } else {
        oldRootItems.push({ id: page.id, title, path });
      }
    }

    console.log(`\nItems in DUPLICATED Workspace (under ${NEW_ROOT_ID}):`);
    console.log(`Count: ${newRootItems.length}`);
    newRootItems.forEach(item => {
      console.log(`- Page: "${item.title}" (${item.id})`);
      console.log(`  Path: ${item.path}`);
    });

    console.log(`\nItems in ORIGINAL/OTHER Workspace:`);
    console.log(`Count: ${oldRootItems.length}`);
    oldRootItems.forEach(item => {
      console.log(`- Page: "${item.title}" (${item.id})`);
      console.log(`  Path: ${item.path}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

tracePaths();
