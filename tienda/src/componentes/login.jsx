import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setIsAuthenticated, setRol, handleOpenModal }) {
  const [formData, setFormData] = useState({
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
      const response = await fetch("http://localhost:3000/usuarios/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        alert("Inicio de sesión exitoso");

        setIsAuthenticated(true);
        setRol(data.user.rol);

        // Guardar token y datos de usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("nombre", data.user.nombre);
        localStorage.setItem("rol", data.user.rol);

        if (data.user.rol === "admin") {
          navigate("/admin");
        } else if (data.user.rol === "cliente") {
          navigate("/productos");
        }
      } else {
        alert("Error al iniciar sesión, alguna de las credenciales es incorrecta");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all duration-300 hover:shadow-3xl">
        <div className="text-center">
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Iniciar Sesión</h1>
          <p className="text-gray-600">Bienvenido de vuelta</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400 peer"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 peer-focus:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400 peer"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 peer-focus:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-indigo-200 outline-none"
          >
            Iniciar Sesión
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              ¿No tienes una cuenta? 
              <Link 
                to="/registro" 
                className="ml-1 text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors duration-200"
                onClick={() => handleOpenModal && handleOpenModal("registro")}
              >
                Registrarse
              </Link>
            </p>
          </div>

          <div className="text-center">
            <a 
              href="#" 
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;