import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Resultado() {
    const [searchParams] = useSearchParams();
    const [recibo, setRecibo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const status = searchParams.get("status");
    const sessionId = searchParams.get("session_id");
    console.log("Status:", status);
    console.log("Session ID:", sessionId);

    useEffect(() => {
        if (status === "success" && sessionId) {
            const obtenerRecibo = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`https://ecomerce-production-c031.up.railway.app/usuarios/recibo/${sessionId}`);
                    console.log("Respuesta del servidor:", response);
                    if (!response.ok) {
                        throw new Error("Error al obtener el recibo");
                    }
                    const data = await response.json();
                    console.log("Datos del recibo:", data);
                    setRecibo(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
            obtenerRecibo();
        }
    }, [status, sessionId]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Procesando...</h2>
                    <p className="text-gray-600">Obteniendo los detalles de tu pedido</p>
                </div>
            </div>
        );
    }
        
    if (status === "cancel") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-l-8 border-red-500 transform hover:scale-105 transition-transform duration-300">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">❌</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pago Cancelado</h1>
                        <p className="text-gray-600 mb-6">Tu pago ha sido cancelado. No te preocupes, puedes intentarlo nuevamente.</p>
                    </div>
                    <button 
                        onClick={() => navigate("/")}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-l-8 border-red-500">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => navigate("/")}
                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    if (recibo) {
        console.log("Recibo obtenido:", recibo);
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-l-8 border-green-500 transform hover:scale-105 transition-transform duration-300">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-5xl">✅</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full"></div>
                    </div>

                    {/* Order Details */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="text-2xl mr-2">📦</span>
                            Detalles del Pedido
                        </h2>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <ul className="space-y-3">
                                {recibo.lineItems.data.map(item => (
                                    <li key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-800">
                                                {item.quantity} x {item.description}
                                            </span>
                                        </div>
                                        <div className="font-bold text-green-600">
                                            ${item.amount_total / 100}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-green-200">
                            <span className="text-lg font-medium text-gray-700 flex items-center">
                                <span className="text-xl mr-2">💰</span>
                                Total
                            </span>
                            <span className="text-2xl font-bold text-green-600">
                                ${recibo.session.amount_total / 100}
                            </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-gray-600">
                                <span className="text-lg mr-2">⌚</span>
                                <div>
                                    <span className="font-medium">Fecha:</span>
                                    <br />
                                    <span>{new Date(recibo.session.created * 1000).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <span className="text-lg mr-2">👤</span>
                                <div>
                                    <span className="font-medium">Cliente:</span>
                                    <br />
                                    <span>{recibo.session.customer_details?.email || "Cliente"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thank you message */}
                    <div className="text-center mb-6">
                        <p className="text-lg text-gray-700">
                            ¡Gracias por tu compra, <span className="font-bold text-green-600">{recibo.session.customer_details?.email || "Cliente"}</span>!
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Recibirás un email de confirmación en breve
                        </p>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={() => navigate("/")}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                        <span className="mr-2">🏠</span>
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤔</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Estado Desconocido</h2>
                <p className="text-gray-600 mb-6">No se pudo determinar el estado del pago</p>
                <button 
                    onClick={() => navigate("/")}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    Volver al Inicio
                </button>
            </div>
        </div>
    );
}

export default Resultado;