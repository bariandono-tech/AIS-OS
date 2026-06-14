const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

function decodeMap(map) {
  const decoded = {};
  for (const k of Object.keys(map)) {
    decoded[decodeURIComponent(k)] = decodeURIComponent(map[k]);
  }
  return decoded;
}

const NOTES_MAP = decodeMap({
  'wpGh': 'pqQj', // Archived -> Archive
  'qjoA': 'jBr%40', // Favorite -> Favorite
  'IhZt': 'z%60IC', // Tag -> Tag (relation)
  '_UqJ': 'Soca', // Type -> Type
  '%60if%5C': 'x%3FCF', // URL -> URL
  'De%3Ae': 'g%7CaI', // Audio File -> Audio File
  'AZ_M': 'GF%40U', // File Name -> File Name
  'wHmJ': 'Vnsh', // Duration (Seconds) -> Duration (Seconds)
  'X%5EnF': 'cFX%3F', // Note Date -> Note Date
  'title': 'title' // Name -> Name
});

const TASKS_MAP = decodeMap({
  'NOI%5E': 'lQh%3C', // Due -> Due
  '%60pIG': 'jbTO', // Project -> Project (relation)
  '~%60Oo': 'oHKB', // Done -> Status
  'title': 'title'
});

const PROJECTS_MAP = decodeMap({
  'HKUO': 'TWP%60', // Tasks -> Tasks
  'Srgu': 'f%3EZ%5B', // Status -> Status
  'eTYk': 'pU%5Cf', // Archive -> Archived
  'f%5DMo': 'b%3Fdz', // Area -> Area
  'm%7CmV': 'IMDW', // Notes -> Notes
  'title': 'title'
});

const NOTES_PARA_MAP = decodeMap({
  '%3CIwj': 'pqQj', // Archive -> Archive
  'E%3FGZ': '%7CJa%3C', // Root Area -> Root Area
  '_%40MB': '%7Ditd', // Area/Resource -> Area/Resource
  '%60xiv': 'h%3FdB', // Tags -> Tags
  'nUEp': 'x%3FCF', // URL -> URL
  'pY%3Aq': 'EZMI', // Project -> Project
  'jGN%5B': '%3F%5CJk', // Created -> Created
  'LvDK': 'QE%7B%3A', // Edited -> Edited
  'y%5CEV': '%40ChX', // URL Base -> Base URL
  'title': 'title'
});

const TASKS_PARA_MAP = decodeMap({
  '%40mLR': 'jbTO', // Project -> Project
  '%5BiAu': 'oHKB', // Status -> Status
  'exzX': 'lQh%3C', // Due -> Due
  'title': 'title'
});

const PROJECTS_PARA_MAP = decodeMap({
  'D%5DT%7B': 'f%3EZ%5B', // Status -> Status
  'PkYh': 'b%3Fdz', // Area -> Area
  'UyQu': 'IMDW', // Notes -> Notes
  '%5BFuA': 'TWP%60', // Tasks -> Tasks
  'ao%7Bk': 'pU%5Cf', // Archive -> Archived
  'title': 'title'
});

const AREAS_PARA_MAP = decodeMap({
  '%3BpGR': 'ci%5B%60', // Notes -> Notes
  'DtdF': 'srwY', // Archive -> Archive
  'K%5DGh': 'z%5ETI', // Root Area -> Root Area
  'N%5E%3A%7B': '%60Vb~', // Resources -> Resources
  'dkyp': 'kVj%5C', // Projects -> Projects
  'qG%3EO': 'RPqS', // Type -> Type
  'title': 'title'
});

