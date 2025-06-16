import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registro() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            console.log('📤 Enviando datos:', formData);
            
            const response = await fetch("http://localhost:3000/usuarios/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log('📡 Status de respuesta:', response.status);
            console.log('📡 Headers de respuesta:', Object.fromEntries(response.headers));

            const data = await response.json();
            console.log('📥 Datos recibidos:', data);

            if (response.ok) {
                alert("Usuario registrado con éxito");
                navigate("/login");
            } else {
                // Mostrar el error específico del servidor
                const errorMessage = data.error || data.message || "Error desconocido";
                alert(`Error: ${errorMessage}`);
                console.error('❌ Error del servidor:', data);
            }
        } catch (error) {
            console.error("❌ Error de red/conexión:", error);
            alert(`Error de conexión: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <form 
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all duration-300 hover:shadow-3xl" 
                onSubmit={handleSubmit}
            >
                <h1 className='text-3xl font-bold text-center text-gray-800 mb-8'>Registro</h1>

                <div className="space-y-4">
                    <input 
                        type="text" 
                        id="nombre" 
                        name="nombre" 
                        placeholder="Nombre" 
                        value={formData.nombre}
                        onChange={handleChange}
                        required 
                        minLength={2}
                        maxLength={50}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                    />

                    <input 
                        type="text" 
                        id="apellido" 
                        name="apellido" 
                        placeholder="Apellido" 
                        value={formData.apellido}
                        onChange={handleChange}
                        maxLength={50}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                    />

                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                    />

                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Contraseña (mín. 6 caracteres)" 
                        value={formData.password}
                        onChange={handleChange}
                        required 
                        minLength={6}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 font-semibold rounded-lg transform transition-all duration-200 shadow-lg focus:ring-4 focus:ring-blue-200 outline-none ${
                        loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 hover:shadow-xl'
                    }`}
                >
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>

                <div className="text-center space-y-3">
                    <p className="text-gray-600">
                        ¿Ya tienes una cuenta? 
                        <button 
                            type="button"
                            onClick={() => navigate("/login")}
                            className="ml-1 text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
                        >
                            Iniciar sesión
                        </button>
                    </p>

                    <p className="text-sm text-gray-500 leading-relaxed">
                        Al registrarte, aceptas nuestros 
                        <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 mx-1">
                            Términos de servicio
                        </a> 
                        y 
                        <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 ml-1">
                            Política de privacidad
                        </a>.
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Registro;