# API Configuration - WebCrm React Application

Documentazione completa per la configurazione e l'utilizzo del sistema di chiamate API centralizzato.

---

## ?? Indice

1. [Panoramica](#panoramica)
2. [Struttura File](#struttura-file)
3. [Configurazione Environment](#configurazione-environment)
4. [API Service](#api-service)
5. [Servizi Specifici](#servizi-specifici)
6. [Utilizzo nei Componenti](#utilizzo-nei-componenti)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## ?? Panoramica

Il sistema di configurazione API fornisce:

- ? **URL configurabile via environment** - Gestione separata per development/production
- ? **Type-safe** - TypeScript garantisce type safety su tutte le chiamate
- ? **Centralizzato** - Un unico punto di accesso per tutte le API
- ? **Riutilizzabile** - Metodi HTTP pronti all'uso (GET, POST, PUT, DELETE, PATCH)
- ? **Error handling** - Gestione errori unificata
- ? **Query params** - Supporto automatico per parametri URL

---

## ?? Struttura File

```
WebCrm.React/
??? .env.development      # Variabili environment per sviluppo
??? .env.production    # Variabili environment per produzione
??? .gitignore         # Esclude file .env dal version control
??? src/
?   ??? config/
?   ?   ??? app.config.ts         # Configurazione applicazione centralizzata
?   ??? services/
?   ?   ??? api.service.ts        # Servizio HTTP generico
?   ?   ??? customers.service.ts  # Servizio API Clienti
?   ?   ??? mezzi.service.ts      # [TODO] Servizio API Mezzi
?   ?   ??? sedi.service.ts    # [TODO] Servizio API Sedi
?   ?   ??? contatti.service.ts   # [TODO] Servizio API Contatti
?   ??? examples/
?       ??? ExampleCustomerComponent.tsx  # Esempio utilizzo
```

---

## ?? Configurazione Environment

### File `.env.development`

Utilizzato durante lo sviluppo locale (`npm run dev`):

```sh
# Development environment variables
VITE_API_BASE_URL=http://localhost:5000/api
```

### File `.env.production`

Utilizzato per il build di produzione (`npm run build`):

```sh
# Production environment variables
VITE_API_BASE_URL=/api
```

> **Nota**: In produzione, l'URL relativo `/api` presuppone che frontend e backend siano serviti dallo stesso dominio.

### File `app.config.ts`

```typescript
interface AppConfig {
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default config;
```

---

## ?? API Service

Il servizio `api.service.ts` fornisce metodi HTTP pronti all'uso.

### Metodi Disponibili

| Metodo | Descrizione | Esempio |
|--------|-------------|---------|
| `get<T>(endpoint, options?)` | GET request | `api.get<Customer[]>('/customers')` |
| `post<T>(endpoint, data, options?)` | POST request | `api.post('/customers', customerData)` |
| `put<T>(endpoint, data, options?)` | PUT request | `api.put('/customers/1', customerData)` |
| `delete<T>(endpoint, options?)` | DELETE request | `api.delete('/customers/1')` |
| `patch<T>(endpoint, data, options?)` | PATCH request | `api.patch('/customers/1', { status: 'active' })` |

### Caratteristiche

#### 1. **Query Parameters Automatici**

```typescript
// Automaticamente trasforma params in query string
await apiService.get('/customers', {
  params: { 
    page: 1, 
    pageSize: 10, 
    search: 'Rossi' 
  }
});

// Risultato: GET /api/customers?page=1&pageSize=10&search=Rossi
```

#### 2. **Error Handling Unificato**

```typescript
private async handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP Error ${response.status}: ${response.statusText}`,
    }));
 throw new Error(error.message || 'An error occurred');
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}
```

#### 3. **Headers Personalizzabili**

```typescript
await apiService.get('/customers', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Custom-Header': 'value'
  }
});
```

---

## ?? Servizi Specifici

Ogni entità (Customers, Mezzi, SEDI, Contatti) ha il proprio servizio dedicato.

### Esempio: `customers.service.ts`

```typescript
import apiService from './api.service';

