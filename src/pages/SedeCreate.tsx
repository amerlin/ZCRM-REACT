import { useState, useEffect, useCallback } from 'react';
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
import type { DestinationType, CreateDestinationRequest, UpdateDestinationRequest } from '../services/customers.service';

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
  const [isActive, setIsActive] = useState(true);
  const [destinationReferenceId, setDestinationReferenceId] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Dropdown lists
  const [tipologiaSedeList, setTipologiaSedeList] = useState<DestinationType[]>([]);
  const [provinciaList, setProvinciaList] = useState<Provincia[]>([]);

  const loadCustomerInfo = useCallback(async () => {
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
  }, [customerId]);

  const loadSedeData = useCallback(async () => {
    if (!sedeId) return;
    
    try {
      const sedeData = await customersService.getDestinationById(sedeId);
      setTipologiaSede(sedeData.destinationTypeId.toString());
      setDescrizione(sedeData.descr1);
      setIndirizzo(sedeData.address);
      setCitta(sedeData.city);
      setEmail(sedeData.email);
      setTelefono(sedeData.telephoneNumber);
      setProvincia(sedeData.county);
      setRiferimento(sedeData.personReference);
      setIsActive(sedeData.isActive || true);
      setDestinationReferenceId(sedeData.destinationReferenceId || 0);
    } catch (error) {
      console.error('Error loading sede data:', error);
      toast.error('Errore nel caricamento dei dati della sede');
    }
  }, [sedeId]);

  useEffect(() => {
    loadCustomerInfo();
    loadTipologiaSedeList();
    loadProvinciaList();
    if (isEditMode) {
      loadSedeData();
    }
  }, [loadCustomerInfo, isEditMode, loadSedeData]);

  const loadTipologiaSedeList = async () => {
    try {
      const tipologieData = await customersService.getDestinationTypes();
      setTipologiaSedeList(tipologieData);
    } catch (error) {
      console.error('Error loading tipologia sede list:', error);
      toast.error('Errore nel caricamento delle tipologie di sede');
      
      // Fallback to sample data in case of error
      setTipologiaSedeList([
        { id: '1', description: 'Sede Legale' },
        { id: '2', description: 'Sede Operativa' },
        { id: '3', description: 'Magazzino' },
        { id: '4', description: 'Filiale' },
      ]);
    }
  };

  const loadProvinciaList = async () => {
    try {
      const provincieData = await customersService.getProvinces();
      setProvinciaList(provincieData.map(p => ({
        shortdescription: p.shortDescription,
        fulldescription: p.fullDescription
      })));
    } catch (error) {
      console.error('Error loading provincia list:', error);
      toast.error('Errore nel caricamento delle province');
      
      // Fallback to sample data in case of error
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
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validateTelefono = (telefono: string): boolean => {
    return !isNaN(Number(telefono));
  };

  const handleSave = async () => {
    // Validation - Campo tipologia sede obbligatorio
    if (!tipologiaSede) {
      toast.warning('Campo Tipologia Sede non impostato.');
      return;
    }

    // Validation - Campo descrizione obbligatorio
    if (!descrizione.trim()) {
      toast.warning('Il campo Descrizione deve essere compilato.');
      return;
    }

    if (!provincia) {
      toast.warning('Il campo Provincia deve essere compilato.');
      return;
    }

    if (telefono && !validateTelefono(telefono)) {
      toast.warning('Il campo Telefono può contenere solo numeri.');
      return;
    }

    if (email && !validateEmail(email)) {
      toast.warning('Il campo Email non è corretto.');
      return;
    }

    setIsBusy(true);
    try {
      if (isEditMode) {
        // Preparazione dati per l'aggiornamento
        const updateData: UpdateDestinationRequest = {
          id: parseInt(sedeId || '0'),
          customerId: customerId || '',
          customerDescription: '',
          descr1: descrizione.trim(),
          descr2: '',
          address: indirizzo.trim(),
          city: citta.trim(),
          email: email.trim(),
          telephonenumber: telefono.trim(),
          mobilenumber: '',
          county: provincia,
          personreference: riferimento.trim(),
          destinationtype: tipologiaSede,
          isActive: isActive,
          destinationReferenceId: destinationReferenceId,
        };
        
        console.log('Update sede data to be sent:', updateData);
        await customersService.updateDestination(updateData);
      } else {
        // Preparazione dati per la creazione
        const sedeData: CreateDestinationRequest = {
          id: 0,
          customerId: customerId || '',
          customerDescription: '',
          descr1: descrizione.trim(),
          descr2: '',
          address: indirizzo.trim(),
          city: citta.trim(),
          email: email.trim(),
          telephonenumber: telefono.trim(),
          mobilenumber: '',
          county: provincia,
          personreference: riferimento.trim(),
          destinationtype: tipologiaSede,
        };
        
        console.log('Create sede data to be sent:', sedeData);
        await customersService.createDestination(sedeData);
      }

      const successMessage = isEditMode ? 'Sede aggiornata con successo!' : 'Sede creata con successo!';
      toast.success(successMessage);
      navigate(`/customers/${customerId}/sedi`);
    } catch (error) {
      console.error('Error saving sede:', error);
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
    if (!sedeId) return;
    
    setIsBusy(true);
    setDeleteDialogOpen(false);
    
    try {
      await customersService.deleteDestination(sedeId);
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
