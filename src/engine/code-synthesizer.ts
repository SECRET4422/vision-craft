import { DesignTokens, PresetDefinition, UIComponent, SynthesizedResult } from '../types.js';

export class CodeSynthesizer {
  private presets: Map<string, PresetDefinition> = new Map();

  constructor() {
    this.registerBuiltinPresets();
  }

  public getPresets(): PresetDefinition[] {
    return Array.from(this.presets.values());
  }

  public getPresetById(id: string): PresetDefinition | undefined {
    return this.presets.get(id);
  }

  public synthesizeFromTokens(
    tokens: DesignTokens,
    components: UIComponent[],
    sourceType: 'image_upload' | 'preset' | 'url' = 'image_upload',
    title: string = 'Synthesized Interface'
  ): SynthesizedResult {
    const isDark = tokens.theme === 'dark';
    const bgClass = isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';
    const cardBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200';
    const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

    const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: '${isDark ? 'class' : 'media'}',
      theme: {
        extend: {
          colors: {
            brand: '${tokens.primaryColor}',
            surface: '${tokens.surfaceColor}',
            accent: '${tokens.accentColor}'
          }
        }
      }
    }
  </script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="${bgClass} font-sans min-h-screen antialiased selection:bg-blue-500 selection:text-white">
  
  <!-- Navigation Bar -->
  <nav class="border-b ${isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white/80'} backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
        <i class="fa-solid fa-layer-group text-sm"></i>
      </div>
      <span class="font-bold tracking-tight text-base">${title}</span>
      <span class="text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-950/80 text-blue-400 border border-blue-800/50' : 'bg-blue-50 text-blue-600 border border-blue-200'}">v1.0 Live</span>
    </div>

    <div class="flex items-center space-x-3">
      <div class="relative hidden sm:block">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs ${mutedText}"></i>
        <input type="text" placeholder="Search resources..." class="pl-8 pr-4 py-1.5 text-xs rounded-lg ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-100 border-slate-200 text-slate-800 focus:border-blue-500'} border focus:outline-none transition-colors">
      </div>
      <button class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm">
        <i class="fa-solid fa-plus mr-1.5"></i>Create Action
      </button>
    </div>
  </nav>

  <!-- Main Content Container -->
  <main class="max-w-7xl mx-auto px-6 py-8">
    
    <!-- Hero Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight mb-1">Executive Dashboard</h1>
      <p class="${mutedText} text-sm">Automated live layout synthesized directly from visual telemetry tokens.</p>
    </div>

    <!-- KPI Metric Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="p-5 rounded-xl border ${cardBg} shadow-sm hover:border-blue-500/50 transition-all">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium ${mutedText}">Total Active Pipelines</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">+14.2%</span>
        </div>
        <div class="text-2xl font-bold mb-1">1,284</div>
        <p class="text-xs ${mutedText}">Across 18 autonomous worker nodes</p>
      </div>

      <div class="p-5 rounded-xl border ${cardBg} shadow-sm hover:border-blue-500/50 transition-all">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium ${mutedText}">Execution Latency</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">Optimal</span>
        </div>
        <div class="text-2xl font-bold mb-1">42ms</div>
        <p class="text-xs ${mutedText}">P99 edge response verification</p>
      </div>

      <div class="p-5 rounded-xl border ${cardBg} shadow-sm hover:border-blue-500/50 transition-all">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium ${mutedText}">System Reliability</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">99.98%</span>
        </div>
        <div class="text-2xl font-bold mb-1">0 Critical Faults</div>
        <p class="text-xs ${mutedText}">Zero loop drops in last 24h</p>
      </div>
    </div>

