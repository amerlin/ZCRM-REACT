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
import customersService, { type CreateCustomerItemRequest, type UpdateCustomerItemRequest, type CustomerItemDetail, type CheckMatricolaResponse } from '../services/customers.service';

interface CustomerInfo {
  ragsoc: string;
  indirizzo: string;
  citta: string;
  provincia: string;
}

interface Marca {
  id: number;
  description: string;
  orderIndex: number;
}

interface TipologiaMezzo {
  id: number;
  description: string;
  isVisible: boolean;
  templateId: number;
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
  const [tipologiaMezzo, setTipologiaMezzo] = useState<number | ''>('');
  const [templateId, setTemplateId] = useState<number | null>(null);

  const [trattore, setTrattore] = useState(false);
  const [telescopico, setTelescopico] = useState(false);
  const [brandId, setBrandId] = useState<number | ''>('');
  const [modello, setModello] = useState('');
  const [matricola, setMatricola] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [anno, setAnno] = useState<number | ''>('');
  const [annoCreazione, setAnnoCreazione] = useState<number | ''>('');
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
  const [annoList, setAnnoList] = useState<Array<{ id: number; description: string }>>([]);
  const [annoProduzioneList, setAnnoProduzioneList] = useState<Array<{ id: number; description: string }>>([]);

  // Note: isDeleteDialogOpen duplicate removed - using deleteDialogOpen instead

  useEffect(() => {
    loadCustomerInfo();
    loadTipologiaMezzoList();
    loadMarcaList();
    loadAnnoList();
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
      const itemTypes = await customersService.getItemTypes();
      console.log('ItemTypes from API:', itemTypes);
      // Filtra solo i tipi visibili
      const visibleTypes = itemTypes.filter(type => type.isVisible);
      console.log('Visible types with templateId:', visibleTypes.map(t => ({ id: t.id, description: t.description, templateId: t.templateId })));
      setTipologiaMezzoList(visibleTypes);
    } catch (error) {
      console.error('Error loading tipologia mezzo list:', error);
      toast.error('Errore nel caricamento delle tipologie mezzo');
    }
  };

  const loadMarcaList = async () => {
    try {
      const itemBrands = await customersService.getItemBrands();
      // Ordina per orderIndex
      const sortedBrands = itemBrands.sort((a, b) => a.orderIndex - b.orderIndex);
      setMarcaList(sortedBrands);
    } catch (error) {
      console.error('Error loading marca list:', error);
      toast.error('Errore nel caricamento delle marche');
    }
  };

  const loadAnnoList = async () => {
    try {
      const itemYears = await customersService.getItemYears();
      setAnnoList(itemYears);
    } catch (error) {
      console.error('Error loading anni list:', error);
      toast.error('Errore nel caricamento degli anni');
    }
  };

  const loadAnnoProduzioneList = async () => {
    try {
      const itemYears = await customersService.getItemYears();
      // Per l'anno di produzione aggiungiamo anche l'opzione "N.D"
      const yearsWithND = [...itemYears, { id: -1, description: 'N.D' }];
      setAnnoProduzioneList(yearsWithND);
    } catch (error) {
      console.error('Error loading anni produzione list:', error);
      toast.error('Errore nel caricamento degli anni di produzione');
    }
  };

