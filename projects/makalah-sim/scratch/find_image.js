const fs = require('fs');
const path = require('path');

const relsPath = path.join(__dirname, '..', 'temp_docx', 'word', '_rels', 'document.xml.rels');
const xmlPath = path.join(__dirname, '..', 'temp_docx', 'word', 'document.xml');

if (!fs.existsSync(relsPath) || !fs.existsSync(xmlPath)) {
  console.error("Files not found");
  process.exit(1);
}

const rels = fs.readFileSync(relsPath, 'utf8');
const xml = fs.readFileSync(xmlPath, 'utf8');

// Find relationship ID for image1.jpg
const image1RelMatch = rels.match(/Id="([^"]+)"[^>]+Target="media\/image1\.jpg"/);
if (!image1RelMatch) {
  console.log("image1.jpg not found in rels");
  process.exit(0);
}

const rId = image1RelMatch[1];
console.log(`image1.jpg Relationship ID: ${rId}`);

// Find where this relationship ID is used in document.xml
const index = xml.indexOf(rId);
if (index === -1) {
  console.log(`Relationship ID ${rId} not found in document.xml`);
  process.exit(0);
}

console.log(`Found rId at index ${index}. Extracting context...`);
const start = Math.max(0, index - 500);
const end = Math.min(xml.length, index + 500);
console.log(xml.substring(start, end));
