// src/components/common/CardProducto.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatearPrecio } from '../../utils/helpers';

export default function CardProducto({ producto, agregarAlCarrito }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-3xl p-5 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 flex flex-col relative overflow-hidden">
      <Link to={`/producto/${producto.mi_sku}`} className="flex flex-col flex-1">
        <div className="h-52 w-full bg-gray-50 rounded-2xl mb-5 flex items-center justify-center p-6 overflow-hidden">
          <img 
            src={producto.imagen_url || 'https://via.placeholder.com/300'} 
            alt={producto.nombre} 
            className="max-h-full max-w-full object-contain mix-blend-multiply transform group-hover:scale-110 transition-transform duration-700" 
          />
        </div>
        <h3 className="font-bold text-base text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {producto.nombre}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase tracking-tighter">
            SKU: {producto.mi_sku}
          </span>
        </div>
      </Link>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <span className="text-2xl font-black text-blue-900">
          {formatearPrecio(producto.precio)}
        </span>
        <button 
          onClick={() => agregarAlCarrito(producto)}
          className="bg-blue-900 text-white p-3 rounded-xl hover:bg-orange-600 transition-all shadow-lg"
        >
          <i className="fas fa-cart-plus"></i>
        </button>
      </div>
    </div>
  );
}