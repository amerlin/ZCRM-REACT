import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Grid,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';

interface Agent {
  id: string;
  description: string;
}

interface Province {
  shortdescription: string;
  fulldescription: string;
}

interface Tipologia {
  id: string;
  description: string;
}

interface Category {
  id: string;
  description: string;
}

const CustomersSearch = () => {
  const navigate = useNavigate();

  // TODO: TEMPORARILY DISABLED - Re-enable authentication check later
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //   navigate('/sign-in');
  //   }
  // }, [isAuthenticated, navigate]);

  // Form state
  const [ragsoc, setRagsoc] = useState('');
  const [agente, setAgente] = useState('');
  const [isActiveCustomer, setIsActiveCustomer] = useState(true);
  const [provincia, setProvincia] = useState('');
  const [tipologia, setTipologia] = useState('');
  const [citta, setCitta] = useState('');
  const [isOptimistic, setIsOptimistic] = useState(true);
  const [categoria, setCategoria] = useState('');

  // Dropdown lists
  const [agentList, setAgentList] = useState<Agent[]>([]);
  const [provinciaList, setProvinciaList] = useState<Province[]>([]);
  const [tipologiaList, setTipologiaList] = useState<Tipologia[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const [isBusy, setIsBusy] = useState(false);
  const [customerList] = useState<any[]>([]);

  useEffect(() => {
    // Load dropdown data
    loadAgents();
    loadProvinces();
    loadTipologie();
    loadCategories();
  }, []);

  const loadAgents = async () => {
    // TODO: Implement API call
    console.log('Load agents...');
    setAgentList([]);
  };

  const loadProvinces = async () => {
    // TODO: Implement API call
    console.log('Load provinces...');
    setProvinciaList([]);
  };

  const loadTipologie = async () => {
    // TODO: Implement API call
    console.log('Load tipologie...');
    setTipologiaList([]);
  };

  const loadCategories = async () => {
    // TODO: Implement API call
    console.log('Load categories...');
    setCategoryList([]);
  };

  const handleSearch = async () => {
    setIsBusy(true);
    try {
      const searchModel = {
    ragionesociale: ragsoc,
        citta,
provincia,
        isoptimistic: isOptimistic,
idagent: agente,
        tipologia,
   categoria,
    isactivecustomer: isActiveCustomer,
  };

      // TODO: Implement API call
      console.log('Search with:', searchModel);
    } catch (error) {
console.error('Search error:', error);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
   {/* Header - Row 1 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
       <SearchIcon sx={{ mr: 1, fontSize: 32 }} />
      <Typography variant="h5" component="h3" sx={{ fontWeight: 400 }}>
 Ricerca Avanzata Clienti
     </Typography>
        </Box>
   <IconButton
        onClick={() => navigate('/customers/lists')}
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

      {/* Info Note */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
   <Grid item xs={12}>
      <Typography variant="body2">
            NOTA: La funzione ottimistica permette di ricercare nel SOLO campo RAGIONE SOCIALE tutti i clienti che contengono ALMENO una parola.
          </Typography>
      </Grid>
      </Grid>

      {/* Spacer */}
      <Box sx={{ mb: 2 }} />

  {/* Form Row 1: Ragione Sociale, Agente, Cliente Attivo */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <TextField
          variant="standard"
   label="Ragione Sociale"
value={ragsoc}
     onChange={(e) => setRagsoc(e.target.value)}
       sx={{ width: '300px' }}
        />
  <FormControl variant="standard" sx={{ width: '300px' }}>
          <InputLabel>Agente</InputLabel>
       <Select
      value={agente}
      label="Agente"
   onChange={(e) => setAgente(e.target.value)}
      >
 <MenuItem value="">-- Selezionare l'agente --</MenuItem>
   {agentList.map((option) => (
          <MenuItem key={option.id} value={option.id}>
     {option.description}
      </MenuItem>
  ))}
          </Select>
   </FormControl>
        <FormControlLabel
      control={
     <Checkbox
  checked={isActiveCustomer}
    onChange={(e) => setIsActiveCustomer(e.target.checked)}
     sx={{
          color: '#93c54b',
    '&.Mui-checked': {
         color: '#93c54b',
 },
   }}
   />
   }
          label="Cliente attivo"
      sx={{ width: '300px', mt: 2 }}
        />
      </Box>

      {/* Form Row 2: Provincia, Tipologia, Citta */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <FormControl variant="standard" sx={{ width: '300px' }}>
        <InputLabel>Provincia</InputLabel>
          <Select
       value={provincia}
  label="Provincia"
    onChange={(e) => setProvincia(e.target.value)}
          >
     <MenuItem value="">-- Selezionare la provincia --</MenuItem>
  {provinciaList.map((option) => (
  <MenuItem key={option.shortdescription} value={option.shortdescription}>
       {option.fulldescription}
    </MenuItem>
 ))}
     </Select>
        </FormControl>
 <FormControl variant="standard" sx={{ width: '300px' }}>
    <InputLabel>Tipologia</InputLabel>
   <Select
value={tipologia}
      label="Tipologia"
       onChange={(e) => setTipologia(e.target.value)}
    >
 <MenuItem value="">-- Selezionare la tipologia cliente --</MenuItem>
     {tipologiaList.map((option) => (
  <MenuItem key={option.id} value={option.id}>
          {option.description}
    </MenuItem>
       ))}
     </Select>
        </FormControl>
        <TextField
          variant="standard"
label={'Citt\u00E0'}
          value={citta}
        onChange={(e) => setCitta(e.target.value)}
 sx={{ width: '300px' }}
        />
      </Box>

   {/* Form Row 3: Categoria Cliente, Ricerca Ottimistica */}
   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
  <FormControl variant="standard" sx={{ width: '300px' }}>
          <InputLabel>Categoria Cliente</InputLabel>
      <Select
     value={categoria}
         label="Categoria Cliente"
  onChange={(e) => setCategoria(e.target.value)}
       >
 <MenuItem value="">-- Selezionare la categoria cliente --</MenuItem>
            {categoryList.map((option) => (
    <MenuItem key={option.id} value={option.id}>
    {option.description}
         </MenuItem>
))}
       </Select>
        </FormControl>
        <FormControlLabel
   control={
     <Checkbox
    checked={isOptimistic}
 onChange={(e) => setIsOptimistic(e.target.checked)}
            sx={{
        color: '#93c54b',
    '&.Mui-checked': {
 color: '#93c54b',
     },
     }}
   />
 }
       label="Ricerca Ottimistica"
       sx={{ width: '300px', mt: 2 }}
        />
      </Box>

      {/* Search Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
   variant="contained"
      size="large"
          startIcon={isBusy ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          onClick={handleSearch}
      disabled={isBusy}
       sx={{
     backgroundColor: '#93c54b',
   textTransform: 'uppercase',
  fontWeight: 'bold',
  fontSize: '11px',
    width: '300px',
      py: 1.5,
'&:hover': {
 backgroundColor: '#7db33c',
      },
       }}
  >
    {isBusy ? 'Ricerca in corso...' : 'Ricerca'}
   </Button>
      </Box>

      {/* Spacer */}
      <Box sx={{ mb: 2 }} />

      {/* Results Table Placeholder */}
      <Box sx={{ mb: 3 }}>
        {customerList.length > 0 ? (
    <Box sx={{ 
      border: '1px solid #ccc', 
  borderRadius: 1, 
      p: 4, 
      textAlign: 'center',
  }}>
        <Typography variant="body1">
Tabella risultati (da implementare)
        </Typography>
          </Box>
     ) : (
          <Box sx={{ 
   border: '1px dashed #ccc', 
    borderRadius: 1, 
      p: 4, 
       textAlign: 'center',
minHeight: '100px',
       display: 'flex',
     alignItems: 'center',
        justifyContent: 'center',
       }}>
          <Typography variant="body1" color="text.secondary">
    Effettua una ricerca per visualizzare i risultati
   </Typography>
          </Box>
 )}
      </Box>

  {/* Bottom Spacers */}
      <Box sx={{ mb: 2 }} />
      <Box sx={{ mb: 2 }} />
 <Box sx={{ mb: 2 }} />
      <Box sx={{ mb: 2 }} />
    </Container>
  );
};

export default CustomersSearch;
