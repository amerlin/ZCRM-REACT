# Pagina ConfirmDestinations - Conferma Destinazioni Modificate

## Descrizione
La pagina `/confirm/destinations` mostra una tabella di tutte le destinazioni (sedi) che necessitano di conferma dopo essere state modificate.

## Rotta
```
/confirm/destinations
```

## Navigazione
- **Accesso da**: Cliccando sul numero "Nuovi" o "Modificati" nella card "Destinazioni" della pagina Summary
- **Ritorno a**: Pagina Summary (`/summary`)

## Funzionalità

### 1. **Tabella Destinazioni da Confermare**
Mostra una DataGrid con le seguenti colonne:
- **Cliente**: Nome del cliente a cui appartiene la destinazione
- **Descrizione**: Descrizione della sede/destinazione
- **Indirizzo**: Indirizzo completo della destinazione
- **Città**: Città dove si trova la destinazione
- **Tipo Sede**: Tipologia della sede (es. Sede Legale, Operativa, etc.)
- **Azioni**: Tre pulsanti per gestire le modifiche

### 2. **Pulsanti di Azione Globali**
- **Torna al Summary**: Naviga alla pagina `/summary`
- **Aggiorna**: Ricarica i dati dalla API

### 3. **Azioni per Riga**
Ogni riga della tabella ha tre pulsanti:
- **Conferma** (icona Check, verde): Conferma definitivamente le modifiche
- **Dismissi** (icona Close, rosso): Rifiuta e dismette le modifiche
- **Visualizza** (icona Visibility, blu): Visualizza i dettagli delle modifiche

### 4. **Stati della Pagina**
- **Loading**: Mostra spinner durante il caricamento
- **Tabella con dati**: Mostra le destinazioni da confermare
- **Empty state**: Messaggio quando non ci sono destinazioni da confermare

## API Integration

### Endpoint Utilizzati
```
GET  /destinations/FetchNotConfirmed    # Ottiene la lista delle destinazioni da confermare
POST /destinations/Confirm/{id}         # Conferma le modifiche di una destinazione
POST /destinations/Dismiss/{id}         # Dismette le modifiche di una destinazione
```

### Interfaccia Dati
```typescript
interface ConfirmDestination {
  id: string;
  customerId: string;
  customerName: string;
  description: string;
  address: string;
  city: string;
  tipoSede: string;
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
- **Icona principale**: `LocationOn` per il titolo
- **Icone azioni**: `ArrowBack`, `Refresh`, `Check`, `Close`, `Visibility`

### Tabella Features
- Sorting su tutte le colonne (eccetto Azioni)
- Filtro rapido nella toolbar
- Paginazione (15 elementi per pagina)
- Hover effect sulle righe
- Dimensioni responsive delle colonne

## Navigazione Dettagliata

### Da Summary a ConfirmDestinations
1. Utente clicca sul numero "Nuovi" o "Modificati" nella card "Destinazioni" (solo se > 0)
2. Naviga a `/confirm/destinations`
3. Carica automaticamente i dati via API

### Da ConfirmDestinations a Edit
1. Utente clicca sull'icona "Visualizza" su una riga
2. Naviga a `/customers/{customerId}/sedi/{destinationId}/edit`
3. Utilizza la pagina SedeCreate esistente in modalità edit

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
- Toast notifications per errori e successi
- Loading state durante le operazioni

### Responsive Design
- Colonne con larghezza flessibile (`flex` property)
- Pulsanti che si wrappano su schermi piccoli
- Tabella scrollabile orizzontalmente se necessario

## Integrazione con Pagina Summary

La pagina viene integrata nella Summary attraverso:

1. **Click handler**: I numeri "Nuovi" e "Modificati" della card "Destinazioni" sono cliccabili
2. **Condizionale**: Solo cliccabili se il valore > 0
3. **Visual feedback**: Underline e hover effect per indicare clickability
4. **Navigazione**: Route diretta a `/confirm/destinations`

## Workflow Completo

### Per ogni destinazione da confermare:
1. **Utente vede lista** delle destinazioni da confermare
2. **Sceglie azione**:
   - ✅ **Conferma** → API call `/destinations/Confirm/{id}` → Toast successo → Lista aggiornata
   - ❌ **Dismissi** → API call `/destinations/Dismiss/{id}` → Toast successo → Lista aggiornata  
   - 👁️ **Visualizza** → Naviga a `/customers/{customerId}/sedi/{id}/edit`

### Auto-refresh dopo azioni:
Dopo ogni conferma o dismissione, la lista viene automaticamente ricaricata per riflettere i cambiamenti.

## Future Enhancements
- Azioni di massa (conferma/dismetti multiple destinazioni selezionate)
- Filtri avanzati per cliente, città, tipo sede, etc.
- Dettagli delle modifiche (cosa è cambiato)
- Notificazioni real-time per nuove destinazioni da confermare
- Pagina dedicata per visualizzare diff delle modifiche invece di navigare all'edit