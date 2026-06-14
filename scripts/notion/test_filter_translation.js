const { Client } = require('@notionhq/client');
require('dotenv').config();

const NOTES_MAP = {
  'wpGh': 'pqQj', // Archived -> Archive
  'qjoA': 'jBr@', // Favorite -> Favorite
  'IhZt': 'z`IC', // Tag -> Tag (relation)
  '_UqJ': 'Soca', // Type -> Type
  '`if\\': 'x?CF', // URL -> URL
  'De:e': 'g|aI', // Audio File -> Audio File
  'AZ_M': 'GF@U', // File Name -> File Name
  'wHmJ': 'Vnsh', // Duration (Seconds) -> Duration (Seconds)
  'X^nF': 'cFX?', // Note Date -> Note Date
  'title': 'title'
};

const PROJECTS_MAP = {
  'HKUO': 'TWP`',
  'Srgu': 'f>Z[',
  'eTYk': 'pU\\f',
  'f]Mo': 'b?dz',
  'm|mV': 'IMDW',
  'title': 'title'
};

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
    if (obj.hasOwnProperty('property')) {
      const mappedProp = map[obj.property];
      if (!mappedProp) {
        return undefined;
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

const filter1 = {
  "property": "wpGh",
  "checkbox": {
    "equals": false
  }
};

const filter2 = {
  "and": [
    {
      "property": "f]Mo",
      "relation": {
        "contains": "37b78c4c-e388-81f4-b621-cab6d1394bce"
      }
    },
    {
      "property": "eTYk",
      "checkbox": {
        "equals": false
      }
    }
  ]
};

console.log('Translated Filter 1:', JSON.stringify(translateAllPropertyIds(filter1, NOTES_MAP), null, 2));
console.log('Translated Filter 2:', JSON.stringify(translateAllPropertyIds(filter2, PROJECTS_MAP), null, 2));
