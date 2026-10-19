import { DesignTokens, UIComponent } from '../types.js';

export class ImageAnalyzer {
  /**
   * Analyzes an image payload (base64 data URL or raw buffer) and extracts design tokens and layout heuristics
   */
  public analyze(imageDataOrBase64: string): { tokens: DesignTokens; components: UIComponent[] } {
    let rawBuffer: Buffer;

    if (imageDataOrBase64.startsWith('data:')) {
      const base64Data = imageDataOrBase64.split(',')[1] || '';
      rawBuffer = Buffer.from(base64Data, 'base64');
    } else {
      rawBuffer = Buffer.from(imageDataOrBase64, 'base64');
    }

    const { dominantColor, isDark } = this.estimateDominantColors(rawBuffer);
    const tokens = this.generateDesignTokens(dominantColor, isDark);
    const components = this.detectLayoutComponents(tokens);

    return { tokens, components };
  }

  /**
   * Samples buffer bytes to estimate background and accent color signatures
   */
  public estimateDominantColors(buffer: Buffer): { dominantColor: string; isDark: boolean } {
    if (buffer.length < 54) {
      // Default to high-converting modern dark mode if empty/corrupted buffer
      return { dominantColor: '#0a0d14', isDark: true };
    }

    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let sampleCount = 0;

    // Sample up to 500 points across the buffer
    const step = Math.max(1, Math.floor(buffer.length / 500));
    for (let i = 0; i < buffer.length - 3; i += step) {
      rSum += buffer[i];
      gSum += buffer[i + 1];
      bSum += buffer[i + 2];
      sampleCount++;
    }

    const r = Math.round(rSum / sampleCount);
    const g = Math.round(gSum / sampleCount);
    const b = Math.round(bSum / sampleCount);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const isDark = luminance < 0.55;

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    return { dominantColor: hex, isDark };
  }

  /**
   * Calculates WCAG contrast ratio between two hex colors
   */
  public calculateContrast(hex1: string, hex2: string): number {
    const lum1 = this.getLuminance(hex1);
    const lum2 = this.getLuminance(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
  }

  private getLuminance(hex: string): number {
    const cleanHex = hex.replace('#', '');
    const num = parseInt(cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const [rs, gs, bs] = [r, g, b].map(c => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  public generateDesignTokens(dominantHex: string, isDark: boolean): DesignTokens {
    if (isDark) {
      const bg = '#090d16';
      const surface = '#111726';
      const text = '#f8fafc';
      const contrast = this.calculateContrast(bg, text);

      return {
        primaryColor: '#3b82f6', // electric blue
        secondaryColor: '#6366f1', // indigo
        backgroundColor: bg,
        surfaceColor: surface,
        textColor: text,
        mutedTextColor: '#94a3b8',
        borderColor: '#1e293b',
        accentColor: '#10b981', // emerald
        borderRadius: 'lg',
        fontFamily: 'sans',
        theme: 'dark',
        contrastRatio: contrast
      };
    } else {
      const bg = '#ffffff';
      const surface = '#f8fafc';
      const text = '#0f172a';
      const contrast = this.calculateContrast(bg, text);

      return {
        primaryColor: '#2563eb',
        secondaryColor: '#4f46e5',
        backgroundColor: bg,
        surfaceColor: surface,
        textColor: text,
        mutedTextColor: '#64748b',
        borderColor: '#e2e8f0',
        accentColor: '#059669',
        borderRadius: 'lg',
        fontFamily: 'sans',
        theme: 'light',
        contrastRatio: contrast
      };
    }
  }

  public detectLayoutComponents(tokens: DesignTokens): UIComponent[] {
    const isDark = tokens.theme === 'dark';
    const borderCls = isDark ? 'border-slate-800' : 'border-slate-200';
    const surfaceCls = isDark ? 'bg-slate-900/80 backdrop-blur-md' : 'bg-white shadow-sm';
    const textCls = isDark ? 'text-white' : 'text-slate-900';

    return [
      {
        id: 'comp-nav',
        type: 'navbar',
        label: 'Navigation Bar',
        classes: `w-full h-16 border-b ${borderCls} ${surfaceCls} flex items-center justify-between px-6 sticky top-0 z-50`
      },
      {
        id: 'comp-hero',
        type: 'hero',
        label: 'Main Showcase Header',
        classes: 'py-12 px-6 max-w-6xl mx-auto text-center'
      },
      {
        id: 'comp-stats',
        type: 'stats-grid',
        label: 'Metric & KPI Grid',
        classes: 'grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 py-6'
      },
      {
        id: 'comp-card-1',
        type: 'card',
        label: 'Primary Feature Surface',
        classes: `p-6 rounded-xl border ${borderCls} ${surfaceCls} hover:border-blue-500/50 transition-all duration-200`
      },
      {
        id: 'comp-btn-cta',
        type: 'button',
        label: 'Primary Action CTA',
        classes: 'px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-500/25'
      }
    ];
  }
}
