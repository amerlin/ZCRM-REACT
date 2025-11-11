/**
 * Customers API Service
 * Handles all customer-related API calls
 */

import apiService from './api.service';
import config from '../config/app.config';

export interface Customer {
  id: string;
  descr1: string;
  typology: string;
  city: string;
  prov: string;
  address?: string;
  piva?: string;
  zipCode?: string;
  email?: string;
  isSenderEmailEnabled?: boolean;
  emailPec?: string;
  telephoneNumber?: string;
  mobileNumber?: string;
  extraNumber?: string;
  personreference?: string;
  provincia?: { id: string; [key: string]: string | number | boolean };
  agentId?: string;
  privacy?: { id: string; [key: string]: string | number | boolean };
  customerCategoryType?: Array<{ id: string; name: string; shortDescription: string; value: boolean }>;
  customerType?: Array<{ id: number; name: string; shortName: string }>;
  isActiveCustomer?: boolean;
  preferredColturaId?: string;
  customerColturaType?: Array<{
    id: number;
    customerId: number;
    colturaTypeId: number;
    colturaTypeDescription: string;
    ettariAffitto: number;
    ettariColtivati: number;
    ettariProprieta: number;
    isBio: boolean;
  }>;
}

export interface CreateCustomerRequest {
  id: number;
  erpNumber: string;
  descr1: string;
  descr2: string;
  zipCode: string;
  city: string;
  country: string;
  address: string;
  telephoneNumber: string;
  mobileNumber: string;
  extraNumber: string;
  email: string;
  emailPec: string;
  personReference: string;
  piva: string;
  codFis: string;
  provinceId: number;
  counties: string;
  privacyId: number;
  privacyPolicy: string;
  agentId: number;
  agentShortDescription: string;
  preferredColturaId: number;
  isActiveCustomer: boolean;
  isSenderEmailEnabled: boolean;
  customerTypeIds: number[];
  customerCategories: Array<{
    customerCategoryTypeId: number;
    value: boolean;
  }>;
  allevamentoTypes: Array<{
    allevamentoTypeId: number;
    numeroCapi: number;
  }>;
  colturaTypes: Array<{
    colturaTypeId: number;
    ettariProprieta: number;
    ettariAffitto: number;
    ettariColtivati: number;
    isBio: boolean;
  }>;
  referenceRecordId: number;
  isConfirmed: boolean;
  isActive: boolean;
  haveModifiedDestinations: boolean;
  username: string;
  customerType: number;
  customerTypeDescr: string;
}

// Update request uses the same structure as create request
export type UpdateCustomerRequest = CreateCustomerRequest;

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
}

export interface CustomerItem {
  id: number;
  brand: string;
  model: string;
  serialNumber: string;
  description: string;
  typologyId: number;
  typologyDescription: string;
}

export interface ItemType {
  id: number;
  description: string;
  isVisible: boolean;
  templateId: number;
}

export interface ItemBrand {
  id: number;
  description: string;
  orderIndex: number;
}

export interface ItemYear {
  id: number;
  description: string;
}

export interface CustomerItemDetail {
  id: number;
  templateId: string;
  typeId: number;
  customerId: number;
  referenceRecordId: number;
  brandId: number;
  typeDescription: string;
  brandDescription: string;
  description: string;
  model: string;
  year: number;
  yearCreated: number;
  matricola: string;
  isActive: boolean;
  telematics: boolean;
  trattore: boolean;
  telescopico: boolean;
  hour: number;
  hourAtDay: string;
  rotorHour: number;
  rotorHourAtDate: string;
  battHour: number;
  battHourAtDate: string;
  motorHour: number;
  motorHourAtDate: string;
}

export interface CreateCustomerItemRequest {
  id: number;
  templateId: number;
  typeId: number;
  customerId: number;
  referenceRecordId: number;
  brandId: number;
  description: string;
  model: string;
  year: number;
  yearCreated: number;
  matricola: string;
  isActive: boolean;
  telematics: boolean;
  trattore: boolean;
  telescopico: boolean;
  hour: number;
  hourAtDay: string; // ISO date string
  rotorHour: number;
  rotorHourAtDate: string; // ISO date string
  battHour: number;
  battHourAtDate: string; // ISO date string
  motorHour: number;
  motorHourAtDate: string; // ISO date string
}

export interface UpdateCustomerItemRequest {
  id: number;
  templateId: number; // Numeric value, not string
  typeId: number;
  customerId: number;
  referenceRecordId: number;
  brandId: number;
  description: string;
  model: string;
  year: number;
  yearCreated: number;
  matricola: string;
  isActive: boolean;
  telematics: boolean;
  trattore: boolean;
  telescopico: boolean;
  hour: number;
  hourAtDay: string; // ISO date string
  rotorHour: number;
  rotorHourAtDate: string; // ISO date string
  battHour: number;
  battHourAtDate: string; // ISO date string
  motorHour: number;
  motorHourAtDate: string; // ISO date string
}

