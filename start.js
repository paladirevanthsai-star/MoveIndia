import fs from 'fs';
import path from 'path';

console.log('==============================================');
console.log('>>> MOVE INDIA: STARTING PRODUCTION SERVER <<<');
console.log('==============================================');

let serverFile = null;
if (fs.existsSync(path.resolve(process.cwd(), 'server', 'index.js'))) {
  serverFile = path.resolve(process.cwd(), 'server', 'index.js');
} else if (fs.existsSync(path.resolve(process.cwd(), 'index.js'))) {
  serverFile = path.resolve(process.cwd(), 'index.js');
} else if (fs.existsSync(path.resolve(process.cwd(), '..', 'server', 'index.js'))) {
  serverFile = path.resolve(process.cwd(), '..', 'server', 'index.js');
}

if (!serverFile) {
  console.error('ERROR: Could not find server/index.js in any path!');
  process.exit(1);
}

console.log('Launching server from:', serverFile);
import(`file://${serverFile}`);
