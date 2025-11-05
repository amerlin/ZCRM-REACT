# Pagina ConfirmContacts - Conferma Contatti Modificati

## Descrizione
La pagina `/confirm/contacts` mostra una tabella di tutti i contatti che necessitano di conferma dopo essere stati modificati.

## Rotta
```
/confirm/contacts
```

## Navigazione
- **Accesso da**: Cliccando sul numero "Modificati" nella card "Contatti" della pagina Summary
- **Ritorno a**: Pagina Summary (`/summary`)

## Funzionalità

### 1. **Tabella Contatti da Confermare**
Mostra una DataGrid con le seguenti colonne:
- **Cliente**: Nome del cliente a cui appartiene il contatto
- **Nome**: Nome del contatto
- **Cognome**: Cognome del contatto  
- **Email**: Indirizzo email del contatto
- **Descrizione**: Descrizione/ruolo del contatto
- **Azioni**: Tre pulsanti per gestire le modifiche

### 2. **Pulsanti di Azione Globali**
- **Torna al Summary**: Naviga alla pagina `/summary`
- **Aggiorna**: Ricarica i dati dalla API

### 3. **Azioni per Riga**
Ogni riga della tabella ha tre pulsanti:
- **Conferma** (icona Check, verde): Conferma definitivamente le modifiche
- **Dismissi** (icona Close, rosso): Rifiuta e dismette le modifiche
- **Visualizza** (icona Visibility, blu): Visualizza i dettagli delle modifiche

### 3. **Stati della Pagina**
- **Loading**: Mostra spinner durante il caricamento
- **Tabella con dati**: Mostra i contatti da confermare
- **Empty state**: Messaggio quando non ci sono contatti da confermare

## API Integration

### Endpoint Utilizzati
```
GET  /references/FetchNotConfirmed     # Ottiene la lista dei contatti da confermare
POST /references/Confirm/{id}          # Conferma le modifiche di un contatto
POST /references/Dismiss/{id}          # Dismette le modifiche di un contatto
```

### Interfaccia Dati
```typescript
interface ConfirmReference {
  id: string;
  customerId: string;
  customerName: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
}
```

## Design e Stile

### Layout
- Container responsive con `maxWidth="lg"`
- Header con titolo e pulsanti di azione
- DataGrid Material-UI con toolbar e filtri
- Empty state con icona e messaggio

### Colori e Icone
- **Verde principale**: `#93c54b` (pulsanti standard)
- **Verde conferma**: `#4caf50` (pulsante conferma)
- **Rosso dismissione**: `#f44336` (pulsante dismissione)
- **Blu visualizza**: `#2196f3` (pulsante visualizza)
- **Icona principale**: `ContactPhone` per il titolo
- **Icone azioni**: `ArrowBack`, `Refresh`, `Check`, `Close`, `Visibility`

### Tabella Features
- Sorting su tutte le colonne
- Filtro rapido nella toolbar
- Paginazione (15 elementi per pagina)
- Hover effect sulle righe
- Dimensioni responsive delle colonne

## Navigazione Dettagliata

### Da Summary a ConfirmContacts
1. Utente clicca sul numero "Modificati" nella card "Contatti" (solo se > 0)
2. Naviga a `/confirm/contacts`
3. Carica automaticamente i dati via API

### Da ConfirmContacts a Edit
1. Utente clicca sull'icona "Edit" su una riga
2. Naviga a `/customers/{customerId}/contatti/{contactId}/edit`
3. Utilizza la pagina ContattoCreate esistente in modalità edit

### Ritorno al Summary
1. Utente clicca "Torna al Summary"
2. Naviga a `/summary`

## Implementazione Tecnica

### Componenti Utilizzati
- **DataGrid**: Tabella principale con tutte le funzionalità
- **Material-UI**: Buttons, Typography, Box, Container
- **React Router**: Navigazione tra pagine
- **React Hooks**: useState, useEffect per state management

### Error Handling
- Try/catch per chiamate API
- Toast notifications per errori
- Loading state durante le operazioni

### Responsive Design
- Colonne con larghezza flessibile (`flex` property)
- Pulsanti che si wrappano su schermi piccoli
- Tabella scrollabile orizzontalmente se necessario

## Integrazione con Pagina Summary

La pagina viene integrata nella Summary attraverso:

1. **Click handler**: Il numero "Modificati" della card "Contatti" è cliccabile
2. **Condizionale**: Solo cliccabile se il valore > 0
3. **Visual feedback**: Underline e hover effect per indicare clickability
4. **Navigazione**: Route diretta a `/confirm/contacts`

## Future Enhancements
- Azioni di massa (conferma tutti i contatti selezionati)
- Filtri avanzati per cliente, data modifica, etc.
- Dettagli delle modifiche (cosa è cambiato)
- Notificazioni real-time per nuovi contatti da confermare