// Código corregido y optimizado con Tailwind CSS
import React, { useState, useEffect } from 'react';
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

  const producto = productos.find((p) => p._id === id);
  
  // SVG placeholder más simple y funcional
  const imagenPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='200' y='200' font-family='Arial' font-size='16' fill='%23374151' text-anchor='middle' dy='.3em'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

  // Manejo mejorado de imágenes
  const imagenes = React.useMemo(() => {
    if (!producto) return [];
    
    if (producto.imagenes && Array.isArray(producto.imagenes)) {
      const imagenesValidas = producto.imagenes.filter(img => img && img.trim() !== '');
      if (imagenesValidas.length > 0) return imagenesValidas;
    }
    
    if (producto.imagen && producto.imagen.trim() !== '') {
      return [producto.imagen];
    }
    
    return ['placeholder'];
  }, [producto]);

  const imagenActual = imagenes[currentImageIndex] || 'placeholder';

  useEffect(() => {
    if (!id) return;
    
    const fetchResenas = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://ecomerce-production-c031.up.railway.app/productos/${id}/resenas`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
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
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
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
      // Fallback si no hay historial
      window.location.href = '/productos';
    }
  };

  const cambiarImagen = (direccion) => {
    setCurrentImageIndex(prev => {
      const newIndex = prev + direccion;
      if (newIndex < 0) return imagenes.length - 1;
      if (newIndex >= imagenes.length) return 0;
      return newIndex;
    });
  };

  const agregar = () => {
    if (!agregarAlCarrito || !producto) {
      alert("Error: No se puede agregar el producto al carrito");
      return;
    }

    const precio = parseFloat(producto.precio);
    if (isNaN(precio) || precio <= 0) {
      alert("Error: Precio del producto no válido");
      return;
    }

    agregarAlCarrito({
      ...producto,
      precio: precio,
      cantidad: cantidad,
      precioTotal: precio * cantidad
    });
    
    alert(`${producto.nombre} agregado al carrito (${cantidad} unidad${cantidad > 1 ? 'es' : ''})`);
  };

  const obtenerUrlImagen = (nombreImagen) => {
    if (nombreImagen === 'placeholder') return imagenPlaceholder;
    return `https://ecomerce-production-c031.up.railway.app/uploads/${nombreImagen}`;
  };

  const manejarErrorImagen = (e) => {
    e.target.src = imagenPlaceholder;
  };

  if (!producto) {
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

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={goBack} 
          className="mb-6 text-sm text-gray-600 hover:text-blue-600 flex items-center transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> 
          Volver a productos
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Sección de imágenes */}
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden aspect-square bg-gray-100">
                <img
                  src={obtenerUrlImagen(imagenActual)}
                  alt={producto.nombre}
                  onError={manejarErrorImagen}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {imagenes.length > 1 && (
                  <>
                    <button 
                      onClick={() => cambiarImagen(-1)} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => cambiarImagen(1)} 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {imagenes.length > 1 && imagenes[0] !== 'placeholder' && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {imagenes.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'border-blue-600 ring-2 ring-blue-200' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={obtenerUrlImagen(img)}
                        alt={`${producto.nombre} ${index + 1}`}
                        onError={manejarErrorImagen}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  {producto.nombre}
                </h1>
                <div className="flex items-baseline space-x-3">
                  <p className="text-4xl font-bold text-blue-600">
                    ${(parseFloat(producto.precio || 0) * cantidad).toFixed(2)}
                  </p>
                  {cantidad > 1 && (
                    <span className="text-lg text-gray-500">
                      (${parseFloat(producto.precio || 0).toFixed(2)} c/u)
                    </span>
                  )}
                </div>
              </div>

              {producto.descripcion && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {producto.descripcion}
                </p>
              )}

              <div className="flex items-center space-x-4">
                <label className="text-gray-700 font-medium">Cantidad:</label>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setCantidad(prev => Math.max(1, prev - 1))} 
                    className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200 text-lg font-medium"
                    disabled={cantidad <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-gray-300 bg-gray-50 font-medium min-w-[60px] text-center">
                    {cantidad}
                  </span>
                  <button 
                    onClick={() => setCantidad(prev => prev + 1)} 
                    className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200 text-lg font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={agregar} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Agregar al carrito</span>
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setFavorito(!favorito)} 
                  className={`border-2 rounded-xl px-4 py-3 flex items-center justify-center space-x-2 transition-all duration-200 font-medium ${
                    favorito 
                      ? 'border-red-500 text-red-500 bg-red-50' 
                      : 'border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorito ? 'fill-current' : ''}`} />
                  <span>{favorito ? 'En favoritos' : 'Favoritos'}</span>
                </button>
                <button className="border-2 border-gray-300 rounded-xl px-4 py-3 flex items-center justify-center space-x-2 text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 font-medium">
                  <Share2 className="w-5 h-5" />
                  <span>Compartir</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sección de reseñas */}
          <div className="border-t border-gray-200 bg-gray-50 p-6 lg:p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Formulario para nueva reseña */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <MessageCircle className="text-blue-600 w-6 h-6" />
                  <span>Deja tu Reseña</span>
                </h3>
                <div className="space-y-4">
                  <textarea
                    className="w-full border border-gray-300 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows={5}
                    value={nuevaResena}
                    onChange={e => setNuevaResena(e.target.value)}
                    placeholder="Comparte tu experiencia con este producto..."
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {nuevaResena.length}/500 caracteres
                    </span>
                    <button
                      onClick={enviarResena}
                      disabled={enviando || !nuevaResena.trim()}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl flex items-center space-x-2 transition-colors duration-200"
                    >
                      {enviando ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Enviar Reseña</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mostrar reseñas existentes */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Reseñas de Clientes
                  {resenas.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({resenas.length})
                    </span>
                  )}
                </h3>
                
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="flex flex-col items-center space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      <span className="text-gray-500">Cargando reseñas...</span>
                    </div>
                  </div>
                ) : resenas.length > 0 ? (
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800">
                          {resenas[currentResenaIndex]?.usuario || 'Usuario Anónimo'}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {resenas[currentResenaIndex]?.texto}
                      </p>
                    </div>
                    
                    {resenas.length > 1 && (
                      <div className="flex items-center justify-between pt-2">
                        <button 
                          onClick={() => setCurrentResenaIndex(prev => (prev - 1 + resenas.length) % resenas.length)} 
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                          aria-label="Reseña anterior"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex space-x-2">
                          {resenas.map((_, index) => (
                            <button 
                              key={index}
                              onClick={() => setCurrentResenaIndex(index)} 
                              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                index === currentResenaIndex 
                                  ? 'bg-blue-600 scale-110' 
                                  : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                              aria-label={`Ir a reseña ${index + 1}`}
                            />
                          ))}
                        </div>
                        
                        <button 
                          onClick={() => setCurrentResenaIndex(prev => (prev + 1) % resenas.length)} 
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                          aria-label="Reseña siguiente"
                        >
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
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;