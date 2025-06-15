import React, { useState } from 'react';
import facebook from '../imagenes/fb.png';
import instagram from '../imagenes/ig.png';

function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Company Info Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Nuestra Empresa
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Fuga cupiditate non magnam sequi, at quis fugit obcaecati? 
                Inventore tenetur, nostrum fugit nisi quod possimus 
                quo optio qui, dolores, eligendi vitae.
              </p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Productos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Servicios
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="group relative p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <img 
                  src={facebook} 
                  alt="Facebook" 
                  className="w-6 h-6 filter brightness-0 invert group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              
              <a 
                href="#" 
                className="group relative p-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <img 
                  src={instagram} 
                  alt="Instagram" 
                  className="w-6 h-6 filter brightness-0 invert group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <p className="text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                info@empresa.com
              </p>
              <p className="text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                +54 (381) 123-4567
              </p>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-700 mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <p className="text-gray-300">
              &copy; 2025 <span className="font-semibold text-white">Empresa</span>. Todos los derechos reservados.
            </p>
          </div>
          
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              Política de Privacidad
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              Términos de Servicio
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              Cookies
            </a>
          </div>
        </div>

        {/* Decorative bottom line */}
        <div className="mt-8 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
      </div>
    </footer>
  );
}

export default Footer;