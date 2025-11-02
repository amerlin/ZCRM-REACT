import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authenticationService } from '../services/authenticationService';
import { toast } from 'react-toastify';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Lock as LockIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

const SignIn = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate('/home');
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!userName || !password) {
      toast.warning('Inserire login e password...');
      return;
    }

    setIsBusy(true);

    try {
      const profile = await authenticationService.signIn(userName, password);
      login(profile, rememberMe);
      toast.success('Login effettuato con successo!');
      navigate('/home');
    } catch {
      toast.warning('Login o password non corrette!');
      navigate('/');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        width: '100vw',
        overflow: 'hidden',
        paddingX: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
     maxWidth: 500,
          maxHeight: '90vh',
          p: 0,
    overflow: 'hidden',
     }}
  >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#93c54b',
     color: 'white',
       p: 1,
 display: 'flex',
  alignItems: 'center',
            gap: 1,
    }}
        >
          <LockIcon sx={{ fontSize: 16 }} />
          <Typography variant="h6" component="h1" sx={{ fontSize: '11px', fontWeight: 'bold' }}>
      AUTENTICAZIONE
          </Typography>
        </Box>

        {/* Body */}
        <Box sx={{ p: 2 }}>
          <form onSubmit={handleSubmit}>
   <TextField
         fullWidth
        margin="dense"
           label="Username"
    type="text"
      value={userName}
     onChange={(e) => setUserName(e.target.value)}
              autoFocus
              disabled={isBusy}
  InputProps={{
          startAdornment: (
       <InputAdornment position="start">
           <EmailIcon />
      </InputAdornment>
            ),
        }}
      />

       <TextField
  fullWidth
        margin="dense"
              label="Password"
       type="password"
   value={password}
 onChange={(e) => setPassword(e.target.value)}
   disabled={isBusy}
    InputProps={{
    startAdornment: (
         <InputAdornment position="start">
           <LockIcon />
   </InputAdornment>
       ),
         }}
            />

       <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 1.5 }}>
     <Button
         type="submit"
                variant="contained"
       disabled={isBusy}
       sx={{
           minWidth: 120,
      backgroundColor: '#93c54b',
           fontSize: '11px',
         fontWeight: 'bold',
          textTransform: 'uppercase',
          '&:hover': {
     backgroundColor: '#7db33c',
           },
        }}
         startIcon={isBusy ? <CircularProgress size={20} color="inherit" /> : null}
      >
            {isBusy ? 'IN COLLEGAMENTO...' : 'LOGIN'}
      </Button>

      <FormControlLabel
     control={
          <Checkbox
             checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
      disabled={isBusy}
       sx={{
     color: '#93c54b',
          '&.Mui-checked': {
              color: '#93c54b',
        },
             }}
      />
  }
            label="RICORDA"
             sx={{
    '& .MuiFormControlLabel-label': {
 fontSize: '11px',
          fontWeight: 'bold',
       },
      }}
  />
  </Box>
   </form>
  </Box>
      </Paper>
    </Box>
  );
};

export default SignIn;