    <!-- Active Tasks Table / Data View -->
    <div class="rounded-xl border ${cardBg} shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} flex items-center justify-between">
        <h2 class="font-semibold text-sm">Active Ingestion Ledger</h2>
        <span class="text-xs ${mutedText}">Real-time sync</span>
      </div>
      <div class="divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}">
        <div class="px-6 py-3.5 flex items-center justify-between hover:${isDark ? 'bg-slate-800/30' : 'bg-slate-50'} transition-colors">
          <div class="flex items-center space-x-3">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <div>
              <div class="text-xs font-medium">LoopBreaker Circuit Radar</div>
              <div class="text-[11px] ${mutedText}">Auto-detected repetition threshold</div>
            </div>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-md ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'} font-mono">200 OK</span>
        </div>

        <div class="px-6 py-3.5 flex items-center justify-between hover:${isDark ? 'bg-slate-800/30' : 'bg-slate-50'} transition-colors">
          <div class="flex items-center space-x-3">
            <span class="w-2 h-2 rounded-full bg-blue-400"></span>
            <div>
              <div class="text-xs font-medium">Token Velocity Meter</div>
              <div class="text-[11px] ${mutedText}">Real-time burn calculation</div>
            </div>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-md ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'} font-mono">ACTIVE</span>
        </div>
      </div>
    </div>