export interface Customer {
  id: string;
  ragsoc: string;
  indirizzo: string;
  citta: string;
  provincia: string;
}

class CustomersService {
  private readonly basePath = '/customers';

  async getAll(): Promise<Customer[]> {
    return apiService.get<Customer[]>(this.basePath);
  }

  async getById(id: string): Promise<Customer> {
    return apiService.get<Customer>(`${this.basePath}/${id}`);
  }

  async getSummary(id: string): Promise<{ description: string }> {
    return apiService.get(`${this.basePath}/${id}/summary`);
  }

  async create(customer: Partial<Customer>): Promise<Customer> {
 return apiService.post<Customer>(this.basePath, customer);
  }

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    return apiService.put<Customer>(`${this.basePath}/${id}`, customer);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete<void>(`${this.basePath}/${id}`);
  }

  async search(query: string): Promise<Customer[]> {
    return apiService.get<Customer[]>(this.basePath, {
params: { q: query },
    });
  }
}

const customersService = new CustomersService();
export default customersService;
```

### Template per Nuovi Servizi

#### `mezzi.service.ts`

```typescript
import apiService from './api.service';

export interface Mezzo {
  id: string;
  marca: string;
  modello: string;
  matricola: string;
  descrizione: string;
  tipologia: string;
}

class MezziService {
  async getByCustomerId(customerId: string): Promise<Mezzo[]> {
    return apiService.get(`/customers/${customerId}/items`);
  }

  async getById(customerId: string, mezzoId: string): Promise<Mezzo> {
    return apiService.get(`/customers/${customerId}/items/${mezzoId}`);
  }

  async create(customerId: string, data: Partial<Mezzo>): Promise<Mezzo> {
 return apiService.post(`/customers/${customerId}/items`, data);
}

  async update(customerId: string, mezzoId: string, data: Partial<Mezzo>): Promise<Mezzo> {
    return apiService.put(`/customers/${customerId}/items/${mezzoId}`, data);
  }

  async delete(customerId: string, mezzoId: string): Promise<void> {
    return apiService.delete(`/customers/${customerId}/items/${mezzoId}`);
  }
}

const mezziService = new MezziService();
export default mezziService;
```

#### `sedi.service.ts`

```typescript
import apiService from './api.service';

export interface Sede {
  id: string;
  denominazione: string;
  indirizzo: string;
  citta: string;
  provincia: string;
  cap: string;
  telefono: string;
  email: string;
}

class SediService {
  async getByCustomerId(customerId: string): Promise<Sede[]> {
    return apiService.get(`/customers/${customerId}/destinations`);
  }

  async getById(customerId: string, sedeId: string): Promise<Sede> {
    return apiService.get(`/customers/${customerId}/destinations/${sedeId}`);
  }

  async create(customerId: string, data: Partial<Sede>): Promise<Sede> {
    return apiService.post(`/customers/${customerId}/destinations`, data);
  }

  async update(customerId: string, sedeId: string, data: Partial<Sede>): Promise<Sede> {
    return apiService.put(`/customers/${customerId}/destinations/${sedeId}`, data);
  }

  async delete(customerId: string, sedeId: string): Promise<void> {
    return apiService.delete(`/customers/${customerId}/destinations/${sedeId}`);
  }
}

const sediService = new SediService();
export default sediService;
```

#### `contatti.service.ts`

```typescript
import apiService from './api.service';

export interface Contatto {
  id: string;
  nome: string;
  cognome: string;
  ruolo: string;
  telefono: string;
  cellulare: string;
  email: string;
  note: string;
}

class ContattiService {
  async getByCustomerId(customerId: string): Promise<Contatto[]> {
    return apiService.get(`/customers/${customerId}/references`);
  }

  async getById(customerId: string, contattoId: string): Promise<Contatto> {
    return apiService.get(`/customers/${customerId}/references/${contattoId}`);
  }

