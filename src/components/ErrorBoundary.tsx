import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          backgroundColor: '#fee',
          border: '2px solid #c00',
          borderRadius: '5px',
          fontFamily: 'monospace'
        }}>
          <h1 style={{ color: '#c00' }}>?? Errore nell'Applicazione</h1>
          <h2>Qualcosa è andato storto!</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Clicca per vedere i dettagli dell'errore
            </summary>
            <p style={{ marginTop: '10px' }}>
              <strong>Messaggio:</strong><br/>
              {this.state.error?.message}
            </p>
            <p>
              <strong>Stack trace:</strong><br/>
              {this.state.error?.stack}
            </p>
          </details>
          <hr />
          <h3>Possibili Soluzioni:</h3>
          <ol>
            <li>Hai eseguito <code>npm install</code>? Se no, eseguilo ora.</li>
            <li>Controlla la console del browser (F12) per errori dettagliati</li>
            <li>Verifica che tutti i file siano stati creati correttamente</li>
            <li>Riavvia il server Vite: <code>Ctrl+C</code> poi <code>npm run dev</code></li>
          </ol>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
