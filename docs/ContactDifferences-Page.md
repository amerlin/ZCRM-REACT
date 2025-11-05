# Contact Differences Page - Visualizzazione Differenze Contatti

## Panoramica
La pagina `ContactDifferences` permette agli utenti di visualizzare nel dettaglio le modifiche proposte per un contatto specifico che necessita di conferma.

## Accesso alla Pagina
- **Rotta**: `/confirm/contacts/differences/{id}`
- **Navigazione**: Dalla pagina "Conferma Contatti" cliccando sull'icona dell'occhio (👁) "Visualizza modifiche"

## Funzionalità

### API Integration
- **Endpoint**: `GET /references/GetDifference/{id}`
- **Service Method**: `customersService.getReferenceDifferences(id)`
- **Response Type**: `ReferenceDifferences`

### Struttura dei Dati
```typescript
export interface ReferenceDifferences {
  id: string;
  customerId: string;
  customerName: string;
  differences: Array<{
    field: string;
    oldValue: string;
    newValue: string;
  }>;
}
```

### Componenti UI

#### Header Section
- **Pulsante "Indietro"**: Ritorna alla pagina `/confirm/contacts`
- **Titolo**: "Differenze Contatto" con icona ContactPage
- **Divider**: Separazione visiva

#### Customer Information Card
- **Cliente**: Nome del cliente
- **ID Contatto**: Identificativo del contatto

#### Differences Table
- **Tabella comparativa** con colonne:
  - **Campo**: Nome del campo modificato
  - **Valore Precedente**: Valore originale (rosso)
  - **Nuovo Valore**: Valore proposto (verde)

### Stati della Pagina

#### Loading State
- **CircularProgress**: Indicatore di caricamento durante il fetch dei dati
- **Posizionamento**: Centrato nella pagina

#### Error State
- **Toast Error**: Messaggio di errore in caso di fallimento API
- **Fallback UI**: Card con messaggio "Impossibile caricare le differenze"

#### Empty State
- **Nessuna differenza**: Messaggio quando non ci sono modifiche da mostrare

### Navigation Flow

```
ConfirmContacts Page
       ↓ (click eye icon)
ContactDifferences Page
       ↓ (click back button)
ConfirmContacts Page
```

### Error Handling
- **Try/Catch**: Gestione errori API
- **Toast Notifications**: Feedback utente
- **Console Logging**: Debug information
- **Graceful Degradation**: UI alternativa in caso di errore

### Styling
- **Material-UI Components**: Card, Table, Typography, Button
- **Color Coding**: 
  - Valori precedenti: `color: 'error.main'` (rosso)
  - Nuovi valori: `color: 'success.main'` (verde)
- **Responsive Design**: Container con `maxWidth="lg"`

## Struttura File
```
src/
├── pages/
│   ├── ContactDifferences.tsx     # Pagina principale
│   └── ConfirmContacts.tsx        # Pagina di origine (aggiornata)
├── services/
│   └── customers.service.ts       # Service API (aggiornato)
└── App.tsx                        # Routing (aggiornato)
```

## Modifiche Correlate

### ConfirmContacts.tsx
- **handleView**: Aggiornato per navigare a `/confirm/contacts/differences/{id}`
- **Parametri**: Rimosso `customerId` non utilizzato

### customers.service.ts
- **Nuova interfaccia**: `ReferenceDifferences`
- **Nuovo metodo**: `getReferenceDifferences(referenceId: string)`
- **Endpoint**: `/references/GetDifference/{referenceId}`

### App.tsx
- **Nuova rotta**: `/confirm/contacts/differences/:id`
- **Import**: `ContactDifferences` component

## Note per lo Sviluppo
- L'interfaccia `ReferenceDifferences` è attualmente una struttura temporanea
- Una volta fornito il modello dati esatto dall'API, l'interfaccia dovrà essere aggiornata
- La pagina è completamente tipizzata con TypeScript
- Gestione completa degli stati di loading, error e empty