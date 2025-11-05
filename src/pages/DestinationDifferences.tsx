import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import customersService, { type ReferenceDifferences, type DestinationDetail } from '../services/customers.service';

const DestinationDifferences = () => {
  const { id, confirmedId } = useParams<{ id: string; confirmedId: string }>();
  const navigate = useNavigate();
  const [isBusy, setIsBusy] = useState(false);
  const [differences, setDifferences] = useState<ReferenceDifferences[]>([]);
  const [destinationInfo, setDestinationInfo] = useState<DestinationDetail | null>(null);

  useEffect(() => {
    const loadDifferences = async () => {
      if (!id || !confirmedId) return;
      
      console.log('Loading destination differences - id:', id, 'confirmedId:', confirmedId);
      setIsBusy(true);
      
      let destinationData: DestinationDetail | null = null;
      let differencesData: ReferenceDifferences[] = [];
      
      // Prima chiamata: getDestinationById con confirmedId per ottenere customerDescription
      try {
        console.log('Calling getDestinationById with confirmedId:', confirmedId);
        destinationData = await customersService.getDestinationById(confirmedId);
        console.log('Destination data received:', destinationData);
        setDestinationInfo(destinationData);
      } catch (error) {
        console.error('Error loading destination:', error);
        toast.error('Errore nel caricamento delle informazioni di destinazione');
      }
      
      // Seconda chiamata: getDestinationDifferences con id
      try {
        console.log('Calling getDestinationDifferences with id:', id);
        differencesData = await customersService.getDestinationDifferences(id);
        console.log('Differences data received:', differencesData);
        setDifferences(differencesData);
      } catch (error) {
        console.error('Error loading differences:', error);
        toast.error('Errore nel caricamento delle differenze della destinazione');
      }
      
      setIsBusy(false);
    };

    if (id && confirmedId) {
      loadDifferences();
    }
  }, [id, confirmedId]);

  const handleGoBack = () => {
    navigate('/confirm/destinations');
  };

  if (isBusy) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mr: 2 }}
        >
          Indietro
        </Button>
        <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Differenze Destinazione
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {differences ? (
        <>
          {/* Customer Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informazioni Cliente
              </Typography>
              <Typography variant="body1">
                <strong>Cliente:</strong> {(() => {
                  // Provo con customerDescription dalla destinazione
                  const customerName = (destinationInfo as unknown as any)?.customerDescription || 
                                     'N/A';
                  console.log('Displaying customer name:', customerName, {
                    destinationInfo: destinationInfo
                  });
                  return customerName;
                })()}
              </Typography>
            </CardContent>
          </Card>

          {/* Differences Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Modifiche Proposte
              </Typography>
              {(() => {
                console.log('Rendering differences:', differences);
                console.log('Differences length:', differences?.length);
                console.log('Differences array:', JSON.stringify(differences, null, 2));
                
                if (differences && differences.length > 0) {
                  return (
                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Campo</strong></TableCell>
                            <TableCell><strong>Valore Precedente</strong></TableCell>
                            <TableCell><strong>Nuovo Valore</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {differences.map((diff, index) => {
                            console.log(`Rendering diff ${index}:`, diff);
                            return (
                              <TableRow key={index}>
                                <TableCell>{diff.propName}</TableCell>
                                <TableCell sx={{ color: 'error.main' }}>
                                  {diff.oldValue || <em>vuoto</em>}
                                </TableCell>
                                <TableCell sx={{ color: 'success.main' }}>
                                  {diff.newValue || <em>vuoto</em>}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  );
                } else {
                  return (
                    <Typography color="textSecondary">
                      Nessuna differenza disponibile. (Array length: {differences?.length || 'undefined'})
                    </Typography>
                  );
                }
              })()}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent>
            <Typography color="textSecondary" align="center">
              Impossibile caricare le differenze della destinazione.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default DestinationDifferences;