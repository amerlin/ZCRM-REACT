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
  ContactPage as ContactPageIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import customersService, { type ReferenceDifferences, type Reference } from '../services/customers.service';

// Tipo esteso per includere customerDescription
type ReferenceWithCustomer = Reference & { customerDescription?: string };

const ContactDifferences = () => {
  const { id, confirmedId } = useParams<{ id: string; confirmedId: string }>();
  const navigate = useNavigate();
  const [isBusy, setIsBusy] = useState(false);
  const [differences, setDifferences] = useState<ReferenceDifferences[]>([]);
  const [referenceInfo, setReferenceInfo] = useState<ReferenceWithCustomer | null>(null);

  useEffect(() => {
    const loadDifferences = async () => {
      if (!id || !confirmedId) return;
      
      console.log('Loading differences - id:', id, 'confirmedId:', confirmedId);
      setIsBusy(true);
      
      let referenceData: Reference | null = null;
      let differencesData: ReferenceDifferences[] = [];
      
      // Prima chiamata: getReferenceById con confirmedId per ottenere customerDescription
      try {
        console.log('Calling getReferenceById with confirmedId:', confirmedId);
        referenceData = await customersService.getReferenceById(confirmedId);
        console.log('Reference data received:', referenceData);
        setReferenceInfo(referenceData);
      } catch (error) {
        console.error('Error loading reference:', error);
        toast.error('Errore nel caricamento delle informazioni di riferimento');
      }
      
      // Seconda chiamata: getReferenceDifferences con id
      try {
        console.log('Calling getReferenceDifferences with id:', id);
        differencesData = await customersService.getReferenceDifferences(id);
        console.log('Differences data received:', differencesData);
        setDifferences(differencesData);
      } catch (error) {
        console.error('Error loading differences:', error);
        toast.error('Errore nel caricamento delle differenze del contatto');
      }
      
      setIsBusy(false);
    };

    if (id) {
      loadDifferences();
    }
  }, [id, confirmedId]);

  const handleGoBack = () => {
    navigate('/confirm/contacts');
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
        <ContactPageIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Differenze Contatto
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
                  // Provo con customerDescription dal reference
                  const customerName = referenceInfo?.customerDescription || 
                                     'N/A';
                  console.log('Displaying customer name:', customerName, {
                    referenceInfo: referenceInfo
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
              Impossibile caricare le differenze del contatto.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ContactDifferences;