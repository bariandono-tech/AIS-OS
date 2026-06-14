const fs = require('fs');
const logPath = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\f2cbb795-8ea2-4965-80ed-bebb6788740b\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.step_index === 249) {
        console.log(JSON.stringify(obj, null, 2));
      }
    } catch (e) {}
  }
}