const migrations = [
  {
    name: 'Notes (Ultimate) -> Notes [PT] (Fase 2)',
    oldDs: '37b78c4c-e388-81f1-be3d-000b4b1c3009',
    newDs: '37b78c4c-e388-81de-8816-000bf8f8c872',
    map: NOTES_MAP
  },
  {
    name: 'Tasks [PT] -> Tasks [UT] (Fase 3)',
    oldDs: '37b78c4c-e388-81aa-95cd-000bd9800292',
    newDs: '37b78c4c-e388-8105-a5b2-000b5faa01a6',
    map: TASKS_MAP
  },
  {
    name: 'Projects [PT] -> Projects [UT] (Fase 3)',
    oldDs: '37b78c4c-e388-81e0-af96-000b7901ce71',
    newDs: '37b78c4c-e388-81f4-836c-000bebfc9b81',
    map: PROJECTS_MAP
  },
  {
    name: 'Tasks [PARA] -> Tasks [UT] (Fase 3 - Dashboard)',
    oldDs: '37b78c4c-e388-8170-939d-000bd17662b9',
    newDs: '37b78c4c-e388-8105-a5b2-000b5faa01a6',
    map: TASKS_PARA_MAP
  },
  {
    name: 'Notes [PARA] -> Notes [PT] (Fase 3 - Dashboard)',
    oldDs: '37b78c4c-e388-810e-a8ac-000bd48e2a2c',
    newDs: '37b78c4c-e388-81de-8816-000bf8f8c872',
    map: NOTES_PARA_MAP
  },
  {
    name: 'Projects [PARA] -> Projects [UT] (Fase 3 - Dashboard)',
    oldDs: '37b78c4c-e388-815e-9f66-000be5b4d839',
    newDs: '37b78c4c-e388-81f4-836c-000bebfc9b81',
    map: PROJECTS_PARA_MAP
  },
  {
    name: 'Areas [PARA] -> Areas [PT] (Fase 3 - Dashboard)',
    oldDs: '37b78c4c-e388-8141-b4d2-000b7865a5d2',
    newDs: '37b78c4c-e388-81c6-ac4b-000b70cbdb57',
    map: AREAS_PARA_MAP
  }
];

function translateAllPropertyIds(obj, map) {
  if (obj === null || obj === undefined) return undefined;
  
  if (typeof obj === 'string') {
    return map[obj] || obj;
  }
  
  if (Array.isArray(obj)) {
    const arr = obj.map(item => translateAllPropertyIds(item, map)).filter(item => item !== undefined);
    return arr.length > 0 ? arr : undefined;
  }
  
  if (typeof obj === 'object') {
    // If it is a filter/sort object that references a property
    if (obj.hasOwnProperty('property')) {
      const mappedProp = map[obj.property];
      if (!mappedProp) {
        return undefined; // Drop the entire filter/sort block if property is not supported
      }
      const result = { ...obj, property: mappedProp };
      for (const key of Object.keys(result)) {
        if (key !== 'property') {
          result[key] = translateAllPropertyIds(result[key], map);
        }
      }
      return result;
    }
    
    const result = {};
    for (const key of Object.keys(obj)) {
      const val = translateAllPropertyIds(obj[key], map);
      if (val !== undefined) {
        result[key] = val;
      }
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }
  
  return obj;
}

async function rerouteAllViews() {
  console.log('=== STARTING MIGRATION & VIEW REROUTING (DEEP ID TRANSLATION) ===');

  for (const migration of migrations) {
    console.log(`\n========================================`);
    console.log(`Migration: ${migration.name}`);
    console.log(`========================================`);

    try {
      const listRes = await notion.views.list({ data_source_id: migration.oldDs });
      console.log(`Found ${listRes.results.length} views linked to old data source.`);

      let successCount = 0;
      for (const view of listRes.results) {
        if (view.id.startsWith('37b78c4c-e388-')) {
          try {
            const oldDetails = await notion.views.retrieve({ view_id: view.id });
            const parentDbBlock = oldDetails.parent.database_id;
            
            console.log(`- Rerouting View: "${oldDetails.name}" (${view.id})`);

            // Translate filter, sorts and layout configurations deeply
            const newFilter = translateAllPropertyIds(oldDetails.filter, migration.map);
            const newSorts = translateAllPropertyIds(oldDetails.sorts, migration.map);
            const newConfig = translateAllPropertyIds(oldDetails.configuration, migration.map);

            // 1. Create the new view under the same parent block pointing to the new data source first
            console.log(`  Creating new view under block ${parentDbBlock}...`);
            const newView = await notion.views.create({
              database_id: parentDbBlock,
              data_source_id: migration.newDs,
              name: oldDetails.name,
              type: oldDetails.type,
              filter: newFilter,
              sorts: newSorts,
              configuration: newConfig
            });
            console.log(`  ✅ Successfully created new view: ${newView.id}`);

            // 2. Delete the old view now that the database block has more than one view
            console.log(`  Deleting old view...`);
            await notion.views.delete({ view_id: view.id });
            console.log(`  ✅ Successfully deleted old view: ${view.id}`);
            
            successCount++;

          } catch (viewErr) {
            console.error(`  ❌ Failed to reroute view ${view.id}:`, viewErr.message);
          }
        } else {
          console.log(`- Skipping view ${view.id} (does not belong to duplicated workspace)`);
        }
      }

      console.log(`Migration ${migration.name} complete. Rerouted ${successCount} views.`);

    } catch (err) {
      console.error(`Migration ${migration.name} failed:`, err.message);
    }
  }

  console.log('\n=== ALL VIEW MIGRATIONS & REROUTINGS COMPLETED ===');
}

rerouteAllViews();
