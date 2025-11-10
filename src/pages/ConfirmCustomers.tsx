import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const ConfirmCustomers = () => {
  const navigate = useNavigate();
  const [isBusy] = useState(false);

  useEffect(() => {
    // TODO: Load customers data when API is available
  }, []);

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    toast.info('Funzionalità di aggiornamento non ancora implementata');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <PersonIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">
              Conferma Clienti
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestione conferma clienti
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isBusy}
          >
            Aggiorna
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Content */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
          {isBusy ? (
            <CircularProgress />
          ) : (
            <Typography variant="h6" color="text.secondary">
              Pagina in fase di sviluppo
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ConfirmCustomers;