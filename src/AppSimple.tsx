import './App.css';

// Simple test component that doesn't require anything
function AppSimple() {
  return (
    <div className="app" style={{ padding: '20px' }}>
      <h1>? WebCRM React - Test di Base</h1>
      <p>Se vedi questo messaggio, React funziona!</p>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '5px'
      }}>
        <h2>? Stato dell'Applicazione</h2>
        <ul>
          <li>? React caricato correttamente</li>
          <li>? Vite funziona</li>
          <li>? TypeScript compilato</li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '5px'
      }}>
        <h2>?? Prossimi Passi</h2>
        <ol>
          <li>Verifica che <code>npm install</code> sia completato</li>
          <li>Apri Developer Tools (F12) e controlla la Console</li>
          <li>Se non vedi errori, sostituisci questo componente con App.tsx completo</li>
        </ol>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '5px'
      }}>
        <h2>? Se Vedi Ancora Pagina Bianca</h2>
        <ol>
          <li>Apri la Console del browser (F12)</li>
          <li>Cerca errori in rosso</li>
          <li>Verifica nel terminale se Vite ha errori</li>
          <li>Prova: <code>Ctrl+C</code> poi <code>npm run dev</code></li>
        </ol>
      </div>
    </div>
  );
}

export default AppSimple;
