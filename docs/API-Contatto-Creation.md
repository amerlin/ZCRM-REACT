# Gestione Contatti - Documentazione API

## Endpoint Create
```
POST /references/create
```

## Endpoint Update
```
PUT /references/update
```

## Endpoint Get by ID
```
GET /references/fetchById/{id}
```

## Endpoint Delete
```
DELETE /references/delete/{id}
```

## Validazioni Obbligatorie
Prima di inviare la richiesta, i seguenti campi devono essere validati:

1. **Nome o Cognome** - Almeno uno dei due campi deve essere compilato

Validazioni aggiuntive:
- **Email** - Se presente, deve avere formato valido
- **Telefono** - Se presente, deve contenere solo numeri

## Struttura JSON Request (Create)

```json
{
  "id": 0,
  "customerId": "string",
  "customerDescription": "",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "description": "string",
  "telephoneNumber": "string"
}
```

## Struttura JSON Request (Update)

```json
{
  "id": 123,
  "customerId": "string",
  "customerDescription": "",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "description": "string",
  "telephoneNumber": "string"
}
```

## Esempio Concreto (Create)

```json
{
  "id": 0,
  "customerId": "123",
  "customerDescription": "",
  "firstName": "Mario",
  "lastName": "Rossi",
  "email": "mario.rossi@esempio.it",
  "description": "Responsabile Acquisti",
  "telephoneNumber": "0212345678"
}
```

## Esempio Concreto (Update)

```json
{
  "id": 456,
  "customerId": "123",
  "customerDescription": "",
  "firstName": "Mario",
  "lastName": "Rossi",
  "email": "mario.rossi.nuovo@esempio.it",
  "description": "Responsabile Acquisti Senior",
  "telephoneNumber": "0212345679"
}
```

## Descrizione Campi

| Campo | Tipo | Obbligatorio | Descrizione |
|-------|------|--------------|-------------|
| `id` | number | No | ID del contatto (0 per nuova creazione) |
| `customerId` | string | Sì | ID del cliente |
| `customerDescription` | string | No | Descrizione cliente (vuota per nuova creazione) |
| `firstName` | string | Condizionale | **Nome del contatto** (obbligatorio se lastName vuoto) |
| `lastName` | string | Condizionale | **Cognome del contatto** (obbligatorio se firstName vuoto) |
| `email` | string | No | Email del contatto (validata se presente) |
| `description` | string | No | Descrizione/Ruolo del contatto |
| `telephoneNumber` | string | No | Numero di telefono (solo numeri se presente) |

## Note
- È obbligatorio che almeno uno tra `firstName` e `lastName` sia compilato
- I campi vengono automaticamente "puliti" (trim) degli spazi prima dell'invio
- La validazione email usa il pattern: `/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/`
- La validazione telefono controlla che il valore sia numerico

## Response dall'API (GET)
Quando si recupera un contatto esistente, l'API restituisce:

```json
{
  "id": 12,
  "firstName": "Nome",
  "lastName": "Cognome", 
  "email": "prova@prova.it",
  "description": "descrizione",
  "telephoneNumber": "0131812341"
}
```