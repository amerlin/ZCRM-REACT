import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';
import {
  ListAlt as ListAltIcon,
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  // TODO: TEMPORARILY DISABLED - Add authentication check when structure is complete
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/sign-in');
  //   }
  // }, [isAuthenticated, navigate]);

  const menuButtons = [
    { label: 'Clienti', path: '/customers/lists' },
    { label: 'Ricerca Avanzata Clienti', path: '/customers/search' },
    { label: 'Ricerca Avanzata Mezzi', path: '/items/search' },
    { label: 'Usato', path: '/used' },
    { label: 'Comunicazioni', path: '/comunications' },
    { label: 'Numeri utili', path: '/addressbook' },
    /*{ label: 'Ordini Attivi', path: '/documents/lists' },*/
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ListAltIcon sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h4" component="h2" sx={{ fontWeight: 400 }}>
          Menu principale
        </Typography>
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
            size="medium"
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

export default Home;
