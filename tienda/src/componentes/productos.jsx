import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Eye, AlertCircle, Loader2, LogIn, ImageOff, RefreshCw } from "lucide-react";

// Versión de caché para imágenes (actualizar cuando se cambien imágenes existentes)
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
            const headers = {
                "Content-Type": "application/json",
            };
            
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
            
            const response = await fetch("https://ecomerce-production-c031.up.railway.app/productos", {
                method: "GET",
                headers: headers,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Validar que data sea un array válido
            const productosValidos = Array.isArray(data) ? data : [];
            setProductos(productosValidos);
            setImageErrors(new Set()); // Limpiar errores de imagen al cargar nuevos productos
            
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            if (error.name === 'AbortError') {
                setError("La conexión tardó demasiado tiempo. Verifica tu conexión a internet.");
            } else {
                setError(error.message || "Error desconocido al cargar los productos");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);

    const handleProductClick = useCallback((productId) => {
        if (!productId) {
            console.error("ID de producto no válido");
            return;
        }
        navigate(`/producto/${productId}`);
    }, [navigate]);

    const handleLoginRedirect = useCallback(() => {
        navigate('/login');
    }, [navigate]);

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
        
        // Validar que el producto tenga imagen
        const hasValidImage = producto.imagen && producto.imagen.trim() !== '';
        
        // URL con parámetro de versión para evitar caché
        const imageUrl = hasValidImage 
            ? `https://ecomerce-production-c031.up.railway.app/uploads/${producto.imagen}?v=${IMAGE_CACHE_VERSION}&retry=${localRetryCount}`
            : null;

        const handleImageLoadError = useCallback(() => {
            setImageLoading(false);
            handleImageError(producto._id);
        }, [producto._id]);

        const handleImageLoad = useCallback(() => {
            setImageLoading(false);
        }, []);

        const handleLocalRetry = useCallback(() => {
            handleImageRetry(producto._id);
            setLocalRetryCount(prev => prev + 1);
            setImageLoading(true);
        }, [producto._id]);

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
                            className="text-blue-600 hover:text-blue-700 text-xs underline flex items-center space-x-1 transition-colors duration-200"
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
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageLoadError}
                    loading="lazy"
                />
            </div>
        );
    });

    ProductImage.displayName = 'ProductImage';

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                    <p className="text-gray-600 font-medium">Cargando productos...</p>
                    <p className="text-gray-400 text-sm">Esto puede tomar unos segundos</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-md mx-4">
                    <div className="flex items-center space-x-3 mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                        <h2 className="text-xl font-bold text-gray-800">Error al cargar productos</h2>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
                    <div className="space-y-3">
                        <button 
                            onClick={handleRetryFetch}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Reintentar</span>
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            Ir al inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <ShoppingBag className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Nuestros Productos</h1>
                                <p className="text-gray-600 mt-1">
                                    Descubre nuestra colección de productos premium
                                </p>
                            </div>
                        </div>
                        
                        {!isAuthenticated && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-blue-700 text-sm flex items-center">
                                    <LogIn className="w-4 h-4 mr-1" />
                                    Inicia sesión para agregar al carrito
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {Array.isArray(productos) && productos.length > 0 ? (
                    <>
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
                            <p className="text-gray-600 text-sm">
                                Mostrando {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
                            </p>
                            <button
                                onClick={handleRetryFetch}
                                className="mt-2 sm:mt-0 text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1 transition-colors duration-200"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Actualizar productos</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {productos.map((producto) => {
                                // Validación de datos del producto
                                if (!producto || !producto._id) {
                                    return null;
                                }

                                const precio = parseFloat(producto.precio || 0);
                                const nombreProducto = producto.nombre || 'Producto sin nombre';
                                const descripcionProducto = producto.descripcion || '';

                                return (
                                    <div 
                                        key={producto._id} 
                                        className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                                            <ProductImage producto={producto} />
                                            
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                                <button
                                                    onClick={() => handleProductClick(producto._id)}
                                                    className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-6 py-2 rounded-full font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center space-x-2 hover:bg-gray-50"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span>Ver detalles</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                                                {nombreProducto}
                                            </h3>
                                            
                                            {precio > 0 && (
                                                <p className="text-2xl font-bold text-blue-600 mb-4">
                                                    ${precio.toLocaleString('es-AR', { 
                                                        minimumFractionDigits: 2, 
                                                        maximumFractionDigits: 2 
                                                    })}
                                                </p>
                                            )}

                                            {descripcionProducto && (
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {descripcionProducto}
                                                </p>
                                            )}

                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => handleProductClick(producto._id)}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 group/btn"
                                                >
                                                    <Eye className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-200" />
                                                    <span>Ver detalles</span>
                                                </button>
                                                
                                                {!isAuthenticated && (
                                                    <button
                                                        onClick={handleLoginRedirect}
                                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
                                                    >
                                                        <LogIn className="w-4 h-4" />
                                                        <span>Inicia sesión para comprar</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
                            <div className="bg-gray-100 p-4 rounded-xl inline-block mb-6">
                                <ShoppingBag className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No hay productos disponibles
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Actualmente no tenemos productos para mostrar. Vuelve más tarde o intenta actualizar la página.
                            </p>
                            <div className="space-y-3">
                                <button 
                                    onClick={handleRetryFetch}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Actualizar</span>
                                </button>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Ir al inicio
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Productos;