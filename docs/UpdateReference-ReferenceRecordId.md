# Update Reference API - Campo referenceRecordId

## Panoramica
È stato aggiunto il campo obbligatorio `referenceRecordId` all'interfaccia `UpdateReferenceRequest` per includere l'ID del record originale che viene aggiornato quando si chiama l'API di update per i references.

## Modifiche Apportate

### 1. Interfaccia UpdateReferenceRequest
**File**: `src/services/customers.service.ts`

```typescript
export interface UpdateReferenceRequest {
  id: number;
  customerId: string;
  customerDescription: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  telephoneNumber: string;
  referenceRecordId: number; // ← NUOVO CAMPO AGGIUNTO
}
```

### 2. Implementazione in ContattoCreate.tsx
**File**: `src/pages/ContattoCreate.tsx`

```typescript
const updateData: UpdateReferenceRequest = {
  id: parseInt(contattoId || '0'),
  customerId: customerId || '',
  customerDescription: '',
  firstName: nome.trim(),
  lastName: cognome.trim(),
  email: email.trim(),
  description: descrizione.trim(),
  telephoneNumber: telefono.trim(),
  referenceRecordId: parseInt(contattoId || '0'), // ← NUOVO CAMPO AGGIUNTO
};
```

## Logica Implementata

### Campo referenceRecordId
- **Valore**: L'ID del contatto originale che si sta modificando
- **Tipo**: `number`
- **Fonte**: Il parametro `contattoId` dalla URL convertito in numero
- **Scopo**: Identificare quale record esistente viene aggiornato

### Flusso di Aggiornamento
1. **Caricamento**: `loadContattoData()` carica i dati esistenti tramite `getReferenceById(contattoId)`
2. **Modifica**: L'utente modifica i campi nel form
3. **Salvataggio**: `updateReference()` viene chiamato con tutti i dati incluso `referenceRecordId`
4. **API**: Il backend riceve sia il nuovo ID che l'ID del record originale

### Esempio di Utilizzo
```typescript
// URL: /customers/123/contatti/456/edit
// contattoId = "456" (ID del record originale)

const updateData: UpdateReferenceRequest = {
  id: 456,                    // ID del contatto
  referenceRecordId: 456,     // ID del record originale
  customerId: "123",          // ID del cliente
  firstName: "Mario",         // Dati aggiornati...
  // ... altri campi
};
```

## Impatto

### Modifiche Obbligatorie
- ✅ Aggiunta campo `referenceRecordId` all'interfaccia
- ✅ Aggiornamento codice in `ContattoCreate.tsx`
- ✅ Mantenimento compatibilità con API esistente

### Nessun Impatto Su
- ✅ Creazione nuovi contatti (`CreateReferenceRequest` non modificato)
- ✅ Altre operazioni CRUD esistenti
- ✅ UI e UX della pagina

### Test Necessari
- [ ] Verifica che l'aggiornamento contatti funzioni correttamente
- [ ] Controllo che il backend riceva il campo `referenceRecordId`
- [ ] Test che il valore sia corretto (uguale all'ID del contatto esistente)

## Note Tecniche
- Il campo è obbligatorio (`referenceRecordId: number` senza `?`)
- Il valore viene sempre impostato come l'ID del contatto esistente
- La logica è automatica e non richiede input dall'utente
- Compatibile con TypeScript strict mode