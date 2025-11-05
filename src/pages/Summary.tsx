import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import customersService, { type ProcessSummary } from '../services/customers.service';

const Summary = () => {
  const navigate = useNavigate();
  const [isBusy, setIsBusy] = useState(false);
  const [summary, setSummary] = useState<ProcessSummary | null>(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setIsBusy(true);
    try {
      const summaryData = await customersService.getProcessSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading process summary:', error);
      toast.error('Errore nel caricamento del riassunto processi');
    } finally {
      setIsBusy(false);
    }
  };

  const handleRefresh = () => {
    loadSummary();
  };

  const renderSummaryCard = (title: string, newCount: number, modifiedCount: number, modifiedClickRoute?: string, newClickRoute?: string) => {
    // Debug log per verificare i parametri
    console.log(`renderSummaryCard - ${title}:`, { newCount, modifiedCount, modifiedClickRoute, newClickRoute });
    
    const isModifiedClickable = modifiedClickRoute && modifiedCount > 0;
    const isNewClickable = newClickRoute && newCount > 0;
    console.log(`${title} - isModifiedClickable:`, isModifiedClickable, 'isNewClickable:', isNewClickable);
    
    return (
      <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
        <Card sx={{ height: '100%', border: '1px solid #ddd' }}>
          <CardContent>
            <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Nuovi:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: newCount > 0 ? '#f57c00' : 'inherit',
                  cursor: isNewClickable ? 'pointer' : 'default',
                  textDecoration: isNewClickable ? 'underline' : 'none',
                  '&:hover': isNewClickable ? { 
                    color: '#ef6c00' 
                  } : {}
                }}
                onClick={() => {
                  console.log(`Click su ${title} NUOVI - newCount: ${newCount}, route: ${newClickRoute}`);
                  if (isNewClickable) {
                    console.log(`Navigating to: ${newClickRoute}`);
                    navigate(newClickRoute);
                  }
                }}
              >
                {newCount}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Modificati:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: modifiedCount > 0 ? '#f57c00' : 'inherit',
                  cursor: isModifiedClickable ? 'pointer' : 'default',
                  textDecoration: isModifiedClickable ? 'underline' : 'none',
                  '&:hover': isModifiedClickable ? { 
                    color: '#ef6c00' 
                  } : {}
                }}
                onClick={() => {
                  console.log(`Click su ${title} MODIFICATI - modifiedCount: ${modifiedCount}, route: ${modifiedClickRoute}`);
                  if (isModifiedClickable) {
                    console.log(`Navigating to: ${modifiedClickRoute}`);
                    navigate(modifiedClickRoute);
                  }
                }}
              >
                {modifiedCount}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      {/* Header with title and action buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 400 }}>
            Modifiche da confermare
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/customers/lists')}
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
            Torna alla Lista
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

      {/* Loading State */}
      {isBusy && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress sx={{ color: '#93c54b' }} />
          <Typography sx={{ ml: 2 }}>Caricamento...</Typography>
        </Box>
      )}

      {/* Summary Content */}
      {!isBusy && summary && (
        <>
          {/* Summary Totals */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Riepilogo Generale
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <Card sx={{ backgroundColor: '#e3f2fd', border: '1px solid #2196f3' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                      Totale Elementi Nuovi
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                      {summary.totalNewElements}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <Card sx={{ backgroundColor: '#fff3e0', border: '1px solid #ff9800' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                      Totale Elementi Modificati
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                      {summary.totalModifiedElements}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>

          {/* Detailed Summary */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Dettaglio per Categoria
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {renderSummaryCard('Clienti', summary.newCustomers, summary.modifiedCustomers)}
              {renderSummaryCard('Destinazioni', summary.newDestinations, summary.modifiedDestinations, '/confirm/destinations', '/confirm/destinations')}
              {renderSummaryCard('Contatti', summary.newReferences, summary.modifiedReferences, '/confirm/contacts', '/confirm/contacts')}
              {renderSummaryCard('Mezzi', summary.newItems, summary.modifiedItems)}
            </Box>
          </Box>
        </>
      )}

      {/* No Data State */}
      {!isBusy && summary && (
        summary.totalNewElements === 0 && summary.totalModifiedElements === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 1 }}>
              Nessuna modifica da confermare
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tutti gli elementi sono già stati confermati.
            </Typography>
          </Box>
        )
      )}

      {/* Error State */}
      {!isBusy && !summary && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Errore nel caricamento dei dati
          </Typography>
          <Button
            variant="contained"
            onClick={handleRefresh}
            sx={{
              backgroundColor: '#93c54b',
              '&:hover': { backgroundColor: '#7db33c' },
            }}
          >
            Riprova
          </Button>
        </Box>
      )}

      {/* Bottom Spacer */}
      <Box sx={{ mb: 2 }} />
    </Container>
  );
};

export default Summary;