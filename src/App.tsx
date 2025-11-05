import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import CustomersList from './pages/CustomersList';
import CustomersSearch from './pages/CustomersSearch';
import CustomersCreate from './pages/CustomersCreate';
import CustomerMezzi from './pages/CustomerMezzi';
import CustomerSedi from './pages/CustomerSedi';
import CustomerContatti from './pages/CustomerContatti';
import MezzoCreate from './pages/MezzoCreate';
import SedeCreate from './pages/SedeCreate';
import ContattoCreate from './pages/ContattoCreate';
import Summary from './pages/Summary';
import ConfirmContacts from './pages/ConfirmContacts';
import ConfirmDestinations from './pages/ConfirmDestinations';
import ContactDifferences from './pages/ContactDifferences';
import DestinationDifferences from './pages/DestinationDifferences';
import './App.css';

// Placeholder components for now
const ItemsSearch = () => <div className="container"><h1>Ricerca Avanzata Mezzi - In sviluppo</h1></div>;
const Used = () => <div className="container"><h1>Usato - In sviluppo</h1></div>;
const Comunications = () => <div className="container"><h1>Comunicazioni - In sviluppo</h1></div>;
const AddressBook = () => <div className="container"><h1>Numeri utili - In sviluppo</h1></div>;
const DocumentsList = () => <div className="container"><h1>Ordini Attivi - In sviluppo</h1></div>;

function App() {
  return (
    <div className="app">
      <Header />
      
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/sign-in" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/confirm/contacts" element={<ConfirmContacts />} />
          <Route path="/confirm/contacts/differences/:id/:confirmedId" element={<ContactDifferences />} />
          <Route path="/confirm/destinations" element={<ConfirmDestinations />} />
          <Route path="/confirm/destinations/differences/:id/:confirmedId" element={<DestinationDifferences />} />
          <Route path="/customers/lists" element={<CustomersList />} />
          <Route path="/customers/search" element={<CustomersSearch />} />
          <Route path="/customers/create" element={<CustomersCreate />} />
          <Route path="/customers/edit/:id" element={<CustomersCreate />} />
          <Route path="/customers/:id/mezzi" element={<CustomerMezzi />} />
          <Route path="/customers/:customerId/mezzi/create" element={<MezzoCreate />} />
          <Route path="/customers/:customerId/mezzi/:mezzoId/edit" element={<MezzoCreate />} />
          <Route path="/customers/:id/sedi" element={<CustomerSedi />} />
          <Route path="/customers/:customerId/sedi/create" element={<SedeCreate />} />
          <Route path="/customers/:customerId/sedi/:sedeId/edit" element={<SedeCreate />} />
          <Route path="/customers/:id/contatti" element={<CustomerContatti />} />
          <Route path="/customers/:customerId/contatti/create" element={<ContattoCreate />} />
          <Route path="/customers/:customerId/contatti/:contattoId/edit" element={<ContattoCreate />} />
          <Route path="/items/search" element={<ItemsSearch />} />
          <Route path="/used" element={<Used />} />
          <Route path="/comunications" element={<Comunications />} />
          <Route path="/addressbook" element={<AddressBook />} />
          <Route path="/documents/lists" element={<DocumentsList />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
