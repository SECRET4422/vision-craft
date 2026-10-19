// VisionCraft Live Sandbox Studio Client Logic

let currentResult = null;
let currentFramework = 'tailwind-html';
let presets = [];

// DOM References
const presetSelect = document.getElementById('presetSelect');
const btnDesktop = document.getElementById('btnDesktop');
const btnTablet = document.getElementById('btnTablet');
const btnMobile = document.getElementById('btnMobile');
const ghostToggle = document.getElementById('ghostToggle');
const ghostOpacity = document.getElementById('ghostOpacity');
const ghostPercent = document.getElementById('ghostPercent');
const ghostOverlay = document.getElementById('ghostOverlay');
const frameWrapper = document.getElementById('frameWrapper');
const sandboxIframe = document.getElementById('sandboxIframe');
const referenceImage = document.getElementById('referenceImage');
const dropZoneOverlay = document.getElementById('dropZoneOverlay');
const imageUploadInput = document.getElementById('imageUploadInput');
const codeDrawer = document.getElementById('codeDrawer');
const drawerCloseBtn = document.getElementById('drawerCloseBtn');
const codeViewer = document.getElementById('codeViewer');
const tokenStrip = document.getElementById('tokenStrip');
const btnToggleCode = document.getElementById('btnToggleCode');
const btnCopyCode = document.getElementById('btnCopyCode');
const btnExport = document.getElementById('btnExport');
const btnFrameworkHtml = document.getElementById('btnFrameworkHtml');
const btnFrameworkReact = document.getElementById('btnFrameworkReact');
const toast = document.getElementById('toast');
const studioSplitter = document.getElementById('studioSplitter');
const panelLeft = document.getElementById('panelLeft');
const panelRight = document.getElementById('panelRight');

// 1. Initialize Studio
async function init() {
  await loadPresets();
  setupEventListeners();
  setupDragAndDrop();
  setupClipboardPaste();
  setupSplitter();

  // Load default preset (linear-dashboard)
  if (presetSelect.value) {
    await selectPreset(presetSelect.value);
  }
}

// 2. Fetch & Populate Presets
async function loadPresets() {
  try {
    const res = await fetch('/api/presets');
    const data = await res.json();
    if (data.success && data.presets) {
      presets = data.presets;
    }
  } catch (err) {
    console.error('Failed to load presets:', err);
  }
}

// 3. Select & Render Preset
async function selectPreset(presetId) {
  try {
    const res = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presetId, targetFramework: currentFramework })
    });

    const data = await res.json();
    if (data.success && data.result) {
      currentResult = data.result;
      renderSandbox(currentResult);
      renderTokens(currentResult.tokens);
      updateCodeView();
      showToast(`Loaded Preset: ${currentResult.title}`);
    }
  } catch (err) {
    showToast('Failed to load preset', 'error');
  }
}

// 4. Render Sandboxed Iframe
function renderSandbox(result) {
  const code = result.htmlCode;
  const doc = sandboxIframe.contentWindow.document;
  doc.open();
  doc.write(code);
  doc.close();

  // If there's an image preview or we generate SVG mockup for reference
  if (result.sourceType === 'image_upload' && result.imageSrc) {
    referenceImage.src = result.imageSrc;
    referenceImage.classList.add('visible');
    dropZoneOverlay.style.display = 'none';
    ghostOverlay.style.backgroundImage = `url(${result.imageSrc})`;
  } else {
    // Generate a sleek SVG canvas mock for preset reference
    const mockSvg = generateMockSvgForPreset(result);
    referenceImage.src = mockSvg;
    referenceImage.classList.add('visible');
    dropZoneOverlay.style.display = 'none';
    ghostOverlay.style.backgroundImage = `url("${mockSvg}")`;
  }
}

// 5. Render Extracted Design Tokens
function renderTokens(tokens) {
  if (!tokens) return;
  tokenStrip.innerHTML = `
    <div class="token-pill">
      <span class="token-color-dot" style="background: ${tokens.primaryColor}"></span>
      <span>Primary: ${tokens.primaryColor}</span>
    </div>
    <div class="token-pill">
      <span class="token-color-dot" style="background: ${tokens.backgroundColor}"></span>
      <span>BG: ${tokens.backgroundColor}</span>
    </div>
    <div class="token-pill">
      <span>Theme: <strong>${tokens.theme.toUpperCase()}</strong></span>
    </div>
    <div class="token-pill">
      <span>Contrast: <strong>${tokens.contrastRatio}:1 (WCAG AA)</strong></span>
    </div>
    <div class="token-pill">
      <span>Radius: ${tokens.borderRadius}</span>
    </div>
  `;
}

// 6. Update Code Viewer
function updateCodeView() {
  if (!currentResult) return;
  if (currentFramework === 'tailwind-html') {
    codeViewer.textContent = currentResult.htmlCode;
  } else {
    codeViewer.textContent = currentResult.reactCode;
  }
}

// 7. Process Uploaded Screenshot (Base64)
async function processImage(dataUrl) {
  showToast('Synthesizing UI from screenshot...', 'info');
  try {
    const res = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl, targetFramework: currentFramework })
    });

    const data = await res.json();
    if (data.success && data.result) {
      currentResult = data.result;
      currentResult.imageSrc = dataUrl;
      renderSandbox(currentResult);
      renderTokens(currentResult.tokens);
      updateCodeView();
      showToast('⚡ UI Synthesized Successfully!');
    } else {
      showToast(data.error || 'Conversion failed', 'error');
    }
  } catch (err) {
    showToast('Failed to process screenshot', 'error');
  }
}

