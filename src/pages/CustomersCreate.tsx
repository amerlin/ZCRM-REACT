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
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  ListAlt as ListAltIcon,
  ChevronLeft as ChevronLeftIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import CustomerEditNavBar from '../components/CustomerEditNavBar';
import customersService from '../services/customers.service';

interface Agent {
  id: string;
  description: string;
}

interface Province {
  id: string;
  shortDescription: string;
  fullDescription: string;
}

interface Category {
  id: string;
  description: string;
  value: boolean;
}

interface AllevamentoType {
  id: string;
  description: string;
}

interface ColturaType {
  id: string;
  description: string;
}

interface ColturaItem {
  colturaId: string;
  description: string;
  ettariColtivati: string;
  colturaBiologica: boolean;
  ettariProprieta: string;
  ettariInAffitto: string;
}

const CustomersCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();  // Get customer ID from URL
  const isEditMode = !!id;  // Determine if we're in edit mode

  // TODO: TEMPORARILY DISABLED - Re-enable authentication check later
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form state - Tipologia Cliente
  const [isAgricoltore, setIsAgricoltore] = useState(false);
  const [isControterzista, setIsControterzista] = useState(false);
  const [isAllevatore, setIsAllevatore] = useState(false);
  const [isEdile, setIsEdile] = useState(false);
  const [isMovTerra, setIsMovTerra] = useState(false);
  const [isForestale, setIsForestale] = useState(false);
  const [isCommerciante, setIsCommerciante] = useState(false);
  const [isIndustria, setIsIndustria] = useState(false);
  const [isEcologia, setIsEcologia] = useState(false);
  const [isOfficina, setIsOfficina] = useState(false);
  const [isEnte, setIsEnte] = useState(false);
  const [isNoleggiatore, setIsNoleggiatore] = useState(false);

  // Form state - Dati Cliente
  const [isActiveCustomer, setIsActiveCustomer] = useState(true);
  const [ragsoc, setRagsoc] = useState('');
  const [indirizzo, setIndirizzo] = useState('');
  const [piva, setPiva] = useState('');
  const [agente, setAgente] = useState('');
  const [citta, setCitta] = useState('');
  const [provincia, setProvincia] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [cap, setCap] = useState('');
  const [isSenderEmailEnabled, setIsSenderEmailEnabled] = useState(false);
  const [email, setEmail] = useState('');
  const [emailPec, setEmailPec] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cellulare, setCellulare] = useState('');
  const [altroTelefono, setAltroTelefono] = useState('');
  const [riferimento, setRiferimento] = useState('');

  // Form state - Allevatore
  const [tipoAllevamento, setTipoAllevamento] = useState('');
  const [numeroCapi, setNumeroCapi] = useState('');

  // Form state - Agricoltore/Controterzista
  const [colturaPreferita, setColturaPreferita] = useState('');

  // Dropdown lists
  const [agentList, setAgentList] = useState<Agent[]>([]);
  const [provinciaList, setProvinciaList] = useState<Province[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [allevamentoTypeList, setAllevamentoTypeList] = useState<AllevamentoType[]>([]);
  const [colturaTypeList, setColturaTypeList] = useState<ColturaType[]>([]);
  const [colturaItemList, setColturaItemList] = useState<ColturaItem[]>([]);
  const [privacyStatusList, setPrivacyStatusList] = useState<{id: string; description: string}[]>([]);

  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Load dropdown data
    loadAgents();
    loadProvinces();
    loadCategories();
    loadAllevamentoTypes();
    loadColturaTypes();
    loadColturaItems();
    loadPrivacyStatus();

    // If in edit mode, load customer data
    if (isEditMode && id) {
      loadCustomerData(id);
    }
  }, [id, isEditMode]);

  const loadCustomerData = async (customerId: string) => {
    setIsLoading(true);
    try {
      const customerData = await customersService.fetchCustomerById(customerId);
      
      // Map fields from API response to form fields
      setRagsoc(customerData.descr1 || '');
      setIndirizzo(customerData.address || '');
      setPiva(customerData.piva || '');
      setCap(customerData.zipCode || '');
      setEmail(customerData.email || '');
      setIsSenderEmailEnabled(customerData.isSenderEmailEnabled || false);
      setEmailPec(customerData.emailPec || '');
      setTelefono(customerData.telephoneNumber || '');
      setCellulare(customerData.mobileNumber || '');
      setAltroTelefono(customerData.extraNumber || '');
      setRiferimento(customerData.personreference || '');
      setCitta(customerData.city || '');
      setProvincia(customerData.provincia?.id || '');
      setAgente(customerData.agentId || '');
      setPrivacy(customerData.privacy?.id || '');
      setIsActiveCustomer(customerData.isActiveCustomer ?? true);
      setColturaPreferita(customerData.preferredColturaId || '');
      
      // Map customer categories - use the 'value' boolean from API to set checkbox state
      if (customerData.customerCategoryType && Array.isArray(customerData.customerCategoryType)) {
        setCategoryList(customerData.customerCategoryType.map((cat) => ({
          id: cat.id,
          description: cat.name,
          value: cat.value, // Use the boolean value from API
        })));
      }
      
      // Map customer types (Tipologia Cliente) - set checkboxes based on shortName (2-letter codes)
      if (customerData.customerType && Array.isArray(customerData.customerType)) {
        customerData.customerType.forEach((type) => {
          const shortName = type.shortName?.toUpperCase() || '';
          if (shortName === 'AG') setIsAgricoltore(true);
          if (shortName === 'CO') setIsControterzista(true);
          if (shortName === 'AL') setIsAllevatore(true);
          if (shortName === 'ED') setIsEdile(true);
          if (shortName === 'MO') setIsMovTerra(true);
          if (shortName === 'FO') setIsForestale(true);
          if (shortName === 'CM') setIsCommerciante(true);
          if (shortName === 'IN') setIsIndustria(true);
          if (shortName === 'EC') setIsEcologia(true);
          if (shortName === 'OF') setIsOfficina(true);
          if (shortName === 'EN') setIsEnte(true);
          if (shortName === 'NO') setIsNoleggiatore(true);
        });
      }

      // Map customer coltura data - merge with all coltura types
      if (customerData.customerColturaType && Array.isArray(customerData.customerColturaType)) {
        // Get all coltura types first
        const allColturaTypes = await customersService.getColturaTypes();
        
        // Create a map of customer coltura data by colturaTypeId
        const customerColturaMap = new Map(
          customerData.customerColturaType.map((coltura) => [coltura.colturaTypeId, coltura])
        );
        
        console.log('Customer coltura data from API:', customerData.customerColturaType);
        
        // Merge all coltura types with customer data
        const mergedColturaList: ColturaItem[] = allColturaTypes.map((type) => {
          const customerColtura = customerColturaMap.get(Number(type.id));
          return {
            colturaId: type.id,
            description: type.description,
            ettariColtivati: customerColtura ? String(customerColtura.ettariColtivati) : '0',
            colturaBiologica: customerColtura?.isBio || false,
            ettariProprieta: customerColtura ? String(customerColtura.ettariProprieta) : '0',
            ettariInAffitto: customerColtura ? String(customerColtura.ettariAffitto) : '0',
          };
        });
        
        console.log('Merged coltura list:', mergedColturaList);
        setColturaItemList(mergedColturaList);
      }
      
    } catch (error) {
      console.error('Error loading customer data:', error);
      toast.error('Errore nel caricamento dei dati del cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAgents = async () => {
    try {
      const agents = await customersService.getAgents();
      setAgentList(agents);
    } catch (error) {
      console.error('Errore nel caricamento degli agenti:', error);
      setAgentList([]);
    }
  };

  const loadProvinces = async () => {
    try {
      const provinces = await customersService.getProvinces();
      setProvinciaList(provinces);
    } catch (error) {
      console.error('Errore nel caricamento delle province:', error);
      setProvinciaList([]);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await customersService.getCustomerCategories();
      // Map API response to Category format with value = false by default
      const mappedCategories = cats.map((cat: any) => ({
        id: cat.id,
        description: cat.description,
        value: false,
      }));
      setCategoryList(mappedCategories);
    } catch (error) {
      console.error('Errore nel caricamento delle categorie:', error);
      setCategoryList([]);
    }
  };

  const loadAllevamentoTypes = async () => {
    try {
      const types = await customersService.getAllevamentoTypes();
      setAllevamentoTypeList(types);
    } catch (error) {
      console.error('Errore nel caricamento dei tipi di allevamento:', error);
      setAllevamentoTypeList([]);
    }
  };

  const loadColturaTypes = async () => {
    try {
      const types = await customersService.getColturaTypes();
      setColturaTypeList(types);
    } catch (error) {
      console.error('Errore nel caricamento dei tipi di coltura:', error);
      setColturaTypeList([]);
    }
  };

  const loadColturaItems = async () => {
    try {
      // Get all coltura types to populate the table
      const types = await customersService.getColturaTypes();
      console.log('Coltura types loaded:', types);
      // Initialize the table with all coltura types (default values to 0)
      const items: ColturaItem[] = types.map((type) => ({
        colturaId: type.id,
        description: type.description,
        ettariColtivati: '0',
        colturaBiologica: false,
        ettariProprieta: '0',
        ettariInAffitto: '0',
      }));
      console.log('Coltura items initialized:', items);
      setColturaItemList(items);
    } catch (error) {
      console.error('Errore nel caricamento dei tipi di coltura:', error);
      setColturaItemList([]);
    }
  };

  const loadPrivacyStatus = async () => {
    try {
      const statuses = await customersService.getPrivacyStatuses();
      setPrivacyStatusList(statuses);
    } catch (error) {
      console.error('Errore nel caricamento degli stati privacy:', error);
      setPrivacyStatusList([]);
    }
  };

  const handleSave = async () => {
    setIsBusy(true);
    try {
      if (isEditMode) {
        // TODO: Implement update API call
        console.log('Updating customer ID:', id);
        // await updateCustomer(id, formData);
        toast.success('Cliente aggiornato con successo!');
      } else {
        // TODO: Implement create API call
        console.log('Creating new customer...');
    // await createCustomer(formData);
        toast.success('Cliente creato con successo!');
      }
      navigate('/customers/lists');
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error(isEditMode ? 'Errore nell\'aggiornamento del cliente' : 'Errore nella creazione del cliente');
    } finally {
      setIsBusy(false);
    }
  };

  // Note: handleDelete function removed as it's not used in this component

  const handleTabChange = (tab: string) => {
    // Navigate to the specific page
    switch (tab) {
      case 'mezzi':
   navigate(`/customers/${id}/mezzi`);
        break;
      case 'sedi':
        navigate(`/customers/${id}/sedi`);
        break;
      case 'contatti':
   navigate(`/customers/${id}/contatti`);
     break;
      default:
        break;
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;

    setIsBusy(true);
    try {
      // TODO: Implement API call to delete customer
      console.log('Deleting customer:', id);
 
      // Example API call:
    // await fetch(`/api/customers/${id}`, { method: 'DELETE' });
  
      toast.success('Cliente eliminato con successo!');
      setDeleteDialogOpen(false);
      navigate('/customers/lists');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Errore durante l\'eliminazione del cliente');
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const showAllevatore = isAllevatore;
  const showAgricoltoreControterzista = isAgricoltore || isControterzista;

  console.log('Agricoltore:', isAgricoltore, 'Controterzista:', isControterzista, 'Show table:', showAgricoltoreControterzista);
  console.log('Coltura items count:', colturaItemList.length);

  // Show loading spinner while loading customer data
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
 <CircularProgress sx={{ color: '#93c54b' }} />
          <Typography sx={{ ml: 2 }}>Caricamento dati cliente...</Typography>
      </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
  <ListAltIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 400 }}>
    {isEditMode ? 'Modifica Cliente' : 'Aggiungi Cliente'}
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
   </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Edit Mode Navigation Bar */}
    {isEditMode && (
   <CustomerEditNavBar
 activeTab=""
          onTabChange={handleTabChange}
        />
    )}

      {/* Tipologia Cliente and Categoria Cliente */}
   <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>

    {/* Tipologia Cliente */}
    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
  <Paper elevation={2} sx={{ overflow: 'hidden', height: '100%' }}>
  <Box sx={{ 
  backgroundColor: '#f5f5f5', 
      borderBottom: '1px solid #ddd',
      px: 2,
 py: '5px'
  }}>

  <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '13px', textTransform: 'uppercase' }}>

   Tipologia Cliente
   </Typography>
  </Box>
       <Box sx={{ p: 1, backgroundColor: '#fff' }}>
       <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 0, columnGap: 0.5 }}>
   <FormControlLabel 
  sx={{ 
        width: '150px', 
  m: 0,
 '& .MuiFormControlLabel-label': { fontSize: '13px' },
'& .MuiCheckbox-root': { padding: '4px' }
      }}
       control={<Checkbox size="small" checked={isAgricoltore} onChange={(e) => setIsAgricoltore(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />} 
    label="Agricoltore" 
       />
  <FormControlLabel 
  sx={{ 
      width: '150px', 
m: 0,
      '& .MuiFormControlLabel-label': { fontSize: '13px' },
  '& .MuiCheckbox-root': { padding: '4px' }
      }}
  control={<Checkbox size="small" checked={isControterzista} onChange={(e) => setIsControterzista(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />} 
label="Controterzista" 
     />
<FormControlLabel 
sx={{ 
        width: '150px', 
        m: 0,
  '& .MuiFormControlLabel-label': { fontSize: '13px' },
   '& .MuiCheckbox-root': { padding: '4px' }
    }}
    control={<Checkbox size="small" checked={isAllevatore} onChange={(e) => setIsAllevatore(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />} 
  label="Allevatore" 
  />
     <FormControlLabel 
 sx={{ 
        width: '150px', 
   m: 0,
  '& .MuiFormControlLabel-label': { fontSize: '13px' },
    '& .MuiCheckbox-root': { padding: '4px' }
      }}
   control={<Checkbox size="small" checked={isEdile} onChange={(e) => setIsEdile(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />} 
 label="Edile" 
   />
  <FormControlLabel 
    sx={{ 
      width: '150px', 
m: 0,
   '& .MuiFormControlLabel-label': { fontSize: '13px' },
     '& .MuiCheckbox-root': { padding: '4px' }
      }}
control={<Checkbox size="small" checked={isMovTerra} onChange={(e) => setIsMovTerra(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />} 
    label="Mov.Terra" 
/>
 <FormControlLabel 
sx={{ 
 width: '150px', 
      m: 0,
     '& .MuiFormControlLabel-label': { fontSize: '13px' },
 '& .MuiCheckbox-root': { padding: '4px' }
 }}
    control={<Checkbox size="small" checked={isForestale} onChange={(e) => setIsForestale(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />} 
      label="Forestale" 
 />
          <FormControlLabel 
sx={{ 
width: '150px', 
  m: 0,
      '& .MuiFormControlLabel-label': { fontSize: '13px' },
  '& .MuiCheckbox-root': { padding: '4px' }
  }}
    control={<Checkbox size="small" checked={isCommerciante} onChange={(e) => setIsCommerciante(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />} 
  label="Commerciante" 
  />
    <FormControlLabel 
    sx={{ 
     width: '150px', 
  m: 0,
   '& .MuiFormControlLabel-label': { fontSize: '13px' },
  '& .MuiCheckbox-root': { padding: '4px' }
}}
   control={<Checkbox size="small" checked={isIndustria} onChange={(e) => setIsIndustria(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />} 
   label="Industria" 
    />
  <FormControlLabel 
   sx={{ 
        width: '150px', 
    m: 0,
    '& .MuiFormControlLabel-label': { fontSize: '13px' },
        '& .MuiCheckbox-root': { padding: '4px' }
      }}
        control={<Checkbox size="small" checked={isEcologia} onChange={(e) => setIsEcologia(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />} 
 label="Ecologia" 
  />
<FormControlLabel 
   sx={{ 
     width: '150px', 
m: 0,
'& .MuiFormControlLabel-label': { fontSize: '13px' },
    '& .MuiCheckbox-root': { padding: '4px' }
}}
 control={<Checkbox size="small" checked={isOfficina} onChange={(e) => setIsOfficina(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />} 
  label="Officina Meccanica" 
  />
  <FormControlLabel 
  sx={{ 
 width: '150px', 
   m: 0,
 '& .MuiFormControlLabel-label': { fontSize: '13px' },
   '& .MuiCheckbox-root': { padding: '4px' }
      }}
   control={<Checkbox size="small" checked={isEnte} onChange={(e) => setIsEnte(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />} 
    label="Ente" 
/>
   <FormControlLabel 
 sx={{ 
  width: '150px', 
        m: 0,
  '& .MuiFormControlLabel-label': { fontSize: '13px' },
 '& .MuiCheckbox-root': { padding: '4px' }
    }}
   control={<Checkbox size="small" checked={isNoleggiatore} onChange={(e) => setIsNoleggiatore(e.target.checked)} sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }} />} 
 label="Noleggiatore" 
 />
    </Box>
       </Box>
    </Paper>
        </Box>

    {/* Categoria Cliente */}
  <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>

      <Paper elevation={2} sx={{ overflow: 'hidden', height: '100%' }}>
    <Box sx={{ 
  backgroundColor: '#f5f5f5', 
     borderBottom: '1px solid #ddd',
  px: 2,
     py: '5px'
      }}>
   <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '13px', textTransform: 'uppercase' }}>

      Categoria Cliente
 </Typography>
         </Box>
<Box sx={{ p: 1, backgroundColor: '#fff' }}>
 <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 0.5, columnGap: 1 }}>
    {categoryList.map((category) => (
<FormControlLabel
    key={category.id}
  sx={{ 
  width: '160px', 
  m: 0,
      '& .MuiFormControlLabel-label': { fontSize: '13px', textTransform: 'capitalize' },
     '& .MuiCheckbox-root': { padding: '4px' }
}}
     control={
   <Checkbox
   size="small"
  checked={category.value}
    onChange={(e) => {
 const updated = categoryList.map((c) =>
  c.id === category.id ? { ...c, value: e.target.checked } : c
     );
   setCategoryList(updated);
     }}
     sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }}
   />
  }
        label={category.description.toLowerCase()}
     />
        ))}

  </Box>
  </Box>
   </Paper>
   </Box>
  </Box>

      {/* Cliente attivo */}
   <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
        <FormControlLabel
        sx={{ 
          m: 0,
            '& .MuiFormControlLabel-label': { fontSize: '13px' },
          '& .MuiCheckbox-root': { padding: '4px' }
 }}
          control={
  <Checkbox
              size="small"
            checked={isActiveCustomer}
onChange={(e) => setIsActiveCustomer(e.target.checked)}
         sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }}
       />
          }
       label="Cliente attivo"
        />
      </Box>

      {/* Form fields con larghezza 300px */}
      <Box sx={{ mb: 3 }}>
        <TextField
   fullWidth
          variant="standard"
        label="Ragione sociale"
          value={ragsoc}
          onChange={(e) => setRagsoc(e.target.value)}
        />
 </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
    variant="standard"
          label="Indirizzo"
      value={indirizzo}
          onChange={(e) => setIndirizzo(e.target.value)}
        />
      </Box>

      {/* Partita IVA e Agente - 50% ciascuno */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <TextField
          variant="standard"
          label="Partita Iva o Codice Fiscale"
          value={piva}
          onChange={(e) => setPiva(e.target.value)}
          sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
        />
        <FormControl variant="standard" sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
     <InputLabel>Agente</InputLabel>
          <Select value={agente} label="Agente" onChange={(e) => setAgente(e.target.value)}>
      <MenuItem value="">-- Selezionare l'agente --</MenuItem>
      {agentList.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.description}
       </MenuItem>
        ))}

          </Select>
        </FormControl>
      </Box>

      {/* Citta, Provincia, Privacy - 33% ciascuno */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <TextField
  variant="standard"
          label={'Citt\u00E0'}
   value={citta}
     onChange={(e) => setCitta(e.target.value)}
          sx={{ flex: '1 1 calc(33.33% - 11px)', minWidth: '200px' }}
        />
        <FormControl variant="standard" sx={{ flex: '1 1 calc(33.33% - 11px)', minWidth: '200px' }}>
       <InputLabel>Provincia</InputLabel>
     <Select value={provincia} label="Provincia" onChange={(e) => setProvincia(e.target.value)}>
<MenuItem value="">-- Selezionare la provincia --</MenuItem>
            {provinciaList.map((option) => (
     <MenuItem key={option.id} value={option.id}>
       {option.shortDescription} - {option.fullDescription}
         </MenuItem>
    ))}

   </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ flex: '1 1 calc(33.33% - 11px)', minWidth: '200px' }}>
     <InputLabel>Privacy</InputLabel>
 <Select value={privacy} label="Privacy" onChange={(e) => setPrivacy(e.target.value)}>
     <MenuItem value="">-- Selezionare Privacy --</MenuItem>
     {privacyStatusList.map((option) => (
           <MenuItem key={option.id} value={option.id}>
     {option.description}
         </MenuItem>
        ))}

          </Select>
        </FormControl>
      </Box>

      {/* CAP, Email, Invia Email, Email PEC - 4 controlli */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'flex-end' }}>
        <TextField
          variant="standard"
          label="Codice Avviamento Postale"
          value={cap}
          onChange={(e) => setCap(e.target.value)}
          sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '150px' }}
        />
 <TextField
 variant="standard"
          label="Email"
 value={email}
          onChange={(e) => setEmail(e.target.value)}
   sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '150px' }}
   />
    <FormControlLabel
   sx={{ 
       flex: '0 0 auto',
    m: 0,
  '& .MuiFormControlLabel-label': { fontSize: '13px' },
            '& .MuiCheckbox-root': { padding: '4px' }
  }}
   control={
     <Checkbox
       size="small"
      checked={isSenderEmailEnabled}
         onChange={(e) => setIsSenderEmailEnabled(e.target.checked)}
      sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }}
  />
        }
   label="Invia Email"
     />
   <TextField
          variant="standard"
      label="Email Pec"
   value={emailPec}
       onChange={(e) => setEmailPec(e.target.value)}
    sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '150px' }}
  />
      </Box>

      {/* Telefono Fisso, Cellulare, Altro telefono, Persona di riferimento - 25% ciascuno */}
   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <TextField
    variant="standard"
      label="Telefono Fisso"
     value={telefono}
 onChange={(e) => setTelefono(e.target.value)}
          sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '150px' }}
        />
        <TextField
        variant="standard"
        label="Cellulare"
     value={cellulare}
       onChange={(e) => setCellulare(e.target.value)}
          sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '150px' }}
        />
        <TextField
          variant="standard"
    label="Altro telefono"
  value={altroTelefono}
          onChange={(e) => setAltroTelefono(e.target.value)}
    sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '150px' }}
        />
        <TextField
     variant="standard"
          label="Persona di riferimento"
     value={riferimento}
    onChange={(e) => setRiferimento(e.target.value)}
   sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '150px' }}
        />
      </Box>

      {/* Spacer */}
      {showAllevatore && <Box sx={{ mb: 3 }} />}

      {/* Dati Allevamento */}
      {showAllevatore && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
    Dati Allevamento
      </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
  <FormControl variant="standard" sx={{ width: '300px' }}>
      <InputLabel>Tipologia di allevamento</InputLabel>
         <Select value={tipoAllevamento} label="Tipologia di allevamento" onChange={(e) => setTipoAllevamento(e.target.value)}>
            <MenuItem value="">-- Selezionare la tipologia --</MenuItem>
                {allevamentoTypeList.map((option) => (
      <MenuItem key={option.id} value={option.id}>
       {option.description}
       </MenuItem>
  ))}

  </Select>
            </FormControl>
            <TextField
   variant="standard"
    label="Numero di capi"
           value={numeroCapi}
    onChange={(e) => setNumeroCapi(e.target.value)}
     sx={{ width: '300px' }}
          />
       </Box>
        </Box>
      )}

      {/* Spacer */}
    {showAgricoltoreControterzista && <Box sx={{ mb: 3 }} />}

      {/* Coltura preferenziale */}
  {showAgricoltoreControterzista && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <FormControl variant="standard" sx={{ width: '300px' }}>
          <InputLabel>Coltura preferenziale</InputLabel>
          <Select value={colturaPreferita} label="Coltura preferenziale" onChange={(e) => setColturaPreferita(e.target.value)}>
     <MenuItem value="">-- Selezionare la coltura preferenziale --</MenuItem>
            {colturaTypeList.map((option) => (
    <MenuItem key={option.id} value={option.id}>
    {option.description}
      </MenuItem>
        ))}

            </Select>
          </FormControl>
  </Box>
      )}

    {/* Spacer */}
      {showAgricoltoreControterzista && <Box sx={{ mb: 3 }} />}

    {/* Tabella Colture */}
 {showAgricoltoreControterzista && (
        <Box sx={{ mb: 3, overflowX: 'auto' }}>
          <Table size="small" sx={{ '& .MuiTableCell-root': { py: 0.5 } }}>
     <TableHead>
   <TableRow>
         <TableCell>Tipologia coltura</TableCell>
              <TableCell align="right">Ettari coltivati</TableCell>
    <TableCell align="center">Coltura Biologica</TableCell>
     <TableCell align="right">Ettari Proprieta</TableCell>
       <TableCell align="right">Ettari In Affitto</TableCell>
      </TableRow>
        </TableHead>
            <TableBody>
    {colturaItemList.map((coltura) => (
    <TableRow key={coltura.colturaId}>
         <TableCell>{coltura.description}</TableCell>
         <TableCell align="right">
      <TextField
         variant="standard"
           size="small"
            value={coltura.ettariColtivati}
     onChange={(e) => {
     const updated = colturaItemList.map((c) =>
    c.colturaId === coltura.colturaId ? { ...c, ettariColtivati: e.target.value } : c
     );
      setColturaItemList(updated);
  }}
            inputProps={{ style: { textAlign: 'right' } }}
 />
                  </TableCell>
<TableCell align="center">
        <Checkbox
          checked={coltura.colturaBiologica}
      onChange={(e) => {
     const updated = colturaItemList.map((c) =>
      c.colturaId === coltura.colturaId ? { ...c, colturaBiologica: e.target.checked } : c
);
      setColturaItemList(updated);
         }}
    sx={{ color: '#93c54b', '&.Mui-checked': { color: '#93c54b' } }}
          />
        </TableCell>
   <TableCell align="right">
          <TextField
     variant="standard"
        size="small"
 value={coltura.ettariProprieta}
        onChange={(e) => {
         const updated = colturaItemList.map((c) =>
                 c.colturaId === coltura.colturaId ? { ...c, ettariProprieta: e.target.value } : c
    );
           setColturaItemList(updated);
    }}
            inputProps={{ style: { textAlign: 'right' } }}
     />
         </TableCell>
<TableCell align="right">
        <TextField
           variant="standard"
       size="small"
           value={coltura.ettariInAffitto}
       onChange={(e) => {
    const updated = colturaItemList.map((c) =>
     c.colturaId === coltura.colturaId ? { ...c, ettariInAffitto: e.target.value } : c
            );
  setColturaItemList(updated);
   }}
              />
 </TableCell>
    </TableRow>
 ))}

        </TableBody>
  </Table>
        </Box>
      )}

    {/* Spacer */}


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
      Salva
     </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle sx={{ backgroundColor: '#d32f2f', color: 'white' }}>
          Conferma Eliminazione
      </DialogTitle>
    <DialogContent sx={{ mt: 2 }}>
 <DialogContentText>
 Sei sicuro di voler eliminare il cliente <strong>"{ragsoc}"</strong>?
     <br />
          <br />
            Questa azione non pu� essere annullata.
          </DialogContentText>
        </DialogContent>
   <DialogActions sx={{ p: 2 }}>
    <Button 
     onClick={handleDeleteCancel}
            variant="outlined"
            sx={{ 
      color: '#666',
borderColor: '#666',
     '&:hover': {
    borderColor: '#333',
backgroundColor: 'rgba(0, 0, 0, 0.04)',
         }
          }}
          >
     Annulla
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
 variant="contained"
            disabled={isBusy}
 sx={{ 
              backgroundColor: '#d32f2f',
          color: 'white',
       '&:hover': {
   backgroundColor: '#b71c1c',
              },
       }}
      startIcon={isBusy ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
        {isBusy ? 'Eliminazione...' : 'Elimina'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bottom Spacers */}
<Box sx={{ mb: 2 }} />
    </Container>
  );
};

export default CustomersCreate;
