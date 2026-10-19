#!/usr/bin/env node

import { createVisionCraftServer } from '../dist/src/server.js';
import { exec } from 'node:child_process';

const args = process.argv.slice(2);
let port = 5050;
let autoOpen = true;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '-p' || args[i] === '--port') {
    port = parseInt(args[i + 1], 10) || 5050;
    i++;
  } else if (args[i] === '--no-open') {
    autoOpen = false;
  } else if (args[i] === '-h' || args[i] === '--help') {
    console.log(`
  ⚡ VisionCraft - Screenshot-to-Fullstack Live Sandbox Engine

  Usage:
    npx @ssgk4422/vision-craft [options]
    vision-craft [options]

  Options:
    -p, --port <number>    Port to listen on (default: 5050)
    --no-open              Do not automatically open browser on start
    -h, --help             Show this help guide

  Examples:
    npx @ssgk4422/vision-craft
    npx @ssgk4422/vision-craft --port 8080
  `);
    process.exit(0);
  }
}

const server = createVisionCraftServer();

server.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`
  ╔════════════════════════════════════════════════════════════════╗
  ║                                                                ║
  ║   ⚡  V I S I O N C R A F T   v1.0.0                          ║
  ║   Screenshot-to-Fullstack Live Sandbox Engine                  ║
  ║                                                                ║
  ╚════════════════════════════════════════════════════════════════╝

  🛰️  Live Sandbox Studio: ${url}
  🎨  Presets Available:   Linear, Stripe, Cyberpunk Terminal, SaaS, Web3
  🔍  Ghost Diff Overlay:  Active (1:1 Pixel Accuracy Verification)
  ⚡  Runtime:             Zero npm runtime dependencies

  Press Ctrl+C to stop studio server.
  `);

  if (autoOpen) {
    const startCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${startCmd} ${url}`);
  }
});
