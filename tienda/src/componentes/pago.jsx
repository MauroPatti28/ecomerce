import { useEffect, useState } from "react";

function Pago({ carrito }) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!carrito || carrito.length === 0) {
      setError("El carrito está vacío, no se puede procesar el pago");
      setLoading(false);
      return;
    }

    const carritoParaPago = carrito.map(item => ({
      nombre: item.nombre || item.title || "Producto sin nombre",
      precio: item.precio,
      cantidad: item.cantidad,
      productoId: item._id || item.id // <-- ¡este campo es clave!
    }));

    console.log("Items para pago:", carritoParaPago);

    const crearSesionPago = async () => {
      try {
        const response = await fetch("https://ecomerce-production-c031.up.railway.app/usuarios/pago", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ items: carritoParaPago })
        });

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url; 
        } else {
          setError("No se pudo iniciar el proceso de pago");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al crear sesión de Stripe:", error);
        setError("Hubo un error al intentar procesar el pago");
        setLoading(false);
      }
    };

    crearSesionPago();
  }, [carrito, token]);

  const total = carrito ? carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0) : 0;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-l-4 border-red-500">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error en el Pago</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">{error}</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Volver al Carrito
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">💳</div>
              <h2 className="text-3xl font-bold mb-2">Procesando Pago</h2>
              <p className="text-blue-100 opacity-90">Conectando con Stripe...</p>
            </div>
            {/* Animated background elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white bg-opacity-5 rounded-full animate-pulse delay-1000"></div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Order Summary */}
            {carrito && carrito.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  Resumen de tu orden
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  {carrito.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        {item.nombre} {item.cantidad > 1 && `(×${item.cantidad})`}
                      </span>
                      <span className="font-semibold text-gray-800">
                        ${(item.precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Animation */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-lg font-semibold text-gray-800">
                  Redirigiendo a Stripe...
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Por favor, no cierres esta ventana.<br/>
                  Serás redirigido automáticamente al proceso de pago seguro.
                </p>
              </div>

              {/* Progress Steps */}
              <div className="mt-8 flex justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">Validando</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-500"></div>
                  <span className="text-xs text-gray-600">Conectando</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-1000"></div>
                  <span className="text-xs text-gray-600">Redirigiendo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border-t border-green-100 p-6">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <span className="text-lg">🔒</span>
              <span className="text-sm font-medium">Pago 100% seguro con Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pago;