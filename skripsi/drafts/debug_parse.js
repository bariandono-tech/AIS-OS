// Debug script: parse the MD files and dump the block structure to JSON
// untuk membandingkan apa yang diparsing vs apa yang seharusnya ada

const fs = require('fs');
const path = require('path');

const inputDir = 'd:/WORKSPACE/AIS-OS/projects/audit revisi proposal/revisi audit/outputs/analisis-anggaran-rudenim/revisi-v1';

// Load build_revisi parser
const revisiPath = path.resolve(__dirname, 'build_revisi.js');
// We can't easily import since it's a CLI script, so let's just parse manually

function parseMdFileToBlocks(mdContent) {
  const lines = mdContent.split('\n');
  const blocks = [];
  let i = 0;
  let inCatatanRevisi = false;
  let inDaftarPustaka = false;

  while (i < lines.length) {
    let line = lines[i].replace(/\r$/, '');
    if (line.trim() === '') { i++; continue; }
    if (/^##\s+Catatan Revisi/i.test(line)) { inCatatanRevisi = true; i++; continue; }
    if (inCatatanRevisi) {
      if (/^#\s+/.test(line)) { inCatatanRevisi = false; } else { i++; continue; }
    }
    if (line.trim() === '---PAGE_BREAK---') { blocks.push({ type: 'page_break' }); i++; continue; }
    if (/^#\s+Hasil Revisi/i.test(line)) { i++; continue; }
    
    if (/^#\s+DAFTAR PUSTAKA/i.test(line) || /^##\s+Daftar Pustaka/i.test(line)) {
      inDaftarPustaka = true;
      blocks.push({ type: 'h1', text: 'DAFTAR PUSTAKA' });
      i++; continue;
    }
    
    if (inDaftarPustaka) {
      if (/^#+\s+/.test(line)) {
        if (/catatan/i.test(line)) { inCatatanRevisi = true; i++; continue; }
        inDaftarPustaka = false;
      } else {
        const entryText = line.trim();
        if (entryText) {
          const cleanedEntry = entryText.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '');
          blocks.push({ type: 'daftar_pustaka_entry', text: cleanedEntry.substring(0, 80) + '...' });
        }
        i++; continue;
      }
    }

    if (/^###\s+/.test(line)) { blocks.push({ type: 'h3', text: line.replace(/^###\s+/, '').trim() }); i++; continue; }
    if (/^##\s*/.test(line)) { 
      const text = line.replace(/^##\s*/, '').trim();
      if (text) blocks.push({ type: 'h2', text }); 
      i++; continue; 
    }
    if (/^#\s+/.test(line)) { blocks.push({ type: 'h1', text: line.replace(/^#\s+/, '').trim() }); i++; continue; }

    if (/^\*\*Tabel\s+\d/.test(line)) { blocks.push({ type: 'table_caption', text: line.replace(/\*\*/g, '').trim() }); i++; continue; }
    if (/^\*Sumber:/.test(line) || /^\*\*?Sumber:/.test(line)) { blocks.push({ type: 'table_source', text: 'Sumber:...' }); i++; continue; }
    if (/^\*\*Gambar\s+\d/.test(line) || /^\*Gambar\s+\d/.test(line)) { blocks.push({ type: 'image_caption', text: line.replace(/\*/g, '').trim() }); i++; continue; }
    if (/^\[image:/.test(line)) { blocks.push({ type: 'image_file' }); i++; continue; }
    if (/^\[Flowchart/.test(line)) { blocks.push({ type: 'image_placeholder' }); i++; continue; }

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      let rowCount = 0;
      while (i < lines.length) {
        const tLine = lines[i].replace(/\r$/, '').trim();
        if (!tLine.startsWith('|') || !tLine.endsWith('|')) break;
        const inner = tLine.slice(1, -1).trim();
        const isSeparator = inner.split('|').every(c => /^[\s:]*-+[\s:]*$/.test(c.trim()));
        if (!isSeparator) rowCount++;
        i++;
      }
      blocks.push({ type: 'table', rows: rowCount });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) { blocks.push({ type: 'numbered_item', text: line.substring(0, 60) + '...' }); i++; continue; }

    blocks.push({ type: 'p', text: line.substring(0, 80) + '...' });
    i++;
  }

  return blocks;
}

const files = ['05-revisi-bab1.md', '05-revisi-bab2.md', '05-revisi-bab3.md', '05-revisi-daftar-pustaka.md'];
const result = {};

for (const file of files) {
  const filePath = path.join(inputDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const blocks = parseMdFileToBlocks(content);
    
    // Count by type
    const typeCounts = {};
    for (const b of blocks) {
      typeCounts[b.type] = (typeCounts[b.type] || 0) + 1;
    }
    
    result[file] = {
      totalBlocks: blocks.length,
      typeCounts,
      firstBlocks: blocks.slice(0, 10),
      lastBlocks: blocks.slice(-5),
    };
  }
}

// Also check the existing revisi .md files for format issues
const bab1Content = fs.readFileSync(path.join(inputDir, '05-revisi-bab1.md'), 'utf-8');
const bab1Lines = bab1Content.split('\n').slice(0, 20);

result._bab1_first20lines = bab1Lines.map((l, i) => `${i+1}: ${l.substring(0, 120)}`);

// Check if build_makalah.js is intact  
const buildMakalahSize = fs.statSync(path.resolve(__dirname, 'build_makalah.js')).size;
result._build_makalah_js_size = buildMakalahSize;

fs.writeFileSync(path.resolve(__dirname, 'debug_parse.json'), JSON.stringify(result, null, 2), 'utf-8');
console.log('Debug output written to debug_parse.json');
console.log('build_makalah.js size:', buildMakalahSize, 'bytes');
