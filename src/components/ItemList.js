import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import '../styles/custom.css';
import '../styles/custom-modal-view.css';
import '../styles/media-mobile-500.css';
import { FaEye, FaTrash, FaExclamationTriangle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const ItemList = ({ items, onItemUpdated, onItemDeleted }) => {
  // Ordenar items: primero los de cantidad baja
  const sortedItems = [...items].sort((a, b) => {
    // Primero los items con cantidad <= 2
    if (a.cantidad <= 2 && b.cantidad > 2) return -1;
    if (b.cantidad <= 2 && a.cantidad > 2) return 1;
    // Luego ordenar por cantidad ascendente
    return a.cantidad - b.cantidad;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingDeleteItem, setPendingDeleteItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nombre: '',
    descripcion: '', 
    cantidad: '',
    proveedor: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [fadeGrid, setFadeGrid] = useState(false);

  // Animar el grid al cambiar de página
  useEffect(() => {
    setFadeGrid(true);
    const timeout = setTimeout(() => setFadeGrid(false), 350);
    return () => clearTimeout(timeout);
  }, [currentPage]);

  // Filtrado de items
  const filteredItems = sortedItems.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.proveedor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estado para detectar mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estado para paginación
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const handleEdit = (item) => {
    setEditItem(item);
    setEditFormData({
      nombre: item.nombre,
      descripcion: item.descripcion,
      cantidad: item.cantidad,
      proveedor: item.proveedor || ''
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE}/api/items/${editItem._id}`, {
        ...editFormData,
        cantidad: Number(editFormData.cantidad)
      });
      if (onItemUpdated) {
        onItemUpdated(response.data);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1800);
      setEditItem(null);
    } catch (error) {
      console.error('Error al actualizar el item:', error);
    }
  };

  return (
    <>
      <AnimatePresence>
        {editItem && (
          <motion.div className="edit-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSuccess && (
          <motion.div className="success-toast" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            Guardado con éxito
          </motion.div>
        )}
      </AnimatePresence>
      <div className='itemlist-wrapped ss'>
        <div className="search-bar">
          <motion.input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar items..."
            className="input"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          />
        </div>
        <motion.div className={`card-grid${paginatedItems.length <= 2 ? ' centrado-movil' : ''}${fadeGrid ? ' page-fade' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <AnimatePresence>
            {paginatedItems.map(item => {
              const expanded = editItem && editItem._id === item._id;
              return (
                <motion.div
                  key={item._id}
                  className={`item-card${item.cantidad <= 2 ? ' low-stock-row' : ''}${expanded ? ' expanded' : ''}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="item-card-content">
                    <div className="item-card-title">
                      <span>{item.nombre}</span>
                    </div>
                    {isMobile ? (
                      <button className="item-card-edit-button" onClick={e => { e.stopPropagation(); handleEdit(item); }}><FaEye /> Ver</button>
                    ) : (
                      <>
                        <div className="item-card-provider">
                          <span>{item.proveedor}</span>
                        </div>
                        <div className="item-card-qty">
                          <span style={{fontFamily: 'monospace'}}>{item.cantidad}</span>
                        </div>
                        <div className="item-card-edit">
                          <button className="item-card-edit-button" onClick={e => { e.stopPropagation(); handleEdit(item); }}><FaEye /> Ver</button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        {totalPages > 1 && (
          <motion.div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', margin: '1.2rem 0 0 0' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <FaArrowLeft
              className={`pag-arrow-icon${currentPage === 1 ? ' pag-arrow-disabled' : ''}`}
              onClick={() => currentPage > 1 && setCurrentPage(p => Math.max(1, p - 1))}
              style={{ cursor: currentPage === 1 ? 'default' : 'pointer', fontSize: '1.4rem', color: currentPage === 1 ? '#ccc' : '#1976d2', transition: 'color 0.2s' }}
            />
            <FaArrowRight
              className={`pag-arrow-icon${currentPage === totalPages ? ' pag-arrow-disabled' : ''}`}
              onClick={() => currentPage < totalPages && setCurrentPage(p => Math.min(totalPages, p + 1))}
              style={{ cursor: currentPage === totalPages ? 'default' : 'pointer', fontSize: '1.4rem', color: currentPage === totalPages ? '#ccc' : '#1976d2', transition: 'color 0.2s' }}
            />
          </motion.div>
        )}
      </div>

       <AnimatePresence>
         {editItem && (
           <motion.div className="modal-bg modal-bg-darker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
             <motion.div className="modal-content" initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }} transition={{ duration: 0.22 }}>
               <div className="modal-view-fields">
  <div className="modal-view-row modal-view-row-flex">
    <span className="modal-view-label">Nombre:</span>
    <span className="modal-view-nombre">{editFormData.nombre}</span>
  </div>
  <div className="modal-view-row modal-view-row-flex">
    <span className="modal-view-label">Descripción:</span>
    <span className="modal-view-desc">{editFormData.descripcion}</span>
  </div>
  <div className="modal-view-row modal-view-row-flex">
    <span className="modal-view-label">Cantidad:</span>
    <span className="modal-view-cantidad">{editFormData.cantidad}</span>
  </div>
  <div className="modal-view-row modal-view-row-flex">
    <span className="modal-view-label">Provedor:</span>
    <span className="modal-view-proveedor">{editFormData.proveedor}</span>
  </div>
</div>
               <div className="modal-actions">
               <button type="button" className="boton-accion item-card-edit-button" onClick={() => setEditItem(null)}>Cerrar</button>
                 <button type="button" className=" item-card-edit-button" onClick={() => setPendingDeleteItem(editItem)}><FaTrash style={{verticalAlign: 'middle', marginRight: '2px'}}/>Eliminar</button>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Modal para confirmar borrado */}
       <AnimatePresence>
         {pendingDeleteItem && (
           <motion.div className="modal-bg modal-bg-darker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
             <motion.div className="modal-content" initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }} transition={{ duration: 0.22 }}>
               <p className="modal-title"></p>
               <p>¿Estás seguro de que deseas eliminar el item "{pendingDeleteItem.nombre}"? Esta acción no se puede deshacer.</p>
               <div className="modal-actions">
                 <button type="button" onClick={() => setPendingDeleteItem(null)} className="boton-accion  item-card-edit-button">Cancelar</button>
                 <button type="button" onClick={async () => {
                   try {
                     await axios.delete(`${process.env.REACT_APP_API_BASE}/api/items/${pendingDeleteItem._id}`);
                     if (onItemDeleted) {
                       onItemDeleted(pendingDeleteItem._id);
                     }
                     setPendingDeleteItem(null);
                     setEditItem(null);
                   } catch (error) {
                     console.error('Error al eliminar el item:', error);
                   }
                 }} className="  item-card-edit-button">Eliminar</button>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
     </> // Se agregó el cierre del fragmento principal
  );
};

export default ItemList;
