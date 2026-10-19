import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ImageAnalyzer } from './engine/image-analyzer.js';
import { CodeSynthesizer } from './engine/code-synthesizer.js';
import { CodeExporter } from './engine/exporter.js';
import { ConversionRequest } from './types.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC_DIR = join(__dirname, '../../public');

export function createVisionCraftServer() {
  const analyzer = new ImageAnalyzer();
  const synthesizer = new CodeSynthesizer();
  const exporter = new CodeExporter();

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    // API: Presets
    if (req.method === 'GET' && pathname === '/api/presets') {
      const presets = synthesizer.getPresets();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, presets }));
      return;
    }

    // API: Convert / Synthesize
    if (req.method === 'POST' && pathname === '/api/convert') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const payload: ConversionRequest = JSON.parse(body || '{}');

          // If preset requested
          if (payload.presetId) {
            const preset = synthesizer.getPresetById(payload.presetId);
            if (!preset) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: 'Preset not found' }));
              return;
            }

            const result = {
              id: `preset-${preset.id}`,
              title: preset.title,
              framework: payload.targetFramework || 'tailwind-html',
              tokens: preset.tokens,
              components: preset.components,
              htmlCode: preset.htmlCode,
              reactCode: preset.reactCode,
              timestamp: Date.now(),
              sourceType: 'preset' as const
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, result }));
            return;
          }

          // If raw screenshot image provided
          if (payload.image) {
            const { tokens, components } = analyzer.analyze(payload.image);
            const result = synthesizer.synthesizeFromTokens(tokens, components, 'image_upload', 'Uploaded Screenshot UI');

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, result }));
            return;
          }

          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Provide image or presetId' }));
        } catch (err: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
      return;
    }

    // API: Export project
    if (req.method === 'POST' && pathname === '/api/export') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          if (!payload.result) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Missing result payload' }));
            return;
          }

          const format = payload.format || 'html';
          if (format === 'react') {
            const files = exporter.exportReactViteProject(payload.result);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, files }));
          } else {
            const html = exporter.exportStandaloneHtml(payload.result);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
          }
        } catch (err: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
      return;
    }

    // Static Asset Delivery
    let filePath = join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
    if (!existsSync(filePath)) {
      filePath = join(PUBLIC_DIR, 'index.html');
    }

    try {
      const content = readFileSync(filePath);
      const ext = extname(filePath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
      };

      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(content);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  return server;
}
