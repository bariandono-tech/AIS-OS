const fs = require('fs');
const logPath = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\f2cbb795-8ea2-4965-80ed-bebb6788740b\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.step_index < 350) {
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            if (tc.name === 'write_to_file' || tc.name === 'replace_file_content') {
              const content = tc.args.CodeContent || tc.args.ReplacementContent || '';
              if (content.includes('Catatan Bimbingan')) {
                console.log(`Step: ${obj.step_index} | Tool: ${tc.name} | TargetFile: ${tc.args.TargetFile}`);
              }
            }
          }
        }
      }
    } catch (e) {}
  }
}
