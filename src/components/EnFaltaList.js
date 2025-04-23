import React, { useState } from 'react';
import { Paper, Typography, Box, IconButton, TextField, Button, Snackbar, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

import '../styles/custom.css';

function EnFaltaList({ items, onItemUpdated, onItemDeleted }) {
  const itemsEnFalta = items.filter(i => i.cantidad === 0);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', descripcion: '', cantidad: '', proveedor: '' });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEditClick = (item) => {
    setEditItem(item);
    setEditForm({
      nombre: item.nombre,
      descripcion: item.descripcion || '',
      cantidad: item.cantidad,
      proveedor: item.proveedor || ''
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const putUrl = `${process.env.REACT_APP_API_BASE}/api/items/${editItem._id}`;
      console.log('PUT URL:', putUrl);
      const response = await axios.put(putUrl, {
        ...editForm,
        cantidad: Number(editForm.cantidad)
      });
      if (onItemUpdated) onItemUpdated(response.data);
      if (Number(editForm.cantidad) > 0) {
        setEditItem(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1800);
      } else {
        setEditItem(null);
      }
    } catch (err) {
      console.error('Error al guardar los cambios', err);
      let msg = 'Error al guardar los cambios';
      if (err.response && err.response.data && err.response.data.message) {
        msg += ': ' + err.response.data.message;
      } else if (err.message) {
        msg += ': ' + err.message;
      }
      alert(msg);
    }
    setSaving(false);
  };


  const handleDelete = async () => {
    setSaving(true);
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE}/api/items/${pendingDelete._id}`);
      if (onItemDeleted) onItemDeleted(pendingDelete._id);
      setPendingDelete(null);
      setEditItem(null);
    } catch (err) {
      alert('Error al eliminar el item');
    }
    setSaving(false);
  };

  return (
    <div className="enfalta-container">
      <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, type: 'spring' }}>
        <h3 className="enfalta-title">Elementos en falta</h3>
        {itemsEnFalta.length === 0 ? (
          <p className="enfalta-titlep">No hay productos en falta.</p>
        ) : (
          <div className="enfalta-list">
            {itemsEnFalta.map(item => (
              <motion.div key={item._id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.23 }} className="enfalta-card">
                <div>
                  <strong>{item.nombre}</strong><br/>
                  <span className="enfalta-proveedor">Provedor: {item.proveedor || 'Sin provedor'}</span>
                </div>
                <button aria-label="Editar" onClick={() => handleEditClick(item)} className="enfalta-edit-btn">
                  <svg width="20" height="20" fill="#5e6e88" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm2.92 1.34l9.06-9.06 1.42 1.42-9.06 9.06H5.92v-1.42zm13.06-12.02c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {editItem && (
          <motion.div className="modal-bg modal-bg-darker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} style={{ zIndex: 3000 }}>
            <motion.div className="modal-content" initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }} transition={{ duration: 0.22 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Editar producto en falta</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <h4 style={{marginBottom: 8, marginTop: 0, fontSize: '1.5rem', fontWeight: 700}}>{editForm.nombre}</h4>
                <TextField className="item-boton" label="Descripción" name="descripcion" value={editForm.descripcion} onChange={handleEditChange} size="small" fullWidth multiline minRows={2} />
                <TextField className="item-boton" label="Cantidad" name="cantidad" value={editForm.cantidad} onChange={handleEditChange} size="small" type="number" fullWidth />
                <TextField className="item-boton" label="Provedor" name="proveedor" value={editForm.proveedor} onChange={handleEditChange} size="small" fullWidth />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                <Button component="button" className="botonesDeEliminar" onClick={() => setEditItem(null)} disabled={saving}>Cancelar</Button>
                <Button component="button" className="botonesDeEliminar" color="error" onClick={() => setPendingDelete(editItem)} startIcon={<DeleteIcon />} disabled={saving}>Eliminar</Button>
                <Button component="button" className="botonesDeEliminar" variant="contained" onClick={handleEditSave} disabled={saving}>Guardar</Button>
              </Box>
            </motion.div>
          </motion.div>
        )}
        {pendingDelete && (
          <motion.div className="modal-bg modal-bg-darker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} style={{ zIndex: 3200 }}>
            <motion.div className="modal-content" initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }} transition={{ duration: 0.22 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>¿Seguro que deseas eliminar "{pendingDelete.nombre}"? Esta acción no se puede deshacer.</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button component="button" className="botonesDeEliminar" onClick={() => setPendingDelete(null)} disabled={saving}>Cancelar</Button>
                <Button component="button" className="botonesDeEliminar" color="error" variant="contained" onClick={handleDelete} disabled={saving}>Eliminar</Button>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Snackbar open={showSuccess} autoHideDuration={1800} onClose={() => setShowSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          ¡Producto actualizado y devuelto a la lista!
        </Alert>
      </Snackbar>
      <Snackbar open={showSuccess} autoHideDuration={1800} onClose={() => setShowSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          ¡Producto actualizado y devuelto a la lista!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default EnFaltaList;
