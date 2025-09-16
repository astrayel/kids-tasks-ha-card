#!/usr/bin/env node
// Watch and deploy script for Home Assistant development

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Configuration
const HA_PATHS = [
  // Common Home Assistant paths - update these for your setup
  'C:\\config\\www\\local\\kids-tasks-card-dev.js',
  '/config/www/local/kids-tasks-card-dev.js',
  '/usr/share/hassio/homeassistant/www/local/kids-tasks-card-dev.js',
  // Add your specific HA path here
];

let deployPath = null;

// Find valid deployment path
for (const haPath of HA_PATHS) {
  const dir = path.dirname(haPath);
  if (fs.existsSync(dir)) {
    deployPath = haPath;
    console.log(`✅ Found HA deployment path: ${deployPath}`);
    break;
  }
}

if (!deployPath) {
  console.log('⚠️  No Home Assistant path found, deploying to local dist only');
  console.log('   Update HA_PATHS in this script with your HA www directory');
}

// Watch for changes and deploy
function deployToBuildLocations() {
  const sourcePath = path.join(projectRoot, 'dist', 'kids-tasks-card.dev.js');
  
  if (!fs.existsSync(sourcePath)) {
    console.log('⚠️  Development build not found, make sure build is running');
    return;
  }
  
  if (deployPath) {
    try {
      fs.copyFileSync(sourcePath, deployPath);
      console.log(`🚀 Deployed to HA: ${deployPath}`);
    } catch (error) {
      console.error('❌ Failed to deploy to HA:', error.message);
    }
  }
}

// Watch for file changes in dist directory
if (fs.existsSync(path.join(projectRoot, 'dist'))) {
  fs.watch(path.join(projectRoot, 'dist'), (eventType, filename) => {
    if (filename === 'kids-tasks-card.dev.js') {
      console.log('📦 Development build updated, deploying...');
      setTimeout(deployToBuildLocations, 100); // Small delay to ensure file write is complete
    }
  });
  
  console.log('👀 Watching for build changes...');
  console.log('💡 Run "npm run dev" in another terminal to start the build watcher');
} else {
  console.log('⚠️  Dist directory not found, run "npm run build:dev" first');
}

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\\n🛑 Watch script stopped');
  process.exit(0);
});