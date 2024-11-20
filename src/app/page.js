'use client';
import { useState, useEffect } from 'react';
import ProductoForm from './components/ProductoForm';
import Modal from './components/Modal';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);

  // Función para obtener los productos
  const fetchProductos = async () => {
    try {
      const res = await fetch('/api/productos');
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener productos:', error.message);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Función para abrir el modal para crear un nuevo producto
  const handleCreate = () => {
    setEditingProducto(null);
    setIsModalOpen(true);
  };

  // Función para abrir el modal para editar un producto existente
  const handleEdit = (producto) => {
    setEditingProducto(producto);
    setIsModalOpen(true);
  };

  // Función para eliminar un producto
  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const res = await fetch(`/api/productos?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchProductos();
        } else {
          console.error('Error al eliminar producto.');
        }
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-500 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold"> CRUD App</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-black">Productos</h2>
          <button
            onClick={handleCreate}
            className="bg-green-500 text-white font-semibold px-4 py-2 rounded hover:bg-green-600"
          >
            + Crear Producto
          </button>
        </div>
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Nombre</th>
                <th className="py-3 px-6">Precio</th>
                <th className="py-3 px-6">Descripción</th>
                <th className="py-3 px-6">Imagen</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {productos.map((producto) => (
                <tr key={producto.id} className="border-b bg-white hover:bg-gray-100">
                  <td className="py-3 px-6">{producto.id}</td>
                  <td className="py-3 px-6">{producto.nombre}</td>
                  <td className="py-3 px-6">{`$${producto.precio}`}</td>
                  <td className="py-3 px-6">{producto.descripcion}</td>
                  <td className="py-3 px-6">
                    {producto.imagen && (
                      <img
                        src={`data:image/jpeg;base64,${producto.imagen}`}
                        alt={producto.nombre}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleEdit(producto)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(producto.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ProductoForm
          fetchProductos={fetchProductos}
          editingProducto={editingProducto}
          setEditingProducto={setEditingProducto}
          closeModal={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
