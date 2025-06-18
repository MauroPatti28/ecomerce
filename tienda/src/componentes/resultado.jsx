import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";


function Resultado(){
    const [searchParams] = useSearchParams();
    const [recibo, setRecibo] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const status = searchParams.get("status");
    const sessionId = searchParams.get("session_id");
    console.log("Status:", status);
    console.log("Session ID:", sessionId);

    useEffect(() => {
        if (status === "success" && sessionId) {
            const obtenerRecibo = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/usuarios/recibo/${sessionId}`);
                    console.log("Respuesta del servidor:", response);
                    if (!response.ok) {
                        throw new Error("Error al obtener el recibo");
                    }
                    const data = await response.json();
                    console.log("Datos del recibo:", data);
                    setRecibo(data);
                } catch (error) {
                    setError(error.message);
                }
            };
            obtenerRecibo();
        }}, [status, sessionId]);
        
        if (status === "cancel"){
            return (
                <div style={{backgroundColor:"white", color:"black", borderRadius:"10px",padding:"20px", margin:"20px",
                width:"800px", height: "450px", justifyContent:"center",textAlign:"center", alignItems:"center", display:"flex", flexDirection:"column", border:"10px solid red"}}>
                    <h1>❌ Pago Cancelado</h1>
                    <p>Tu pago ha sido cancelado. Por favor, intenta nuevamente.</p>
                </div>
            );
        }

        if (error) {
            return (
                <div>
                    <h1>Error</h1>
                    <p>{error}</p>
                </div>
            );
        }

        if (recibo){
            console.log("Recibo obtenido:", recibo);
            return (
                <div style={{backgroundColor:"white", color:"black", borderRadius:"10px",padding:"20px", margin:"20px",
                width:"800px", height: "auto ", textAlign:"center", alignItems:"center", display:"flex", flexDirection:"column", border:"10px solid green"}}>
                    
                    {/* <button style={{marginRight:"700px", backgroundColor:"green",border:"2px solid black"}} onClick={()=> navigate("/")}>Volver</button> */}
                    <h1 style={{marginTop:"-10px"}}>✅ Pago Exitoso</h1>
                    
                    <h2>📦 Detalles del Pedido:</h2>
                    <ul style={{paddingLeft:"20px", textAlign:"left",marginBottom:"10px"}}>
                        {recibo.lineItems.data.map(item => (
                            <li key={item.id} style={{marginBottom:"5px"}}>
                                {item.quantity} x {item.description} - ${item.amount_total / 100}
                            </li>
                        ))}
                    </ul>
                    <div style={{marginTop:"8px"}}>
                        <p>💰 Total: $ <strong>{recibo.session.amount_total / 100}</strong></p>
                        <strong><p>⌚ Fecha: {new Date(recibo.session.created * 1000).toLocaleString()}</p></strong>
                        <p>¡Gracias por tu compra, <strong>{recibo.session.customer_details?.email  || "Cliente" }</strong>!</p>
                    </div>
                </div>
            );
        }

        return null;
}

export default Resultado;