  async create(customerId: string, data: Partial<Contatto>): Promise<Contatto> {
    return apiService.post(`/customers/${customerId}/references`, data);
  }

  async update(customerId: string, contattoId: string, data: Partial<Contatto>): Promise<Contatto> {
    return apiService.put(`/customers/${customerId}/references/${contattoId}`, data);
  }

  async delete(customerId: string, contattoId: string): Promise<void> {
    return apiService.delete(`/customers/${customerId}/references/${contattoId}`);
  }
}

const contattiService = new ContattiService();
export default contattiService;
```

---

## ?? Utilizzo nei Componenti

### Esempio Completo: CustomerMezzi.tsx

```typescript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import mezziService, { Mezzo } from '../services/mezzi.service';
import { toast } from 'react-toastify';

const CustomerMezzi = () => {
  const { id } = useParams<{ id: string }>();
  const [mezzi, setMezzi] = useState<Mezzo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadMezzi(id);
    }
  }, [id]);

  const loadMezzi = async (customerId: string) => {
    setIsLoading(true);
    try {
      const data = await mezziService.getByCustomerId(customerId);
      setMezzi(data);
    } catch (error) {
      console.error('Error loading mezzi:', error);
      toast.error('Errore nel caricamento dei mezzi');
    } finally {
      setIsLoading(false);
    }
  };

  // ... resto del componente
};
```

### Esempio: MezzoCreate.tsx (Create/Update)

```typescript
import mezziService from '../services/mezzi.service';

const MezzoCreate = () => {
  const { customerId, mezzoId } = useParams();
  const isEditMode = !!mezzoId;

  const handleSave = async () => {
    const mezzoData = {
      marca: brandId,
      modello: modello,
      descrizione: descrizione,
      // ... altri campi
    };

    try {
 if (isEditMode && mezzoId) {
        await mezziService.update(customerId!, mezzoId, mezzoData);
  toast.success('Mezzo aggiornato con successo!');
      } else {
        await mezziService.create(customerId!, mezzoData);
  toast.success('Mezzo creato con successo!');
      }
      navigate(`/customers/${customerId}/mezzi`);
    } catch (error) {
  console.error('Error saving mezzo:', error);
      toast.error('Errore nel salvataggio del mezzo');
    }
  };

  const handleDelete = async () => {
    if (!mezzoId) return;

    try {
      await mezziService.delete(customerId!, mezzoId);
   toast.success('Mezzo eliminato con successo!');
      navigate(`/customers/${customerId}/mezzi`);
    } catch (error) {
      console.error('Error deleting mezzo:', error);
 toast.error('Errore nell\'eliminazione del mezzo');
    }
  };
};
```

---

## ? Best Practices

### 1. **Gestione Errori Consistente**

```typescript
try {
  const data = await service.getData();
  // Handle success
} catch (error) {
  console.error('Detailed error:', error);
  toast.error('User-friendly error message');
}
```

### 2. **Loading States**

```typescript
const [isLoading, setIsLoading] = useState(false);

const loadData = async () => {
  setIsLoading(true);
  try {
    const data = await service.getData();
    setData(data);
  } finally {
    setIsLoading(false); // Always execute
  }
};
```

### 3. **Type Safety**

```typescript
// ? Definisci sempre le interfacce
export interface Mezzo {
  id: string;
  marca: string;
  // ...
}

// ? Usa i tipi nelle chiamate
const mezzi = await mezziService.getAll(); // mezzi è già tipato come Mezzo[]
```

### 4. **Cancellazione Richieste (AbortController)**

```typescript
useEffect(() => {
  const abortController = new AbortController();

  const loadData = async () => {
    try {
      const data = await apiService.get('/endpoint', {
      signal: abortController.signal
      });
      setData(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('Error loading data');
      }
    }
  };

  loadData();

  return () => abortController.abort(); // Cleanup on unmount
}, []);
```

### 5. **Validazione Dati**

```typescript
const handleSave = async () => {
  // Validate before API call
  if (!marca || !modello) {
    toast.warning('Campi obbligatori mancanti');
    return;
  }

  try {
    await service.create(data);
  } catch (error) {
    // Handle API errors
  }
};
```

---

## ?? Troubleshooting

### Problema: CORS Error in Development

**Sintomo:**
```
Access to fetch at 'http://localhost:5000/api/customers' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Soluzione:**

