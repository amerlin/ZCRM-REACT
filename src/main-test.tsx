import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

console.log('?? Starting ultra-simple React app...');

function UltraSimpleApp() {
  console.log('? UltraSimpleApp rendering...');
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>? REACT FUNZIONA!</h1>
        <p style={{ margin: '10px 0 0 0' }}>Se vedi questo messaggio, React è stato caricato correttamente.</p>
      </div>

      <div style={{
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>?? Test Completati</h2>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>? Vite server in esecuzione</li>
          <li>? React caricato</li>
          <li>? TypeScript compilato</li>
          <li>? Hot Module Replacement (HMR) attivo</li>
        </ul>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        color: '#856404',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>?? Prossimi Passi</h2>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Apri la Console del browser (F12) e verifica che non ci siano errori</li>
          <li>Se vedi questo messaggio, il problema era nei componenti complessi</li>
          <li>Torna a <code>main.tsx</code> e sostituisci con la versione completa</li>
        </ol>
      </div>

      <div style={{
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        color: '#721c24',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>?? Informazioni Debug</h2>
        <p style={{ margin: '5px 0' }}><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
        <p style={{ margin: '5px 0' }}><strong>User Agent:</strong> {navigator.userAgent}</p>
        <p style={{ margin: '5px 0' }}><strong>Risoluzione:</strong> {window.innerWidth}x{window.innerHeight}</p>
      </div>
    </div>
  );
}

console.log('?? Getting root element...');
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('? Root element not found!');
  document.body.innerHTML = `
    <div style="padding: 20px; background: #f44336; color: white; font-family: Arial;">
      <h1>? ERRORE CRITICO</h1>
      <p>L'elemento #root non è stato trovato nell'HTML!</p>
      <p>Verifica che index.html contenga: &lt;div id="root"&gt;&lt;/div&gt;</p>
    </div>
  `;
  throw new Error('Root element not found!');
}

console.log('? Root element found:', rootElement);

try {
  console.log('?? Creating React root...');
  const root = createRoot(rootElement);
  
  console.log('?? Rendering app...');
  root.render(
    <StrictMode>
      <UltraSimpleApp />
    </StrictMode>
  );
  
  console.log('? App rendered successfully!');
  console.log('?? If you see this in the console, React is working!');
} catch (error) {
  console.error('? Error during render:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; background: #f44336; color: white; font-family: monospace;">
      <h1>? ERRORE RENDERING</h1>
      <pre>${error}</pre>
    </div>
  `;
}
