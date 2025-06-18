import React, { useState, useEffect } from 'react';
import { 
    Star, 
    ShoppingCart, 
    ChevronLeft, 
    ChevronRight, 
    Send,
    Heart,
    Share2,
    Loader2,
    AlertCircle,
    ArrowLeft,
    MessageCircle,
    User
} from 'lucide-react';
import { useParams } from 'react-router-dom'; // Importamos useParams

function ProductoDetalle({ productos = [], agregarAlCarrito }) {
    // Obtenemos el id real de la URL
    const { id } = useParams();
    
    const [resenas, setResenas] = useState([]);
    const [nuevaResena, setNuevaResena] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [enviandoResena, setEnviandoResena] = useState(false);
    const [cantidad, setCantidad] = useState(1);
    const [isFavorito, setIsFavorito] = useState(false);

    // FIX: Resetear currentIndex cuando cambien las reseñas
    useEffect(() => {
        if (resenas.length > 0 && currentIndex >= resenas.length) {
            setCurrentIndex(0);
        }
    }, [resenas, currentIndex]);

    useEffect(() => {
        const fetchResenas = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const response = await fetch(`https://ecomerce-production-c031.up.railway.app/productos/${id}/resenas`);
                if (!response.ok) {
                    throw new Error("Error al obtener las reseñas");
                }
                const data = await response.json();
                setResenas(Array.isArray(data.resenas) ? data.resenas : []);
                setError(null);
            } catch (error) {
                console.error("Error al obtener las reseñas:", error);
                setResenas([]);
                setError("Error al cargar las reseñas");
            } finally {
                setLoading(false);
            }
        };

        fetchResenas();
    }, [id]);

    useEffect(() => {
        if (resenas.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => 
                    prevIndex === resenas.length - 1 ? 0 : prevIndex + 1
                );
            }, 4000);

            return () => clearInterval(interval);
        }
    }, [resenas]);

    // Buscar el producto por el ID de la URL
    const producto = productos.find((producto) => producto._id === id);

    const enviarResena = async () => {
        if (nuevaResena.trim() === "") {
            alert("Por favor, escribe una reseña antes de enviar.");
            return;
        }

        if (!id) {
            alert("Error: No se puede enviar la reseña sin un producto válido.");
            return;
        }

        setEnviandoResena(true);
        try {
            const response = await fetch(`https://ecomerce-production-c031.up.railway.app/productos/${id}/resenas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productoId: id, texto: nuevaResena }),
            });
            
            if (!response.ok) {
                throw new Error("Error al enviar la reseña");
            }
            
            const nuevaResenaData = await response.json();
            setResenas(prevResenas => [...prevResenas, nuevaResenaData]);
            setNuevaResena("");
            alert("Reseña enviada correctamente");
        } catch (error) {
            console.error("Error al enviar la reseña:", error);
            alert("Error al enviar la reseña. Por favor, inténtalo de nuevo.");
        } finally {
            setEnviandoResena(false);
        }
    };

    const handleAgregarCarrito = () => {
        if (agregarAlCarrito && producto) {
            agregarAlCarrito({ 
                ...producto, 
                precio: parseFloat(producto.precio),
                cantidad,
                precioTotal: parseFloat(producto.precio) * cantidad
            });
        }
    };

    const nextImage = () => {
        if (producto?.imagenes && producto.imagenes.length > 1) {
            setCurrentImageIndex((prev) => 
                prev === producto.imagenes.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (producto?.imagenes && producto.imagenes.length > 1) {
            setCurrentImageIndex((prev) => 
                prev === 0 ? producto.imagenes.length - 1 : prev - 1
            );
        }
    };

    const goBack = () => {
        window.history.back();
    };

    const imagenPlaceholder = "data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='400' fill='%23F3F4F6'/%3E%3Ctext x='200' y='200' text-anchor='middle' fill='%239CA3AF' font-family='Arial' font-size='16'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

    if (!productos || productos.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                    <p className="text-gray-600 font-medium">Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-md mx-4">
                    <div className="flex items-center space-x-3 mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                        <h2 className="text-xl font-bold text-gray-800">Producto no encontrado</h2>
                    </div>
                    <p className="text-gray-600 mb-6">El producto solicitado no existe o ha sido eliminado.</p>
                    <button 
                        onClick={goBack}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Volver</span>
                    </button>
                </div>
            </div>
        );
    }

    const prepararImagenes = () => {
        if (producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
            return producto.imagenes.filter(img => img && img.trim() !== '');
        } else if (producto.imagen && producto.imagen.trim() !== '') {
            return [producto.imagen];
        }
        return ['placeholder'];
    };

    const imagenes = prepararImagenes();
    const imagenActual = imagenes[currentImageIndex];

    useEffect(() => {
        if (currentImageIndex >= imagenes.length) {
            setCurrentImageIndex(0);
        }
    }, [imagenes, currentImageIndex]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <button onClick={goBack} className="hover:text-blue-600 transition-colors">
                            <ArrowLeft className="w-4 h-4 inline mr-1" />
                            Volver
                        </button>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 font-medium">{producto.nombre}</span>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                                <img 
                                    src={imagenActual === 'placeholder' ? imagenPlaceholder : `https://ecomerce-production-c031.up.railway.app/uploads/${imagenActual}`}
                                    alt={producto.nombre}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = imagenPlaceholder;
                                    }}
                                />
                                
                                {imagenes.length > 1 && imagenes[0] !== 'placeholder' && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>

                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                            {imagenes.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`w-2 h-2 rounded-full transition-colors ${
                                                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {imagenes.length > 1 && imagenes[0] !== 'placeholder' && (
                                <div className="flex space-x-4 overflow-x-auto pb-2">
                                    {imagenes.map((imagen, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                                index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                                            }`}
                                        >
                                            <img 
                                                src={`https://ecomerce-production-c031.up.railway.app/uploads/${imagen}`}
                                                alt={`Vista ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = imagenPlaceholder;
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{producto.nombre}</h1>
                                
                                <p className="text-4xl font-bold text-blue-600 mb-4">
                                    ${producto.precio ? (producto.precio * cantidad).toLocaleString('es-ES', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }) : 'Precio no disponible'}
                                    {cantidad > 1 && (
                                        <span className="text-sm text-gray-500 ml-2">
                                            (${producto.precio.toLocaleString('es-ES', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })} c/u)
                                        </span>
                                    )}
                                </p>

                                <p className="text-gray-700 leading-relaxed mb-6">
                                    {producto.descripcion || 'Descripción no disponible'}
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700">Cantidad:</span>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-2 border-x border-gray-300">{cantidad}</span>
                                    <button
                                        onClick={() => setCantidad(cantidad + 1)}
                                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleAgregarCarrito}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-3"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Agregar al Carrito</span>
                                </button>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setIsFavorito(!isFavorito)}
                                        className={`flex-1 border-2 border-gray-300 hover:border-red-400 py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 ${
                                            isFavorito ? 'border-red-400 text-red-500' : 'text-gray-700'
                                        }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isFavorito ? 'fill-current' : ''}`} />
                                        <span>Favoritos</span>
                                    </button>
                                    
                                    <button className="flex-1 border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2">
                                        <Share2 className="w-5 h-5" />
                                        <span>Compartir</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <MessageCircle className="w-6 h-6 text-blue-600" />
                            <h3 className="text-2xl font-bold text-gray-900">Deja tu Reseña</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <textarea
                                placeholder="Comparte tu experiencia con este producto..."
                                value={nuevaResena}
                                onChange={(e) => setNuevaResena(e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                            
                            <button
                                onClick={enviarResena}
                                disabled={enviandoResena || nuevaResena.trim() === ""}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                                {enviandoResena ? (
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

                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Reseñas de Clientes</h3>
                            <span className="text-gray-500">({resenas.length})</span>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : resenas.length > 0 ? (
                            <div className="relative">
                                <div className="bg-gray-50 rounded-xl p-6 min-h-[200px] flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-4">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <span className="font-semibold text-gray-800">
                                                {resenas[currentIndex]?.usuario || "Usuario Anónimo"}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            {resenas[currentIndex]?.texto || "No hay reseña disponible"}
                                        </p>
                                    </div>
                                </div>

                                {resenas.length > 1 && (
                                    <div className="flex items-center justify-between mt-4">
                                        <button
                                            onClick={() => setCurrentIndex(currentIndex === 0 ? resenas.length - 1 : currentIndex - 1)}
                                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        
                                        <div className="flex space-x-2">
                                            {resenas.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentIndex(index)}
                                                    className={`w-2 h-2 rounded-full transition-colors ${
                                                        index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        
                                        <button
                                            onClick={() => setCurrentIndex(currentIndex === resenas.length - 1 ? 0 : currentIndex + 1)}
                                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No hay reseñas aún.</p>
                                <p className="text-gray-400 text-sm">¡Sé el primero en compartir tu opinión!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductoDetalle;