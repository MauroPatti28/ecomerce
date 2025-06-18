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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 w-8 h-8" />
          <h2>Producto no encontrado</h2>
          <button onClick={goBack} className="btn mt-4">Volver</button>
        </div>
      </div>
    );
  }

  const imagenes = producto?.imagenes?.filter(Boolean) ||
    (producto?.imagen ? [producto.imagen] : ['placeholder']);
  const imagenActual = imagenes[currentImageIndex];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <button onClick={goBack} className="text-sm mb-4 flex items-center">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="relative">
            <img
              src={imagenActual === 'placeholder' ? imagenPlaceholder : `https://ecomerce-production-c031.up.railway.app/uploads/${imagenActual}`}
              alt={producto.nombre}
              onError={e => e.target.src = imagenPlaceholder}
              className="w-full aspect-square object-cover rounded-xl"
            />
            {imagenes.length > 1 && (
              <>
                <button onClick={() => cambiarImagen(-1)} className="absolute left-2 top-1/2">◀</button>
                <button onClick={() => cambiarImagen(1)} className="absolute right-2 top-1/2">▶</button>
              </>
            )}
          </div>

          {imagenes.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto">
              {imagenes.map((img, i) => (
                <img
                  key={i}
                  src={`https://ecomerce-production-c031.up.railway.app/uploads/${img}`}
                  alt="mini"
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-16 h-16 rounded border ${i === currentImageIndex ? 'border-blue-600' : 'border-gray-300'}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{producto.nombre}</h1>
          <p className="text-xl text-blue-600">
            ${(producto.precio * cantidad).toFixed(2)}
            {cantidad > 1 && <span className="ml-2 text-sm text-gray-500">(${producto.precio} c/u)</span>}
          </p>
          <p className="text-gray-700">{producto.descripcion}</p>

          <div className="flex items-center space-x-2">
            <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
            <span>{cantidad}</span>
            <button onClick={() => setCantidad(cantidad + 1)}>+</button>
          </div>

          <button onClick={agregar} className="btn w-full bg-blue-600 text-white">Agregar al carrito</button>
          <div className="flex space-x-2">
            <button onClick={() => setFavorito(!favorito)} className={`btn border ${favorito ? 'border-red-500 text-red-500' : ''}`}><Heart /></button>
            <button className="btn border"><Share2 /></button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-4">
        <div>
          <h2 className="font-bold text-xl mb-2">Deja tu reseña</h2>
          <textarea
            value={nuevaResena}
            onChange={e => setNuevaResena(e.target.value)}
            className="w-full border rounded p-2"
            rows={4}
            placeholder="Escribe tu opinión..."
          />
          <button onClick={enviarResena} disabled={enviando || !nuevaResena.trim()} className="btn mt-2 bg-green-600 text-white">
            {enviando ? <Loader2 className="animate-spin" /> : <><Send className="inline-block mr-1" /> Enviar</>}
          </button>
        </div>

        <div>
          <h2 className="font-bold text-xl mb-2">Reseñas ({resenas.length})</h2>
          {loadingResenas ? <Loader2 className="animate-spin" /> : resenas.length ? (
            <div className="border rounded p-4">
              <p className="font-semibold mb-1">{resenas[currentResenaIndex].usuario || 'Anónimo'}</p>
              <p>{resenas[currentResenaIndex].texto}</p>
            </div>
          ) : <p>No hay reseñas aún.</p>}
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;
