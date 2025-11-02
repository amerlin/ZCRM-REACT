import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Podcasts as PodcastsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

const Header = () => {
  const { user, isAuthenticated, hasAdministrativeGrants, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    logout();
    toast.success('Logout effettuato con successo!');
    navigate('/sign-in');
    handleMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#93c54b',
        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
      }}
    >
      <Toolbar sx={{ minHeight: '45px !important', px: 2 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <PodcastsIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: '18px',
            }}
            onClick={() => navigate('/home')}
          >
            WebCrm
          </Typography>
          <Typography
            variant="caption"
            sx={{ ml: 0.5, color: '#e8f5d8', fontSize: '11px' }}
          >
            {'{ dashboard }'}
          </Typography>
        </Box>

        {/* Desktop Menu */}
        {isAuthenticated && !isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => handleNavigation('/home')}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Menu Principale
            </Button>

            {hasAdministrativeGrants && (
              <>
                <Button
                  color="inherit"
                  startIcon={<PeopleIcon />}
                  onClick={() => handleNavigation('/account/manager')}
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  Gestione utenti
                </Button>
                <Button
                  color="inherit"
                  startIcon={<SettingsIcon />}
                  onClick={() => handleNavigation('/configurations')}
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  Configurazione
                </Button>
              </>
            )}

            <Button
              color="inherit"
              startIcon={<PersonIcon />}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              {user?.userName}
            </Button>

            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleSignOut}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Logout
            </Button>
          </Box>
        )}

        {/* Mobile Menu */}
        {isAuthenticated && isMobile && (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              edge="end"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleNavigation('/home')}>
                Menu Principale
              </MenuItem>
              {hasAdministrativeGrants && (
                <>
                  <MenuItem onClick={() => handleNavigation('/account/manager')}>
                    Gestione utenti
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/configurations')}>
                    Configurazione
                  </MenuItem>
                </>
              )}
              <MenuItem disabled>
                <PersonIcon sx={{ mr: 1 }} />
                {user?.userName}
              </MenuItem>
              <MenuItem onClick={handleSignOut}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