export interface CheckMatricolaRequest {
  customerId: number;
  itemsId: number;
  matricola: string;
}

export interface CheckMatricolaResponse {
  customerId: number;
  itemsId: number;
  customerDescription: string;
}

export interface CustomerSearchRequest {
  ragioneSociale: string;
  address: string;
  city: string;
  provinceId: number;
  cap: string;
  agentId: number;
  isOptimistic: boolean;
  isActiveCustomer: boolean;
  categoryId: number;
  tipologyId: number;
}

export interface CustomerSearchResult {
  id: number;
  descr1: string;
  city: string;
  prov: string;
  typology: string;
}

export interface Agent {
  id: number;
  shortDescription: string;
  description: string;
  email: string;
  userId: string;
}

export interface Province {
  id: number;
  shortDescription: string;
  fullDescription: string;
}

export interface CustomerCategory {
  id: number;
  description: string;
}

export interface CustomerType {
  id: number;
  name: string;
  shortName: string;
}

export interface ProcessSummary {
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

export interface ConfirmReference {
  id: string;
  confirmedId: string; // ID del record confermato per le differenze
  customerId: string;
  customerName: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
}

export interface ConfirmDestination {
  id: string;
  confirmedId: string; // ID del record confermato per le differenze
  customerId: string;
  customerName: string;
  description: string;
  address: string;
  city: string;
  tipoSede: string;
}

export interface ReferenceDifferences {
  // L'API restituisce direttamente un array di differenze
  propName: string;
  oldValue: string;
  newValue: string;
}

export interface Destination {
  id: number;
  description: string;
  address: string | null;
  city: string;
  typeId: number;
  typeDescription: string;
}

export interface DestinationDetail {
  id: number;
  descr1: string;
  descr2: string;
  address: string;
  city: string;
  email: string;
  telephoneNumber: string;
  mobileNumber: string;
  destinationTypeId: number;
  destinationTypeDescription: string;
  personReference: string;
  county: string;
  isActive: boolean;
  destinationReferenceId: number;
}

export interface Reference {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  telephoneNumber: string;
}

export interface DestinationType {
  id: string;
  description: string;
}

export interface CreateDestinationRequest {
  id: number;
  customerId: string;
  customerDescription: string;
  descr1: string;
  descr2: string;
  address: string;
  city: string;
  email: string;
  telephonenumber: string;
  mobilenumber: string;
  county: string;
  personreference: string;
  destinationtype: string;
}

export interface CreateReferenceRequest {
  id: number;
  customerId: string;
  customerDescription: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  telephoneNumber: string;
}

export interface UpdateDestinationRequest {
  id: number;
  customerId: string;
  customerDescription: string;
  descr1: string;
  descr2: string;
  address: string;
  city: string;
  email: string;
  telephonenumber: string;
  mobilenumber: string;
  county: string;
  personreference: string;
  destinationtype: string;
  isActive: boolean;
  destinationReferenceId: number;
}

export interface UpdateReferenceRequest {
  id: number;
  customerId: string;
  customerDescription: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  telephoneNumber: string;
}

class CustomersService {
  /**
   * Get provinces
   */
  async getProvinces(): Promise<Province[]> {
    return apiService.get<Province[]>('/Province/GetProvinces');
  }

  /**
   * Get customer categories
   */
  async getCustomerCategories(): Promise<CustomerCategory[]> {
    return apiService.get<CustomerCategory[]>('/TypeCategory/GetCustomerCategories');
  }

  /**
   * Get customer types
   */
  async getCustomerTypes(): Promise<CustomerType[]> {
    return apiService.get<CustomerType[]>('/TypeCustomer/GetCustomerTypes');
  }

  /**
   * Get privacy statuses
   */
  async getPrivacyStatuses(): Promise<{id: string; description: string}[]> {
    return apiService.get<{id: string; description: string}[]>(`/privacyStatus/GetPrivacyStatuses`);
  }

  /**
   * Get coltura types
   */
  async getColturaTypes(): Promise<{id: string; description: string}[]> {
    return apiService.get<{id: string; description: string}[]>(`/TypeColtura/GetColturaTypes`);
  }

  /**
   * Get allevamento types
   */
  async getAllevamentoTypes(): Promise<{id: string; description: string}[]> {
    return apiService.get<{id: string; description: string}[]>(`/TypeAllevamento/GetAllevamentoTypes`);
  }

  /**
   * Search customers
   */
  async searchCustomers(searchData: CustomerSearchRequest): Promise<CustomerSearchResult[]> {
    return apiService.post<CustomerSearchResult[]>('/Customers/Search', searchData);
  }

