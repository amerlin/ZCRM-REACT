import { createTheme } from '@mui/material/styles';

// Import Roboto font from Google Fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#93c54b',
      light: '#a8d165',
      dark: '#7db33c',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f1c40f',
      light: '#f4d03f',
      dark: '#d4ac0d',
      contrastText: '#000',
    },
    error: {
      main: '#e74c3c',
    },
    warning: {
      main: '#f39c12',
    },
    info: {
      main: '#3498db',
    },
    success: {
      main: '#27ae60',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    body1: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    body2: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    button: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    caption: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
  },
});