  const loadMezzoData = async (id: string) => {
    try {
      console.log('Loading mezzo data for ID:', id);
      const mezzoData: CustomerItemDetail = await customersService.getCustomerItemById(id);
      console.log('Loaded mezzo data:', mezzoData);

      // Populate form fields with mezzo data
      setDescrizione(mezzoData.description || '');
      setModello(mezzoData.model || '');
      setMatricola(mezzoData.matricola || '');
      setTipologiaMezzo(mezzoData.typeId || '');
      setBrandId(mezzoData.brandId || '');
      setAnno(mezzoData.year || '');
      setAnnoCreazione(mezzoData.yearCreated || '');
      setTelematics(mezzoData.telematics || false);
      setTrattore(mezzoData.trattore || false);
      setTelescopico(mezzoData.telescopico || false);
      
      // Set hours data
      setOre(mezzoData.hour?.toString() || '');
      setOreRotore(mezzoData.rotorHour?.toString() || '');
      setOreBattitore(mezzoData.battHour?.toString() || '');
      setOreMotore(mezzoData.motorHour?.toString() || '');
      
      // Set date data (convert from ISO string to YYYY-MM-DD format for date inputs)
      if (mezzoData.hourAtDay) {
        setDataRilievoOre(mezzoData.hourAtDay.split('T')[0]);
      }
      if (mezzoData.rotorHourAtDate) {
        setDataRilievoRotore(mezzoData.rotorHourAtDate.split('T')[0]);
      }
      if (mezzoData.battHourAtDate) {
        setDataRilievoBattitore(mezzoData.battHourAtDate.split('T')[0]);
      }
      if (mezzoData.motorHourAtDate) {
        setDataRilievoMotore(mezzoData.motorHourAtDate.split('T')[0]);
      }

      // Set templateId based on the type
      if (mezzoData.templateId) {
        // Convert templateId from string to number
        const templateIdNum = Number(mezzoData.templateId);
        if (!isNaN(templateIdNum)) {
          setTemplateId(templateIdNum);
        }
      }

    } catch (error) {
      console.error('Error loading mezzo data:', error);
      toast.error('Errore nel caricamento dei dati del mezzo');
    }
  };

  const handleTipologiaChange = (value: string) => {
    const numValue = value === '' ? '' : parseInt(value, 10);
    setTipologiaMezzo(numValue);
    const selected = tipologiaMezzoList.find(t => t.id === numValue);
    if (selected) {
      setTemplateId(selected.templateId);
      console.log('Selected tipologia:', selected.description, 'TemplateId:', selected.templateId);
    } else {
      setTemplateId(null);
    }
  };

