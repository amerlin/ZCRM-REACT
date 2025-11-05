/**
 * Example: Using the API service in a React component
 */

import { useState, useEffect } from 'react';
import customersService, { type Customer } from '../services/customers.service';
import { toast } from 'react-toastify';

const ExampleCustomerComponent = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  // Load customers on mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await customersService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Errore nel caricamento dei clienti');
    } finally {
      setLoading(false);
    }
  };

  // Note: handleCreateCustomer, handleUpdateCustomer, and handleDeleteCustomer 
  // functions removed as they are not used in this example component

  return (
    <div>
      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <ul>
          {customers.map(customer => (
            <li key={customer.id}>{customer.descr1}</li>
          ))}
        </ul>
      )}
  </div>
  );
};

export default ExampleCustomerComponent;
