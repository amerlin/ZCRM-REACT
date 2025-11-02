import './App.css';

function AppTest() {
  console.log('AppTest rendering...');
  
  return (
    <div style={{ 
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
  }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px',
     borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#28a745', marginBottom: '20px' }}>
      ? React App È In Esecuzione!
        </h1>
        
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
    borderRadius: '5px',
          padding: '20px',
          marginBottom: '20px'
   }}>
          <h2>?? Successo!</h2>
          <p>Se vedi questo messaggio, significa che:</p>
          <ul>
            <li>? React sta funzionando</li>
            <li>? Vite sta compilando correttamente</li>
        <li>? TypeScript sta funzionando</li>
       <li>? Il browser carica l'applicazione</li>
          </ul>
        </div>

   <div style={{
     backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
   borderRadius: '5px',
      padding: '20px',
   marginBottom: '20px'
        }}>
       <h2>?? Prossimi Passi</h2>
       <ol>
  <li>Apri Developer Tools (F12)</li>
            <li>Controlla la Console - non dovrebbero esserci errori</li>
            <li>Se tutto OK, torna alla versione completa</li>
          </ol>
      </div>

        <div style={{
          backgroundColor: '#d1ecf1',
      border: '1px solid #bee5eb',
        borderRadius: '5px',
   padding: '20px'
        }}>
          <h2>?? Per Tornare alla Versione Completa</h2>
     <p>Nel file <code>src/main.tsx</code>, cambia:</p>
       <pre style={{ 
            backgroundColor: '#f8f9fa',
          padding: '10px',
         borderRadius: '5px',
  overflow: 'auto'
    }}>
       import App from './AppTest'
          </pre>
   <p>in:</p>
          <pre style={{ 
  backgroundColor: '#f8f9fa',
   padding: '10px',
            borderRadius: '5px',
            overflow: 'auto'
  }}>
          import App from './App'
          </pre>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center', color: '#666' }}>
          <p>Porta: <strong>3000</strong></p>
     <p>URL: <strong>http://localhost:3000</strong></p>
        </div>
      </div>
    </div>
  );
}

export default AppTest;
