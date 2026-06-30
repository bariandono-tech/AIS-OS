const { execSync } = require('child_process');
const path = require('path');

try {
  const inputDir = path.resolve('d:/WORKSPACE/AIS-OS/projects/audit revisi proposal/revisi audit/outputs/analisis-anggaran-rudenim/revisi-v1');
  const result = execSync(
    `node build_revisi.js "${inputDir}"`,
    { 
      cwd: 'd:/WORKSPACE/AIS-OS/skripsi/drafts',
      encoding: 'utf-8',
      timeout: 30000
    }
  );
  console.log(result);
} catch (e) {
  console.error('STDERR:', e.stderr);
  console.error('STDOUT:', e.stdout);
  console.error('MESSAGE:', e.message);
}
