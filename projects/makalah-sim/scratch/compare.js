const fs = require('fs');
const path = require('path');

function normalize(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractText(xmlPath) {
  if (!fs.existsSync(xmlPath)) return [];
  const xml = fs.readFileSync(xmlPath, 'utf8');
  const paragraphRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
  const textRegex = /<w:t\b[^>]*>(.*?)<\/w:t>/g;
  let paragraphs = [];
  let match;
  while ((match = paragraphRegex.exec(xml)) !== null) {
    const pContent = match[1];
    let pText = '';
    let tMatch;
    while ((tMatch = textRegex.exec(pContent)) !== null) {
      pText += tMatch[1];
    }
    const normalizedText = normalize(pText);
    if (normalizedText) {
      paragraphs.push(normalizedText);
    }
  }
  return paragraphs;
}

const originalTexts = extractText(path.join(__dirname, '..', 'temp_original', 'word', 'document.xml'));
const copyTexts = extractText(path.join(__dirname, '..', 'temp_docx', 'word', 'document.xml'));

console.log("Original non-empty paragraphs: " + originalTexts.length);
console.log("Copy non-empty paragraphs: " + copyTexts.length);

// Compare using a simple alignment check
let origIdx = 0;
let copyIdx = 0;
let diffCount = 0;

while (origIdx < originalTexts.length || copyIdx < copyTexts.length) {
  if (origIdx < originalTexts.length && copyIdx < copyTexts.length) {
    if (originalTexts[origIdx] === copyTexts[copyIdx]) {
      origIdx++;
      copyIdx++;
    } else {
      diffCount++;
      console.log(`Mismatch at Orig[${origIdx}] and Copy[${copyIdx}]:`);
      console.log(`  Orig: "${originalTexts[origIdx]}"`);
      console.log(`  Copy: "${copyTexts[copyIdx]}"`);
      console.log('---');
      // Advance both for now
      origIdx++;
      copyIdx++;
      if (diffCount > 15) {
        console.log("Too many mismatches, stopping...");
        break;
      }
    }
  } else if (origIdx < originalTexts.length) {
    diffCount++;
    console.log(`Extra in Original at [${origIdx}]: "${originalTexts[origIdx]}"`);
    origIdx++;
  } else {
    diffCount++;
    console.log(`Extra in Copy at [${copyIdx}]: "${copyTexts[copyIdx]}"`);
    copyIdx++;
  }
}

console.log(`Total mismatch/extra paragraphs: ${diffCount}`);
