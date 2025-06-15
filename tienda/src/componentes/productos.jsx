import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Agregar esta importación
import { ShoppingBag, Eye, AlertCircle, Loader2 } from "lucide-react";

function Productos() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // ✅ Agregar el hook de navegación

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch("http://localhost:3000/productos");
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                console.error("Error al obtener los productos:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    const handleProductClick = (productId) => {
        console.log(`Navegando a producto: ${productId}`);
        // ✅ Cambiar esto por navegación real
        navigate(`/producto/${productId}`);
    };

    // Estado de carga
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                    <p className="text-gray-600 font-medium">Cargando productos...</p>
                </div>
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-md mx-4">
                    <div className="flex items-center space-x-3 mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                        <h2 className="text-xl font-bold text-gray-800">Error al cargar</h2>
                    </div>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {Array.isArray(productos) && productos.length > 0 ? (
                    <>
                        {/* Contador de productos */}
                        <div className="mb-8">
                            <p className="text-gray-600 text-sm">
                                Mostrando {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
                            </p>
                        </div>

                        {/* Grid de productos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {productos.map((producto) => (
                                <div 
                                    key={producto._id} 
                                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {/* Imagen del producto */}
                                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                                        <img 
                                            src={`http://localhost:3000/uploads/${producto.imagen}`} 
                                            alt={producto.nombre}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTUwSDE1MFYxMjVIMTc1VjE1MFpNMjI1IDE1MEgyMDBWMTI1SDIyNVYxNTBaTTI3NSAxNTBIMjUwVjEyNUgyNzVWMTUwWk0xNzUgMjAwSDE1MFYxNzVIMTc1VjIwMFpNMjI1IDIwMEgyMDBWMTc1SDIyNVYyMDBaTTI3NSAyMDBIMjUwVjE3NUgyNzVWMjAwWk0xNzUgMjUwSDE1MFYyMjVIMTc1VjI1MFpNMjI1IDI1MEgyMDBWMjI1SDIyNVYyNTBaTTI3NSAyNTBIMjUwVjIyNUgyNzVWMjUwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                            }}
                                        />
                                        
                                        {/* Overlay en hover */}
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

                                    {/* Información del producto */}
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                                            {producto.nombre}
                                        </h3>
                                        
                                        {/* Precio si está disponible */}
                                        {producto.precio && (
                                            <p className="text-2xl font-bold text-blue-600 mb-4">
                                                ${producto.precio.toLocaleString()}
                                            </p>
                                        )}

                                        {/* Botón de acción */}
                                        <button
                                            onClick={() => handleProductClick(producto._id)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 group/btn"
                                        >
                                            <Eye className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-200" />
                                            <span>Ver detalles</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    // Estado vacío
                    <div className="text-center py-16">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
                            <div className="bg-gray-100 p-4 rounded-xl inline-block mb-6">
                                <ShoppingBag className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No hay productos disponibles
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Actualmente no tenemos productos para mostrar. Vuelve más tarde.
                            </p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Actualizar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Productos;