export interface DesignTokens {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  accentColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  fontFamily: 'sans' | 'mono' | 'serif';
  theme: 'dark' | 'light';
  contrastRatio: number;
}

export interface UIComponent {
  id: string;
  type: 'navbar' | 'hero' | 'card' | 'form' | 'table' | 'button' | 'badge' | 'sidebar' | 'stats-grid';
  label: string;
  classes: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SynthesizedResult {
  id: string;
  title: string;
  framework: 'tailwind-html' | 'react-tailwind';
  tokens: DesignTokens;
  components: UIComponent[];
  htmlCode: string;
  reactCode: string;
  timestamp: number;
  sourceType: 'image_upload' | 'preset' | 'url';
}

export interface PresetDefinition {
  id: string;
  title: string;
  category: 'Dashboard' | 'Fintech' | 'AI & Developer' | 'Marketing' | 'Web3';
  description: string;
  thumbnailSvg: string;
  tokens: DesignTokens;
  htmlCode: string;
  reactCode: string;
  components: UIComponent[];
}

export interface ConversionRequest {
  image?: string; // base64 data URL
  presetId?: string;
  targetFramework?: 'tailwind-html' | 'react-tailwind';
  promptRefinement?: string;
}
