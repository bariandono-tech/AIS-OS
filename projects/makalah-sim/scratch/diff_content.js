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

// Find items in copyTexts that do not exist at all in originalTexts (by exact match or close match)
const originalSet = new Set(originalTexts);
const newItems = [];

for (const item of copyTexts) {
  if (!originalSet.has(item)) {
    // Check if there is a close match to filter out minor formatting differences
    let hasClose = false;
    for (const orig of originalTexts) {
      // simple check: if length difference is small and one contains the other, or edit distance is small
      if (Math.abs(orig.length - item.length) < 10 && (orig.includes(item) || item.includes(orig))) {
        hasClose = true;
        break;
      }
    }
    if (!hasClose) {
      newItems.push(item);
    }
  }
}

console.log("Paragraphs in Copy not found in Original (no close matches):");
console.log(JSON.stringify(newItems, null, 2));
