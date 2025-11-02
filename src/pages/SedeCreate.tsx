import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  IconButton,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Business as SediIcon,
  ChevronLeft as ChevronLeftIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import customersService from '../services/customers.service';

interface CustomerInfo {
  ragsoc: string;
  indirizzo: string;
  citta: string;
  provincia: string;
}

interface Provincia {
  shortdescription: string;
  fulldescription: string;
}

interface TipologiaSede {
  id: string;
  description: string;
}

const SedeCreate = () => {
  const navigate = useNavigate();
  const { customerId, sedeId } = useParams<{ customerId: string; sedeId?: string }>();
  const isEditMode = !!sedeId;
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Customer info
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  // Form state
  const [tipologiaSede, setTipologiaSede] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [indirizzo, setIndirizzo] = useState('');
  const [citta, setCitta] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [provincia, setProvincia] = useState('');
  const [riferimento, setRiferimento] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Dropdown lists
  const [tipologiaSedeList, setTipologiaSedeList] = useState<TipologiaSede[]>([]);
  const [provinciaList, setProvinciaList] = useState<Provincia[]>([]);

  // Delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadCustomerInfo();
    loadTipologiaSedeList();
    loadProvinciaList();
  }, [customerId]);

  const loadCustomerInfo = async () => {
    if (!customerId) return;
    
    try {
      const summary = await customersService.getCustomerSummary(customerId);
      setCustomerInfo({
        ragsoc: summary.descr1,
        indirizzo: summary.address,
        citta: summary.city,
        provincia: summary.province,
      });
    } catch (error) {
      console.error('Error loading customer summary:', error);
      toast.error('Errore nel caricamento delle informazioni cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTipologiaSedeList = async () => {
    try {
      console.log('Loading tipologia sede list...');
      
      // Sample data
      setTipologiaSedeList([
        { id: '1', description: 'Sede Legale' },
        { id: '2', description: 'Sede Operativa' },
        { id: '3', description: 'Magazzino' },
        { id: '4', description: 'Filiale' },
      ]);
    } catch (error) {
      console.error('Error loading tipologia sede list:', error);
    }
  };

  const loadProvinciaList = async () => {
    try {
      console.log('Loading provincia list...');
    
      // Sample data
      setProvinciaList([
        { shortdescription: 'MI', fulldescription: 'Milano' },
        { shortdescription: 'RM', fulldescription: 'Roma' },
        { shortdescription: 'TO', fulldescription: 'Torino' },
        { shortdescription: 'NA', fulldescription: 'Napoli' },
        { shortdescription: 'PA', fulldescription: 'Palermo' },
        { shortdescription: 'GE', fulldescription: 'Genova' },
        { shortdescription: 'BO', fulldescription: 'Bologna' },
        { shortdescription: 'FI', fulldescription: 'Firenze' },
      ]);
    } catch (error) {
      console.error('Error loading provincia list:', error);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validateTelefono = (telefono: string): boolean => {
    return !isNaN(Number(telefono));
  };

  const handleSave = async () => {
    // Validation
    if (!tipologiaSede) {
      toast.warning('Campo Tipologia Sede non impostato.');
      return;
    }

    if (tipologiaSede !== '1' && tipologiaSede !== '2') {
      toast.warning('Campo Tipologia Sede non impostato.');
      return;
    }

    if (!descrizione) {
      toast.warning('Il campo Descrizione deve essere compilato.');
      return;
    }

    if (!provincia) {
      toast.warning('Il campo Provincia deve essere compilato.');
      return;
    }

    if (telefono && !validateTelefono(telefono)) {
      toast.warning('Il campo Telefono pu� contenere solo numeri.');
      return;
    }

    if (email && !validateEmail(email)) {
      toast.warning('Il campo Email non � corretto.');
      return;
    }

    setIsBusy(true);
    try {
      // TODO: Implement API call to create sede
      console.log('Creating sede for customer:', customerId);
      
      const sedeData = {
        id: 0,
        customerId: customerId,
        customerDescription: '',
        descr1: descrizione,
        descr2: '',
        address: indirizzo,
        city: citta,
        email: email,
        telephonenumber: telefono,
        mobilenumber: '',
        county: provincia,
        personreference: riferimento,
        destinationtype: tipologiaSede,
      };
      
      console.log('Sede data:', sedeData);

      const successMessage = isEditMode ? 'Sede aggiornata con successo!' : 'Sede creata con successo!';
      toast.success(successMessage);
      navigate(`/customers/${customerId}/sedi`);
    } catch (error) {
      console.error('Error creating sede:', error);
      const errorMessage = isEditMode ? 'Errore nell\'aggiornamento della sede' : 'Errore nella creazione della sede';
      toast.error(errorMessage);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsBusy(true);
    setDeleteDialogOpen(false);
    
    try {
   // TODO: Implement API call to delete sede
      console.log('Deleting sede:', sedeId);
      
      toast.success('Sede eliminata con successo!');
      navigate(`/customers/${customerId}/sedi`);
    } catch (error) {
      console.error('Error deleting sede:', error);
  toast.error('Errore nell\'eliminazione della sede');
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteCancel = () => {
  setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress sx={{ color: '#93c54b' }} />
          <Typography sx={{ ml: 2 }}>Caricamento...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SediIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 400 }}>
            {isEditMode ? 'Modifica Sede' : 'Aggiungi Sede'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isEditMode && (
          <IconButton
              onClick={handleDeleteClick}
   sx={{
     backgroundColor: '#d32f2f',
                color: 'white',
          width: '30px',
         height: '30px',
  borderRadius: 1,
    '&:hover': {
        backgroundColor: '#b71c1c',
      },
       }}
>
              <DeleteIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}
        <IconButton
          onClick={() => navigate(`/customers/${customerId}/sedi`)}
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
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Customer Info */}
      {customerInfo && (
        <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f9f9f9' }}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
            <strong>Ragione Sociale:</strong> {customerInfo.ragsoc}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Indirizzo:</strong> {customerInfo.indirizzo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Citt\u00E0:</strong> {customerInfo.citta} <strong>Provincia:</strong> {customerInfo.provincia}
          </Typography>
        </Paper>
      )}

      {/* Form */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {/* Tipologia Sede - Row 1 */}
        <Box sx={{ mb: 3 }}>
          <FormControl variant="standard" required fullWidth>
            <InputLabel>Tipologia della Sede *</InputLabel>
            <Select value={tipologiaSede} onChange={(e) => setTipologiaSede(e.target.value)}>
              <MenuItem value="">-- Selezionare la tipologia --</MenuItem>
              {tipologiaSedeList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Descrizione - Row 2 */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="standard"
            required
            label="Descrizione *"
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
          />
        </Box>

        {/* Indirizzo e Citt� - Row 3 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <TextField
            variant="standard"
            label="Indirizzo"
            value={indirizzo}
            onChange={(e) => setIndirizzo(e.target.value)}
            sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
          />
          <TextField
            variant="standard"
            label={'Citt\u00E0'}
            value={citta}
            onChange={(e) => setCitta(e.target.value)}
            sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
          />
        </Box>

        {/* Email e Telefono - Row 4 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <TextField
            variant="standard"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
          />
          <TextField
            variant="standard"
            label="Telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
          />
        </Box>

        {/* Provincia e Persona di riferimento - Row 5 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <FormControl variant="standard" required sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
            <InputLabel>Provincia *</InputLabel>
            <Select value={provincia} onChange={(e) => setProvincia(e.target.value)}>
              <MenuItem value="">-- Selezionare la provincia --</MenuItem>
              {provinciaList.map((option) => (
                <MenuItem key={option.shortdescription} value={option.shortdescription}>
                  {option.fulldescription}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            variant="standard"
            label="Persona di riferimento"
            value={riferimento}
            onChange={(e) => setRiferimento(e.target.value)}
            sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
          />
        </Box>
      </Paper>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
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
          {isBusy ? 'Salvataggio...' : 'Salva'}
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
   <DialogTitle>Conferma Eliminazione</DialogTitle>
 <DialogContent>
  <DialogContentText>
   Sei sicuro di voler eliminare questa sede? Questa azione non pu� essere annullata.
    </DialogContentText>
   </DialogContent>
     <DialogActions>
          <Button onClick={handleDeleteCancel} sx={{ color: '#666' }}>
            Annulla
        </Button>
     <Button onClick={handleDeleteConfirm} sx={{ color: '#d32f2f', fontWeight: 'bold' }} autoFocus>
      Elimina
   </Button>
   </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SedeCreate;
