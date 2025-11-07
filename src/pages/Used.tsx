import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Sell as UsedIcon,
} from '@mui/icons-material';

const Used = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Trattori',
      path: '/used/tractors',
    },
    {
      title: 'Trebbie e Trince',
      path: '/used/harvesters',
    },
    {
      title: 'Attrezzature',
      path: '/used/equipment',
    },
    {
      title: 'Edilizia',
      path: '/used/construction',
    },
  ];

  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

  const handleGoBack = () => {
    navigate('/home');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <UsedIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 400 }}>
            Gestione Usato
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
        {categories.map((category, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => handleCategoryClick(category.path)}
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
            {category.title}
          </Button>
        ))}
      </Box>

      {/* Bottom Spacer */}
      <Box sx={{ mb: 2 }} />
    </Container>
  );
};

export default Used;