/**
 * Example: Using the API service in a React component
 */

import { useState, useEffect } from 'react';
import customersService, { Customer } from '../services/customers.service';
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

  const handleCreateCustomer = async (customerData: Partial<Customer>) => {
    try {
 const newCustomer = await customersService.create(customerData);
      toast.success('Cliente creato con successo!');
      setCustomers([...customers, newCustomer]);
    } catch (error) {
  console.error('Error creating customer:', error);
      toast.error('Errore nella creazione del cliente');
    }
  };

  const handleUpdateCustomer = async (id: string, customerData: Partial<Customer>) => {
    try {
      const updatedCustomer = await customersService.update(id, customerData);
      toast.success('Cliente aggiornato con successo!');
      setCustomers(customers.map(c => c.id === id ? updatedCustomer : c));
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Errore nell\'aggiornamento del cliente');
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await customersService.delete(id);
      toast.success('Cliente eliminato con successo!');
      setCustomers(customers.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
  toast.error('Errore nell\'eliminazione del cliente');
    }
  };

return (
    <div>
      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <ul>
          {customers.map(customer => (
            <li key={customer.id}>{customer.ragsoc}</li>
          ))}
        </ul>
      )}
  </div>
  );
};

export default ExampleCustomerComponent;
