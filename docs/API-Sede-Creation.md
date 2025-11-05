# Gestione Sedi - Documentazione API

## Endpoint Create
```
POST /Destinations/Create
```

## Endpoint Update
```
PUT /Destinations/Update
```

## Endpoint Get by ID
```
GET /Destinations/FetchById/{id}
```

## Endpoint Delete
```
DELETE /Destinations/Delete/{id}
```

## Validazioni Obbligatorie
Prima di inviare la richiesta, i seguenti campi devono essere validati:

1. **Tipologia Sede** (`destinationtype`) - Campo obbligatorio
2. **Descrizione** (`descr1`) - Campo obbligatorio, non può essere vuoto o contenere solo spazi

Validazioni aggiuntive:
- **Email** - Se presente, deve avere formato valido
- **Telefono** - Se presente, deve contenere solo numeri
- **Provincia** - Campo obbligatorio

## Struttura JSON Request (Create)

```json
{
  "id": 0,
  "customerId": "string",
  "customerDescription": "",
  "descr1": "string",
  "descr2": "",
  "address": "string",
  "city": "string", 
  "email": "string",
  "telephonenumber": "string",
  "mobilenumber": "",
  "county": "string",
  "personreference": "string",
  "destinationtype": "string"
}
```

## Struttura JSON Request (Update)

```json
{
  "id": 123,
  "customerId": "string",
  "customerDescription": "",
  "descr1": "string",
  "descr2": "",
  "address": "string",
  "city": "string", 
  "email": "string",
  "telephonenumber": "string",
  "mobilenumber": "",
  "county": "string",
  "personreference": "string",
  "destinationtype": "string"
}
```

## Esempio Concreto (Create)

```json
{
  "id": 0,
  "customerId": "123",
  "customerDescription": "",
  "descr1": "Sede Operativa Milano",
  "descr2": "",
  "address": "Via Roma 123",
  "city": "Milano",
  "email": "milano@esempio.it",
  "telephonenumber": "0212345678",
  "mobilenumber": "",
  "county": "MI",
  "personreference": "Mario Rossi",
  "destinationtype": "2"
}
```

## Esempio Concreto (Update)

```json
{
  "id": 456,
  "customerId": "123",
  "customerDescription": "",
  "descr1": "Sede Operativa Milano - Aggiornata",
  "descr2": "",
  "address": "Via Roma 456",
  "city": "Milano",
  "email": "milano.nuovo@esempio.it",
  "telephonenumber": "0212345678",
  "mobilenumber": "",
  "county": "MI",
  "personreference": "Mario Rossi",
  "destinationtype": "2"
}
```

## Descrizione Campi

| Campo | Tipo | Obbligatorio | Descrizione |
|-------|------|--------------|-------------|
| `id` | number | No | ID della destinazione (0 per nuova creazione) |
| `customerId` | string | Sì | ID del cliente |
| `customerDescription` | string | No | Descrizione cliente (vuota per nuova creazione) |
| `descr1` | string | Sì | **Descrizione principale della sede** |
| `descr2` | string | No | Descrizione secondaria (opzionale) |
| `address` | string | No | Indirizzo della sede |
| `city` | string | No | Città della sede |
| `email` | string | No | Email della sede (validata se presente) |
| `telephonenumber` | string | No | Numero di telefono (solo numeri se presente) |
| `mobilenumber` | string | No | Numero cellulare (non utilizzato) |
| `county` | string | Sì | **Codice provincia** |
| `personreference` | string | No | Persona di riferimento |
| `destinationtype` | string | Sì | **ID del tipo di destinazione** |

## Tipi di Destinazione Disponibili
I tipi vengono recuperati dall'endpoint: `GET /TypeDestination/GetDestinationTypes`

Esempi tipici:
- `"1"` - Sede Legale
- `"2"` - Sede Operativa  
- `"3"` - Magazzino
- `"4"` - Filiale

## Province Disponibili
Le province vengono recuperate dall'endpoint: `GET /Province/GetProvinces`

Esempi:
- `"MI"` - Milano
- `"RM"` - Roma
- `"TO"` - Torino
- etc.

## Response dall'API (GET List)
Quando si recupera la lista delle sedi, l'API restituisce:

```json
{
  "id": 8,
  "description": "Sede001",
  "address": null,
  "city": "citta",
  "typeId": 1,
  "typeDescription": "Sede Principale"
}
```

## Response dall'API (GET by ID)
Quando si recupera una sede singola per l'edit con `FetchById/{id}`, l'API restituisce:

```json
{
  "id": 8,
  "descr1": "Sede001",
  "descr2": "",
  "address": "indirizzo",
  "city": "citta",
  "email": "merlin.andrea@gmail.com",
  "telephoneNumber": "0131812341",
  "mobileNumber": "",
  "destinationTypeId": 1,
  "destinationTypeDescription": "Sede Principale",
  "personReference": "Mario Rossi",
  "county": "AL"
}
```

**Nota:** La struttura della response `FetchById` è diversa da quella della lista:
- `descr1` invece di `description`
- `destinationTypeId` invece di `typeId`  
- `destinationTypeDescription` invece di `typeDescription`
- Include campi aggiuntivi come `descr2`, `email`, `telephoneNumber`, `mobileNumber`, `personReference`, `county`