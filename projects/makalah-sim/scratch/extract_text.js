const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, '..', 'temp_docx', 'word', 'document.xml');
if (!fs.existsSync(xmlPath)) {
  console.error("XML file not found at " + xmlPath);
  process.exit(1);
}

const xml = fs.readFileSync(xmlPath, 'utf8');

// A very simple w:p and w:t text extractor
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
  if (pText.trim()) {
    paragraphs.push(pText);
  }
}

const outputPath = path.join(__dirname, 'extracted_text.txt');
fs.writeFileSync(outputPath, paragraphs.join('\n\n'), 'utf8');
console.log("Text successfully extracted to " + outputPath);
console.log("Total paragraphs: " + paragraphs.length);
