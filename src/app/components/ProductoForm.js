'use client';
import { useState, useEffect } from 'react';
import './ProductoForm.css';

export default function ProductoForm({ fetchProductos, editingProducto, setEditingProducto, closeModal }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    if (editingProducto) {
      setNombre(editingProducto.nombre || '');
      setPrecio(editingProducto.precio || '');
      setDescripcion(editingProducto.descripcion || '');
      setImagen(null); // No cargamos la imagen previa en este caso
    }
  }, [editingProducto]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('descripcion', descripcion);
    if (imagen) formData.append('imagen', imagen);

    try {
      const method = editingProducto ? 'PUT' : 'POST';
      const url = editingProducto ? `/api/productos?id=${editingProducto.id}` : '/api/productos';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        console.error('Error al guardar el producto:', errorResponse.error);
        alert(`Error: ${errorResponse.error}`);
        return;
      }

      fetchProductos();
      setNombre('');
      setPrecio('');
      setDescripcion('');
      setImagen(null);
      setEditingProducto(null);
      closeModal();
    } catch (error) {
      console.error('Error al guardar el producto:', error.message);
      alert('Ocurrió un error al guardar el producto. Verifica la consola para más detalles.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label className="modal-label">Nombre:</label>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="form-input"
        required
      />
      <label className="modal-label">Precio:</label>
      <input
        type="number"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        className="form-input"
        required
      />
      <label className="modal-label">Descripción:</label>
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="form-textarea"
        required
      />
      <label className="modal-label">Imagen:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagen(e.target.files[0])}
        className="form-input"
      />
      <div className="modal-buttons">
        <button type="button" className="modal-button cancel" onClick={closeModal}>
          Cancelar
        </button>
        <button type="submit" className="modal-button save">
          {editingProducto ? 'Actualizar Producto' : 'Agregar Producto'}
        </button>
      </div>
    </form>
  );
}
