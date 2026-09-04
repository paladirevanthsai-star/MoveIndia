import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('==============================================');
console.log('>>> MOVE INDIA: SMART CLOUD BUILD SCRIPT <<<');
console.log('==============================================');
console.log('Current Directory:', process.cwd());

// 1. Locate Client Directory
let clientDir = null;
if (fs.existsSync(path.resolve(process.cwd(), 'client'))) {
  clientDir = path.resolve(process.cwd(), 'client');
} else if (fs.existsSync(path.resolve(process.cwd(), '../client'))) {
  clientDir = path.resolve(process.cwd(), '../client');
} else if (fs.existsSync(path.resolve(process.cwd(), 'src')) && fs.existsSync(path.resolve(process.cwd(), 'vite.config.js'))) {
  clientDir = process.cwd();
}

// 2. Locate Server Directory
let serverDir = null;
if (fs.existsSync(path.resolve(process.cwd(), 'server'))) {
  serverDir = path.resolve(process.cwd(), 'server');
} else if (fs.existsSync(path.resolve(process.cwd(), '../server'))) {
  serverDir = path.resolve(process.cwd(), '../server');
} else if (fs.existsSync(path.resolve(process.cwd(), 'index.js')) && fs.existsSync(path.resolve(process.cwd(), 'data'))) {
  serverDir = process.cwd();
}

console.log('Client Directory:', clientDir);
console.log('Server Directory:', serverDir);

// Build Client
if (clientDir && fs.existsSync(path.join(clientDir, 'package.json'))) {
  console.log('\n>>> Installing Client Dependencies...');
  execSync('npm install', { cwd: clientDir, stdio: 'inherit' });
  console.log('\n>>> Compiling React Frontend with Vite...');
  execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });
} else {
  console.log('WARNING: Client directory not found or already built.');
}

// Install Server
if (serverDir && fs.existsSync(path.join(serverDir, 'package.json'))) {
  console.log('\n>>> Installing Server Dependencies...');
  execSync('npm install', { cwd: serverDir, stdio: 'inherit' });
}

console.log('\n==============================================');
console.log('>>> BUILD FINISHED SUCCESSFULLY! READY TO START <<<');
console.log('==============================================\n');
