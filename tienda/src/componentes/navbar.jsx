import React, { useState } from 'react';
import carrito from '../imagenes/carrito1.png';
import Registro from './registro';
import Login from './login';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../imagenes/logo.png';

function NavBar({isAuthenticated, handleLogout, rol, carritoItems}) {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpenModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent(null);
    };

    const handleLogoutAndRedirect = () => {
        handleLogout();
        navigate("/login");
    };

    const handleCarritoClick = () => {
        if (!isAuthenticated || rol !== 'cliente') {
            alert('Debes iniciar sesión como cliente para acceder al carrito');
            navigate('/login');
            return;
        }
        navigate("/carrito");
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <nav className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 shadow-2xl border-b border-blue-800/30">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-blue-600/10"></div>
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        
                        {/* Logo Section */}
                        <div className="flex items-center group">
                            <Link to="/" className="flex items-center space-x-3">
                                <div className="relative">
                                    <img 
                                        src={Logo} 
                                        alt="Logo" 
                                        className="h-12 w-auto transform group-hover:scale-105 transition-transform duration-300 filter drop-shadow-lg"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <span className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Mi Empresa
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            <Link 
                                to="/" 
                                className="group relative px-4 py-2 text-white font-medium transition-all duration-300 hover:text-blue-300"
                            >
                                <span className="relative z-10">Inicio</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                            </Link>

                            {/* Productos - Ahora accesible para todos */}
                            <Link 
                                to="/productos" 
                                className="group relative px-4 py-2 text-white font-medium transition-all duration-300 hover:text-blue-300"
                            >
                                <span className="relative z-10">Productos</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                                {!isAuthenticated && (
                                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                                        Libre
                                    </span>
                                )}
                            </Link>

                            <Link 
                                to="/registro" 
                                className="group relative px-4 py-2 text-white font-medium transition-all duration-300 hover:text-blue-300"
                            >
                                <span className="relative z-10">Registrarse</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                            </Link>

                            {/* Admin Panel - Solo para admins */}
                            {isAuthenticated && rol === 'admin' && (
                                <Link 
                                    to="/admin" 
                                    className="group relative px-4 py-2 text-yellow-300 font-medium transition-all duration-300 hover:text-yellow-200"
                                >
                                    <span className="relative z-10">Admin</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/0 via-yellow-600/20 to-yellow-600/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                                </Link>
                            )}

                            {!isAuthenticated ? (
                                <Link 
                                    to="/login"
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Iniciar Sesión
                                </Link>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span className="text-green-400 text-sm font-medium">
                                        👋 Hola, {localStorage.getItem('nombre') || 'Usuario'}
                                    </span>
                                    <button
                                        onClick={handleLogoutAndRedirect}
                                        className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full font-medium hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Cart and Mobile Menu Button */}
                        <div className="flex items-center space-x-4">
                            {/* Shopping Cart */}
                            <button 
                                onClick={handleCarritoClick}
                                className="relative group p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50"
                                title={isAuthenticated && rol === 'cliente' ? 'Ver carrito' : 'Inicia sesión para acceder al carrito'}
                            >
                                <img 
                                    src={carrito} 
                                    alt="Carrito" 
                                    className="w-6 h-6 filter brightness-0 invert group-hover:scale-110 transition-transform duration-300"
                                />
                                {carritoItems && carritoItems.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse shadow-lg">
                                        {carritoItems.length}
                                    </span>
                                )}
                                {!isAuthenticated && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 rounded-xl transition-all duration-300"></div>
                            </button>

                            {/* Mobile menu button */}
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 rounded-lg text-white hover:bg-blue-800/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-gray-900/95 backdrop-blur-sm`}>
                    <div className="px-4 pt-2 pb-4 space-y-2 border-t border-blue-800/30">
                        <Link 
                            to="/" 
                            className="block px-4 py-3 text-white font-medium hover:bg-blue-800/30 rounded-lg transition-colors duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            🏠 Inicio
                        </Link>

                        {/* Productos - Accesible para todos en móvil también */}
                        <Link 
                            to="/productos" 
                            className="block px-4 py-3 text-white font-medium hover:bg-blue-800/30 rounded-lg transition-colors duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            📦 Productos {!isAuthenticated && <span className="text-orange-400 text-sm">(Ver disponible)</span>}
                        </Link>

                        <Link 
                            to="/registro" 
                            className="block px-4 py-3 text-white font-medium hover:bg-blue-800/30 rounded-lg transition-colors duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            📝 Registrarse
                        </Link>

                        {/* Admin Panel para móvil */}
                        {isAuthenticated && rol === 'admin' && (
                            <Link 
                                to="/admin" 
                                className="block px-4 py-3 text-yellow-300 font-medium hover:bg-yellow-800/30 rounded-lg transition-colors duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                ⚙️ Panel Admin
                            </Link>
                        )}

                        {!isAuthenticated ? (
                            <Link 
                                to="/login"
                                className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                🚀 Iniciar Sesión
                            </Link>
                        ) : (
                            <div className="space-y-2">
                                <div className="px-4 py-2 text-green-400 text-sm font-medium">
                                    👋 Hola, {localStorage.getItem('nombre') || 'Usuario'}
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogoutAndRedirect();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="block w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 text-center"
                                >
                                    🚪 Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-slideIn">
                        <div className="relative p-6">
                            <button 
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                                onClick={handleCloseModal}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                            {modalContent === "registro" && <Registro handleOpenModal={handleOpenModal}/>}
                            {modalContent === "login" && <Login handleOpenModal={handleOpenModal}/>}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { 
                        opacity: 0; 
                        transform: scale(0.9) translateY(-20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: scale(1) translateY(0); 
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
}

export default NavBar;