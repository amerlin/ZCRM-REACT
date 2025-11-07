import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Agriculture as HarvesterIcon,
} from '@mui/icons-material';

const UsedHarvesters = () => {
  const navigate = useNavigate();

  const menuButtons = [
    { label: 'Aggiungi Trebbia/Trincia', path: '/used/harvesters/create' },
    { label: 'Visualizza Elenco', path: '/used/harvesters/list' },
    { label: 'Ricerca Avanzata', path: '/used/harvesters/search' },
    { label: 'Statistiche', path: '/used/harvesters/stats' },
    { label: 'Importa Dati', path: '/used/harvesters/import' },
    { label: 'Esporta Dati', path: '/used/harvesters/export' },
  ];

  const handleGoBack = () => {
    navigate('/used');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HarvesterIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 400 }}>
            Gestione Trebbie e Trince Usate
          </Typography>
        </Box>
        <IconButton
          onClick={handleGoBack}
          sx={{
            backgroundColor: '#93c54b',
            color: 'white',
            width: '30px',
            height: '30px',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: '#7db33c',
            },
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Spacer */}
      <Box sx={{ mb: 2 }} />

      {/* Menu Buttons Grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {menuButtons.map((button, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => navigate(button.path)}
            sx={{
              py: 1,
              px: 2,
              fontSize: '11px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              backgroundColor: '#93c54b',
              height: '40px',
              width: '300px',
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: '#7db33c',
              },
            }}
          >
            {button.label}
          </Button>
        ))}
      </Box>

      {/* Bottom Spacer */}
      <Box sx={{ mb: 2 }} />
    </Container>
  );
};

export default UsedHarvesters;