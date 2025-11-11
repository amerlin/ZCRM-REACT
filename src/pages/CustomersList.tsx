import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
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
import customersService, { type ProcessSummary } from '../services/customers.service';

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
  const [summary, setSummary] = useState<ProcessSummary | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    // TODO: TEMPORARILY DISABLED - Re-enable authentication check later
    // Redirect if not authenticated
    // if (!isAuthenticated) {
    //   navigate('/sign-in');
    //   return;
    // }

    console.log('hasAdministrativeGrants:', hasAdministrativeGrants);

    // Load summary always (admin check disabled)
    loadSummary();

    // Load customers list
    loadCustomers();
  }, [hasAdministrativeGrants]); // Removed isAuthenticated and navigate from dependencies

  const loadSummary = async () => {
    try {
      const summaryData = await customersService.getProcessSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading process summary:', error);
      toast.error('Errore nel caricamento del riassunto processi');
    }
  };

  // Helper function to check if there are elements to confirm
  const hasElementsToConfirm = (summary: ProcessSummary | null): boolean => {
    if (!summary) return false;
    
    return summary.totalNewElements > 0 ||
           summary.totalModifiedElements > 0 ||
           summary.newCustomers > 0 ||
           summary.modifiedCustomers > 0 ||
           summary.newDestinations > 0 ||
           summary.modifiedDestinations > 0 ||
           summary.newReferences > 0 ||
           summary.modifiedReferences > 0 ||
           summary.newItems > 0 ||
           summary.modifiedItems > 0;
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

  const handleExportToExcel = async () => {
    try {
      setIsBusy(true);
      console.log('Exporting to Excel...');
      
      const blob = await customersService.exportExcel();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customers.xlsx');
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Export completato con successo');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Errore durante l\'export Excel');
    } finally {
      setIsBusy(false);
    }
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

      {/* Confirmation Button - Show if there are pending confirmations (admin check disabled) */}
      {hasElementsToConfirm(summary) && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/summary')}
            sx={{
              backgroundColor: '#f57c00',
              color: 'white',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              fontSize: '11px',
              '&:hover': {
                backgroundColor: '#ef6c00',
              },
            }}
          >
            Ci sono degli elementi da confermare
          </Button>
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
