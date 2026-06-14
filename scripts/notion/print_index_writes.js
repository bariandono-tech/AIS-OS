const fs = require('fs');
const logPath = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\f2cbb795-8ea2-4965-80ed-bebb6788740b\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          const target = tc.args.TargetFile || '';
          if (target.includes('index.js')) {
            const content = tc.args.CodeContent || tc.args.ReplacementContent || '';
            console.log(`Step: ${obj.step_index} | Length: ${content.length}`);
            // Let's print the first 200 characters and look for DB IDs (strings of 32 chars)
            console.log('  Preview:', content.substring(0, 300).replace(/\n/g, ' '));
            const dbIds = content.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi);
            if (dbIds) {
              console.log('  Found UUIDs:', Array.from(new Set(dbIds)));
            }
          }
        }
      }
    } catch (e) {}
  }
}
