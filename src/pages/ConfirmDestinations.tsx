import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  LocationOn as LocationOnIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import customersService, { type ConfirmDestination } from '../services/customers.service';

const ConfirmDestinations = () => {
  const navigate = useNavigate();
  const [isBusy, setIsBusy] = useState(false);
  const [destinations, setDestinations] = useState<ConfirmDestination[]>([]);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    setIsBusy(true);
    try {
      const destinationsData = await customersService.getConfirmDestinations();
      setDestinations(destinationsData);
    } catch (error) {
      console.error('Error loading destinations to confirm:', error);
      toast.error('Errore nel caricamento delle destinazioni da confermare');
    } finally {
      setIsBusy(false);
    }
  };

  const handleRefresh = () => {
    loadDestinations();
  };

  const handleConfirm = async (id: string) => {
    try {
      await customersService.confirmDestination(id);
      toast.success('Modifiche confermate con successo');
      // Ricarica la lista dopo la conferma
      loadDestinations();
    } catch (error) {
      console.error('Error confirming destination:', error);
      toast.error('Errore nella conferma delle modifiche');
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await customersService.dismissDestination(id);
      toast.success('Modifiche dismesse con successo');
      // Ricarica la lista dopo la dismissione
      loadDestinations();
    } catch (error) {
      console.error('Error dismissing destination:', error);
      toast.error('Errore nella dismissione delle modifiche');
    }
  };

  const handleView = (id: string, confirmedId: string) => {
    // Naviga alla pagina delle differenze passando entrambi gli ID nella URL
    console.log('Visualizza modifiche destinazione - id:', id, 'confirmedId:', confirmedId);
    navigate(`/confirm/destinations/differences/${id}/${confirmedId}`);
  };

  const columns: GridColDef[] = [
    { 
      field: 'customerName', 
      headerName: 'Cliente', 
      flex: 2,
      minWidth: 200,
    },
    { 
      field: 'description', 
      headerName: 'Descrizione', 
      flex: 2,
      minWidth: 150,
    },
    { 
      field: 'address', 
      headerName: 'Indirizzo', 
      flex: 2,
      minWidth: 180,
    },
    { 
      field: 'city', 
      headerName: 'Città', 
      flex: 1,
      minWidth: 120,
    },
    { 
      field: 'typeDescription', 
      headerName: 'Tipo Sede', 
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'actions',
      headerName: 'Azioni',
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
          {(() => {
            console.log('Destination Button render - id:', params.row.id, 'confirmedId:', params.row.confirmedId);
            console.log('Destination Are they equal?', params.row.id === params.row.confirmedId);
            const isDisabled = params.row.id === params.row.confirmedId || 
                              params.row.confirmedId === "0" || 
                              params.row.confirmedId === 0 || 
                              !params.row.confirmedId;
            console.log('Destination Is disabled:', isDisabled);
            return null;
          })()}
          <IconButton
            size="small"
            onClick={() => handleConfirm(params.row.id)}
            sx={{ 
              color: '#4caf50',
              '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' }
            }}
            title="Conferma modifiche"
          >
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDismiss(params.row.id)}
            sx={{ 
              color: '#f44336',
              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
            }}
            title="Dismissi modifiche"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleView(params.row.id, params.row.confirmedId)}
            disabled={
              params.row.id === params.row.confirmedId ||
              params.row.confirmedId === "0" || 
              params.row.confirmedId === 0 || 
              !params.row.confirmedId
            }
            sx={{ 
              color: (params.row.id === params.row.confirmedId ||
                     params.row.confirmedId === "0" || 
                     params.row.confirmedId === 0 || 
                     !params.row.confirmedId) ? '#ccc' : '#2196f3',
              '&:hover': { 
                backgroundColor: (params.row.id === params.row.confirmedId ||
                               params.row.confirmedId === "0" || 
                               params.row.confirmedId === 0 || 
                               !params.row.confirmedId)
                  ? 'transparent' 
                  : 'rgba(33, 150, 243, 0.1)' 
              },
              cursor: (params.row.id === params.row.confirmedId ||
                      params.row.confirmedId === "0" || 
                      params.row.confirmedId === 0 || 
                      !params.row.confirmedId) ? 'not-allowed' : 'pointer'
            }}
            title={
              params.row.id === params.row.confirmedId ? 
                "I record sono identici, nessuna differenza da visualizzare" :
                (params.row.confirmedId === "0" || params.row.confirmedId === 0 || !params.row.confirmedId) ?
                  "Nessuna differenza disponibile" : 
                  "Visualizza modifiche"
            }
          >
            <VisibilityIcon fontSize="small" />
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
          <LocationOnIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 400 }}>
            Destinazioni da Confermare
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/summary')}
            sx={{
              borderColor: '#93c54b',
              color: '#93c54b',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              fontSize: '11px',
              '&:hover': {
                borderColor: '#7db33c',
                backgroundColor: 'rgba(147, 197, 75, 0.1)',
              },
            }}
          >
            Torna al Summary
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isBusy}
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
            Aggiorna
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* DataGrid */}
      <Box sx={{ mb: 3, height: 500, width: '100%' }}>
        {isBusy ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px' }}>
            <CircularProgress sx={{ color: '#93c54b' }} />
            <Typography sx={{ ml: 2 }}>Caricamento...</Typography>
          </Box>
        ) : (
          <DataGrid
            rows={destinations}
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

      {/* Empty State */}
      {!isBusy && destinations.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <LocationOnIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 1 }}>
            Nessuna destinazione da confermare
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tutte le destinazioni sono già state confermate.
          </Typography>
        </Box>
      )}

      {/* Bottom Spacer */}
      <Box sx={{ mb: 2 }} />
    </Container>
  );
};

export default ConfirmDestinations;