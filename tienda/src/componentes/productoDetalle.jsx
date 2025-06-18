import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Heart, Loader2,
  MessageCircle, Send, Share2, ShoppingCart, AlertCircle, User
} from 'lucide-react';
import { useParams } from 'react-router-dom';

function ProductoDetalle({ productos = [], agregarAlCarrito }) {
  const { id } = useParams();
  const [resenas, setResenas] = useState([]);
  const [nuevaResena, setNuevaResena] = useState("");
  const [currentResenaIndex, setCurrentResenaIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [favorito, setFavorito] = useState(false);
  const [productoIndividual, setProductoIndividual] = useState(null);

  const imagenPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='200' y='200' font-family='Arial' font-size='16' fill='%23374151' text-anchor='middle' dy='.3em'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

  const producto = productos.find((p) => p._id === id);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`https://ecomerce-production-c031.up.railway.app/productos/${id}`);
        if (!res.ok) throw new Error('Producto no encontrado');
        const data = await res.json();
        setProductoIndividual(data);
      } catch (err) {
        console.error('Error al cargar producto:', err);
        setProductoIndividual(undefined);
      }
    };

    if (!producto) {
      fetchProducto();
    } else {
      setProductoIndividual(producto);
    }
  }, [id, producto]);

  useEffect(() => {
    if (!id) return;

    const fetchResenas = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://ecomerce-production-c031.up.railway.app/productos/${id}/resenas`);
        const data = await response.json();
        setResenas(Array.isArray(data.resenas) ? data.resenas : []);
      } catch (error) {
        console.error('Error al cargar reseñas:', error);
        setResenas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResenas();
  }, [id]);

  useEffect(() => {
    if (resenas.length > 1) {
      const interval = setInterval(() => {
        setCurrentResenaIndex(prev => (prev + 1) % resenas.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [resenas.length]);

  const imagenes = useMemo(() => {
    if (!productoIndividual) return [];

    if (productoIndividual.imagenes && Array.isArray(productoIndividual.imagenes)) {
      const validas = productoIndividual.imagenes.filter(img => img && img.trim() !== '');
      if (validas.length > 0) return validas;
    }

    if (productoIndividual.imagen && productoIndividual.imagen.trim() !== '') {
      return [productoIndividual.imagen];
    }

    return ['placeholder'];
  }, [productoIndividual]);

  const imagenActual = imagenes[currentImageIndex] || 'placeholder';

  const enviarResena = async () => {
    const textoLimpio = nuevaResena.trim();
    if (!textoLimpio) {
      alert("Por favor, escribe una reseña antes de enviar.");
      return;
    }

    setEnviando(true);
    try {
      const response = await fetch(`https://ecomerce-production-c031.up.railway.app/productos/${id}/resenas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId: id, texto: textoLimpio })
      });

      const data = await response.json();
      setResenas(prev => [...prev, data]);
      setNuevaResena("");
      alert("Reseña enviada correctamente");
    } catch (error) {
      console.error('Error al enviar reseña:', error);
      alert("Error al enviar la reseña. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/productos';
    }
  };

  const cambiarImagen = (dir) => {
    setCurrentImageIndex(prev => {
      const nuevo = prev + dir;
      if (nuevo < 0) return imagenes.length - 1;
      if (nuevo >= imagenes.length) return 0;
      return nuevo;
    });
  };

  const agregar = () => {
    if (!agregarAlCarrito || !productoIndividual) return alert("Error al agregar al carrito");

    const precio = parseFloat(productoIndividual.precio);
    if (isNaN(precio) || precio <= 0) return alert("Precio inválido");

    agregarAlCarrito({
      ...productoIndividual,
      precio,
      cantidad,
      precioTotal: precio * cantidad
    });

    alert(`${productoIndividual.nombre} agregado al carrito (${cantidad})`);
  };

  const obtenerUrlImagen = (nombre) =>
    nombre === 'placeholder'
      ? imagenPlaceholder
      : `https://ecomerce-production-c031.up.railway.app/uploads/${nombre}`;

  const manejarErrorImagen = (e) => {
    e.target.src = imagenPlaceholder;
  };

  if (productoIndividual === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <AlertCircle className="mx-auto text-red-500 w-12 h-12 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={goBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  if (!productoIndividual) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <button onClick={goBack} className="mb-4 text-sm text-blue-600 flex items-center">
          <ArrowLeft className="mr-2 w-4 h-4" /> Volver
        </button>
        <h1 className="text-2xl font-bold mb-2">{productoIndividual.nombre}</h1>
        <p className="text-gray-600 mb-4">{productoIndividual.descripcion}</p>
        <img
          src={obtenerUrlImagen(imagenActual)}
          onError={manejarErrorImagen}
          className="w-full max-w-md rounded-xl object-cover mb-4"
          alt="Imagen del producto"
        />

        <div className="mb-4 flex items-center space-x-4">
          <label className="text-gray-700 font-medium">Cantidad:</label>
          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
            <button onClick={() => setCantidad(prev => Math.max(1, prev - 1))} className="px-4 py-2 hover:bg-gray-100">-</button>
            <span className="px-6 py-2 border-x border-gray-300 bg-gray-50 font-medium">{cantidad}</span>
            <button onClick={() => setCantidad(prev => prev + 1)} className="px-4 py-2 hover:bg-gray-100">+</button>
          </div>
        </div>

        <button onClick={agregar} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl mb-6 flex items-center justify-center space-x-2 text-lg">
          <ShoppingCart className="w-5 h-5" />
          <span>Agregar al carrito</span>
        </button>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button onClick={() => setFavorito(!favorito)} className={`border-2 rounded-xl px-4 py-3 flex items-center justify-center space-x-2 font-medium ${favorito ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-500'}`}>
            <Heart className={`w-5 h-5 ${favorito ? 'fill-current' : ''}`} />
            <span>{favorito ? 'En favoritos' : 'Favoritos'}</span>
          </button>
          <button className="border-2 border-gray-300 rounded-xl px-4 py-3 flex items-center justify-center space-x-2 text-gray-700 hover:border-blue-400 hover:text-blue-600 font-medium">
            <Share2 className="w-5 h-5" />
            <span>Compartir</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <MessageCircle className="text-blue-600 w-6 h-6" />
            <span>Deja tu Reseña</span>
          </h3>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={5}
            value={nuevaResena}
            onChange={e => setNuevaResena(e.target.value)}
            placeholder="Comparte tu experiencia con este producto..."
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">{nuevaResena.length}/500 caracteres</span>
            <button
              onClick={enviarResena}
              disabled={enviando || !nuevaResena.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-xl flex items-center space-x-2"
            >
              {enviando ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Enviando...</span></> : <><Send className="w-5 h-5" /><span>Enviar</span></>}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Reseñas de Clientes {resenas.length > 0 && <span className="ml-2 text-sm font-normal text-gray-500">({resenas.length})</span>}</h3>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : resenas.length > 0 ? (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-800">{resenas[currentResenaIndex]?.usuario || 'Usuario Anónimo'}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{resenas[currentResenaIndex]?.texto}</p>
              </div>

              {resenas.length > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <button onClick={() => setCurrentResenaIndex(prev => (prev - 1 + resenas.length) % resenas.length)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex space-x-2">
                    {resenas.map((_, index) => (
                      <button key={index} onClick={() => setCurrentResenaIndex(index)} className={`w-3 h-3 rounded-full ${index === currentResenaIndex ? 'bg-blue-600 scale-110' : 'bg-gray-300 hover:bg-gray-400'}`} />
                    ))}
                  </div>
                  <button onClick={() => setCurrentResenaIndex(prev => (prev + 1) % resenas.length)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No hay reseñas aún</p>
              <p className="text-gray-400 text-sm mt-1">Sé el primero en dejar una reseña</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;