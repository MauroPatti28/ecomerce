// Código simplificado y estilizado con Tailwind CSS
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
  const imagenPlaceholder = "data:image/svg+xml,%3Csvg...%3C/svg%3E";

  const imagenes = producto?.imagenes?.filter(Boolean) ||
    (producto?.imagen ? [producto.imagen] : ['placeholder']);
  const imagenActual = imagenes[currentImageIndex];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`https://ecomerce-production-c031.up.railway.app/productos/${id}/resenas`)
      .then(res => res.ok ? res.json() : Promise.reject("Error"))
      .then(data => setResenas(Array.isArray(data.resenas) ? data.resenas : []))
      .catch(() => setResenas([]))
      .finally(() => setLoading(false));
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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
  const agregar = () => agregarAlCarrito && producto && agregarAlCarrito({
    ...producto,
    precio: parseFloat(producto.precio),
    cantidad,
    precioTotal: parseFloat(producto.precio) * cantidad
  });

  if (!producto) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center">
        <AlertCircle className="mx-auto text-red-500 w-10 h-10 mb-2" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Producto no encontrado</h2>
        <button onClick={goBack} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Volver</button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button onClick={goBack} className="text-sm mb-6 text-gray-600 hover:text-blue-600 flex items-center">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="relative rounded-xl overflow-hidden aspect-square bg-gray-100">
            <img
              src={imagenActual === 'placeholder' ? imagenPlaceholder : `https://ecomerce-production-c031.up.railway.app/uploads/${imagenActual}`}
              alt={producto.nombre}
              onError={e => e.target.src = imagenPlaceholder}
              className="w-full h-full object-cover"
            />
            {imagenes.length > 1 && (
              <>
                <button onClick={() => cambiarImagen(-1)} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => cambiarImagen(1)} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {imagenes.length > 1 && (
            <div className="flex space-x-3 mt-4 overflow-x-auto">
              {imagenes.map((img, i) => (
                <img
                  key={i}
                  src={`https://ecomerce-production-c031.up.railway.app/uploads/${img}`}
                  alt="mini"
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-20 h-20 object-cover rounded-xl border-2 cursor-pointer ${i === currentImageIndex ? 'border-blue-600' : 'border-gray-300'}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>
          <p className="text-4xl font-bold text-blue-600">
            ${(producto.precio * cantidad).toFixed(2)}
            {cantidad > 1 && <span className="ml-2 text-sm text-gray-500">(${producto.precio} c/u)</span>}
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">{producto.descripcion}</p>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Cantidad:</span>
            <div className="flex items-center border rounded-xl overflow-hidden">
              <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="px-3 py-2 hover:bg-gray-100">-</button>
              <span className="px-4 border-x py-2">{cantidad}</span>
              <button onClick={() => setCantidad(cantidad + 1)} className="px-3 py-2 hover:bg-gray-100">+</button>
            </div>
          </div>

          <button onClick={agregar} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition">Agregar al carrito <ShoppingCart className="inline-block ml-2" /></button>

          <div className="flex space-x-4">
            <button onClick={() => setFavorito(!favorito)} className={`flex-1 border-2 rounded-xl px-4 py-2 flex items-center justify-center space-x-2 transition ${favorito ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-700 hover:border-red-400'}`}>
              <Heart className={`w-5 h-5 ${favorito ? 'fill-current' : ''}`} />
              <span>Favoritos</span>
            </button>
            <button className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-2 flex items-center justify-center space-x-2 text-gray-700 hover:border-blue-400 hover:text-blue-600">
              <Share2 className="w-5 h-5" />
              <span>Compartir</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <MessageCircle className="text-blue-600 w-5 h-5" />
            <span>Deja tu Reseña</span>
          </h3>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={nuevaResena}
            onChange={e => setNuevaResena(e.target.value)}
            placeholder="Escribe tu experiencia..."
          />
          <button
            onClick={enviarResena}
            disabled={enviando || !nuevaResena.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2"
          >
            {enviando ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Enviando...</span></> : <><Send className="w-5 h-5" /><span>Enviar Reseña</span></>}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Reseñas de Clientes</h3>
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : resenas.length ? (
            <div>
              <div className="border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-gray-800">{resenas[currentResenaIndex]?.usuario || 'Anónimo'}</span>
                </div>
                <p className="text-gray-700">{resenas[currentResenaIndex]?.texto}</p>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={() => setCurrentResenaIndex(i => (i - 1 + resenas.length) % resenas.length)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><ChevronLeft /></button>
                <div className="flex space-x-1">
                  {resenas.map((_, i) => (
                    <button key={i} onClick={() => setCurrentResenaIndex(i)} className={`w-2 h-2 rounded-full ${i === currentResenaIndex ? 'bg-blue-600' : 'bg-gray-300'}`}></button>
                  ))}
                </div>
                <button onClick={() => setCurrentResenaIndex(i => (i + 1) % resenas.length)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><ChevronRight /></button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">No hay reseñas aún.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;
