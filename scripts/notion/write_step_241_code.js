const fs = require('fs');
const logPath = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\f2cbb795-8ea2-4965-80ed-bebb6788740b\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.step_index === 241) {
        const code = obj.tool_calls[0].args.CodeContent;
        fs.writeFileSync('step_241_code.js', code, 'utf8');
        console.log('Successfully wrote step_241_code.js');
      }
    } catch (e) {
      console.error('Error writing file:', e.message);
    }
  }
}
