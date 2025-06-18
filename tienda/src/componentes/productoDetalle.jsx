import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Heart, Loader2,
  MessageCircle, Send, Share2, ShoppingCart, AlertCircle
} from 'lucide-react';
import { useParams } from 'react-router-dom';

function ProductoDetalle({ agregarAlCarrito }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [nuevaResena, setNuevaResena] = useState("");
  const [currentResenaIndex, setCurrentResenaIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingProducto, setLoadingProducto] = useState(true);
  const [loadingResenas, setLoadingResenas] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [favorito, setFavorito] = useState(false);

  const imagenPlaceholder = "data:image/svg+xml,%3Csvg...%3C/svg%3E";

  useEffect(() => {
    if (!id) return;
    setLoadingProducto(true);
    fetch(`https://ecomerce-production-c031.up.railway.app/productos/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject("No encontrado"))
      .then(data => setProducto(data))
      .catch(() => setProducto(null))
      .finally(() => setLoadingProducto(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingResenas(true);
    fetch(`https://ecomerce-production-c031.up.railway.app/productos/${id}/resenas`)
      .then(res => res.ok ? res.json() : Promise.reject("Error"))
      .then(data => setResenas(Array.isArray(data.resenas) ? data.resenas : []))
      .catch(() => setResenas([]))
      .finally(() => setLoadingResenas(false));
  }, [id]);

  useEffect(() => {
    if (resenas.length > 1) {
      const interval = setInterval(() => {
        setCurrentResenaIndex(i => (i + 1) % resenas.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [resenas]);

  const enviarResena = async () => {
    if (!nuevaResena.trim()) return alert("Escribe una reseña.");
    setEnviando(true);
    try {
      const res = await fetch(`https://ecomerce-production-c031.up.railway.app/productos/${id}/resenas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId: id, texto: nuevaResena })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResenas(prev => [...prev, data]);
      setNuevaResena("");
    } catch {
      alert("Error al enviar reseña");
    } finally {
      setEnviando(false);
    }
  };

  const goBack = () => window.history.back();
  const cambiarImagen = dir => setCurrentImageIndex(i => (i + dir + imagenes.length) % imagenes.length);
  const agregar = () => {
    if (!producto) return;
    agregarAlCarrito && agregarAlCarrito({
      ...producto,
      precio: parseFloat(producto.precio),
      cantidad,
      precioTotal: parseFloat(producto.precio) * cantidad
    });
  };

  if (loadingProducto) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <AlertCircle className="mx-auto text-red-500 w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
          <button 
            onClick={goBack} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  const imagenes = producto?.imagenes?.filter(Boolean) ||
    (producto?.imagen ? [producto.imagen] : ['placeholder']);
  const imagenActual = imagenes[currentImageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <button 
          onClick={goBack} 
          className="text-sm mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" /> 
          Volver a productos
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Sección de imágenes */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              <img
                src={imagenActual === 'placeholder' ? imagenPlaceholder : `https://ecomerce-production-c031.up.railway.app/uploads/${imagenActual}`}
                alt={producto.nombre}
                onError={e => e.target.src = imagenPlaceholder}
                className="w-full aspect-square object-cover"
              />
              {imagenes.length > 1 && (
                <>
                  <button 
                    onClick={() => cambiarImagen(-1)} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => cambiarImagen(1)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              
              {/* Indicadores de imagen */}
              {imagenes.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {imagenes.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        i === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {imagenes.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {imagenes.map((img, i) => (
                  <img
                    key={i}
                    src={`https://ecomerce-production-c031.up.railway.app/uploads/${img}`}
                    alt="miniatura"
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-20 h-20 rounded-xl cursor-pointer transition-all duration-200 flex-shrink-0 ${
                      i === currentImageIndex 
                        ? 'ring-4 ring-blue-600 ring-offset-2 shadow-lg' 
                        : 'ring-2 ring-gray-200 hover:ring-gray-300 hover:shadow-md'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{producto.nombre}</h1>
              
              <div className="flex items-baseline space-x-2 mb-6">
                <p className="text-3xl lg:text-4xl font-bold text-blue-600">
                  ${(producto.precio * cantidad).toFixed(2)}
                </p>
                {cantidad > 1 && (
                  <span className="text-lg text-gray-500">
                    (${producto.precio} c/u)
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-8">{producto.descripcion}</p>

              {/* Selector de cantidad */}
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-gray-700 font-medium">Cantidad:</span>
                <div className="flex items-center bg-gray-100 rounded-lg">
                  <button 
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="p-3 hover:bg-gray-200 rounded-l-lg transition-colors duration-200 text-gray-600 hover:text-gray-800"
                  >
                    <span className="text-xl font-semibold">−</span>
                  </button>
                  <span className="px-6 py-3 font-semibold text-lg text-gray-800 bg-white border-x border-gray-200">
                    {cantidad}
                  </span>
                  <button 
                    onClick={() => setCantidad(cantidad + 1)}
                    className="p-3 hover:bg-gray-200 rounded-r-lg transition-colors duration-200 text-gray-600 hover:text-gray-800"
                  >
                    <span className="text-xl font-semibold">+</span>
                  </button>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-4">
                <button 
                  onClick={agregar} 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Agregar al carrito</span>
                </button>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setFavorito(!favorito)} 
                    className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
                      favorito 
                        ? 'bg-red-50 border-2 border-red-500 text-red-600 hover:bg-red-100' 
                        : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorito ? 'fill-current' : ''}`} />
                    <span>{favorito ? 'Favorito' : 'Me gusta'}</span>
                  </button>
                  
                  <button className="flex-1 bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2">
                    <Share2 className="w-5 h-5" />
                    <span>Compartir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de reseñas */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          {/* Escribir reseña */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
            <h2 className="font-bold text-2xl mb-6 text-gray-900 flex items-center">
              <MessageCircle className="w-6 h-6 mr-3 text-blue-600" />
              Deja tu reseña
            </h2>
            <textarea
              value={nuevaResena}
              onChange={e => setNuevaResena(e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl p-4 transition-all duration-200 resize-none text-gray-700"
              rows={4}
              placeholder="Comparte tu experiencia con este producto..."
            />
            <button 
              onClick={enviarResena} 
              disabled={enviando || !nuevaResena.trim()} 
              className="mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2 disabled:cursor-not-allowed"
            >
              {enviando ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Enviar reseña</span>
                </>
              )}
            </button>
          </div>

          {/* Ver reseñas */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
            <h2 className="font-bold text-2xl mb-6 text-gray-900">
              Reseñas ({resenas.length})
            </h2>
            
            {loadingResenas ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
              </div>
            ) : resenas.length ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <p className="font-semibold mb-3 text-gray-800 text-lg">
                  {resenas[currentResenaIndex].usuario || 'Usuario Anónimo'}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  "{resenas[currentResenaIndex].texto}"
                </p>
                
                {resenas.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {resenas.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          i === currentResenaIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No hay reseñas aún.</p>
                <p className="text-gray-400 text-sm mt-2">¡Sé el primero en compartir tu opinión!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;