Nel backend ASP.NET (WebCrm.Api), configura CORS:

```csharp
// Startup.cs o Program.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
    {
        options.AddPolicy("AllowReactApp",
        builder => builder
     .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
         .AllowAnyHeader()
       .AllowCredentials());
    });
}

public void Configure(IApplicationBuilder app)
{
    app.UseCors("AllowReactApp");
    // ... rest of configuration
}
```

### Problema: Environment Variables Non Caricate

**Sintomo:**
```
apiBaseUrl is undefined
```

**Soluzione:**

1. Verifica che i file `.env.development` e `.env.production` esistano nella root di `WebCrm.React/`
2. Le variabili devono iniziare con `VITE_` (es: `VITE_API_BASE_URL`)
3. Riavvia il dev server dopo aver modificato i file `.env`

```sh
npm run dev
```

### Problema: 404 Not Found in Production

**Sintomo:**
```
GET /api/customers 404 (Not Found)
```

**Soluzione:**

In produzione, assicurati che:

1. Il backend risponda su `/api/*` endpoints
2. Il routing ASP.NET sia configurato correttamente
3. Se usi IIS, configura URL Rewrite per il React Router

**web.config per IIS:**

```xml
<configuration>
  <system.webServer>
    <rewrite>
   <rules>
        <rule name="React Routes" stopProcessing="true">
 <match url=".*" />
    <conditions logicalGrouping="MatchAll">
      <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
     <add input="{REQUEST_URI}" pattern="^/api" negate="true" />
   </conditions>
  <action type="Rewrite" url="/" />
        </rule>
    </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### Problema: Autenticazione Non Funziona

**Sintomo:**
```
401 Unauthorized
```

**Soluzione:**

Aggiungi un interceptor per il token di autenticazione in `api.service.ts`:

```typescript
private getHeaders(options?: RequestOptions): HeadersInit {
  const token = localStorage.getItem('authToken'); // O altro storage

  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options?.headers,
  };
}

async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const url = this.buildUrl(endpoint, options?.params);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: this.getHeaders(options),
    ...options,
  });

  return this.handleResponse<T>(response);
}
```

---

## ?? Riferimenti

### Documentazione Correlata

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

### Backend API Endpoints (WebCrm.Api)

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/api/customers` | GET | Lista tutti i clienti |
| `/api/customers/{id}` | GET | Dettagli cliente |
| `/api/customers/{id}/items` | GET | Mezzi del cliente |
| `/api/customers/{id}/destinations` | GET | SEDI del cliente |
| `/api/customers/{id}/references` | GET | Contatti del cliente |

---

## ?? Checklist Implementazione

- [x] Creare `.env.development` e `.env.production`
- [x] Creare `app.config.ts`
- [x] Creare `api.service.ts`
- [x] Creare `customers.service.ts`
- [ ] Creare `mezzi.service.ts`
- [ ] Creare `sedi.service.ts`
- [ ] Creare `contatti.service.ts`
- [ ] Aggiornare `CustomerMezzi.tsx` per usare `mezziService`
- [ ] Aggiornare `MezzoCreate.tsx` per usare `mezziService`
- [ ] Aggiornare `CustomerSedi.tsx` per usare `sediService`
- [ ] Aggiornare `SedeCreate.tsx` per usare `sediService`
- [ ] Aggiornare `CustomerContatti.tsx` per usare `contattiService`
- [ ] Aggiornare `ContattoCreate.tsx` per usare `contattiService`
- [ ] Configurare CORS nel backend
- [ ] Testare in development
- [ ] Testare in production

---

**Versione:** 1.0  
**Ultimo aggiornamento:** 2024  
**Autore:** WebCrm Development Team
