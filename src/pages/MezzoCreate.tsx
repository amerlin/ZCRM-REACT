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
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  DirectionsCar as MezziIcon,
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

interface Marca {
id: string;
  description: string;
}

interface TipologiaMezzo {
  id: string;
  description: string;
  templateid: string;
}

const MezzoCreate = () => {
  const navigate = useNavigate();
  const { customerId, mezzoId } = useParams<{ customerId: string; mezzoId?: string }>();
  const isEditMode = !!mezzoId;
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Customer info
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  // Form state - Dati principali
  const [tipologiaMezzo, setTipologiaMezzo] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [trattore, setTrattore] = useState(false);
  const [telescopico, setTelescopico] = useState(false);
  const [brandId, setBrandId] = useState('');
  const [modello, setModello] = useState('');
  const [matricola, setMatricola] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [anno, setAnno] = useState('');
  const [annoCreazione, setAnnoCreazione] = useState('');
  const [telematics, setTelematics] = useState(false);

  // Ore - Trattrici (templateId 1)
  const [ore, setOre] = useState('');
  const [dataRilievoOre, setDataRilievoOre] = useState('');

  // Ore - Macchine da raccolta (templateId 2)
  const [oreRotore, setOreRotore] = useState('');
  const [dataRilievoRotore, setDataRilievoRotore] = useState('');
  const [oreBattitore, setOreBattitore] = useState('');
  const [dataRilievoBattitore, setDataRilievoBattitore] = useState('');
  const [oreMotore, setOreMotore] = useState('');
  const [dataRilievoMotore, setDataRilievoMotore] = useState('');

  // Verifica matricola
  const [matricolaValida, setMatricolaValida] = useState(false);
  const [matricolaUsata, setMatricolaUsata] = useState(false);
  // Note: matricolaClienteDescrizione removed as not used
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Dropdown lists
  const [tipologiaMezzoList, setTipologiaMezzoList] = useState<TipologiaMezzo[]>([]);
  const [marcaList, setMarcaList] = useState<Marca[]>([]);
  const [annoProduzioneList, setAnnoProduzioneList] = useState<Array<{ id: number; description: string }>>([]);

  // Note: isDeleteDialogOpen duplicate removed - using deleteDialogOpen instead

  useEffect(() => {
    loadCustomerInfo();
    loadTipologiaMezzoList();
    loadMarcaList();
    loadAnnoProduzioneList();
    
    // If in edit mode, load mezzo data
    if (isEditMode && mezzoId) {
      loadMezzoData(mezzoId);
    }
  }, [customerId, mezzoId, isEditMode]);

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

  const loadTipologiaMezzoList = async () => {
    try {
      // TODO: Implement API call
      console.log('Loading tipologia mezzo list...');
      
      // Sample data
      setTipologiaMezzoList([
        { id: '1', description: 'Trattore', templateid: '1' },
        { id: '2', description: 'Mietitrebbia', templateid: '2' },
        { id: '3', description: 'Attrezzatura', templateid: '3' },
    { id: '4', description: 'Motocoltivatore', templateid: '1' },
      ]);
    } catch (error) {
      console.error('Error loading tipologia mezzo list:', error);
    }
  };

  const loadMarcaList = async () => {
    try {
      // TODO: Implement API call
      console.log('Loading marca list...');
      
      // Sample data
      setMarcaList([
        { id: '1', description: 'John Deere' },
     { id: '2', description: 'New Holland' },
  { id: '3', description: 'Claas' },
{ id: '4', description: 'Fendt' },
        { id: '5', description: 'Massey Ferguson' },
      ]);
 } catch (error) {
      console.error('Error loading marca list:', error);
    }
  };

  const loadAnnoProduzioneList = () => {
    const anni: Array<{ id: number; description: string }> = [];
    for (let i = 1980; i < 2026; i++) {
      anni.push({ id: i, description: i.toString() });
    }
    anni.push({ id: -1, description: 'N.D' });
    setAnnoProduzioneList(anni);
  };

  const loadMezzoData = async (id: string) => {
 try {
      // TODO: Implement API call to fetch mezzo data
  console.log('Loading mezzo data for ID:', id);
      
      // TODO: Populate form fields with mezzo data
      // Example: setTipologiaMezzo(mezzoData.tipologia);
      
    } catch (error) {
console.error('Error loading mezzo data:', error);
      toast.error('Errore nel caricamento dei dati del mezzo');
    }
  };

  const handleTipologiaChange = (value: string) => {
    setTipologiaMezzo(value);
    const selected = tipologiaMezzoList.find(t => t.id === value);
    if (selected) {
      setTemplateId(selected.templateid);
    }
  };

  const handleVerificaMatricola = async () => {
    if (!matricola) {
    toast.warning('Campo matricola non impostato.');
return;
    }

    setIsBusy(true);
    try {
      // TODO: Implement API call
      console.log('Checking matricola:', matricola);
      // Note: request object removed as API is not yet implemented
      // const request = { customerid: customerId, itemid: 0, matricola: matricola };

      // Simulate API call
      // const response = await itemsService.checkMatricola(request);
      
      // Simulate valid matricola for now
      setMatricolaValida(true);
      setMatricolaUsata(false);
    } catch (error) {
      console.error('Error checking matricola:', error);
    } finally {
  setIsBusy(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!tipologiaMezzo) {
  toast.warning('Impostare la tipologia del mezzo da creare.');
      return;
    }

    if (!brandId) {
  toast.warning('Il campo marca � obbligatorio.');
      return;
    }

    if (!modello) {
      toast.warning('Il campo modello � obbligatorio.');
      return;
    }

    if (!descrizione) {
  toast.warning('Il campo descrizione � obbligatorio.');
   return;
    }

    setIsBusy(true);
    try {
      // TODO: Implement API call to create/update mezzo
      const action = isEditMode ? 'Updating' : 'Creating';
   console.log(`${action} mezzo for customer:`, customerId);
      
      const mezzoData = {
        id: isEditMode ? mezzoId : 0,
   itemtype: parseInt(templateId) - 1,
        customerid: customerId,
     descr: descrizione,
        model: modello,
        brand: marcaList.find(m => m.id === brandId)?.description || '',
        hour: ore ? parseInt(ore) : 0,
        houratday: dataRilievoOre || new Date(2000, 0, 1),
        rotorhour: oreRotore ? parseInt(oreRotore) : 0,
  rotorhourdate: dataRilievoRotore || new Date(2000, 0, 1),
        batthour: oreBattitore ? parseInt(oreBattitore) : 0,
        batthouratdate: dataRilievoBattitore || new Date(2000, 0, 1),
    motorhour: oreMotore ? parseInt(oreMotore) : 0,
        motorhouratdate: dataRilievoMotore || new Date(2000, 0, 1),
        year: anno ? parseInt(anno) : 2024,
   yearcreated: annoCreazione ? parseInt(annoCreazione) : null,
     matricola: matricola,
  templateid: templateId,
        typeid: tipologiaMezzo,
   telematics: telematics,
        brandid: brandId,
    trattore: trattore,
    telescopico: telescopico
      };
      
   console.log('Mezzo data:', mezzoData);

      const successMessage = isEditMode ? 'Mezzo aggiornato con successo!' : 'Mezzo creato con successo!';
      toast.success(successMessage);
      navigate(`/customers/${customerId}/mezzi`);
    } catch (error) {
      console.error('Error creating mezzo:', error);
const errorMessage = isEditMode ? 'Errore nell\'aggiornamento del mezzo' : 'Errore nella creazione del mezzo';
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
    // TODO: Implement API call to delete mezzo
    console.log('Deleting mezzo:', mezzoId);
      
    toast.success('Mezzo eliminato con successo!');
      navigate(`/customers/${customerId}/mezzi`);
    } catch (error) {
      console.error('Error deleting mezzo:', error);
 toast.error('Errore nell\'eliminazione del mezzo');
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

  const showTrattrici = templateId === '1';
  const showMacchineDaRaccolta = templateId === '2';

  return (
  <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <MezziIcon sx={{ mr: 1, fontSize: 32 }} />
      <Typography variant="h4" component="h2" sx={{ fontWeight: 400 }}>
            {isEditMode ? 'Modifica Mezzo' : 'Aggiungi Mezzo'}
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
       onClick={() => navigate(`/customers/${customerId}/mezzi`)}
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

      {/* Customer Info Card */}
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
        {/* Tipologia e Caratteristiche - Row 1 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
     <FormControl variant="standard" required sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
            <InputLabel>Tipologia del Mezzo *</InputLabel>
  <Select value={tipologiaMezzo} onChange={(e) => handleTipologiaChange(e.target.value)}>
   <MenuItem value="">-- Selezionare la tipologia --</MenuItem>
     {tipologiaMezzoList.map((option) => (
    <MenuItem key={option.id} value={option.id}>
       {option.description}
    </MenuItem>
       ))}
  </Select>
          </FormControl>

     <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Caratteristiche</strong>
  </Typography>
  <FormControlLabel
     control={<Checkbox checked={trattore} onChange={(e) => setTrattore(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />}
       label="Trattore"
       sx={{ mr: 3 }}
    />
   <FormControlLabel
              control={<Checkbox checked={telescopico} onChange={(e) => setTelescopico(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />}
    label="Telescopici con gancio"
     />
 </Box>
    </Box>

        {/* Marca e Modello - Row 2 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
    <FormControl variant="standard" required sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
   <InputLabel>Marca *</InputLabel>
  <Select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
     <MenuItem value="">-- Selezionare la marca --</MenuItem>
  {marcaList.map((option) => (
     <MenuItem key={option.id} value={option.id}>
   {option.description}
        </MenuItem>
  ))}
    </Select>
      </FormControl>

  <TextField
          variant="standard"
  required
       label="Modello *"
            value={modello}
  onChange={(e) => setModello(e.target.value)}
     sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
      />
        </Box>

        {/* Descrizione - Row 3 */}
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

        {/* Matricola con Verifica - Row 4 */}
     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'flex-end' }}>
     <TextField
    variant="standard"
     label="Matricola"
       value={matricola}
  onChange={(e) => {
      setMatricola(e.target.value);
        setMatricolaValida(false);
 setMatricolaUsata(false);
}}
            sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
    />
   <Button
   variant="contained"
          onClick={handleVerificaMatricola}
  sx={{
    backgroundColor: '#93c54b',
 '&:hover': { backgroundColor: '#7db33c' },
    textTransform: 'uppercase',
 fontWeight: 'bold',
     fontSize: '11px',
 }}
     >
       Verifica
   </Button>
          {matricolaValida && (
   <Typography variant="body2" color="success.main" sx={{ ml: 2 }}>
       ? Matricola utilizzabile
    </Typography>
)}
      {matricolaUsata && (
        <Typography variant="body2" color="error.main" sx={{ ml: 2 }}>
          ⚠ Matricola già presente
        </Typography>
      )}
        </Box>

        {/* Anno, Anno di produzione, Telematics - Row 5 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'flex-end' }}>
     <TextField
     variant="standard"
      label="Anno"
        type="number"
       value={anno}
   onChange={(e) => setAnno(e.target.value)}
            sx={{ flex: '1 1 calc(33.33% - 11px)', minWidth: '150px' }}
          />
    
  <FormControl variant="standard" sx={{ flex: '1 1 calc(33.33% - 11px)', minWidth: '150px' }}>
            <InputLabel>Anno di produzione</InputLabel>
   <Select value={annoCreazione} onChange={(e) => setAnnoCreazione(e.target.value)}>
         <MenuItem value="">-- Selezionare anno produzione --</MenuItem>
  {annoProduzioneList.map((option) => (
       <MenuItem key={option.id} value={option.id}>
       {option.description}
       </MenuItem>
        ))}
            </Select>
          </FormControl>

        <FormControlLabel
            control={<Checkbox checked={telematics} onChange={(e) => setTelematics(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />}
    label="Telematics (Accessori CLAAS)"
        sx={{ flex: '1 1 calc(33.33% - 11px)', minWidth: '200px' }}
          />
        </Box>

        {/* TRATTRICI - Ore */}
        {showTrattrici && (
          <>
            <Divider sx={{ my: 3 }} />
       <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
Dati Trattrici
         </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
<TextField
       variant="standard"
      label="Ore"
    type="number"
     value={ore}
  onChange={(e) => setOre(e.target.value)}
    sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
       />
              <TextField
    variant="standard"
        label="Data rilievo ore (gg/mm/aaaa)"
     placeholder="01/01/2024"
    value={dataRilievoOre}
       onChange={(e) => setDataRilievoOre(e.target.value)}
    sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
     />
         </Box>
          </>
        )}

 {/* MACCHINE DA RACCOLTA - Ore dettagliate */}
        {showMacchineDaRaccolta && (
     <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
        Dati Macchine da Raccolta
   </Typography>
            
   {/* Ore Rotore */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <TextField
                variant="standard"
         label="Ore del rotore"
    type="number"
            value={oreRotore}
       onChange={(e) => setOreRotore(e.target.value)}
      sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
   />
      <TextField
         variant="standard"
       label="Data rilievo ore rotore (gg/mm/aaaa)"
           placeholder="01/01/2024"
        value={dataRilievoRotore}
        onChange={(e) => setDataRilievoRotore(e.target.value)}
       sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
              />
     </Box>

            {/* Ore Battitore */}
   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
         <TextField
        variant="standard"
       label="Ore del battitore"
   type="number"
         value={oreBattitore}
onChange={(e) => setOreBattitore(e.target.value)}
           sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
     />
     <TextField
        variant="standard"
      label="Data rilievo ore del battitore (gg/mm/aaaa)"
     placeholder="01/01/2024"
          value={dataRilievoBattitore}
       onChange={(e) => setDataRilievoBattitore(e.target.value)}
          sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
              />
            </Box>

 {/* Ore Motore */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
         <TextField
        variant="standard"
      label="Ore del motore"
       type="number"
    value={oreMotore}
         onChange={(e) => setOreMotore(e.target.value)}
sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
    />
      <TextField
      variant="standard"
   label="Data rilievo ore del motore (gg/mm/aaaa)"
   placeholder="01/01/2024"
      value={dataRilievoMotore}
           onChange={(e) => setDataRilievoMotore(e.target.value)}
    sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
              />
            </Box>
     </>
)}
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
     Sei sicuro di voler eliminare questo mezzo? Questa azione non pu� essere annullata.
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

export default MezzoCreate;
