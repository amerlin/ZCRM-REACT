import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  TextField,
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
  Contacts as ContattiIcon,
  ChevronLeft as ChevronLeftIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import customersService from '../services/customers.service';
import type { CreateReferenceRequest, UpdateReferenceRequest } from '../services/customers.service';

interface CustomerInfo {
  ragsoc: string;
  indirizzo: string;
  citta: string;
  provincia: string;
}

const ContattoCreate = () => {
  const navigate = useNavigate();
  const { customerId, contattoId } = useParams<{ customerId: string; contattoId?: string }>();
  const isEditMode = !!contattoId;
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Customer info
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  // Form state
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [telefono, setTelefono] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const loadContattoData = useCallback(async () => {
    if (!contattoId) return;
    
    try {
      const contattoData = await customersService.getReferenceById(contattoId);
      setNome(contattoData.firstName || '');
      setCognome(contattoData.lastName || '');
      setEmail(contattoData.email || '');
      setDescrizione(contattoData.description || '');
      setTelefono(contattoData.telephoneNumber || '');
    } catch (error) {
      console.error('Error loading contatto data:', error);
      toast.error('Errore nel caricamento dei dati del contatto');
    }
  }, [contattoId]);

  useEffect(() => {
    loadCustomerInfo();
    if (isEditMode) {
      loadContattoData();
    }
  }, [loadCustomerInfo, isEditMode, loadContattoData]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validateTelefono = (telefono: string): boolean => {
    return !isNaN(Number(telefono));
  };

  const handleSave = async () => {
    // Validation - Nome e Cognome obbligatori
    if (!nome.trim() && !cognome.trim()) {
      toast.warning('Almeno uno tra Nome e Cognome deve essere compilato.');
      return;
    }

    // Validation email se presente
    if (email && !validateEmail(email)) {
      toast.warning('Il campo Email non è corretto.');
      return;
    }

    // Validation telefono se presente
    if (telefono && !validateTelefono(telefono)) {
      toast.warning('Il campo Telefono può contenere solo numeri.');
      return;
    }

    setIsBusy(true);
    try {
      if (isEditMode) {
        // Preparazione dati per l'aggiornamento
        const updateData: UpdateReferenceRequest = {
          id: parseInt(contattoId || '0'),
          customerId: customerId || '',
          customerDescription: '',
          firstName: nome.trim(),
          lastName: cognome.trim(),
          email: email.trim(),
          description: descrizione.trim(),
          telephoneNumber: telefono.trim(),
        };
        
        console.log('Update contatto data to be sent:', updateData);
        await customersService.updateReference(updateData);
      } else {
        // Preparazione dati per la creazione
        const contattoData: CreateReferenceRequest = {
          id: 0,
          customerId: customerId || '',
          customerDescription: '',
          firstName: nome.trim(),
          lastName: cognome.trim(),
          email: email.trim(),
          description: descrizione.trim(),
          telephoneNumber: telefono.trim(),
        };
        
        console.log('Create contatto data to be sent:', contattoData);
        await customersService.createReference(contattoData);
      }

      const successMessage = isEditMode ? 'Contatto aggiornato con successo!' : 'Contatto creato con successo!';
      toast.success(successMessage);
      navigate(`/customers/${customerId}/contatti`);
    } catch (error) {
      console.error('Error saving contatto:', error);
      const errorMessage = isEditMode ? 'Errore nell\'aggiornamento del contatto' : 'Errore nella creazione del contatto';
      toast.error(errorMessage);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contattoId) return;
    
    setIsBusy(true);
    setDeleteDialogOpen(false);
    
    try {
      await customersService.deleteReference(contattoId);
      toast.success('Contatto eliminato con successo!');
      navigate(`/customers/${customerId}/contatti`);
    } catch (error) {
      console.error('Error deleting contatto:', error);
      toast.error('Errore nell\'eliminazione del contatto');
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
       <ContattiIcon sx={{ mr: 1, fontSize: 32 }} />
   <Typography variant="h4" component="h2" sx={{ fontWeight: 400 }}>
            {isEditMode ? 'Modifica Contatto' : 'Aggiungi Contatto'}
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
  onClick={() => navigate(`/customers/${customerId}/contatti`)}
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
<strong>{'Citt\u00E0'}:</strong> {customerInfo.citta} <strong>Provincia:</strong> {customerInfo.provincia}
   </Typography>
      </Paper>
      )}

      {/* Form */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {/* Nome e Cognome - Row 1 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <TextField
            variant="standard"
            label="Nome *"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
            helperText="Almeno uno tra Nome e Cognome è obbligatorio"
          />
          <TextField
            variant="standard"
            label="Cognome *"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
            helperText="Almeno uno tra Nome e Cognome è obbligatorio"
          />
        </Box>        {/* Email e Descrizione - Row 2 */}
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
            label="Descrizione"
            value={descrizione}
 onChange={(e) => setDescrizione(e.target.value)}
         sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
          />
        </Box>

        {/* Telefono - Row 3 */}
     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <TextField
   variant="standard"
       label="Telefono"
   value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
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
    Sei sicuro di voler eliminare questo contatto? Questa azione non pu� essere annullata.
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

export default ContattoCreate;
