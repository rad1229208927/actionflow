import http from 'http';
import fs from 'fs-extra';
import path from 'path';
import { load } from 'js-yaml';
import { generateWorkflowHTML } from './html-preview.js';

interface PreviewServerOptions {
  port?: number;
  file?: string;
  open?: boolean;
}

/**
 * Start a local web server to preview workflow
 */
export async function startPreviewServer(options: PreviewServerOptions): Promise<void> {
  const port = options.port || 3000;
  const file = options.file;
  
  if (!file) {
    console.log('❌ Please specify a workflow file');
    return;
  }
  
  // Read workflow
  const content = await fs.readFile(file, 'utf-8');
  const workflow = load(content);
  
  // Generate HTML
  const html = generateWorkflowHTML(workflow);
  
  // Create server
  const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/preview') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else if (req.url === '/api/workflow') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(workflow, null, 2));
    } else if (req.url === '/api/raw') {
      res.writeHead(200, { 'Content-Type': 'text/yaml' });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  
  server.listen(port, () => {
    console.log(`\n🌐 ActionFlow Preview Server`);
    console.log(`   http://localhost:${port}`);
    console.log(`\n📊 API Endpoints:`);
    console.log(`   GET /          - HTML Preview`);
    console.log(`   GET /api/workflow - JSON`);
    console.log(`   GET /api/raw   - YAML`);
    console.log(`\n💡 Press Ctrl+C to stop\n`);
    
    // Auto open in browser
    if (options.open) {
      const { exec } = await import('child_process');
      exec(`open http://localhost:${port}`);
    }
  });
  
  // Handle shutdown
  process.on('SIGINT', () => {
    server.close(() => {
      console.log('\n👋 Server stopped');
      process.exit(0);
    });
  });
}