  /**
   * Fetch customer by ID using FetchCustomer/ID endpoint
   */
  async fetchCustomerById(id: string): Promise<Customer> {
    console.log('CustomerService: Calling /Customers/FetchCustomer/', id);
    const result = apiService.get<Customer>(`/Customers/FetchCustomer/${id}`);
    console.log('CustomerService: FetchCustomer API call initiated');
    return result;
  }
  /**
   * Get customers grid
   */
  async getGrid(): Promise<Customer[]> {
    return apiService.get<Customer[]>('/customers/getgrid');
  }
  private readonly basePath = '/customers';

  /**
   * Get all customers
   */
  async getAll(): Promise<Customer[]> {
    return apiService.get<Customer[]>(this.basePath);
  }

  /**
   * Get customer by ID
   */
  async getById(id: string): Promise<Customer> {
    return apiService.get<Customer>(`${this.basePath}/${id}`);
  }

  /**
   * Get customer summary
   */
  async getSummary(id: string): Promise<{ description: string }> {
    return apiService.get(`${this.basePath}/${id}/summary`);
  }

  /**
   * Create new customer
   */
  async create(customerData: CreateCustomerRequest): Promise<Customer> {
    return apiService.post<Customer>(`${this.basePath}/Create`, customerData);
  }

  /**
   * Update customer
   */
  async update(customerData: UpdateCustomerRequest): Promise<Customer> {
    return apiService.put<Customer>(`${this.basePath}/Update`, customerData);
  }

  /**
   * Delete customer
   */
  async delete(id: string): Promise<void> {
    return apiService.delete<void>(`${this.basePath}/${id}`);
  }

  /**
   * Get customer summary
   */
  async getCustomerSummary(id: string): Promise<{
    descr1: string;
    address: string;
    city: string;
    province: string;
  }> {
    return apiService.get<{
      descr1: string;
      address: string;
      city: string;
      province: string;
    }>(`${this.basePath}/Summary/${id}`);
  }

  /**
   * Search customers
   */
  async search(query: string): Promise<Customer[]> {
  return apiService.get<Customer[]>(this.basePath, {
      params: { q: query },
    });
  }

  /**
   * Get customer destinations/sedi by customer ID
   */
  async getDestinationsByCustomerId(customerId: string): Promise<Destination[]> {
    return apiService.get<Destination[]>(`/Destinations/FetchByCustomer/${customerId}`);
  }

  /**
   * Get customer references/contatti by customer ID
   */
  async getReferencesByCustomerId(customerId: string): Promise<Reference[]> {
    return apiService.get<Reference[]>(`/references/FetchByCustomer/${customerId}`);
  }

  /**
   * Get customer items/mezzi by customer ID
   */
  async getCustomerItemsByCustomerId(customerId: string): Promise<CustomerItem[]> {
    return apiService.get<CustomerItem[]>(`/CustomerItems/FetchByCustomer/${customerId}`);
  }

  /**
   * Get item types for mezzi
   */
  async getItemTypes(): Promise<ItemType[]> {
    return apiService.get<ItemType[]>(`/CustomerItemUtility/GetItemTypes`);
  }

  /**
   * Get item brands for mezzi
   */
  async getItemBrands(): Promise<ItemBrand[]> {
    return apiService.get<ItemBrand[]>(`/CustomerItemUtility/GetItemBrands`);
  }

  /**
   * Get years for mezzi
   */
  async getItemYears(): Promise<ItemYear[]> {
    return apiService.get<ItemYear[]>(`/CustomerItemUtility/GetAnno`);
  }

  /**
   * Create new customer item/mezzo
   */
  async createCustomerItem(itemData: CreateCustomerItemRequest): Promise<void> {
    return apiService.post<void>(`/CustomerItems/Create`, itemData);
  }

  /**
   * Update existing customer item/mezzo
   */
  async updateCustomerItem(itemData: UpdateCustomerItemRequest): Promise<void> {
    return apiService.put<void>(`/CustomerItems/Update`, itemData);
  }

  /**
   * Get customer item details by ID
   */
  async getCustomerItemById(itemId: string): Promise<CustomerItemDetail> {
    return apiService.get<CustomerItemDetail>(`/CustomerItems/FetchById/${itemId}`);
  }

  /**
   * Check matricola for duplicates
   */
  async checkMatricola(customerId: number, matricola: string): Promise<CheckMatricolaResponse[]> {
    const payload: CheckMatricolaRequest = {
      customerId,
      itemsId: 0,
      matricola
    };
    return apiService.post<CheckMatricolaResponse[]>('/CustomerItemUtility/CheckMatricola', payload);
  }

