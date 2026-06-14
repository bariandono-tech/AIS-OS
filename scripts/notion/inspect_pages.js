const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

console.log('notion.pages keys:', notion.pages ? Object.keys(notion.pages) : 'undefined');
console.log('notion.blocks keys:', notion.blocks ? Object.keys(notion.blocks) : 'undefined');
