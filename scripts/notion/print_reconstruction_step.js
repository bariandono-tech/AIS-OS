const fs = require('fs');
const logPath = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\f2cbb795-8ea2-4965-80ed-bebb6788740b\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.step_index >= 200 && obj.step_index <= 245) {
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            const target = tc.args.TargetFile || '';
            if (target.includes('index.js')) {
              console.log(`\n================ STEP ${obj.step_index} (${tc.name}) ================\n`);
              console.log(tc.args.CodeContent);
              console.log(`\n=========================================\n`);
            }
          }
        }
      }
    } catch (e) {}
  }
}
