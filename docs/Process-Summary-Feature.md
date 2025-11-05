# Feature: Process Summary - Elementi da Confermare

## Descrizione
Aggiunta di un sistema per mostrare un pulsante di notifica nella pagina lista clienti quando ci sono elementi in attesa di conferma.

## API Endpoint
```
GET /process/GetSummary
```

## Struttura Risposta API
```json
{
  "totalNewElements": 0,
  "totalModifiedElements": 0,
  "existNewElements": true,
  "existModifiedElements": true,
  "newCustomers": 0,
  "modifiedCustomers": 0,
  "newDestinations": 0,
  "modifiedDestinations": 0,
  "newReferences": 0,
  "modifiedReferences": 0,
  "newItems": 0,
  "modifiedItems": 0
}
```

## Logica di Visualizzazione
Il pulsante "Ci sono degli elementi da confermare" viene mostrato quando **almeno uno** dei seguenti valori è maggiore di 0:

- `totalNewElements`
- `totalModifiedElements`
- `newCustomers`
- `modifiedCustomers`
- `newDestinations`
- `modifiedDestinations`
- `newReferences`
- `modifiedReferences`
- `newItems`
- `modifiedItems`

## Posizionamento
Il pulsante appare:
- Solo per utenti con privilegi amministrativi (`hasAdministrativeGrants`)
- Tra il titolo "Clienti" e il pulsante "Esporta Excel"
- Centrato orizzontalmente
- Con stile arancione per distinguerlo dagli altri pulsanti

## Comportamento
Quando cliccato, il pulsante naviga alla route `/summary` per gestire gli elementi in attesa.

## File Modificati
1. **`src/services/customers.service.ts`**
   - Aggiunta interfaccia `ProcessSummary`
   - Aggiunto metodo `getProcessSummary()`

2. **`src/pages/CustomersList.tsx`**
   - Aggiornato import per includere `ProcessSummary`
   - Aggiornato stato `summary` per usare il nuovo tipo
   - Implementata funzione `loadSummary()` con chiamata API reale
   - Aggiunta funzione helper `hasElementsToConfirm()`
   - Sostituito Alert con Button per la notifica
   - Rimossi import non utilizzati

## Stile del Pulsante
```jsx
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
```

## Testo del Pulsante
```
"Ci sono degli elementi da confermare"
```