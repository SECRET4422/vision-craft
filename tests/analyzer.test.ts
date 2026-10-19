import test from 'node:test';
import assert from 'node:assert';
import { ImageAnalyzer } from '../src/engine/image-analyzer.js';

test('ImageAnalyzer - extracts tokens from buffer and calculates contrast', () => {
  const analyzer = new ImageAnalyzer();

  // Test WCAG contrast
  const contrastDark = analyzer.calculateContrast('#000000', '#ffffff');
  assert.ok(contrastDark >= 20, 'Black/White contrast should be >= 20:1');

  // Test dominant color detection with mock dark buffer
  const darkBuf = Buffer.alloc(100, 15); // near black
  const { dominantColor, isDark } = analyzer.estimateDominantColors(darkBuf);
  assert.strictEqual(isDark, true);
  assert.ok(dominantColor.startsWith('#'));

  // Test token generation
  const tokens = analyzer.generateDesignTokens(dominantColor, isDark);
  assert.strictEqual(tokens.theme, 'dark');
  assert.ok(tokens.contrastRatio > 4.5, 'Tokens must meet WCAG AA');
  assert.strictEqual(tokens.borderRadius, 'lg');
});

test('ImageAnalyzer - analyzes base64 data URL', () => {
  const analyzer = new ImageAnalyzer();
  // Simple 1x1 png base64
  const mockBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkWPjfDwAEeQHzfao84gAAAABJRU5ErkJggg==';

  const { tokens, components } = analyzer.analyze(mockBase64);
  assert.ok(tokens);
  assert.ok(tokens.primaryColor);
  assert.ok(components.length >= 3);
  assert.strictEqual(components[0].type, 'navbar');
});