  </main>
</body>
</html>`;

    const reactCode = `import React, { useState } from 'react';

export default function SynthesizedApp() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="${bgClass} min-h-screen font-sans antialiased">
      {/* Navigation */}
      <nav className="border-b ${isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white/80'} backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold">
            ⚡
          </div>
          <span className="font-bold tracking-tight text-base">${title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-950/80 text-blue-400 border border-blue-800/50' : 'bg-blue-50 text-blue-600 border border-blue-200'}">React JSX</span>
        </div>
        <button className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm">
          Action Trigger
        </button>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Interactive Sandbox</h1>
          <p className="${mutedText} text-sm">Compiled directly from UI visual analysis.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded-xl border ${cardBg} shadow-sm">
            <div className="text-xs font-medium ${mutedText} mb-2">Throughput</div>
            <div className="text-2xl font-bold">1,284 req/s</div>
          </div>
          <div className="p-5 rounded-xl border ${cardBg} shadow-sm">
            <div className="text-xs font-medium ${mutedText} mb-2">Latency</div>
            <div className="text-2xl font-bold">42ms</div>
          </div>
          <div className="p-5 rounded-xl border ${cardBg} shadow-sm">
            <div className="text-xs font-medium ${mutedText} mb-2">Availability</div>
            <div className="text-2xl font-bold">99.98%</div>
          </div>
        </div>
      </main>
    </div>
  );
}`;

    return {
      id: `syn-${Date.now()}`,
      title,
      framework: 'tailwind-html',
      tokens,
      components,
      htmlCode,
      reactCode,
      timestamp: Date.now(),
      sourceType
    };
  }

  private registerBuiltinPresets(): void {
    // Preset 1: Linear Dark Mode Dashboard
    this.presets.set('linear-dashboard', {
      id: 'linear-dashboard',
      title: 'Linear Issue Radar',
      category: 'Dashboard',
      description: 'Minimalist dark-mode sprint board with glowing status chips and keyboard-first UI',
      thumbnailSvg: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/></svg>',
      tokens: {
        primaryColor: '#5e6ad2',
        secondaryColor: '#8a94e8',
        backgroundColor: '#0f1015',
        surfaceColor: '#171821',
        textColor: '#f3f4f6',
        mutedTextColor: '#8a8f98',
        borderColor: '#262836',
        accentColor: '#f2994a',
        borderRadius: 'md',
        fontFamily: 'sans',
        theme: 'dark',
        contrastRatio: 16.2
      },
      htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Linear Issue Radar</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-[#0f1015] text-[#f3f4f6] font-sans antialiased min-h-screen flex selection:bg-[#5e6ad2] selection:text-white">
  <!-- Left Sidebar -->
  <aside class="w-60 border-r border-[#262836] bg-[#12131a] p-4 flex flex-col justify-between hidden md:flex">
    <div>
      <div class="flex items-center space-x-2.5 px-2 py-3 mb-6">
        <div class="w-6 h-6 rounded bg-[#5e6ad2] flex items-center justify-center text-xs font-bold">L</div>
        <span class="font-semibold text-sm tracking-tight">AlphaTech Workspace</span>
      </div>
      <nav class="space-y-1 text-xs">
        <a href="#" class="flex items-center space-x-2.5 px-3 py-2 rounded-md bg-[#222433] text-white font-medium"><i class="fa-solid fa-inbox text-[#8a94e8]"></i><span>Inbox</span><span class="ml-auto text-[10px] bg-[#5e6ad2]/20 text-[#8a94e8] px-1.5 py-0.5 rounded">3</span></a>
        <a href="#" class="flex items-center space-x-2.5 px-3 py-2 rounded-md text-[#8a8f98] hover:text-white hover:bg-[#1a1b24] transition-colors"><i class="fa-solid fa-layer-group"></i><span>My Issues</span></a>
        <a href="#" class="flex items-center space-x-2.5 px-3 py-2 rounded-md text-[#8a8f98] hover:text-white hover:bg-[#1a1b24] transition-colors"><i class="fa-solid fa-diagram-project"></i><span>Roadmap</span></a>
      </nav>
    </div>
    <div class="text-[11px] text-[#8a8f98] px-2 flex items-center justify-between border-t border-[#262836] pt-3">
      <span>Sprint 42</span>
      <span class="text-emerald-400 font-mono">84% Done</span>
    </div>
  </aside>

  <!-- Main View -->
  <main class="flex-1 flex flex-col min-w-0">
    <header class="h-14 border-b border-[#262836] px-6 flex items-center justify-between bg-[#12131a]/60 backdrop-blur-md">
      <div class="flex items-center space-x-3 text-xs">
        <span class="text-[#8a8f98]">AlphaTech</span>
        <span class="text-[#262836]">/</span>
        <span class="font-medium text-white">Active Cycle Issues</span>
      </div>
      <button class="px-3 py-1.5 rounded-md bg-[#5e6ad2] hover:bg-[#4f5ac4] text-white text-xs font-medium transition-colors shadow-sm shadow-[#5e6ad2]/30">
        <i class="fa-solid fa-plus mr-1"></i>New Issue
      </button>
    </header>

    <div class="p-6 max-w-5xl">
      <div class="space-y-2">
        <div class="p-3.5 rounded-lg border border-[#262836] bg-[#171821] hover:border-[#5e6ad2]/60 transition-colors flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="text-[#f2994a] text-xs"><i class="fa-solid fa-circle-dot"></i></span>
            <span class="text-xs font-mono text-[#8a8f98]">ENG-204</span>
            <span class="text-xs font-medium text-white">Intercept recursive agent test failure loops</span>
          </div>
          <div class="flex items-center space-x-2 text-[11px]">
            <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">High</span>
            <span class="text-[#8a8f98]">Prabhakar</span>
          </div>
        </div>

        <div class="p-3.5 rounded-lg border border-[#262836] bg-[#171821] hover:border-[#5e6ad2]/60 transition-colors flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="text-[#8a94e8] text-xs"><i class="fa-solid fa-spinner"></i></span>
            <span class="text-xs font-mono text-[#8a8f98]">ENG-205</span>
            <span class="text-xs font-medium text-white">Synthesize 1:1 pixel ghost diff overlay slider</span>
          </div>
          <div class="flex items-center space-x-2 text-[11px]">
            <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">In Progress</span>
            <span class="text-[#8a8f98]">Alpha</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`,
      reactCode: `import React from 'react';

export default function LinearRadar() {
  return (
    <div className="bg-[#0f1015] text-[#f3f4f6] font-sans min-h-screen flex">
      <aside className="w-60 border-r border-[#262836] bg-[#12131a] p-4 hidden md:block">
        <div className="font-semibold text-sm mb-6">AlphaTech Studio</div>
        <div className="text-xs text-[#8a8f98]">Active Cycle · 84% Complete</div>
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-xl font-bold mb-4">Linear Radar</h1>
        <div className="p-4 rounded-lg bg-[#171821] border border-[#262836]">
          <span className="text-xs text-amber-400">ENG-204</span> Intercept recursive loops
        </div>
      </main>
    </div>
  );
}`,
      components: [
        { id: 'sidebar', type: 'sidebar', label: 'Navigation Workspace Tree', classes: 'w-60 border-r border-[#262836]' },
        { id: 'table', type: 'table', label: 'Cycle Issues Ledger', classes: 'space-y-2' }
      ]
    });

    // Preset 2: Stripe Billing Checkout Form
    this.presets.set('stripe-checkout', {
      id: 'stripe-checkout',
      title: 'Stripe Global Checkout',
      category: 'Fintech',
      description: 'Ultra-clean fintech billing portal with Apple Pay integration and order ledger',
      thumbnailSvg: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
      tokens: {
        primaryColor: '#635bff',
        secondaryColor: '#0a2540',
        backgroundColor: '#f8fafc',
        surfaceColor: '#ffffff',
        textColor: '#0a2540',
        mutedTextColor: '#425466',
        borderColor: '#e3e8ee',
        accentColor: '#00d924',
        borderRadius: 'lg',
        fontFamily: 'sans',
        theme: 'light',
        contrastRatio: 17.5
      },
      htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Stripe Global Checkout</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-[#f8fafc] text-[#0a2540] font-sans antialiased min-h-screen py-10 px-4">
  <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
    <!-- Order Summary -->
    <div class="p-6 md:p-8">
      <div class="flex items-center space-x-2 text-sm text-[#425466] mb-6">
        <i class="fa-solid fa-arrow-left text-xs"></i>
        <span>AlphaTech Studio</span>
      </div>
      <div class="text-xs uppercase tracking-wider text-[#425466] font-semibold mb-1">Subscribe to</div>
      <h1 class="text-2xl font-bold mb-4">Enterprise Agent Fleet</h1>
      <div class="text-4xl font-extrabold mb-6">$199<span class="text-base font-normal text-[#425466]">/mo</span></div>
      
      <div class="space-y-3 border-t border-[#e3e8ee] pt-6 text-xs">
        <div class="flex justify-between text-[#425466]">
          <span>Autonomous agent telemetry nodes</span>
          <span class="font-medium text-[#0a2540]">$199.00</span>
        </div>
        <div class="flex justify-between text-[#425466]">
          <span>LoopBreaker circuit breaker license</span>
          <span class="text-[#00d924] font-semibold">Included</span>
        </div>
        <div class="flex justify-between font-bold text-sm border-t border-[#e3e8ee] pt-3 text-[#0a2540]">
          <span>Total due today</span>
          <span>$199.00</span>
        </div>
      </div>
    </div>

    <!-- Payment Form -->
    <div class="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-[#e3e8ee]">
      <button class="w-full py-3 rounded-lg bg-black text-white font-medium text-xs flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors mb-4">
        <i class="fa-brands fa-apple text-base"></i>
        <span>Pay with Apple Pay</span>
      </button>

      <div class="flex items-center my-4 text-xs text-[#425466]">
        <div class="flex-1 border-t border-[#e3e8ee]"></div>
        <span class="px-3">or pay with card</span>
        <div class="flex-1 border-t border-[#e3e8ee]"></div>
      </div>

      <form class="space-y-4 text-xs" onsubmit="event.preventDefault()">
        <div>
          <label class="block font-medium mb-1">Email</label>
          <input type="email" value="prabhakar@alphatech.studio" class="w-full px-3 py-2 rounded-lg border border-[#e3e8ee] focus:border-[#635bff] focus:outline-none">
        </div>
        <div>
          <label class="block font-medium mb-1">Card Information</label>
          <input type="text" placeholder="1234 1234 1234 1234" class="w-full px-3 py-2 rounded-t-lg border border-[#e3e8ee] focus:border-[#635bff] focus:outline-none font-mono">
          <div class="grid grid-cols-2">
            <input type="text" placeholder="MM / YY" class="px-3 py-2 rounded-bl-lg border-t-0 border-r-0 border border-[#e3e8ee] focus:border-[#635bff] focus:outline-none font-mono">
            <input type="text" placeholder="CVC" class="px-3 py-2 rounded-br-lg border-t-0 border border-[#e3e8ee] focus:border-[#635bff] focus:outline-none font-mono">
          </div>
        </div>
        <button class="w-full py-3 rounded-lg bg-[#635bff] hover:bg-[#534acb] text-white font-semibold text-xs transition-colors shadow-md shadow-[#635bff]/20">
          Subscribe Now · $199.00
        </button>
      </form>
    </div>
  </div>
</body>
</html>`,
      reactCode: `import React from 'react';

export default function StripeCheckout() {
  return (
    <div className="bg-[#f8fafc] text-[#0a2540] min-h-screen p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-[#e3e8ee] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Enterprise Agent Fleet</h2>
        <div className="text-3xl font-extrabold mb-4">$199<span className="text-sm font-normal">/mo</span></div>
        <button className="w-full py-2.5 rounded-lg bg-[#635bff] text-white font-semibold text-sm">
          Pay $199.00
        </button>
      </div>
    </div>
  );
}`,
      components: [
        { id: 'summary', type: 'card', label: 'Order Line Item Summary', classes: 'p-6' },
        { id: 'form', type: 'form', label: 'Payment Gateway Form', classes: 'bg-white p-8 rounded-2xl' }
      ]
    });

    // Preset 3: Glassmorphic Cyberpunk AI Agent Terminal
    this.presets.set('ai-agent-terminal', {
      id: 'ai-agent-terminal',
      title: 'Glassmorphic Agent Terminal',
      category: 'AI & Developer',
      description: 'Futuristic real-time telemetry HUD with prompt stream and killswitch controls',
      thumbnailSvg: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
      tokens: {
        primaryColor: '#00f2fe',
        secondaryColor: '#4facfe',
        backgroundColor: '#05070e',
        surfaceColor: '#0a0f1d',
        textColor: '#e0f2fe',
        mutedTextColor: '#64748b',
        borderColor: '#1e293b',
        accentColor: '#10b981',
        borderRadius: 'xl',
        fontFamily: 'mono',
        theme: 'dark',
        contrastRatio: 18.1
      },
      htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Agent Terminal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-[#05070e] text-[#e0f2fe] font-mono antialiased min-h-screen p-6">
  <div class="max-w-5xl mx-auto border border-cyan-500/20 rounded-2xl bg-[#0a0f1d]/80 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between bg-black/40">
      <div class="flex items-center space-x-3">
        <span class="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
        <span class="font-bold text-sm tracking-wider text-cyan-400">AGENT-01 // COCKPIT_ACTIVE</span>
      </div>
      <div class="flex items-center space-x-3 text-xs">
        <span class="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">CIRCUIT: CLOSED</span>
        <button class="px-3 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-[11px] font-bold">EMERGENCY KILL</button>
      </div>
    </div>

    <!-- Terminal Feed -->
    <div class="p-6 space-y-3 text-xs leading-relaxed">
      <div class="text-cyan-400/70">> Initializing heuristic image visual parser...</div>
      <div class="text-slate-400">> Dominant background sampled at #05070e (Luminance: 0.04)</div>
      <div class="text-emerald-400">> 5 Layout tokens identified. Synthesizing Tailwind responsive grid...</div>
      <div class="p-4 rounded-xl bg-black/50 border border-cyan-500/10 text-slate-300">
        <div class="text-cyan-400 font-semibold mb-1">EXECUTION STATE:</div>
        <div>Generating side-by-side Ghost Diff visual overlay at 60 FPS.</div>
      </div>
    </div>
  </div>
</body>
</html>`,
      reactCode: `import React from 'react';

export default function AgentTerminal() {
  return (
    <div className="bg-[#05070e] text-cyan-400 font-mono p-6 min-h-screen">
      <div className="border border-cyan-500/20 p-6 rounded-xl bg-[#0a0f1d]">
        <h1 className="text-lg font-bold mb-4">AGENT-01 // TELEMETRY HUD</h1>
        <p className="text-xs text-slate-400">> System operational. Ghost diff active.</p>
      </div>
    </div>
  );
}`,
      components: [
        { id: 'terminal-header', type: 'navbar', label: 'Agent Status Header', classes: 'px-6 py-4' },
        { id: 'terminal-body', type: 'card', label: 'Live Stream Console', classes: 'p-6 space-y-3' }
      ]
    });

    // Preset 4: Modern SaaS Hero Landing Page
    this.presets.set('saas-landing', {
      id: 'saas-landing',
      title: 'SaaS Launchpad Hero',
      category: 'Marketing',
      description: 'High-converting gradient badge hero section with call-to-action buttons and feature cards',
      thumbnailSvg: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      tokens: {
        primaryColor: '#4f46e5',
        secondaryColor: '#06b6d4',
        backgroundColor: '#ffffff',
        surfaceColor: '#f8fafc',
        textColor: '#0f172a',
        mutedTextColor: '#64748b',
        borderColor: '#e2e8f0',
        accentColor: '#10b981',
        borderRadius: 'xl',
        fontFamily: 'sans',
        theme: 'light',
        contrastRatio: 16.8
      },
      htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SaaS Launchpad</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-white text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
  <div class="relative overflow-hidden pt-16 pb-24 px-6 text-center max-w-5xl mx-auto">
    <!-- Glow pill badge -->
    <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-semibold mb-6">
      <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
      <span>Introducing VisionCraft v1.0</span>
    </div>
    
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
      Turn any UI screenshot into <span class="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">production code</span> in seconds.
    </h1>

    <p class="text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-8">
      Drop your design mockup, Figma frame, or dashboard clip. Get instant semantic Tailwind CSS, real-time live sandbox execution, and pixel ghost diffs.
    </p>

    <div class="flex items-center justify-center space-x-4 mb-16">
      <button class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-500/25">
        Start Free in Browser
      </button>
      <button class="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors">
        View GitHub Repo
      </button>
    </div>

    <!-- Feature Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
      <div class="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
        <div class="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-4">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <h3 class="font-bold text-sm mb-1">Zero-Prompt Generation</h3>
        <p class="text-xs text-slate-600">Extracts typography, spacing, and palettes automatically without prompt tuning.</p>
      </div>

      <div class="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
        <div class="w-10 h-10 rounded-xl bg-cyan-600/10 text-cyan-600 flex items-center justify-center mb-4">
          <i class="fa-solid fa-code-compare"></i>
        </div>
        <h3 class="font-bold text-sm mb-1">Ghost Diff Slider</h3>
        <p class="text-xs text-slate-600">Drag to inspect 1:1 pixel accuracy between uploaded screenshot and live rendered DOM.</p>
      </div>

      <div class="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
        <div class="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center mb-4">
          <i class="fa-solid fa-bolt"></i>
        </div>
        <h3 class="font-bold text-sm mb-1">Instant Export</h3>
        <p class="text-xs text-slate-600">Download single-file production HTML or modular React Vite boilerplate in one click.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
      reactCode: `import React from 'react';

export default function SaasLanding() {
  return (
    <div className="bg-white text-slate-900 text-center py-20 px-6">
      <h1 className="text-4xl font-extrabold mb-4">Turn screenshots into code</h1>
      <p className="text-slate-600 max-w-lg mx-auto mb-6">Zero prompt friction. 1-click live execution.</p>
      <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium">Launch Sandbox</button>
    </div>
  );
}`,
      components: [
        { id: 'hero', type: 'hero', label: 'Main Value Prop Hero', classes: 'pt-16 pb-24 text-center' },
        { id: 'features', type: 'stats-grid', label: 'Core Features Grid', classes: 'grid grid-cols-1 md:grid-cols-3 gap-6' }
      ]
    });

    // Preset 5: Neomorphic Crypto Portfolio Tracker
    this.presets.set('crypto-portfolio', {
      id: 'crypto-portfolio',
      title: 'Apex Crypto Vault',
      category: 'Web3',
      description: 'High-contrast portfolio tracker with live market tickers and SVG mini sparkline graphs',
      thumbnailSvg: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      tokens: {
        primaryColor: '#10b981',
        secondaryColor: '#f59e0b',
        backgroundColor: '#0b0f19',
        surfaceColor: '#111827',
        textColor: '#f9fafb',
        mutedTextColor: '#9ca3af',
        borderColor: '#1f2937',
        accentColor: '#3b82f6',
        borderRadius: 'xl',
        fontFamily: 'sans',
        theme: 'dark',
        contrastRatio: 17.2
      },
      htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Apex Crypto Vault</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-[#0b0f19] text-[#f9fafb] font-sans antialiased min-h-screen p-6">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="p-6 rounded-2xl bg-[#111827] border border-[#1f2937] flex items-center justify-between">
      <div>
        <div class="text-xs text-[#9ca3af] mb-1">Total Net Asset Value</div>
        <div class="text-3xl font-extrabold">$142,890.45</div>
      </div>
      <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
        +8.45% 24h
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-5 rounded-2xl bg-[#111827] border border-[#1f2937]">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">₿</div>
            <div>
              <div class="text-xs font-bold">Bitcoin</div>
              <div class="text-[11px] text-[#9ca3af]">BTC</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs font-bold">$98,420.00</div>
            <div class="text-[11px] text-emerald-400">+4.12%</div>
          </div>
        </div>
        <!-- Sparkline SVG -->
        <svg class="w-full h-12 text-emerald-400 stroke-current fill-none" viewBox="0 0 100 25">
          <polyline stroke-width="2" points="0,20 20,18 40,12 60,15 80,6 100,2" />
        </svg>
      </div>

      <div class="p-5 rounded-2xl bg-[#111827] border border-[#1f2937]">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">Ξ</div>
            <div>
              <div class="text-xs font-bold">Ethereum</div>
              <div class="text-[11px] text-[#9ca3af]">ETH</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs font-bold">$3,840.50</div>
            <div class="text-[11px] text-emerald-400">+6.80%</div>
          </div>
        </div>
        <!-- Sparkline SVG -->
        <svg class="w-full h-12 text-emerald-400 stroke-current fill-none" viewBox="0 0 100 25">
          <polyline stroke-width="2" points="0,22 25,19 50,14 75,8 100,4" />
        </svg>
      </div>
    </div>
  </div>
</body>
</html>`,
      reactCode: `import React from 'react';

export default function CryptoVault() {
  return (
    <div className="bg-[#0b0f19] text-[#f9fafb] p-6 min-h-screen">
      <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#111827] border border-[#1f2937]">
        <div className="text-xs text-slate-400">Total Balance</div>
        <div className="text-2xl font-bold mb-4">$142,890.45</div>
      </div>
    </div>
  );
}`,
      components: [
        { id: 'balance-card', type: 'card', label: 'Net Asset Value Banner', classes: 'p-6 rounded-2xl' },
        { id: 'crypto-grid', type: 'stats-grid', label: 'Live Crypto Tickers', classes: 'grid grid-cols-1 md:grid-cols-2 gap-6' }
      ]
    });
  }
}
