# Fix ContactDifferences - Utilizzo ID Originale

## Problema Identificato
Nella pagina `ContactDifferences`, l'API `references/GetDifference/{id}` non riceveva l'ID corretto. Veniva passato l'ID del nuovo record invece dell'ID del record originale necessario per recuperare le differenze.

## Modifiche Apportate

### 1. Interfaccia ConfirmReference aggiornata
**File**: `src/services/customers.service.ts`

```typescript
export interface ConfirmReference {
  id: string;
  originalId: string; // ← NUOVO CAMPO AGGIUNTO
  customerId: string;
  customerName: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
}
```

### 2. Logica di navigazione aggiornata
**File**: `src/pages/ConfirmContacts.tsx`

```typescript
const handleView = (id: string, originalId: string) => {
  // Naviga alla pagina delle differenze usando l'ID originale
  console.log('Visualizza modifiche per contatto:', id, 'Original ID:', originalId);
  navigate(`/confirm/contacts/differences/${originalId}`); // ← USA originalId
};

// Chiamata del pulsante aggiornata
onClick={() => handleView(params.row.id, params.row.originalId)}
```

## Flusso Corretto

### Prima (PROBLEMATICO)
```
ConfirmContacts → handleView(newId) → /differences/{newId} → API call con ID sbagliato
```

### Dopo (CORRETTO)
```
ConfirmContacts → handleView(newId, originalId) → /differences/{originalId} → API call con ID corretto
```

## Impatto sui Dati

### Campo originalId
- **Scopo**: Identificare il record originale per recuperare le differenze
- **Fonte**: Deve essere fornito dall'API `references/FetchNotConfirmed`
- **Utilizzo**: Passato all'API `references/GetDifference/{originalId}`

### Flusso dei Dati
1. **API**: `references/FetchNotConfirmed` → restituisce lista con `id` (nuovo) e `originalId` (originale)
2. **UI**: Visualizza lista contatti da confermare
3. **Click**: Utente clicca "Visualizza modifiche"
4. **Navigation**: Naviga a `/differences/{originalId}` (non più `{id}`)
5. **API**: `references/GetDifference/{originalId}` → restituisce differenze corrette

## Requisiti Backend

### API references/FetchNotConfirmed
Deve restituire entrambi i campi:
```json
{
  "id": "123",           // ID del nuovo record
  "originalId": "456",   // ID del record originale
  "customerId": "789",
  "customerName": "...",
  // ... altri campi
}
```

### API references/GetDifference/{originalId}
Deve accettare l'ID del record originale per calcolare le differenze corrette.

## Benefici della Modifica

### ✅ Risolve
- ID corretto passato all'API GetDifference
- Differenze visualizzate correttamente
- Navigazione funzionale tra le pagine

### ✅ Mantiene
- Compatibilità con operazioni confirm/dismiss (usano sempre `id`)
- Struttura esistente della UI
- Logica di navigazione

### ⚠️ Richiede
- Backend deve fornire campo `originalId` nell'API FetchNotConfirmed
- Verifica che GetDifference funzioni con ID originale
- Test end-to-end del flusso completo

## Test Necessari
- [ ] Verifica che `originalId` sia presente nei dati da `FetchNotConfirmed`
- [ ] Test navigazione da ConfirmContacts a ContactDifferences
- [ ] Verifica che GetDifference restituisca dati corretti con `originalId`
- [ ] Test pulsante "Indietro" dalla pagina differenze