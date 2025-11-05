import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Divider,
  IconButton,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Business as SediIcon,
  ChevronLeft as ChevronLeftIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import customersService from '../services/customers.service';
import type { Destination } from '../services/customers.service';
import { toast } from 'react-toastify';

interface CustomerInfo {
  ragsoc: string;
  indirizzo: string;
  citta: string;
  provincia: string;
}

const CustomerSedi = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [sedi, setSedi] = useState<Destination[]>([]);

  const loadCustomerInfo = useCallback(async () => {
    if (!id) return;
    try {
      const summary = await customersService.getCustomerSummary(id);
      setCustomerInfo({
        ragsoc: summary.descr1,
        indirizzo: summary.address,
        citta: summary.city,
        provincia: summary.province,
      });
    } catch (error) {
      console.error('Error loading customer summary:', error);
      toast.error('Errore nel caricamento dei dati del cliente');
    }
  }, [id]);

  const loadSedi = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      // Chiamata API per recuperare le sedi del cliente
      const destinationsData = await customersService.getDestinationsByCustomerId(id);
      setSedi(destinationsData);
    } catch (error) {
      console.error('Error loading sedi:', error);
      toast.error('Errore nel caricamento delle sedi');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCustomerInfo();
    loadSedi();
  }, [loadCustomerInfo, loadSedi]);

  const handleAddSede = () => {
    navigate(`/customers/${id}/sedi/create`);
  };

  const handleEditSede = (sedeId: string) => {
    navigate(`/customers/${id}/sedi/${sedeId}/edit`);
  };

  const columns: GridColDef[] = [
    {
      field: 'descr1',
      headerName: 'Denominazione',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'address',
      headerName: 'Indirizzo',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'city',
      headerName: 'Città',
      width: 130,
    },
    {
      field: 'DestinationType',
      headerName: 'Tipo Destinazione',
      width: 150,
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
            onClick={() => handleEditSede(params.row.id)}
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
   <Box sx={{ display: 'flex', alignItems: 'center' }}>
     <SediIcon sx={{ mr: 1, fontSize: 32 }} />
  <Typography variant="h4" component="h2" sx={{ fontWeight: 400 }}>
     SEDI Cliente
          </Typography>
</Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
  <Button
  variant="contained"
      startIcon={<AddIcon />}
       onClick={handleAddSede}
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
        Aggiungi Sede
          </Button>
        <IconButton
          onClick={() => navigate(`/customers/edit/${id}`)}
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

      {/* Sedi DataGrid */}
      <Box sx={{ mb: 3, height: 500, width: '100%' }}>
{isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px' }}>
   <CircularProgress sx={{ color: '#93c54b' }} />
     <Typography sx={{ ml: 2 }}>Caricamento sedi...</Typography>
          </Box>
        ) : sedi.length === 0 ? (
          <Box sx={{ 
   border: '1px dashed #ccc', 
   borderRadius: 1, 
         p: 4, 
        textAlign: 'center',
         minHeight: '300px',
            display: 'flex',
 alignItems: 'center',
          justifyContent: 'center',
            backgroundColor: '#fafafa',
          }}>
         <Typography variant="h6" color="text.secondary">
           Non sono state trovate sedi per il cliente selezionato.
            </Typography>
          </Box>
  ) : (
  <DataGrid
       rows={sedi}
            columns={columns}
            initialState={{
              pagination: {
        paginationModel: { pageSize: 10, page: 0 },
              },
  filter: {
        filterModel: {
    items: [],
       },
              },
       }}
     pageSizeOptions={[10, 25, 50]}
        checkboxSelection={false}
  disableRowSelectionOnClick
     slots={{
    toolbar: GridToolbar,
          }}
 slotProps={{
              toolbar: {
            showQuickFilter: true,
    quickFilterProps: { debounceMs: 500 },
  },
   }}
      sx={{
              border: '1px solid #ddd',
       '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
         },
        '& .MuiDataGrid-cell:focus': {
       outline: 'none',
 },
    '& .MuiDataGrid-cell:focus-within': {
         outline: 'none',
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
 />
        )}
      </Box>
    </Container>
  );
};

export default CustomerSedi;