  const handleVerificaMatricola = async () => {
    if (!matricola) {
      toast.warning('Campo matricola non impostato.');
      return;
    }

    if (!customerId) {
      toast.error('Customer ID non disponibile');
      return;
    }

    setIsBusy(true);
    try {
      console.log('Checking matricola:', matricola, 'for customer:', customerId);
      
      const response: CheckMatricolaResponse[] = await customersService.checkMatricola(
        parseInt(customerId), 
        matricola
      );
      
      console.log('Matricola check response:', response);

      if (response && response.length > 0) {
        // Matricola is already used
        setMatricolaValida(false);
        setMatricolaUsata(true);
        
        // Create clickable toast for each customer using the matricola
        response.forEach((item) => {
          const toastContent = (
            <div 
              onClick={() => navigate(`/customers/edit/${item.customerId}`)}
              style={{ 
                cursor: 'pointer', 
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                Matricola già utilizzata
              </Typography>
              <Typography variant="body2">
                Cliente: {item.customerDescription}
              </Typography>
              <Typography variant="caption" style={{ opacity: 0.8 }}>
                Clicca per modificare il cliente
              </Typography>
            </div>
          );

          toast.warning(toastContent, {
            autoClose: 8000, // Longer duration for user to read and click
            closeOnClick: true,
            draggable: true,
            style: {
              minWidth: '350px',
              maxWidth: '500px'
            }
          });
        });
      } else {
        // Matricola is available
        setMatricolaValida(true);
        setMatricolaUsata(false);
        toast.success('Matricola disponibile');
      }
    } catch (error) {
      console.error('Error checking matricola:', error);
      toast.error('Errore durante la verifica della matricola');
      setMatricolaValida(false);
      setMatricolaUsata(false);
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
      // Verifica che tipologia sia selezionata per ottenere typeId e templateId
      const selectedTipologia = tipologiaMezzoList.find(t => t.id === tipologiaMezzo);
      if (!selectedTipologia) {
        toast.warning('Seleziona una tipologia di mezzo valida.');
        return;
      }

      // Debug: verifica valori
      console.log('Selected tipologia for save:', selectedTipologia);
      console.log('TemplateId value:', selectedTipologia.templateId);

      // Verifica che templateId sia valorizzato
      if (selectedTipologia.templateId === undefined || selectedTipologia.templateId === null) {
        toast.warning('Errore: templateId non valorizzato per la tipologia selezionata.');
        return;
      }

      const mezzoData: CreateCustomerItemRequest = {
        id: isEditMode ? (mezzoId ? parseInt(mezzoId) : 0) : 0,
        templateId: selectedTipologia.templateId,
        typeId: selectedTipologia.id,
        customerId: customerId ? parseInt(customerId) : 0,
        referenceRecordId: 0,
        brandId: brandId || 0,
        description: descrizione,
        model: modello,
        year: typeof anno === 'number' ? anno : 2024,
        yearCreated: typeof annoCreazione === 'number' ? annoCreazione : 2024,
        matricola: matricola,
        isActive: true,
        telematics: telematics,
        trattore: trattore,
        telescopico: telescopico,
        hour: ore ? parseInt(ore) : 0,
        hourAtDay: new Date().toISOString(),
        rotorHour: oreRotore ? parseInt(oreRotore) : 0,
        rotorHourAtDate: new Date().toISOString(),
        battHour: oreBattitore ? parseInt(oreBattitore) : 0,
        battHourAtDate: new Date().toISOString(),
        motorHour: oreMotore ? parseInt(oreMotore) : 0,
        motorHourAtDate: new Date().toISOString()
      };

      console.log('Mezzo data:', mezzoData);

      if (isEditMode) {
        // Create update request with proper dates
        const updateData: UpdateCustomerItemRequest = {
          id: mezzoId ? parseInt(mezzoId) : 0,
          templateId: selectedTipologia.templateId,
          typeId: selectedTipologia.id,
          customerId: customerId ? parseInt(customerId) : 0,
          referenceRecordId: 0,
          brandId: brandId || 0,
          description: descrizione,
          model: modello,
          year: typeof anno === 'number' ? anno : 2024,
          yearCreated: typeof annoCreazione === 'number' ? annoCreazione : 2024,
          matricola: matricola,
          isActive: true,
          telematics: telematics,
          trattore: trattore,
          telescopico: telescopico,
          hour: ore ? parseInt(ore) : 0,
          hourAtDay: dataRilievoOre ? new Date(dataRilievoOre).toISOString() : new Date().toISOString(),
          rotorHour: oreRotore ? parseInt(oreRotore) : 0,
          rotorHourAtDate: dataRilievoRotore ? new Date(dataRilievoRotore).toISOString() : new Date().toISOString(),
          battHour: oreBattitore ? parseInt(oreBattitore) : 0,
          battHourAtDate: dataRilievoBattitore ? new Date(dataRilievoBattitore).toISOString() : new Date().toISOString(),
          motorHour: oreMotore ? parseInt(oreMotore) : 0,
          motorHourAtDate: dataRilievoMotore ? new Date(dataRilievoMotore).toISOString() : new Date().toISOString()
        };

        console.log('Update data:', updateData);
        await customersService.updateCustomerItem(updateData);
      } else {
        await customersService.createCustomerItem(mezzoData);
      }

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

  // Utilizza templateId per determinare quali campi mostrare
  const showTrattrici = templateId === 1; // Template per Trattrici
  const showMacchineDaRaccolta = templateId === 2; // Template per Macchine da raccolta

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
            <Select value={tipologiaMezzo.toString()} onChange={(e) => handleTipologiaChange(e.target.value as string)}>
              <MenuItem value="">-- Selezionare la tipologia --</MenuItem>
              {tipologiaMezzoList.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
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
            <Select value={brandId.toString()} onChange={(e) => setBrandId(e.target.value === '' ? '' : parseInt(e.target.value, 10))}>
              <MenuItem value="">-- Selezionare la marca --</MenuItem>
              {marcaList.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
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
          <FormControl variant="standard" sx={{ flex: '1 1 calc(33.33% - 11px)', minWidth: '150px' }}>
            <InputLabel>Anno</InputLabel>
            <Select value={anno.toString()} onChange={(e) => setAnno(e.target.value === '' ? '' : parseInt(e.target.value, 10))}>
              <MenuItem value="">-- Selezionare anno --</MenuItem>
              {annoList.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" sx={{ flex: '1 1 calc(33.33% - 11px)', minWidth: '150px' }}>
            <InputLabel>Anno di produzione</InputLabel>
            <Select value={annoCreazione.toString()} onChange={(e) => setAnnoCreazione(e.target.value === '' ? '' : parseInt(e.target.value, 10))}>
              <MenuItem value="">-- Selezionare anno produzione --</MenuItem>
              {annoProduzioneList.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
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
