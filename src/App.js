import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './appRouter';
import Layout from './layout';
import Sidebar from './Sidebar';
import Header from './Header';
import { DomainProvider } from './hooks/DomainContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import SearchPage from './pages/cwm/searchPage';
import SearchCard from './components/SearchCard';  // Import the SearchCard component
import LocationsPage from './components/admin/LocationsPage';  // Import LocationsPage

function App() {
  return (
    <div className="App">
      <DomainProvider>
        <Header /> {/* Render the Header component here */}
        <div style={{ display: 'flex' }}>
          <Sidebar /> {/* Render the Sidebar component here */}
          <Layout>
            <main className="Main">
              <SearchCard /> {/* Moved SearchCard here */}
              <SearchPage />
              <LocationsPage /> {/* Moved LocationsPage here */}
              <AppRouter /> {/* Render your router content here */}
            </main>
          </Layout>
        </div>
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop={false} 
          closeOnClick 
          rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
        />
      </DomainProvider>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export default App;
