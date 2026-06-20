const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, '..', 'temp_docx', 'word', 'document.xml');
if (!fs.existsSync(xmlPath)) {
  console.error("XML file not found");
  process.exit(1);
}

const xml = fs.readFileSync(xmlPath, 'utf8');

// Find occurrences of rId7
const index = xml.indexOf('rId7');
if (index === -1) {
  console.log("rId7 not found");
  process.exit(0);
}

// Find surrounding paragraphs
const paragraphRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
const textRegex = /<w:t\b[^>]*>(.*?)<\/w:t>/g;

let matches = [];
let match;
while ((match = paragraphRegex.exec(xml)) !== null) {
  matches.push({
    start: match.index,
    end: match.index + match[0].length,
    content: match[1]
  });
}

// Find the paragraph containing rId7
let foundIdx = -1;
for (let i = 0; i < matches.length; i++) {
  if (matches[i].start <= index && index <= matches[i].end) {
    foundIdx = i;
    break;
  }
}

if (foundIdx === -1) {
  console.log("Could not associate rId7 with a paragraph");
  process.exit(0);
}

console.log(`Found rId7 in paragraph ${foundIdx}.`);

function getParaText(pContent) {
  let pText = '';
  let tMatch;
  while ((tMatch = textRegex.exec(pContent)) !== null) {
    pText += tMatch[1];
  }
  return pText;
}

// Print paragraphs around the found one
const startIdx = Math.max(0, foundIdx - 3);
const endIdx = Math.min(matches.length - 1, foundIdx + 3);

for (let j = startIdx; j <= endIdx; j++) {
  const isTarget = j === foundIdx;
  console.log(`Paragraph ${j} ${isTarget ? '*** TARGET ***' : ''}:`);
  console.log(`Text: "${getParaText(matches[j].content)}"`);
  console.log(`Raw XML snippet: ${matches[j].content.substring(0, 150)}...\n`);
}
