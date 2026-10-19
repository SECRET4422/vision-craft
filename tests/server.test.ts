import test from 'node:test';
import assert from 'node:assert';
import { createVisionCraftServer } from '../src/server.js';
import { AddressInfo } from 'node:net';

test('VisionCraft Server - responds to REST endpoints and closes cleanly', async () => {
  const server = createVisionCraftServer();

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    // 1. Test GET /api/presets
    const presetsRes = await fetch(`${baseUrl}/api/presets`, {
      headers: { 'Connection': 'close' }
    });
    assert.strictEqual(presetsRes.status, 200);
    const presetsData = await presetsRes.json();
    assert.strictEqual(presetsData.success, true);
    assert.strictEqual(presetsData.presets.length, 5);

    // 2. Test POST /api/convert with preset
    const convertPresetRes = await fetch(`${baseUrl}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'close'
      },
      body: JSON.stringify({ presetId: 'linear-dashboard' })
    });
    assert.strictEqual(convertPresetRes.status, 200);
    const convertData = await convertPresetRes.json();
    assert.strictEqual(convertData.success, true);
    assert.strictEqual(convertData.result.title, 'Linear Issue Radar');

    // 3. Test POST /api/export with HTML format
    const exportRes = await fetch(`${baseUrl}/api/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'close'
      },
      body: JSON.stringify({ result: convertData.result, format: 'html' })
    });
    assert.strictEqual(exportRes.status, 200);
    const exportedHtml = await exportRes.text();
    assert.ok(exportedHtml.includes('<!DOCTYPE html>'));

    // 4. Test POST /api/export with React format
    const exportReactRes = await fetch(`${baseUrl}/api/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'close'
      },
      body: JSON.stringify({ result: convertData.result, format: 'react' })
    });
    assert.strictEqual(exportReactRes.status, 200);
    const exportReactData = await exportReactRes.json();
    assert.strictEqual(exportReactData.success, true);
    assert.ok(exportReactData.files['src/App.jsx']);

  } finally {
    // Teardown
    (server as any).closeAllConnections?.();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
