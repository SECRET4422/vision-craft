import { SynthesizedResult } from '../types.js';

export class CodeExporter {
  /**
   * Bundles the synthesized result into a complete standalone production HTML file
   */
  public exportStandaloneHtml(result: SynthesizedResult): string {
    return result.htmlCode;
  }

  /**
   * Generates a virtual React Vite application structure
   */
  public exportReactViteProject(result: SynthesizedResult): Record<string, string> {
    const packageJson = JSON.stringify(
      {
        name: result.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        private: true,
        version: '0.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview'
        },
        dependencies: {
          react: '^18.3.1',
          'react-dom': '^18.3.1'
        },
        devDependencies: {
          '@types/react': '^18.3.3',
          '@types/react-dom': '^18.3.0',
          '@vitejs/plugin-react': '^4.3.1',
          autoprefixer: '^10.4.19',
          postcss: '^8.4.38',
          tailwindcss: '^3.4.4',
          vite: '^5.3.1'
        }
      },
      null,
      2
    );

    const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;

    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

    const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${result.title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

    const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;

    const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

    return {
      'package.json': packageJson,
      'vite.config.js': viteConfig,
      'tailwind.config.js': tailwindConfig,
      'index.html': indexHtml,
      'src/main.jsx': mainJsx,
      'src/index.css': indexCss,
      'src/App.jsx': result.reactCode
    };
  }
}
