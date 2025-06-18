import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Inicio from './componentes/inicio.jsx';
import NavBar from './componentes/navbar.jsx';
import Registro from './componentes/registro';
import Login from './componentes/login';
import Footer from './componentes/footer.jsx';
import Productos from './componentes/productos.jsx';
import AdminPanel from './componentes/admin.jsx';
import ProductoDetalle from './componentes/productoDetalle.jsx';
import Carrito from './componentes/carrito.jsx';
import Pago from './componentes/pago.jsx';
import Resultado from './componentes/resultado.jsx';
import OrdenHistorial from './componentes/historial.jsx';

function App() {

    const [carrito, setCarrito] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [rol, setRol] = useState(null);
    const [productos, setProductos] = useState([]);
    const location = useLocation();
    const paginaAdmin = location.pathname === '/admin';
    const paginaLogin = location.pathname === '/login';
    const paginaRegistro = location.pathname === '/registro';
    const paginaCarrito = location.pathname === '/carrito';
    const paginaPago = location.pathname === '/pago';
    const paginaPagoSuccess = location.pathname === '/success';
    const paginaPagoCancel = location.pathname === '/cancel';
    const paginaOrdenes = location.pathname === '/admin/historial';

    const [setShowModal] = useState(false);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const token = localStorage.getItem("token"); 
                const response = await fetch("https://ecomerce-production-c031.up.railway.app/productos", {
                    method: "GET",
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }), 
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Error al obtener los productos");
                }
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };
    
        fetchProductos();
    }, []);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setRol(null);
        setCarrito([]);
        localStorage.removeItem("userId");
        localStorage.removeItem("nombre");
        localStorage.removeItem("rol");
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const ProtectedRoute = ({ children, requiredRole }) => {
        if (requiredRole && rol !== requiredRole) {
            return <Navigate to="/" replace />;
        }

        return children;
    };

    const agregarAlCarrito = (producto) => {
    // Verificar si el usuario está logueado antes de agregar al carrito
    if (!isAuthenticated || rol !== 'cliente') {
        alert('Debes iniciar sesión como cliente para agregar productos al carrito');
        return;
    }

    setCarrito((prevCarrito) => {
        const productoExistente = prevCarrito.find(item => item._id === producto._id);
        
        if (productoExistente) {
            // Sumar la nueva cantidad a la existente
            const nuevaCantidad = productoExistente.cantidad + producto.cantidad;
            return prevCarrito.map(item =>
                item._id === producto._id 
                    ? { 
                        ...item, 
                        cantidad: nuevaCantidad,
                        precioTotal: parseFloat(item.precio) * nuevaCantidad
                    } 
                    : item
            );
        } else {
            // Agregar nuevo producto con su cantidad y precio total
            return [...prevCarrito, { 
                ...producto, 
                precioTotal: parseFloat(producto.precio) * producto.cantidad 
            }];
        }
    });
    
        alert(`Producto ${producto.nombre} agregado al carrito`);
    }

    return (
        <>          
            <NavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} rol={rol} carritoItems={carrito} />
            <Routes>
                <Route path="/" element={<Inicio />} />
                
                <Route path="/registro" element={<Registro handleCloseModal={handleCloseModal} />} />
                
                <Route 
                    path="/login" 
                    element={<Login setIsAuthenticated={setIsAuthenticated} setRol={setRol} />}
                />

                {/* Ahora los productos se pueden ver sin estar logueado */}
                <Route 
                    path="/productos" 
                    element={<Productos isAuthenticated={isAuthenticated} rol={rol} />}
                />
                
                <Route  
                   path='/admin/historial'
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <OrdenHistorial />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path="/carrito"    
                    element={
                        <ProtectedRoute requiredRole="cliente">
                            <Carrito carrito={carrito} setCarrito={setCarrito} />
                        </ProtectedRoute>
                    }
                />

                <Route 
                    path='/pago'
                    element={
                        <ProtectedRoute requiredRole="cliente">
                            <Pago carrito={carrito}/>
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path='/success' element={<Resultado/>}
                />

                <Route
                    path='/cancel'  element={<Resultado/>}
                />

                {/* ProductoDetalle también puede verse sin login, pero agregar al carrito requiere autenticación */}
                <Route
                    path='/producto/:id'
                    element={
                        <ProductoDetalle 
                            productos={productos} 
                            agregarAlCarrito={agregarAlCarrito}
                            isAuthenticated={isAuthenticated}
                            rol={rol}
                        />
                    }
                />

                <Route 
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            {!paginaLogin && !paginaRegistro && !paginaAdmin && !paginaCarrito && !paginaPago && !paginaPagoSuccess&& !paginaPagoCancel && !paginaOrdenes && <Footer />}
        </>
    );
}

export default App;