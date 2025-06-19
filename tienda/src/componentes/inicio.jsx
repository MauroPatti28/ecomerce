import React, { useEffect, useState } from 'react';

function Inicio() {
    const [currentIndex, setCurrentIndex] = useState(0); 
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isVisible, setIsVisible] = useState({});
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showAdminAlert, setShowAdminAlert] = useState(true);

    const handleNavigation = (path) => {
        console.log(`Navegando a: ${path}`);
        // Aquí iría la lógica de navegación con React Router
    };

    // Hero slides con contenido dinámico
    const heroSlides = [
        {
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            title: 'GAMING REVOLUTION',
            subtitle: 'Experimenta el futuro del gaming',
            icon: '🎮'
        },
        {
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            title: 'CREATIVE POWER',
            subtitle: 'Herramientas para crear sin límites',
            icon: '🎨'
        },
        {
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            title: 'TECH EXCELLENCE',
            subtitle: 'Tecnología que define el mañana',
            icon: '⚡'
        },
        {
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            title: 'SMART SOLUTIONS',
            subtitle: 'Inteligencia artificial integrada',
            icon: '🤖'
        },
        {
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            title: 'PREMIUM QUALITY',
            subtitle: 'Calidad premium, experiencia única',
            icon: '💎'
        }
    ];

    const extendedSlides = [heroSlides[heroSlides.length - 1], ...heroSlides];

    // Intersection Observer para animaciones
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(prev => ({
                        ...prev,
                        [entry.target.id]: entry.isIntersecting
                    }));
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('[id]').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Mouse tracking para efectos parallax
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX - window.innerWidth / 2) / 50,
                y: (e.clientY - window.innerHeight / 2) / 50
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const handlePrev = () => {
        if (currentIndex === 0) {
            setIsTransitioning(false);
            setCurrentIndex(extendedSlides.length - 2);
            setTimeout(() => setIsTransitioning(true), 0);
        } else {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex === extendedSlides.length - 1) {
            setIsTransitioning(false);
            setCurrentIndex(1); 
            setTimeout(() => setIsTransitioning(true), 0);
        } else {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const productos = [
        {
            id: 1,
            nombre: "Phantom Gaming Rig",
            categoria: "GAMING SETUP",
            precio: "$2,499",
            imagen: "🏆",
            descripcion: "Sistema gaming completo con RGB sincronizado, refrigeración líquida custom y rendimiento 4K garantizado para los títulos más exigentes.",
            specs: ["Intel i9-13900K", "RTX 4090 24GB", "32GB DDR5", "2TB NVMe Gen4"],
            rating: 5,
            popular: true
        },
        {
            id: 2,
            nombre: "Creator Studio Pro",
            categoria: "WORKSTATION",
            precio: "$3,299",
            imagen: "🎬",
            descripcion: "Estación de trabajo profesional optimizada para edición 8K, renderizado 3D y streaming simultáneo sin comprometer la calidad.",
            specs: ["AMD Threadripper", "Quadro RTX 6000", "128GB ECC RAM", "8TB RAID SSD"],
            rating: 5,
            popular: false
        },
        {
            id: 3,
            nombre: "Neural AI Workstation",
            categoria: "AI & MACHINE LEARNING",
            precio: "$4,999",
            imagen: "🧠",
            descripcion: "Supercomputadora diseñada para machine learning, deep learning y procesamiento de big data con aceleración GPU múltiple.",
            specs: ["Dual Xeon Platinum", "4x RTX 4090", "256GB DDR5", "16TB NVMe Array"],
            rating: 5,
            popular: true
        }
    ];

    const features = [
        { icon: "🚀", title: "Rendimiento Extremo", desc: "Hardware de última generación" },
        { icon: "🛡️", title: "Garantía Premium", desc: "Protección completa 3 años" },
        { icon: "⚡", title: "Envío Express", desc: "Entrega en 24-48 horas" },
        { icon: "🔧", title: "Soporte Técnico", desc: "Asistencia 24/7 especializada" }
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            <style jsx>{`
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.5s ease-out;
                }
            `}</style>
            {/* Admin Alert - Toast Style */}
            {showAdminAlert && (
                <div className="fixed top-6 right-6 z-50 max-w-md bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md animate-slide-in-right">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl animate-pulse">
                                🛡️
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-white">Admin Configurado</h3>
                                <button 
                                    onClick={() => setShowAdminAlert(false)}
                                    className="text-gray-400 hover:text-white text-xl p-1 hover:bg-white/10 rounded-full transition-all duration-300"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2 text-gray-300">
                                    <span className="text-blue-400">📧</span>
                                    <span className="font-mono bg-gray-800 px-2 py-1 rounded text-xs">admin@tienda.com</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-300">
                                    <span className="text-green-400">🔑</span>
                                    <span className="font-mono bg-gray-800 px-2 py-1 rounded text-xs">admin123</span>
                                </div>
                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-3">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-yellow-400">⚠️</span>
                                        <span className="text-yellow-200 text-xs font-medium">
                                            Inicia sesión como admin para agregar productos
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Particles Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white opacity-20 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Hero Section con Carousel Avanzado */}
            <section className="relative h-screen overflow-hidden">
                <div
                    className="flex h-full transition-all duration-700 ease-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: isTransitioning ? 'transform 0.7s ease-out' : 'none',
                    }}
                >
                    {extendedSlides.map((slide, index) => (
                        <div
                            key={index}
                            className="w-full h-full flex-shrink-0 relative overflow-hidden"
                            style={{ background: slide.gradient }}
                        >
                            {/* Animated Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50"></div>
                            
                            {/* Geometric Shapes */}
                            <div className="absolute inset-0">
                                <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
                                <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/30 rotate-12 animate-pulse"></div>
                                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                            </div>

                            <div className="relative z-10 h-full flex items-center justify-center">
                                <div 
                                    className="text-center px-8 transform transition-all duration-1000"
                                    style={{
                                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
                                    }}
                                >
                                    <div className="text-8xl mb-8 animate-bounce">{slide.icon}</div>
                                    <h1 className="text-7xl md:text-9xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 leading-tight">
                                        {slide.title}
                                    </h1>
                                    <p className="text-2xl md:text-3xl font-light text-white/90 mb-8">
                                        {slide.subtitle}
                                    </p>
                                    <div className="flex justify-center space-x-4">
                                        <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transform hover:scale-110 transition-all duration-300 shadow-2xl">
                                            EXPLORAR AHORA
                                        </button>
                                        <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transform hover:scale-110 transition-all duration-300">
                                            VER DEMOS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Advanced Navigation */}
                <button 
                    onClick={handlePrev}
                    className="absolute left-8 top-1/2 transform -translate-y-1/2 group"
                >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-all duration-300 group-hover:scale-110">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                </button>
                <button 
                    onClick={handleNext}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 group"
                >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-all duration-300 group-hover:scale-110">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>

                {/* Progress Indicators */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index + 1)}
                            className="group relative"
                        >
                            <div className={`w-12 h-2 rounded-full transition-all duration-500 ${
                                currentIndex === index + 1 ? 'bg-white' : 'bg-white/30'
                            }`}>
                                {currentIndex === index + 1 && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse rounded-full"></div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
                        <div className="w-1 h-3 bg-white/50 rounded-full mx-auto animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gradient-to-b from-black to-gray-900 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <h2 className="text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            ¿POR QUÉ ELEGIRNOS?
                        </h2>
                        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`group p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                                    isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Products Section */}
            <section id="products" className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible.products ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <h2 className="text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600">
                            COLECCIÓN ELITE
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Sistemas diseñados para profesionales que no aceptan compromisos
                        </p>
                    </div>

                    <div className="space-y-24">
                        {productos.map((producto, index) => (
                            <div
                                key={producto.id}
                                className={`group relative ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex gap-12 items-center transform transition-all duration-1000 ${
                                    isVisible.products ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                {producto.popular && (
                                    <div className="absolute -top-4 left-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm animate-pulse z-10">
                                        🔥 MÁS POPULAR
                                    </div>
                                )}

                                {/* Product Showcase */}
                                <div className="flex-1 relative">
                                    <div className="relative w-96 h-96 mx-auto">
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                                        
                                        {/* Main Product Card */}
                                        <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 group-hover:border-blue-500/50 transition-all duration-500 flex items-center justify-center group-hover:scale-105 group-hover:rotate-2">
                                            <div className="text-center">
                                                <div className="text-8xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    {producto.imagen}
                                                </div>
                                                <div className="flex justify-center mb-4">
                                                    {[...Array(producto.rating)].map((_, i) => (
                                                        <div key={i} className="text-yellow-400 text-2xl">⭐</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floating Price Tag */}
                                        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                            {producto.precio}
                                        </div>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <div className="text-sm font-bold text-blue-400 mb-2 tracking-wider">
                                            {producto.categoria}
                                        </div>
                                        <h3 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                            {producto.nombre}
                                        </h3>
                                        <p className="text-xl text-gray-300 leading-relaxed mb-8">
                                            {producto.descripcion}
                                        </p>
                                    </div>
                                    
                                    {/* Specifications */}
                                    <div className="space-y-3">
                                        <h4 className="text-xl font-bold text-white mb-4">Especificaciones:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {producto.specs.map((spec, idx) => (
                                                <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                                                    <span className="text-gray-300 font-medium">{spec}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex space-x-4 pt-6">
                                        <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                            CONFIGURAR AHORA
                                        </button>
                                        <button className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-2xl font-bold hover:border-white hover:text-white transition-all duration-300">
                                            VER SPECS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
                    <h2 className="text-6xl font-black text-white mb-8 leading-tight">
                        ¿LISTO PARA LA
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                            REVOLUCIÓN?
                        </span>
                    </h2>
                    <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                        Únete a la élite tecnológica y experimenta el futuro hoy mismo
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                        <button 
                            onClick={() => handleNavigation('/registro')}
                            className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-6 rounded-2xl font-black text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                            <span className="relative z-10">COMENZAR AHORA</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                        </button>
                        <button 
                            onClick={() => handleNavigation('/productos')}
                            className="border-2 border-white text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-white hover:text-black transform hover:scale-105 transition-all duration-300"
                        >
                            EXPLORAR CATÁLOGO
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex justify-center items-center space-x-8 text-gray-400">
                        <div className="flex items-center space-x-2">
                            <div className="text-2xl">✅</div>
                            <span>Garantía Premium</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="text-2xl">🚀</div>
                            <span>Envío Gratis</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="text-2xl">💎</div>
                            <span>Calidad Certificada</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Inicio;