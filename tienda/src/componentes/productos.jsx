import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Eye, AlertCircle, Loader2, LogIn, ImageOff, RefreshCw } from "lucide-react";

const IMAGE_CACHE_VERSION = "v2";

function Productos({ isAuthenticated, rol }) {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageErrors, setImageErrors] = useState(new Set());
    const [retryCount, setRetryCount] = useState(0);
    const navigate = useNavigate();

    const fetchProductos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            const headers = { "Content-Type": "application/json" };
            if (token) headers.Authorization = `Bearer ${token}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await fetch("https://ecomerce-production-c031.up.railway.app/productos", {
                method: "GET",
                headers,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const data = await response.json();
            setProductos(Array.isArray(data) ? data : []);
            setImageErrors(new Set());
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            setError(error.name === 'AbortError'
                ? "La conexión tardó demasiado tiempo. Verifica tu conexión a internet."
                : error.message || "Error desconocido al cargar los productos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);

    const handleProductClick = useCallback((productId) => {
        if (!productId) return;
        navigate(`/producto/${productId}`);
    }, [navigate]);

    const handleLoginRedirect = useCallback(() => navigate('/login'), [navigate]);

    const handleImageError = useCallback((productId) => {
        setImageErrors(prev => new Set([...prev, productId]));
    }, []);

    const handleImageRetry = useCallback((productId) => {
        setImageErrors(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
        });
    }, []);

    const handleRetryFetch = useCallback(() => {
        setRetryCount(prev => prev + 1);
        fetchProductos();
    }, [fetchProductos]);

    const ProductImage = React.memo(({ producto }) => {
        const hasError = imageErrors.has(producto._id);
        const [imageLoading, setImageLoading] = useState(true);
        const [localRetryCount, setLocalRetryCount] = useState(0);
        const hasValidImage = producto.imagen && producto.imagen.trim() !== '';
        const imageUrl = hasValidImage 
            ? `https://ecomerce-production-c031.up.railway.app/uploads/${producto.imagen}?v=${IMAGE_CACHE_VERSION}&retry=${localRetryCount}`
            : null;

        const handleImageLoadError = () => {
            setImageLoading(false);
            handleImageError(producto._id);
        };

        const handleImageLoad = () => setImageLoading(false);

        const handleLocalRetry = () => {
            handleImageRetry(producto._id);
            setLocalRetryCount(prev => prev + 1);
            setImageLoading(true);
        };

        if (!hasValidImage || hasError) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
                    <ImageOff className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 text-sm text-center mb-3">
                        {!hasValidImage ? 'Sin imagen disponible' : 'Error al cargar imagen'}
                    </p>
                    {hasError && (
                        <button
                            onClick={handleLocalRetry}
                            className="text-blue-600 hover:text-blue-700 text-xs underline flex items-center space-x-1"
                        >
                            <RefreshCw className="w-3 h-3" />
                            <span>Reintentar</span>
                        </button>
                    )}
                </div>
            );
        }

        return (
            <div className="relative w-full h-full">
                {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                )}
                <img 
                    src={imageUrl}
                    alt={producto.nombre || 'Producto'}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={handleImageLoad}
                    onError={handleImageLoadError}
                    loading="lazy"
                />
            </div>
        );
    });

    ProductImage.displayName = 'ProductImage';

    if (loading) return <div>Cargando productos...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {productos.map(producto => (
                <div key={producto._id} className="border rounded-lg overflow-hidden shadow-md">
                    <div className="aspect-w-1 aspect-h-1">
                        <ProductImage producto={producto} />
                    </div>
                    <div className="p-4">
                        <h2 className="font-semibold text-lg mb-1">{producto.nombre}</h2>
                        <p className="text-sm text-gray-600 mb-2">{producto.descripcion}</p>
                        <p className="text-blue-600 font-bold mb-4">${parseFloat(producto.precio || 0).toFixed(2)}</p>
                        <button
                            onClick={() => handleProductClick(producto._id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Ver detalles
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Productos;
