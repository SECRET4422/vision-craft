import test from 'node:test';
import assert from 'node:assert';
import { CodeSynthesizer } from '../src/engine/code-synthesizer.js';
import { CodeExporter } from '../src/engine/exporter.js';

test('CodeSynthesizer - registers all 5 flagship presets', () => {
  const synthesizer = new CodeSynthesizer();
  const presets = synthesizer.getPresets();
  assert.strictEqual(presets.length, 5);

  const presetIds = presets.map(p => p.id);
  assert.ok(presetIds.includes('linear-dashboard'));
  assert.ok(presetIds.includes('stripe-checkout'));
  assert.ok(presetIds.includes('ai-agent-terminal'));
  assert.ok(presetIds.includes('saas-landing'));
  assert.ok(presetIds.includes('crypto-portfolio'));
});

test('CodeSynthesizer - synthesizes clean HTML and React from design tokens', () => {
  const synthesizer = new CodeSynthesizer();
  const linear = synthesizer.getPresetById('linear-dashboard');
  assert.ok(linear);

  const result = synthesizer.synthesizeFromTokens(linear.tokens, linear.components, 'preset', 'Test UI');
  assert.ok(result.htmlCode.includes('<!DOCTYPE html>'));
  assert.ok(result.htmlCode.includes('cdn.tailwindcss.com'));
  assert.ok(result.reactCode.includes('export default function SynthesizedApp()'));
});

test('CodeExporter - generates standalone HTML and React Vite file tree', () => {
  const synthesizer = new CodeSynthesizer();
  const exporter = new CodeExporter();
  const linear = synthesizer.getPresetById('linear-dashboard');
  assert.ok(linear);

  const result = synthesizer.synthesizeFromTokens(linear.tokens, linear.components);
  const standaloneHtml = exporter.exportStandaloneHtml(result);
  assert.ok(standaloneHtml.startsWith('<!DOCTYPE html>'));

  const reactFiles = exporter.exportReactViteProject(result);
  assert.ok(reactFiles['package.json']);
  assert.ok(reactFiles['vite.config.js']);
  assert.ok(reactFiles['src/App.jsx']);
  assert.ok(reactFiles['src/main.jsx']);
});
