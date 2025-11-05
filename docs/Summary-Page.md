# Pagina Summary - Modifiche da Confermare

## Descrizione
La pagina `/summary` mostra un riepilogo dettagliato di tutti gli elementi che necessitano di conferma nel sistema.

## Rotta
```
/summary
```

## Funzionalità

### 1. **Riepilogo Generale**
Due card principali che mostrano:
- **Totale Elementi Nuovi**: Somma di tutti gli elementi nuovi nel sistema
- **Totale Elementi Modificati**: Somma di tutti gli elementi modificati

### 2. **Dettaglio per Categoria**
Quattro card che mostrano il dettaglio per ogni categoria:
- **Clienti**: Nuovi e modificati
- **Destinazioni**: Nuove e modificate
- **Contatti**: Nuovi e modificati
- **Mezzi**: Nuovi e modificati

### 3. **Azioni Disponibili**
- **Torna alla Lista**: Naviga alla lista clienti
- **Aggiorna**: Ricarica i dati dal server

### 4. **Stati della Pagina**
- **Loading**: Mostra spinner durante il caricamento
- **Dati presenti**: Mostra le card con i conteggi
- **Nessuna modifica**: Messaggio di successo quando non ci sono elementi da confermare
- **Errore**: Messaggio di errore con pulsante "Riprova"

## Design e Stile

### Colori
- **Verde principale**: `#93c54b` (pulsanti standard)
- **Blu**: `#2196f3` (elementi nuovi)
- **Arancione chiaro**: `#ff9800` (elementi modificati)
- **Verde successo**: `#4caf50` (stato "nessuna modifica")

### Layout
- Container responsive con `maxWidth="lg"`
- Flexbox per layout responsive delle card
- Card con bordi e ombreggiature
- Typography Material-UI per coerenza

### Icone
- **Assignment**: Icona principale del titolo
- **ArrowBack**: Torna alla lista
- **Refresh**: Aggiorna dati
- **Check**: Stato "nessuna modifica"

## API Integration

### Endpoint Utilizzato
```
GET /process/GetSummary
```

### Interfaccia Dati
```typescript
interface ProcessSummary {
  totalNewElements: number;
  totalModifiedElements: number;
  existNewElements: boolean;
  existModifiedElements: boolean;
  newCustomers: number;
  modifiedCustomers: number;
  newDestinations: number;
  modifiedDestinations: number;
  newReferences: number;
  modifiedReferences: number;
  newItems: number;
  modifiedItems: number;
}
```

## Navigazione
- Accessibile da: Pulsante nella lista clienti quando ci sono elementi da confermare
- Navigazione verso: Lista clienti (`/customers/lists`)

## Stato Implementation
- **useState** per gestire loading e dati summary
- **useEffect** per caricare dati all'init
- **Toast notifications** per feedback utente
- **Error handling** per gestire errori API

## TODO Features
- Aggiungere dettaglio drill-down per ogni categoria
- Implementare filtri per tipo di modifica
- Aggiungere timestamp delle modifiche
- Implementare azioni specifiche per categoria