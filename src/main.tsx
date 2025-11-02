import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ToastContainer } from 'react-toastify'
import { queryClient } from './config/queryClient'
import { theme } from './config/theme'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App.tsx'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

console.log('?? Starting WebCRM React application...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('? Root element not found!');
  throw new Error('Root element not found! Make sure index.html has a div with id="root"');
}

console.log('? Root element found');

try {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AuthProvider>
                <App />
                <ToastContainer
                  position="bottom-center"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </AuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>
  );
  console.log('? WebCRM app rendered successfully!');
} catch (error) {
  console.error('? Error rendering app:', error);
  throw error;
}
