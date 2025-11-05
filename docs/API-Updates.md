# API Updates - Conferma e Dismissione

## Modifiche agli Endpoint API

Sono stati aggiornati gli endpoint API per allinearsi alle specifiche del backend:

### References/Contatti
- **Conferma modifiche**: `POST /References/Confirm/{ID}`
- **Dismissione modifiche**: `POST /References/Dismiss/{ID}`

### Destinations/Destinazioni
- **Conferma modifiche**: `POST /Destinations/Confirm/{ID}`
- **Dismissione modifiche**: `POST /Destinations/Dismiss/{ID}`

## Modifiche al Codice

### customers.service.ts
Aggiornati i metodi:
- `confirmReference()` - ora utilizza `/References/Confirm/{referenceId}`
- `dismissReference()` - ora utilizza `/References/Dismiss/{referenceId}`
- `confirmDestination()` - ora utilizza `/Destinations/Confirm/{destinationId}`
- `dismissDestination()` - ora utilizza `/Destinations/Dismiss/{destinationId}`

### ConfirmContacts.tsx
- Il refresh automatico è già implementato tramite `loadContacts()` dopo ogni operazione
- Gestione degli errori con toast notifications

### ConfirmDestinations.tsx
- Corretto il campo `typeDescription` per il tipo sede
- Il refresh automatico è già implementato tramite `loadDestinations()` dopo ogni operazione
- Gestione degli errori con toast notifications

## Comportamento del Sistema

1. **Conferma modifiche**: L'utente clicca sull'icona verde ✓
   - Viene chiamata l'API di conferma
   - Mostra messaggio di successo
   - Ricarica automaticamente la lista aggiornata

2. **Dismissione modifiche**: L'utente clicca sull'icona rossa ✗
   - Viene chiamata l'API di dismissione
   - Mostra messaggio di successo
   - Ricarica automaticamente la lista aggiornata

3. **Visualizzazione dettagli**: L'utente clicca sull'icona dell'occhio 👁
   - Naviga alla pagina di modifica per visualizzare i dettagli

## Gestione degli Errori

Tutte le operazioni includono:
- Try/catch per gestire gli errori
- Toast notifications per feedback utente
- Log degli errori in console per debugging
- Mantenimento dello stato della pagina in caso di errore