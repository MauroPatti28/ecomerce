import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    imagen: null,
  });

  const [productos, setProductos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [imagenActual, setImagenActual] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch("https://ecomerce-production-c031.up.railway.app/productos");
      const data = await res.json();
      setProductos(data || []);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({
      ...form,
      imagen: file,
    });
  };

  const editarProducto = (producto) => {
    setForm({
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      imagen: null,
    });
    setModoEdicion(true);
    setIdEditando(producto._id);
    setImagenActual(producto.imagen);
  };

  const cancelarEdicion = () => {
    setForm({ nombre: "", descripcion: "", precio: "", imagen: null });
    setModoEdicion(false);
    setIdEditando(null);
    setImagenActual(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("precio", form.precio);
    formData.append("descripcion", form.descripcion);

    if (form.imagen) {
      formData.append("imagen", form.imagen);
    }

    const url = modoEdicion
      ? `https://ecomerce-production-c031.up.railway.app/productos/editar/${idEditando}`
      : "https://ecomerce-production-c031.up.railway.app/productos";
    const method = modoEdicion ? "PUT" : "POST";

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const textResponse = await res.text();
        console.error("Respuesta como texto:", textResponse);
        throw new Error(
          `El servidor devolvió HTML en lugar de JSON. Status: ${res.status}`
        );
      }

      if (res.ok) {
        alert(modoEdicion ? "Producto actualizado" : "Producto agregado");
        setForm({ nombre: "", descripcion: "", precio: "", imagen: null });
        setModoEdicion(false);
        setIdEditando(null);
        setImagenActual(null);
        fetchProductos();
      } else {
        console.error("Error del servidor:", data);
        alert("Error: " + (data.message || data.error || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error en la petición: " + error.message);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`https://ecomerce-production-c031.up.railway.app/productos/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          alert("Producto eliminado");
          fetchProductos();
        } else {
          alert("Error al eliminar: " + (data.message || data.error || "Error desconocido"));
        }
      } catch (error) {
        alert("Error en la petición: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona tus productos de manera eficiente</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {modoEdicion ? "✏️ Editar Producto" : "➕ Agregar Producto"}
              </h2>
              {modoEdicion && (
                <span className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
                  Modo Edición
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ingresa el nombre del producto"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Precio ($)
                </label>
                <input
                  type="number"
                  name="precio"
                  placeholder="0.00"
                  value={form.precio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  rows="4"
                  name="descripcion"
                  placeholder="Describe tu producto..."
                  value={form.descripcion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 resize-none"
                  required
                />
              </div>

              {modoEdicion && imagenActual && (
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300">
                  <p className="text-sm font-medium text-gray-700 mb-3">Imagen Actual:</p>
                  <div className="flex justify-center mb-3">
                    <img
                      src={`https://ecomerce-production-c031.up.railway.app/uploads/${imagenActual}`}
                      alt="Imagen actual"
                      className="w-24 h-24 object-cover rounded-xl shadow-md"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Selecciona una nueva imagen solo si quieres cambiarla
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Imagen del Producto
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="imagen"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept="image/*"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {modoEdicion ? "🔄 Actualizar Producto" : "💾 Guardar Producto"}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/admin/historial")}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 focus:ring-4 focus:ring-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  📋 Ver Historial
                </button>

                {modoEdicion && (
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 focus:ring-4 focus:ring-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    ❌ Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">📦 Productos Existentes</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {productos.length} productos
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {productos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 text-lg font-medium">No hay productos aún</p>
                  <p className="text-gray-400 text-sm">Agrega tu primer producto usando el formulario</p>
                </div>
              ) : (
                productos.map((p) => (
                  <div
                    key={p._id}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
                  >
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-bold text-gray-900 truncate">
                            {p.nombre}
                          </h4>
                          <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full ml-2">
                            ${p.precio}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Descripción:</p>
                          <div className="bg-gray-50 rounded-lg p-3 max-h-24 overflow-y-auto">
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {p.descripcion}
                            </p>
                          </div>
                        </div>

                        {p.imagen && (
                          <div className="mb-4">
                            <img
                              src={`https://ecomerce-production-c031.up.railway.app/uploads/${p.imagen}`}
                              alt={p.nombre}
                              className="w-20 h-20 object-cover rounded-xl shadow-md border-2 border-gray-200"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex lg:flex-col gap-2">
                        <button
                          onClick={() => editarProducto(p)}
                          className="flex-1 lg:flex-none bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 focus:ring-4 focus:ring-amber-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => eliminarProducto(p._id)}
                          className="flex-1 lg:flex-none bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;