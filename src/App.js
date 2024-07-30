import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './appRouter';
import Layout from './layout';
import Sidebar from './Sidebar'; // Import your Sidebar component here
import Header from './Header'; // Import your Header component here
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header /> {/* Render the Header component here */}
      <div style={{ display: 'flex' }}>
        <Sidebar /> {/* Render the Sidebar component here */}
        <Layout>
          <main className="Main">
            <AppRouter /> {/* Render your router content here */}
          </main>
        </Layout>
      </div>
      <footer>
        {/* Your footer content can go here */}
      </footer>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
