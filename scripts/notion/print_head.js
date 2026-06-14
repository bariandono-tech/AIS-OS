const fs = require('fs');
const logPath = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\f2cbb795-8ea2-4965-80ed-bebb6788740b\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  console.log('Total lines:', lines.length);
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    console.log(`Line ${i}:`, lines[i].substring(0, 500));
  }
} else {
  console.log('Log file not found');
}
