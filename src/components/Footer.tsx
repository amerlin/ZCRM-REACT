import { useAuth } from '../contexts/AuthContext';
import { appSettings } from '../config/appSettings';
import { Box, Typography } from '@mui/material';
import { Storage as StorageIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';

const Footer = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#93c54b',
        color: 'white',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.15)',
        minHeight: '35px',
        display: 'flex',
        alignItems: 'center',
        px: 3,
        py: 1,
        zIndex: 1030,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <StorageIcon sx={{ fontSize: 14 }} />
        <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 500 }}>
          WebCrm React - {appSettings.version}
        </Typography>
      </Box>

      {isAuthenticated && user?.lastAccessDate && (
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 500 }}>
            Ultimo accesso {user.lastAccessDate}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Footer;
