const fs = require('fs');

try {
  const content = fs.readFileSync('step_241_code.js', 'utf8');
  // Evaluate the string as a JS string literal
  const fn = new Function('return ' + content);
  const decoded = fn();
  fs.writeFileSync('step_241_code_decoded.js', decoded, 'utf8');
  console.log('Decoded successfully using JS evaluation!');
} catch (e) {
  console.error('Failed to parse using evaluation:', e.message);
}
