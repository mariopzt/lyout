import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete
} from '@mui/material';
import "../styles/busqueda-sugerencias.css"
import WarningIcon from '@mui/icons-material/Warning';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const SubtractForm = ({ onItemUpdated }) => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); 
  const [cantidadMap, setCantidadMap] = useState(() => ({})); 
  const [inputValue, setInputValue] = useState(() => ("")); 
  const [error, setError] = useState("");
const [success, setSuccess] = useState("");

  // Oculta el mensaje de éxito después de 10 segundos
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess("") , 10000);
      return () => clearTimeout(timer);
    }
  }, [success]);
const [showEnFalta, setShowEnFalta] = useState(false);
const itemsEnFalta = items.filter(i => i.cantidad === 0);
const itemsDisponibles = items.filter(i => i.cantidad > 0);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE}/api/items`);
        setItems(response.data);
      } catch (error) {
        console.error('Error al cargar items:', error);
      }
    };
    fetchItems();
  }, []);

  // Al seleccionar un item de la búsqueda
  const handleItemSelect = (event, newValue) => {
  if (newValue && !selectedItems.some(i => i._id === newValue._id)) {
    setSelectedItems(prev => [newValue, ...prev]);
    setCantidadMap(prev => ({ ...prev, [newValue._id]: 1 }));
    setInputValue(""); // Limpiar el input después de seleccionar
  }
};

  // Cambiar cantidad con iconos
  const handleCantidadChange = (itemId, delta) => {
    setCantidadMap(prev => {
      const actual = prev[itemId] || 1;
      let nueva = actual + delta;
      if (nueva < 1) nueva = 1;
      const itemObj = selectedItems.find(i => i._id === itemId);
      if (itemObj && nueva > itemObj.cantidad) nueva = itemObj.cantidad;
      return { ...prev, [itemId]: nueva };
    });
  };

  // Eliminar item de la lista
  const handleRemoveSelected = (itemId) => {
    setSelectedItems(prev => prev.filter(i => i._id !== itemId));
    setCantidadMap(prev => {
      const cp = { ...prev };
      delete cp[itemId];
      return cp;
    });
  };

  // Restar todos los seleccionados
  const handleSubtractAll = async () => {
    let huboError = false;
    for (const item of selectedItems) {
      const cantidadARestar = cantidadMap[item._id] || 1;
      const newQuantity = item.cantidad - cantidadARestar;
      if (newQuantity < 0) {
        setError(`No hay suficiente cantidad disponible para ${item.nombre}`);
        huboError = true;
        continue;
      }
      try {
        const response = await axios.put(`${process.env.REACT_APP_API_BASE}/api/items/${item._id}`, {
          cantidad: newQuantity
        });
        if (onItemUpdated) onItemUpdated(response.data);
      } catch (error) {
        setError(`Error al actualizar el item ${item.nombre}`);
        huboError = true;
      }
    }
    if (!huboError) {
      setSuccess('Se restaron las cantidades seleccionadas.');
      setSelectedItems([]);
      setCantidadMap({});
    }
  };

  return (
    <div className="subtract-form-container">
      <div className="paper">
        <div className="header-row">
          <h2 className='restar-cantidad'>Restar Cantidad</h2>
        </div>
        {showEnFalta && (
          <div className="en-falta-section">
            <h4 style={{color: 'red'}}>Items en falta (cantidad 0):</h4>
            {itemsEnFalta.length === 0 ? (
              <p>No hay items en falta.</p>
            ) : (
              <ul className="en-falta-list">
                {itemsEnFalta.map(item => (
                  <li key={item._id} style={{fontWeight:600}}>{item.nombre}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="busqueda-section">
          <input
            type="text"
            placeholder="Escribe para buscar..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="input"
          />
          {inputValue.length > 0 && (
            <ul className="busqueda-sugerencias">
              {itemsDisponibles
                .filter(i =>
                  !selectedItems.find(sel => sel._id === i._id) &&
                  i.nombre.toLowerCase().startsWith(inputValue.toLowerCase())
                )
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map(option => (
                  <li
                    key={option._id}
                    className="busqueda-sugerencia-li"
                    onClick={() => handleItemSelect(null, option)}
                  >
                    {option.nombre}
                  </li>
                ))}
            </ul>
          )}
        </div>
        {selectedItems.length > 0 && (
          <div className="seleccionados-section" style={{ marginTop: 24, marginBottom: 16 }}>
            <h4 className='restar-cantidad'>Items seleccionados:</h4>
            <div className="seleccionados-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {selectedItems.map(item => (
                <div
                  key={item._id}
                  className="seleccionado-item"
                >
                  <div className="nombre-item-wrap">
  <span style={{ flex: 1,width: '100%', fontWeight: 500 }}>{item.nombre}</span>
</div>
<div className="cantidad-item-wrap">
  <input
    type="number"
    min={1}
    max={item.cantidad}
    value={cantidadMap[item._id] === 0 ? '' : cantidadMap[item._id]}
    onChange={e => {
      const val = e.target.value;
      if (val === '' || val === '0') {
        setCantidadMap(prev => ({ ...prev, [item._id]: 0 }));
        return;
      }
      let num = parseInt(val);
      if (isNaN(num) || num < 1) num = 1;
      if (num > item.cantidad) num = item.cantidad;
      setCantidadMap(prev => ({ ...prev, [item._id]: num }));
    }}
    className="cantidad-input"
    style={{ width: 40, textAlign: 'center', fontWeight: 600, borderRadius: 4,  color: '#5f7691', background: '#151B23' }}
  />
</div>
<div className="quitar-item-wrap">
  <button
    type="button"
    onClick={() => handleRemoveSelected(item._id)}
  className="quitar-btn"
  style={{ marginLeft: 8, color: 'red', background: 'none', border: 'none', padding: 0 }}
    aria-label="Quitar"
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  </button>
</div>
                </div>
              ))}
            </div>
            <button className="restar-todos-btn" style={{ marginTop: 16 }} onClick={handleSubtractAll}>Restar Todos</button>
          </div>
        )}
        {error && (
          <div className="alert-error" style={{ marginTop: 16, color: 'red', background: '#ffeaea', padding: '8px 12px', borderRadius: 6 }}>
            {error}
          </div>
        )}
        {success && (
          <div className="alert-success" style={{ marginTop: 16, color: 'green', background: '#eaffea', padding: '8px 12px', borderRadius: 6 }}>
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtractForm;