// 8. Event Listeners & UI Controls
function setupEventListeners() {
  // Preset change
  presetSelect.addEventListener('change', (e) => {
    selectPreset(e.target.value);
  });

  // Viewport switch
  btnDesktop.addEventListener('click', () => setViewport('desktop'));
  btnTablet.addEventListener('click', () => setViewport('tablet'));
  btnMobile.addEventListener('click', () => setViewport('mobile'));

  // Framework switch
  btnFrameworkHtml.addEventListener('click', () => {
    currentFramework = 'tailwind-html';
    btnFrameworkHtml.classList.add('active');
    btnFrameworkReact.classList.remove('active');
    updateCodeView();
  });

  btnFrameworkReact.addEventListener('click', () => {
    currentFramework = 'react-tailwind';
    btnFrameworkReact.classList.add('active');
    btnFrameworkHtml.classList.remove('active');
    updateCodeView();
  });

  // Ghost diff controls
  ghostToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      ghostOverlay.style.opacity = ghostOpacity.value / 100;
    } else {
      ghostOverlay.style.opacity = '0';
    }
  });

  ghostOpacity.addEventListener('input', (e) => {
    ghostPercent.textContent = `${e.target.value}%`;
    if (ghostToggle.checked) {
      ghostOverlay.style.opacity = e.target.value / 100;
    }
  });

  // Code drawer controls
  btnToggleCode.addEventListener('click', () => {
    codeDrawer.classList.toggle('open');
  });

  drawerCloseBtn.addEventListener('click', () => {
    codeDrawer.classList.toggle('open');
  });

  // Copy code
  btnCopyCode.addEventListener('click', () => {
    const textToCopy = currentFramework === 'tailwind-html' ? currentResult?.htmlCode : currentResult?.reactCode;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      showToast('✓ Code copied to clipboard!');
    }
  });

  // Export Project
  btnExport.addEventListener('click', () => {
    if (!currentResult) return;
    const blob = new Blob([currentResult.htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentResult.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ Standalone HTML bundle downloaded!');
  });

  // File Upload input
  imageUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => processImage(evt.target.result);
      reader.readAsDataURL(file);
    }
  });
}

function setViewport(mode) {
  btnDesktop.classList.remove('active');
  btnTablet.classList.remove('active');
  btnMobile.classList.remove('active');
  frameWrapper.classList.remove('tablet', 'mobile');

  if (mode === 'desktop') {
    btnDesktop.classList.add('active');
  } else if (mode === 'tablet') {
    btnTablet.classList.add('active');
    frameWrapper.classList.add('tablet');
  } else if (mode === 'mobile') {
    btnMobile.classList.add('active');
    frameWrapper.classList.add('mobile');
  }
}

// 9. Drag & Drop
function setupDragAndDrop() {
  window.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZoneOverlay.classList.add('active');
  });

  window.addEventListener('dragleave', (e) => {
    if (e.clientX === 0 || e.clientY === 0) {
      dropZoneOverlay.classList.remove('active');
    }
  });

  window.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZoneOverlay.classList.remove('active');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (evt) => processImage(evt.target.result);
      reader.readAsDataURL(file);
    }
  });
}

// 10. Clipboard Paste (Ctrl+V)
function setupClipboardPaste() {
  window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (evt) => processImage(evt.target.result);
        reader.readAsDataURL(file);
        break;
      }
    }
  });
}

// 11. Resizable Splitter
function setupSplitter() {
  let isDragging = false;

  studioSplitter.addEventListener('mousedown', () => {
    isDragging = true;
    studioSplitter.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const totalWidth = window.innerWidth;
    const leftWidth = Math.max(200, Math.min(totalWidth - 300, e.clientX));
    panelLeft.style.flex = 'none';
    panelLeft.style.width = `${leftWidth}px`;
    panelRight.style.flex = '1';
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      studioSplitter.classList.remove('dragging');
      document.body.style.cursor = 'default';
    }
  });
}

// Helper: Generates SVG Mockup for preset display
function generateMockSvgForPreset(result) {
  const bg = result.tokens.backgroundColor;
  const primary = result.tokens.primaryColor;
  const text = result.tokens.textColor;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="${bg}"/>
    <rect x="40" y="30" width="720" height="50" rx="8" fill="${result.tokens.surfaceColor}"/>
    <circle cx="70" cy="55" r="14" fill="${primary}"/>
    <rect x="100" y="47" width="120" height="16" rx="4" fill="${text}"/>
    <rect x="40" y="110" width="220" height="120" rx="10" fill="${result.tokens.surfaceColor}"/>
    <rect x="280" y="110" width="220" height="120" rx="10" fill="${result.tokens.surfaceColor}"/>
    <rect x="520" y="110" width="240" height="120" rx="10" fill="${result.tokens.surfaceColor}"/>
    <rect x="40" y="260" width="720" height="280" rx="10" fill="${result.tokens.surfaceColor}"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Toast
function showToast(msg, type = 'info') {
  toast.textContent = msg;
  toast.className = `toast-notification show ${type}`;
  setTimeout(() => {
    toast.className = 'toast-notification';
  }, 3200);
}

// Run init
window.addEventListener('DOMContentLoaded', init);
