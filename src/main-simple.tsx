import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppSimple from './AppSimple'
import './index.css'

console.log('?? main-simple.tsx: Starting...');

const rootElement = document.getElementById('root');

console.log('?? Root element:', rootElement);

if (!rootElement) {
  document.body.innerHTML = `
    <div style="padding: 20px; background: #fee; border: 2px solid #c00; margin: 20px;">
      <h1>? Errore Critico</h1>
      <p>Elemento #root non trovato nell'HTML!</p>
      <p>Controlla che index.html contenga: <code>&lt;div id="root"&gt;&lt;/div&gt;</code></p>
    </div>
  `;
  throw new Error('Root element not found!');
}

try {
  console.log('?? Creating React root...');
  const root = createRoot(rootElement);
  
  console.log('?? Rendering app...');
  root.render(
    <StrictMode>
      <AppSimple />
    </StrictMode>
  );
  
  console.log('? App rendered successfully!');
} catch (error) {
  console.error('? Error rendering app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; background: #fee; border: 2px solid #c00; margin: 20px;">
      <h1>? Errore nel Rendering</h1>
      <pre>${error}</pre>
    </div>
  `;
}