  /**
   * Get agents list
   */
  async getAgents(): Promise<Agent[]> {
    return apiService.get<Agent[]>('/Agents/GetAgents');
  }

  /**
   * Export customers to Excel
   */
  async exportExcel(): Promise<Blob> {
    const response = await fetch(`${config.apiBaseUrl}/customers/ExportExcel`, {
      method: 'GET',
      headers: {
        'Authorization': this.getAuthHeader()
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to export Excel file');
    }
    
    return response.blob();
  }

  private getAuthHeader(): string {
    const storedAuth = localStorage.getItem('basicAuthentication');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.token) {
          return `Bearer ${authData.token}`;
        }
      } catch (error) {
        console.error('Failed to parse auth token', error);
      }
    }
    return '';
  }

  /**
   * Get destination types
   */
  async getDestinationTypes(): Promise<DestinationType[]> {
    return apiService.get<DestinationType[]>(`/TypeDestination/GetDestinationTypes`);
  }

  /**
   * Create new destination/sede
   */
  async createDestination(destinationData: CreateDestinationRequest): Promise<void> {
    return apiService.post<void>(`/Destinations/Create`, destinationData);
  }

  /**
   * Create new reference/contatto
   */
  async createReference(referenceData: CreateReferenceRequest): Promise<void> {
    return apiService.post<void>(`/references/create`, referenceData);
  }

  /**
   * Get destination/sede by ID
   */
  async getDestinationById(destinationId: string): Promise<DestinationDetail> {
    return apiService.get<DestinationDetail>(`/Destinations/FetchById/${destinationId}`);
  }

  /**
   * Update destination/sede
   */
  async updateDestination(destinationData: UpdateDestinationRequest): Promise<void> {
    return apiService.put<void>(`/Destinations/Update`, destinationData);
  }

  /**
   * Delete destination/sede
   */
  async deleteDestination(destinationId: string): Promise<void> {
    return apiService.delete<void>(`/Destinations/Delete/${destinationId}`);
  }

  /**
   * Get reference/contatto by ID
   */
  async getReferenceById(referenceId: string): Promise<Reference> {
    return apiService.get<Reference>(`/references/fetchById/${referenceId}`);
  }

  /**
   * Update reference/contatto
   */
  async updateReference(referenceData: UpdateReferenceRequest): Promise<void> {
    return apiService.put<void>(`/references/update`, referenceData);
  }

  /**
   * Delete reference/contatto
   */
  async deleteReference(referenceId: string): Promise<void> {
    return apiService.delete<void>(`/references/delete/${referenceId}`);
  }

  /**
   * Get process summary to check for pending confirmations
   */
  async getProcessSummary(): Promise<ProcessSummary> {
    return apiService.get<ProcessSummary>(`/process/GetSummary`);
  }

  /**
   * Get references/contacts to confirm
   */
  async getConfirmReferences(): Promise<ConfirmReference[]> {
    return apiService.get<ConfirmReference[]>(`/references/FetchNotConfirmed`);
  }

  /**
   * Confirm reference/contact changes
   */
  async confirmReference(referenceId: string): Promise<void> {
    return apiService.post<void>(`/References/Confirm/${referenceId}`, {
      IsConfirmation: true,
      IsActive: true
    });
  }

  /**
   * Dismiss reference/contact changes
   */
  async dismissReference(referenceId: string): Promise<void> {
    return apiService.post<void>(`/References/Dismiss/${referenceId}`, {
      IsConfirmation: false,
      IsActive: false
    });
  }

  /**
   * Get reference differences
   */
  async getReferenceDifferences(referenceId: string): Promise<ReferenceDifferences[]> {
    return apiService.get<ReferenceDifferences[]>(`/references/GetDifference/${referenceId}`);
  }

  /**
   * Get destination differences
   */
  async getDestinationDifferences(destinationId: string): Promise<ReferenceDifferences[]> {
    return apiService.get<ReferenceDifferences[]>(`/destinations/GetDifference/${destinationId}`);
  }

  /**
   * Get destinations to confirm
   */
  async getConfirmDestinations(): Promise<ConfirmDestination[]> {
    return apiService.get<ConfirmDestination[]>(`/destinations/FetchNotConfirmed`);
  }

  /**
   * Confirm destination changes
   */
  async confirmDestination(destinationId: string): Promise<void> {
    return apiService.post<void>(`/Destinations/Confirm/${destinationId}`, {
      IsConfirmation: true,
      IsActive: true
    });
  }

  /**
   * Dismiss destination changes
   */
  async dismissDestination(destinationId: string): Promise<void> {
    return apiService.post<void>(`/Destinations/Dismiss/${destinationId}`, {
      IsConfirmation: false,
      IsActive: false
    });
  }
}

// Export singleton instance
const customersService = new CustomersService();
export default customersService;
