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
  id: string;
  descr1: string;
  address: string;
  city: string;
  destinationtype: string;
}

export interface Reference {
  id: string;
  description: string;
  lastname: string;
  firstname: string;
  email: string;
  telephonenumber: string;
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
}

// Export singleton instance
const customersService = new CustomersService();
export default customersService;
