import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=================================================");
console.log("  🚀 Starting Move India (Live GPS & Transit System)");
console.log("  Backend: http://localhost:5000");
console.log("  Frontend: http://localhost:3000");
console.log("=================================================\n");

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

// 1. Start Server
const server = spawn(npmCmd, ["start"], {
  cwd: path.join(__dirname, "server"),
  stdio: "inherit",
  shell: true
});

// 2. Start Client
const client = spawn(npmCmd, ["run", "dev"], {
  cwd: path.join(__dirname, "client"),
  stdio: "inherit",
  shell: true
});

function cleanup() {
  console.log("\nStopping services...");
  if (server) server.kill();
  if (client) client.kill();
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
