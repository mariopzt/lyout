import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/welcome.css';
import { SnackbarProvider, useSnackbar } from 'notistack';
import './App.css';
import './styles/login.css';
import './styles/autocomplete-compact.css';
import './styles/media-navbar.css';
import Hero from './components/Hero';
import ErrorBoundary from './components/ErrorBoundary';
import { Container, CssBaseline, createTheme, ThemeProvider, Box, Typography, Paper } from '@mui/material';
import ItemForm from './components/ItemForm';
import SubtractForm from './components/SubtractForm';
import EnFaltaList from './components/EnFaltaList';
import ItemList from './components/ItemList';
import Navbar from './components/Navbar';
import axios from 'axios';

// Login comnent
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Cambia la URL si tu backend está en otro puerto o dominio
      const response = await axios.post("http://localhost:3000/api/login", { username, password });
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedUser', username);
      onLogin(username);
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-bg">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar sesión</h2>
        <div>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="login-button">Entrar</button>
      </form>
    </div>
  );
}


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});


const AppContent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [currentTab, setCurrentTab] = useState('hero');

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE}/api/items/`);
      console.log('Respuesta de items:', response.data); // DEBUG
      setItems(response.data);
    } catch (error) {
      console.error('Error al obtener items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleItemAdded = (newItem) => {
    fetchItems();
    enqueueSnackbar('¡Item agregado exitosamente!', { 
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    });
  };

  const handleItemUpdated = (updatedItem) => {
    fetchItems();
  };

  const handleItemDeleted = (itemId) => {
    fetchItems();
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <div className="main-content">
          <Navbar currentTab={currentTab} onTabChange={setCurrentTab} showHeroButton={true} />
          {currentTab === 'hero' && (
            <Hero onTabChange={setCurrentTab} />
          )}
          {currentTab !== 'hero' && (
            <>
              <div className="welcome-section">
                <p className="welcome-title">Stock Bodega</p>
                <p className="welcome-desc">Sistema de control y gestión de productos</p>
              </div>
              <div className="container">
                {currentTab === 'list' && (
                  <div className="itemlist-all">
                    <ItemList 
                      items={items.filter(item => item.cantidad > 0)} 
                      onItemUpdated={handleItemUpdated}
                      onItemDeleted={handleItemDeleted}
                    />
                  </div>
                )}
                {currentTab === 'add' && (
                  <div className='form-container-boton' >
                    <ItemForm onItemAdded={handleItemAdded} />
                  </div>
                )}
                {currentTab === 'subtract' && (
                  <div className='form-container-boton'>
                    <SubtractForm onItemUpdated={handleItemUpdated} />
                  </div>
                )}
                {currentTab === 'enfalta' && (
                  <div className="form-container-boton">
                    <EnFaltaList 
                      items={items} 
                      onItemUpdated={handleItemUpdated}
                      onItemDeleted={handleItemDeleted}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [showWelcome, setShowWelcome] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('loggedUser') || '');

  // Modifica el login para guardar el usuario
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user);
    localStorage.setItem('loggedUser', user);
    setShowWelcome(true);
    setTimeout(() => setShowWelcome(false), 2000);
  };

  // Si no está logueado, muestra el login
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Si está logueado pero debe mostrar bienvenida
  if (showWelcome) {
    return (
      <div className="welcome-bg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="welcome-card"
        >
          <h1 className="welcome-title">
            ¡Bienvenido, {username || 'usuario'}!
          </h1>
          <div className="welcome-msg">Has iniciado sesión correctamente.</div>
        </motion.div>
      </div>
    );
  }

  return (
    <SnackbarProvider maxSnack={3}>
      <AppContent />
    </SnackbarProvider>
  );
}

export default App;
