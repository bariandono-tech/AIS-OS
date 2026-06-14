const fs = require('fs');

try {
  let content = fs.readFileSync('step_241_code.js', 'utf8').trim();
  if (content.startsWith('"') && content.endsWith('"')) {
    content = content.substring(1, content.length - 1);
  }
  const decoded = content
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
  fs.writeFileSync('step_241_code_decoded.js', decoded, 'utf8');
  console.log('Decoded manually successfully!');
} catch (e) {
  console.error('Failed to decode manually:', e.message);
}
