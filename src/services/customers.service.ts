/**
 * Customers API Service
 * Handles all customer-related API calls
 */

import apiService from './api.service';

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
  provincia?: { id: string; [key: string]: any };
  agentId?: string;
  privacy?: { id: string; [key: string]: any };
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

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
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
   * Get agents
   */
  async getAgents(): Promise<{id: string; description: string}[]> {
    return apiService.get<{id: string; description: string}[]>(`/Agents/GetAgents`);
  }

  /**
   * Get provinces
   */
  async getProvinces(): Promise<{id: string; shortDescription: string; fullDescription: string}[]> {
    return apiService.get<{id: string; shortDescription: string; fullDescription: string}[]>(`/Province/GetProvinces`);
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
   * Get customer categories
   */
  async getCustomerCategories(): Promise<string[]> {
    return apiService.get<string[]>(`/TypeCategory/GetCustomerCategories`);
  }
  /**
   * Fetch customer by ID using FetchCustomer/ID endpoint
   */
  async fetchCustomerById(id: string): Promise<Customer> {
    return apiService.get<Customer>(`/Customers/FetchCustomer/${id}`);
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
  async create(customer: Partial<Customer>): Promise<Customer> {
    return apiService.post<Customer>(this.basePath, customer);
}

  /**
   * Update customer
   */
  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    return apiService.put<Customer>(`${this.basePath}/${id}`, customer);
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
}

// Export singleton instance
const customersService = new CustomersService();
export default customersService;
