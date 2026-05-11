// src/components/Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store';

// 1. ACTUALIZAMOS LOS NOMBRES DE LAS CATEGORÍAS (Se eliminó brandsList para mantener limpio)
const categoriesList = ['SpO2', 'ECG Cables', 'EKG Cables', 'NIBP', 'IBP Cables', 'Temperature', 'Fetal', 'Oxygen Sensors', 'Batteries'];
const otrosList = ['Promociones', 'Nuevos'];

function Header() {
  const carrito = useCartStore((state) => state.carrito);
  const eliminarDelCarrito = useCartStore((state) => state.eliminarDelCarrito);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        <div className="w-full lg:w-auto mb-4 lg:mb-0">
          <Link to="/" className="h-10 w-48 bg-blue-900 flex items-center justify-center text-white font-bold text-sm tracking-tighter hover:bg-blue-800 transition-colors">
            MEDSENSORS LOGO
          </Link>
        </div>

        <div className="w-full lg:flex-1 lg:mx-12 mb-4 lg:mb-0">
          <div className="relative">
            <input type="text" placeholder="Buscar por número de parte, modelo o marca..." 
                   className="w-full border-2 border-gray-100 rounded-full py-2 px-6 focus:outline-none focus:border-blue-500 shadow-inner" />
            <button className="absolute right-4 top-2.5 text-blue-600">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden xl:flex items-center space-x-2 text-gray-400 border-r pr-6">
            <i className="fab fa-cc-visa text-xl" title="Visa"></i>
            <i className="fab fa-cc-mastercard text-xl" title="Mastercard"></i>
            <i className="fab fa-cc-amex text-xl" title="Amex"></i>
            <i className="fab fa-cc-paypal text-xl" title="PayPal"></i>
            <span className="text-[10px] font-bold border border-gray-300 px-1 rounded">SPEI</span>
          </div>
          
          <div className="flex space-x-4 text-blue-900">
            <a href="#" className="hover:text-blue-500 flex flex-col items-center">
              <i className="far fa-user text-lg"></i>
              <span className="text-[10px] mt-1 font-bold">CUENTA</span>
            </a>
            <button onClick={() => setIsCartOpen(true)} className="hover:text-blue-500 flex flex-col items-center relative cursor-pointer">
              <i className="fas fa-shopping-cart text-lg"></i>
              {carrito.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {carrito.length}
                </span>
              )}
              <span className="text-[10px] mt-1 font-bold">CARRITO</span>
            </button>
          </div>
        </div>
      </div>
      
      <nav className="bg-blue-900 text-white border-t border-blue-800">
        <div className="container mx-auto px-4 flex justify-center space-x-10 text-xs font-bold uppercase tracking-widest relative">
          
          <Link to="/" className="hover:text-blue-300 transition-colors py-3">Inicio</Link>
          
          {/* --- MENÚ CATEGORÍAS --- */}
          <div className="relative group cursor-pointer py-3">
            <span className="hover:text-blue-300 transition-colors flex items-center">
              Categorías <i className="fas fa-chevron-down ml-1 text-[10px]"></i>
            </span>
            <div className="absolute top-full left-0 bg-white shadow-xl py-2 w-56 text-gray-800 border rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              {categoriesList.map(item => (
                <Link 
                  key={item} 
                  to={`/categorias?tipo=${item}`}
                  className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* --- MENÚ OTROS --- */}
          <div className="relative group cursor-pointer py-3">
            <span className="hover:text-blue-300 transition-colors flex items-center">
              Otros <i className="fas fa-chevron-down ml-1 text-[10px]"></i>
            </span>
            <div className="absolute top-full left-0 bg-white shadow-xl py-2 w-48 text-gray-800 border rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              {otrosList.map(item => (
                <Link key={item} to={item === 'Promociones' ? '/promociones' : '/nuevos'} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/nosotros" className="hover:text-blue-300 transition-colors py-3">Nosotros</Link>
        </div>
      </nav>

      {/* --- PANEL LATERAL DEL CARRITO --- */}
      <div className={`fixed inset-0 bg-black/50 transition-opacity z-50 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>
        
        <div className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          
          <div className="p-4 bg-blue-900 text-white flex justify-between items-center">
            <h2 className="font-bold tracking-widest uppercase">Tu Carrito</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-white hover:text-red-400">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {carrito.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">Tu carrito está vacío.</p>
            ) : (
              carrito.map((producto, index) => (
                <div key={index} className="flex border-b pb-2 items-center relative group">
                  
                  <img 
                    src={producto.imagen_url || 'https://via.placeholder.com/50'} 
                    alt={producto.nombre}
                    className="h-12 w-12 object-contain bg-white mr-4 rounded border border-gray-200"
                  />
                  
                  <div className="flex-1 pr-6">
                    <p className="text-xs font-bold uppercase line-clamp-2">{producto.nombre}</p>
                    <p className="text-blue-600 font-black text-sm mt-1">{producto.precio}</p>
                  </div>
                  
                  <button 
                    onClick={() => eliminarDelCarrito(index)}
                    className="absolute right-0 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                    title="Eliminar producto"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          {carrito.length > 0 && (
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex justify-between items-center mb-4 font-black">
                <span>TOTAL:</span>
                <span className="text-blue-900 text-lg">
                  ${carrito.reduce((total, item) => total + parseFloat(item.precio.replace('$', '').replace(',', '').replace(' MXN', '')), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </span>
              </div>
              <button className="w-full bg-green-600 text-white py-3 font-bold uppercase tracking-widest hover:bg-green-500 transition-colors rounded">
                Proceder al Pago
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;