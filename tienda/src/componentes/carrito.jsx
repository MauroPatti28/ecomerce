import { useNavigate } from "react-router-dom";

function Carrito({ carrito, setCarrito }) {
    const navigate = useNavigate();

    // Función para incrementar cantidad
    const handleIncreaseItem = (id) => {
        const nuevoCarrito = carrito.map(item => {
            if (item._id === id) {
                const nuevaCantidad = item.cantidad + 1;
                return {
                    ...item,
                    cantidad: nuevaCantidad,
                    precioTotal: parseFloat(item.precio) * nuevaCantidad
                };
            }
            return item;
        });
        setCarrito(nuevoCarrito);
    };

    // Función para decrementar cantidad
    const handleDecreaseItem = (id) => {
        const nuevoCarrito = carrito.reduce((acc, item) => {
            if (item._id === id) {
                if (item.cantidad > 1) {
                    const nuevaCantidad = item.cantidad - 1;
                    acc.push({
                        ...item,
                        cantidad: nuevaCantidad,
                        precioTotal: parseFloat(item.precio) * nuevaCantidad
                    });
                }
            } else {
                acc.push(item);
            }
            return acc;
        }, []);
        setCarrito(nuevoCarrito);
    };

    // Función para eliminar completamente un producto
    const handleDeleteItem = (id) => {
        const nuevoCarrito = carrito.filter(item => item._id !== id);
        setCarrito(nuevoCarrito);
    };

    // Calcular el total del carrito
    const total = carrito.reduce((acc, item) => {
        return acc + (item.precioTotal || parseFloat(item.precio) * item.cantidad);
    }, 0);

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                        <h2 className="text-3xl font-bold text-center">🛒 Tu Carrito de Compras</h2>
                        <div className="text-center mt-2 opacity-90">
                            {carrito.length} {carrito.length === 1 ? 'producto' : 'productos'}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {carrito.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-8xl mb-6">🛍️</div>
                                <p className="text-xl text-gray-600 mb-4">Tu carrito está vacío</p>
                                <p className="text-gray-500">¡Agrega algunos productos para comenzar!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {carrito.map((item, index) => (
                                    <div key={index} className="group bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="flex items-center space-x-4">
                                            {/* Image */}
                                            <div className="relative overflow-hidden rounded-lg shadow-md">
                                                <img 
                                                    src={`http://localhost:3000/uploads/${item.imagen}`} 
                                                    alt={item.nombre} 
                                                    className="w-20 h-20 object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                    {item.nombre}
                                                </h3>
                                                
                                                {/* Controles de cantidad */}
                                                <div className="flex items-center space-x-4 mb-2">
                                                    <span className="text-gray-600">Cantidad:</span>
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <button
                                                            onClick={() => handleDecreaseItem(item._id)}
                                                            className="px-3 py-1 hover:bg-gray-100 transition-colors text-sm"
                                                            disabled={item.cantidad <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-3 py-1 border-x border-gray-300 text-sm">{item.cantidad}</span>
                                                        <button
                                                            onClick={() => handleIncreaseItem(item._id)}
                                                            className="px-3 py-1 hover:bg-gray-100 transition-colors text-sm"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    <span className="text-gray-600">
                                                        ${parseFloat(item.precio).toFixed(2)} c/u
                                                    </span>
                                                    <span className="text-lg font-bold text-green-600">
                                                        ${(item.precioTotal || parseFloat(item.precio) * item.cantidad).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <button 
                                                className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl" 
                                                onClick={() => handleDeleteItem(item._id)}
                                                title="Eliminar producto completamente"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer with Total */}
                    {carrito.length > 0 && (
                        <div className="bg-gray-50 border-t-2 border-gray-100 p-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                                <div className="text-center sm:text-left">
                                    <div className="text-2xl font-bold text-gray-800">
                                        Total: <span className="text-green-600">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Impuestos incluidos
                                    </div>
                                </div>
                                
                                <button 
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 min-w-max"
                                    onClick={() => navigate("/pago")}
                                >
                                    <span>💳</span>
                                    <span>Proceder al Pago</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Carrito;