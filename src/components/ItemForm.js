import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import axios from 'axios';
import '../styles/addItem.css';

const ItemForm = ({ onItemAdded }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '', // Siempre string
    cantidad: '',
    proveedor: ''
  });
  const [items, setItems] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE}/api/items`)
      .then(res => setItems(res.data))
      .catch(() => setItems([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'descripcion' ? (value ?? '') : value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Normaliza el nombre para comparar
    const nombreNuevo = formData.nombre.trim().toLowerCase();
    const existe = items.some(item => (item.nombre || '').trim().toLowerCase() === nombreNuevo);
    if (existe) {
      setErrorMsg('Ups, tenemos uno en bodega ya');
      setTimeout(() => setErrorMsg(''), 2100);
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE}/api/items`, {
        ...formData,
        cantidad: Number(formData.cantidad)
      });
      setFormData({ nombre: '', descripcion: '', cantidad: '', proveedor: '' });
      setItems([...items, response.data]);
      if (onItemAdded) onItemAdded(response.data);
    } catch (error) {
      console.error('Error al guardar el item:', error);
    }
  };

  return (
    <motion.div className="add-item-flex-container" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, type: 'spring' }}>
      <motion.div className="add-item-info" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, type: 'spring', stiffness: 100 }}>
        <div><h3>Nombre?</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae.</p>
        </div>
         <div><h3>Descripción?</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae.</p>
        </div>
         <div><h3>Cantidad?</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae.</p>
        </div>
         <div><h3>Provedor?</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae.</p>
        </div>
      </motion.div>
      <motion.div className="add-item-form" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, type: 'spring', stiffness: 100 }}>
        <div className="form-container">
          <motion.p className="form-title" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, type: 'spring', stiffness: 100 }}>Agregar Nuevo Item</motion.p>
          <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.28 }}
              style={{
                background: '#c62828', color: '#fff', padding: '0.6rem 1.3rem', borderRadius: 6, marginBottom: 12, fontWeight: 600, textAlign: 'center', fontSize: '1rem', boxShadow: '0 3px 14px #0002', letterSpacing: '0.5px', transition: 'all .18s'
              }}
            >{errorMsg}</motion.div>
          )}
          </AnimatePresence>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="input new-object-input"
            />
            <textarea
              placeholder="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={2}
              className="textarea input new-object-input"
            />
            <input
              type="number"
              placeholder="Cantidad"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              required
              className="input new-object-input"
            />
            <input
              type="text"
              placeholder="Provedor"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleChange}
              className="input new-object-input"
            />
            <button type="submit" className="item-card-edit-button">
              Guardar Item
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ItemForm;
