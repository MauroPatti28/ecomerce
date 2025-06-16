import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registro() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: ''
    });

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
        try {
            const response = await fetch("https://ecomerce-production-c031.up.railway.app/usuarios/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                alert("Usuario registrado con éxito");
                console.log(data);
                navigate("/login");
            } else {
                alert("Error al registrar el usuario");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al registrar el usuario");
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                    />

                    <input 
                        type="text" 
                        id="apellido" 
                        name="apellido" 
                        placeholder="Apellido" 
                        value={formData.apellido}
                        onChange={handleChange}
                        required 
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
                        placeholder="Contraseña" 
                        value={formData.password}
                        onChange={handleChange}
                        required 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-200 outline-none"
                >
                    Registrarse
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