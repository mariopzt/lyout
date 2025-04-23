import React, { useState } from 'react';
import SettingsIcon from './SettingsIcon';


function Navbar({ currentTab, onTabChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Bloquear scroll al abrir menú
  React.useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [menuOpen]);

  const handleTabChange = (tab) => {
    setMenuOpen(false);
    onTabChange(tab);
  };

  // Detect if mobile (700px or less)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="navbar-content">

        <>
        {isMobile && (
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:10}}>
            <button
              className="navbar-hamburger"
              style={{cursor:'pointer'}}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Abrir menú"
            >
              <span className="hamburger-icon-white">
                <svg width="24" height="24"  viewBox="0 0 32 32" fill="#5e6e88" xmlns="http://www.w3.org/2000/svg">
                  <rect y="6" width="32" height="4" rx="2" fill="#5e6e88" />
                  <rect y="14" width="32" height="4" rx="2" fill="#5e6e88" />
                  <rect y="22" width="32" height="4" rx="2" fill="#5e6e88" />
                </svg>
              </span>
            </button>
            <button
              className="navbar-hamburger"
              style={{cursor:'pointer'}}
              aria-label="Ir al inicio"
              onClick={() => handleTabChange('hero')}
            >
              <span className="hamburger-icon-white">
                <SettingsIcon size={24} color="#5e6e88" />
              </span>
            </button>
            <button
              className="navbar-hamburger"
              style={{cursor:'pointer'}}
              aria-label="Salir"
              onClick={() => { if(window.confirm('¿Estás seguro que deseas salir?')) { localStorage.removeItem('isLoggedIn'); window.location.reload(); } }}
            >
              <span className="hamburger-icon-white">
                <svg width="26" height="26" fill="#5e6e88" viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3z"/><path d="M20 3h-8c-1.1 0-2 .9-2 2v4h2V5h8v14h-8v-4h-2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
              </span>
            </button>
          </div>
        )}
        {(!isMobile || (isMobile && menuOpen)) && (
          <div
            className={`navbar-buttons${isMobile && menuOpen ? ' open' : ''}`}
            style={{display:'flex',alignItems:'center'}}
            onClick={isMobile && menuOpen ? () => setMenuOpen(false) : undefined}
          >
            <button
              className={` navbar-btn-menuList${currentTab === 'hero' ? ' active' : ''}`}
              onClick={e => { e.stopPropagation(); handleTabChange('hero'); }}
            >
              Inicio
            </button>
            <button
              className={`navbar-btn-menuList${currentTab === 'list' ? ' active' : ''}`}
              onClick={e => { e.stopPropagation(); handleTabChange('list'); }}
            >
              Lista de Items
            </button>
            <button
              className={`navbar-btn-menuList${currentTab === 'add' ? ' active' : ''}`}
              onClick={e => { e.stopPropagation(); handleTabChange('add'); }}
            >
              Agregar Nuevo Item
            </button>
            <button
              className={`navbar-btn-menuList${currentTab === 'subtract' ? ' active' : ''}`}
              onClick={e => { e.stopPropagation(); handleTabChange('subtract'); }}
            >
              Restar Items
            </button>
            <button
              className={`navbar-btn-menuList${currentTab === 'enfalta' ? ' active' : ''}`}
              onClick={e => { e.stopPropagation(); handleTabChange('enfalta'); }}
            >
              En falta
            </button>
            {/* Botón de salir */}
            <button
              className="navbar-btn navbar-btn-logout"
              style={{display:'flex',alignItems:'center',background:'none',border:'none',cursor:'pointer',marginLeft:'auto'}}
              aria-label="Salir"
              onClick={() => { if(window.confirm('¿Estás seguro que deseas salir?')) { localStorage.removeItem('isLoggedIn'); window.location.reload(); } }}
            >
              <svg width="26" height="26" fill="#5e6e88" viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3z"/><path d="M20 3h-8c-1.1 0-2 .9-2 2v4h2V5h8v14h-8v-4h-2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
            </button>
          </div>
        )}
        </>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
