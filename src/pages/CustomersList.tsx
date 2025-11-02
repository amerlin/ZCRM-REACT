import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  ListAlt as ListAltIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FileDownload as FileDownloadIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import customersService from '../services/customers.service';

interface Summary {
  esistnewelement?: boolean;
  esistmodifiedelement?: boolean;
}

interface Customer {
  id: string;
  descr1: string;
  typology: string;
  city: string;
  prov: string;
}

const CustomersList = () => {
  const navigate = useNavigate();
  const { hasAdministrativeGrants } = useAuth();
  const [isBusy, setIsBusy] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    // TODO: TEMPORARILY DISABLED - Re-enable authentication check later
    // Redirect if not authenticated
    // if (!isAuthenticated) {
    //   navigate('/sign-in');
    //   return;
    // }

    // Load summary if admin
    if (hasAdministrativeGrants) {
      loadSummary();
    }

    // Load customers list
    loadCustomers();
  }, [hasAdministrativeGrants]); // Removed isAuthenticated and navigate from dependencies

  const loadSummary = async () => {
    // TODO: Implement API call to fetch summary
    console.log('Load summary...');
    setSummary({ esistnewelement: false, esistmodifiedelement: false });
  };

  const loadCustomers = async () => {
    setIsBusy(true);
    try {
      // Fetch customers from the service
  const data = await customersService.getGrid();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Errore nel caricamento dei clienti');
    } finally {
      setIsBusy(false);
    }
  };

  const handleExportToExcel = () => {
    // TODO: Implement Excel export functionality
    console.log('Export to Excel...');
  };

  const handleEdit = (id: string) => {
    navigate(`/customers/edit/${id}`);
  };

  const columns: GridColDef[] = [
    { 
      field: 'descr1', 
      headerName: 'Ragione Sociale', 
      flex: 2,
      minWidth: 250,
    },
    { 
      field: 'typology', 
      headerName: 'Tipologia', 
      flex: 1,
      minWidth: 150,
    },
    { 
      field: 'city', 
      headerName: 'Città', 
      flex: 1,
      minWidth: 150,
    },
    { 
      field: 'prov', 
      headerName: 'Provincia', 
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
  field: 'actions',
      headerName: 'Azioni',
      width: 80,
 sortable: false,
  filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    <IconButton
 size="small"
      onClick={() => handleEdit(params.row.id)}
 sx={{ 
          color: '#93c54b',
            '&:hover': { backgroundColor: 'rgba(147, 197, 75, 0.1)' }
            }}
       >
    <EditIcon fontSize="small" />
          </IconButton>
        </Box>
   ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      {/* Header with title and action buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
  {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ListAltIcon sx={{ mr: 1, fontSize: 32 }} />
   <Typography variant="h4" component="h2" sx={{ fontWeight: 400 }}>
    Clienti
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
    <Button
         variant="contained"
 startIcon={<FileDownloadIcon />}
       onClick={handleExportToExcel}
        sx={{
 backgroundColor: '#93c54b',
textTransform: 'uppercase',
  fontWeight: 'bold',
        fontSize: '11px',
      '&:hover': {
 backgroundColor: '#7db33c',
   },
   }}
    >
        Esporta Excel
      </Button>
<Button
      variant="contained"
  startIcon={<SearchIcon />}
       onClick={() => navigate('/customers/search')}
  sx={{
   backgroundColor: '#93c54b',
     textTransform: 'uppercase',
   fontWeight: 'bold',
    fontSize: '11px',
    '&:hover': {
      backgroundColor: '#7db33c',
       },
            }}
       >
    Ricerca Avanzata
 </Button>
          <Button
  variant="contained"
     startIcon={<AddIcon />}
         onClick={() => navigate('/customers/create')}
    sx={{
      backgroundColor: '#93c54b',
              textTransform: 'uppercase',
     fontWeight: 'bold',
          fontSize: '11px',
        '&:hover': {
      backgroundColor: '#7db33c',
        },
   }}
          >
        Aggiungi
          </Button>
    </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Admin Alert - Show only if there are pending confirmations */}
      {hasAdministrativeGrants && (summary?.esistnewelement || summary?.esistmodifiedelement) && (
        <Box sx={{ mb: 3 }}>
          <Alert 
 severity="warning"
         sx={{ 
            backgroundColor: '#93c54b',
   color: 'white',
  '& .MuiAlert-icon': {
      color: 'white',
         },
          }}
 onClick={() => navigate('/summary')}
  style={{ cursor: 'pointer' }}
     >
       <Typography variant="h6" sx={{ fontWeight: 500 }}>
Attenzione esistono elementi da confermare
</Typography>
          </Alert>
   </Box>
      )}

      {/* DataGrid */}
  <Box sx={{ mb: 3, height: 500, width: '100%' }}>
  {isBusy ? (
     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px' }}>
   <CircularProgress sx={{ color: '#93c54b' }} />
          <Typography sx={{ ml: 2 }}>Loading...</Typography>
    </Box>
        ) : (
          <DataGrid
        rows={customers}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 15, page: 0 },
          },
          filter: {
            filterModel: {
              items: [],
            },
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        checkboxSelection={false}
        disableRowSelectionOnClick
        rowHeight={32}
        sx={{
          border: '1px solid #ddd',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold',
            minHeight: 32,
            height: 32,
          },
          '& .MuiDataGrid-cell': {
            padding: '4px 8px',
            fontSize: '13px',
            minHeight: 32,
            height: 32,
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-row': {
            minHeight: 32,
            height: 32,
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(147, 197, 75, 0.08)',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: 'transparent',
          },
          '& .MuiDataGrid-row.Mui-selected:hover': {
            backgroundColor: 'rgba(147, 197, 75, 0.08)',
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: '8px',
            gap: '8px',
            '& .MuiButton-root': {
              fontSize: '11px',
              textTransform: 'uppercase',
            },
          },
        }}
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
        )}
      </Box>

    {/* Bottom Spacers */}
      <Box sx={{ mb: 2 }} />

    </Container>
  );
};

export default CustomersList;
