const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function runTunnel() {
  console.log('[Auto-Tunnel] Launching localtunnel on port 3000...');
  const child = spawn('npx.cmd --yes localtunnel --port 3000', {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  child.stdout.on('data', (data) => {
    const text = data.toString();
    process.stdout.write(text);
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.loca\.lt/);
    if (match) {
      const url = match[0];
      console.log('\n=============================================');
      console.log('>>> PERSISTENT MOBILE PUBLIC URL:', url);
      console.log('=============================================\n');
      try {
        fs.writeFileSync(path.join(__dirname, 'active_tunnel.txt'), url);
      } catch (e) {}
    }
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
  });

  child.on('close', (code) => {
    console.log(`[Auto-Tunnel] Connection closed (code: ${code}). Auto-reconnecting in 3s...`);
    setTimeout(runTunnel, 3000);
  });

  child.on('error', (err) => {
    console.error('[Auto-Tunnel Error]', err);
    setTimeout(runTunnel, 3000);
  });
}

runTunnel();
