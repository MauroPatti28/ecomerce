import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdenHistorial = () => {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/ordenes") 
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.ordenes || [];
        setOrdenes(data);
      })
      .catch(err => console.error("Error al traer las órdenes:", err));
  }, []);

  return (
    <div>
      <h2>Historial de Órdenes</h2>
      {ordenes.length === 0 ? (
        <p>No hay órdenes registradas.</p>
      ) : (
        <ul>
          {ordenes.map((orden) => (
            <li key={orden._id}>
              <p><strong>Usuario:</strong> {orden.user?.nombre || "Sin nombre"}</p>
              <p><strong>Fecha:</strong> {new Date(orden.createdAt).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${orden.total}</p>
              <ul>
                {orden.items?.map((item, index) => (
                  <li key={index}>
                    {item.producto?.nombre || "Producto desconocido"} x {item.cantidad}
                  </li>
                ))}
              </ul>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdenHistorial;
