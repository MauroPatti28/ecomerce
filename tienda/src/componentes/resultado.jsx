import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Resultado() {
  const [searchParams] = useSearchParams();
  const [recibo, setRecibo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const status = searchParams.get("status");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (status === "success" && sessionId) {
      const obtenerRecibo = async () => {
        try {
          const response = await fetch(`https://ecomerce-production-c031.up.railway.app/usuarios/recibo/${sessionId}`);
          if (!response.ok) {
            throw new Error("Error al obtener el recibo");
          }
          const data = await response.json();
          setRecibo(data);
        } catch (error) {
          setError(error.message);
        }
      };
      obtenerRecibo();
    }
  }, [status, sessionId]);

  if (status === "cancel") {
    return (
      <div className="bg-white text-black rounded-xl p-8 mx-auto mt-10 max-w-2xl text-center border-4 border-red-500 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">❌ Pago Cancelado</h1>
        <p className="text-lg">Tu pago ha sido cancelado. Por favor, intenta nuevamente.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white text-black rounded-xl p-8 mx-auto mt-10 max-w-2xl text-center border border-red-300 shadow">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (recibo) {
    return (
      <div className="bg-white text-black rounded-xl p-8 mx-auto mt-10 max-w-2xl border-4 border-green-500 shadow-lg">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Pago Exitoso</h1>

        <h2 className="text-xl font-semibold mb-3">📦 Detalles del Pedido:</h2>
        <ul className="mb-6 text-left space-y-2">
          {recibo.lineItems.data.map((item) => (
            <li key={item.id} className="text-gray-800">
              {item.quantity} x {item.description} - ${item.amount_total / 100}
            </li>
          ))}
        </ul>

        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">💰 Total: ${recibo.session.amount_total / 100}</p>
          <p className="text-sm text-gray-600 font-medium">
            ⌚ Fecha: {new Date(recibo.session.created * 1000).toLocaleString()}
          </p>
          <p className="text-md">¡Gracias por tu compra, <strong>{recibo.session.customer_details?.email || "Cliente"}</strong>!</p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return null;
}

export default Resultado;
