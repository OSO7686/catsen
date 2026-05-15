// src/pages/ProductoDetalle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducto } from '../hooks/useProducto';
import { useCartStore } from '../store';

const ProductoDetalle = () => {
  const { id } = useParams();
  const { producto, variantes, loading, error } = useProducto(id); 
  const [cantidad, setCantidad] = useState(1);
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);

  // Reinicia la cantidad a 1 cada vez que cambiamos de producto
  useEffect(() => {
    setCantidad(1);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
      <p className="text-gray-500 font-bold">Cargando detalles...</p>
    </div>
  );

  if (error || !producto) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Producto no encontrado.</h2>
      <p className="text-gray-500">El SKU {id} no existe en nuestro catálogo.</p>
    </div>
  );

  // Unimos el producto actual y las variantes
  const todasLasOpciones = [producto, ...(variantes || [])].filter(
    (v, i, a) => v && a.findIndex(t => t?.mi_sku === v?.mi_sku) === i
  ).sort((a, b) => (a?.tipo || '').localeCompare(b?.tipo || ''));

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 max-w-[1200px]">
        
        {/* BREADCRUMBS */}
        <nav className="text-xs text-gray-300 mb-8 flex gap-2">
           <Link to="/" className="hover:text-blue-600">Home</Link>
           <span>›</span>
           <Link to={`/categorias?tipo=${producto.categoria}`} className="hover:text-blue-600">{producto.categoria}</Link>
           <span>›</span>
           <span className="text-gray-400">{producto.nombre}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* COLUMNA 1: IMÁGENES */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-center mb-4 relative">
              <img 
                src={producto.imagen_url || 'https://via.placeholder.com/500'} 
                alt={producto.nombre}
                className="w-full max-h-[350px] object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex gap-2">
               <div className="w-16 h-16 border border-gray-200 p-1 cursor-pointer hover:border-blue-500 transition-colors">
                 <img src={producto.imagen_url} className="w-full h-full object-contain mix-blend-multiply" alt="thumb" />
               </div>
            </div>
          </div>

          {/* COLUMNA 2: TÍTULO Y VARIANTES */}
          <div className="lg:col-span-4 flex flex-col pt-2">
            <h1 className="text-2xl font-bold text-black leading-tight mb-2">
              {producto.nombre}
            </h1>
            
            <div className="flex text-yellow-400 text-xs mb-4">
              <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
            </div>
            
            <div className="text-xs text-gray-500 mb-6">
              Part Number <span className="font-bold text-black">{producto.mi_sku}</span>
            </div>

            {todasLasOpciones.length > 0 && (
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                {todasLasOpciones.map((v, i) => {
                  const isActive = producto.mi_sku === v.mi_sku;
                  return (
                    <Link
                      key={v.mi_sku}
                      to={`/producto/${v.mi_sku}`} 
                      className={`p-3 border-[3px] flex flex-col ${
                        isActive 
                          ? 'border-yellow-400 bg-white' 
                          : 'border-transparent bg-white hover:border-gray-100'
                      }`}
                    >
                      <span className="text-[11px] text-gray-700 mb-1 leading-tight">
                        {v.tipo || `Option ${i + 1}`}
                      </span>
                      <span className="text-[11px] font-bold text-gray-900">
                        ${Number(v.precio).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* COLUMNA 3: PRECIO Y CHECKOUT */}
          <div className="lg:col-span-3 pt-2">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-bold text-black mt-1">Price:</span>
              <span className="text-2xl font-bold text-yellow-500">
                ${Number(producto.precio).toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </span>
            </div>

            {/* Selector de Cantidad Mejorado */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-black mt-1">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  type="button"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="w-8 h-8 flex justify-center items-center bg-gray-50 hover:bg-gray-200 text-gray-800 font-bold transition-colors cursor-pointer"
                >
                  -
                </button>
                <input
                  type="text"
                  value={cantidad}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, ''); 
                    setCantidad(val === '' ? '' : Number(val));
                  }}
                  onBlur={() => {
                    if (cantidad === '' || cantidad < 1) setCantidad(1);
                  }}
                  className="w-10 h-8 text-center text-xs font-bold outline-none border-x border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setCantidad((cantidad || 0) + 1)}
                  className="w-8 h-8 flex justify-center items-center bg-gray-50 hover:bg-gray-200 text-gray-800 font-bold transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="text-right text-[10px] text-gray-400 mb-6">
              In stock
            </div>

            <button 
              onClick={() => agregarAlCarrito({ ...producto, cantidad })}
              className="w-full bg-[#8ced00] hover:bg-[#7bc800] text-white py-3 font-bold transition-colors mb-8 text-sm shadow-sm"
            >
              Add to Cart
            </button>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <i className="fas fa-piggy-bank text-gray-300 text-xl w-6 text-center"></i>
                <div>
                  <strong className="block text-[11px] text-gray-600 uppercase tracking-wide">Up to 60% Savings</strong>
                  <span className="text-[10px] text-gray-400 leading-tight block mt-1">Quality compatibles save you money</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="fas fa-link text-gray-300 text-xl w-6 text-center"></i>
                <div>
                  <strong className="block text-[11px] text-gray-600 uppercase tracking-wide">100% Guaranteed Compatible</strong>
                  <span className="text-[10px] text-gray-400 leading-tight block mt-1">Works like the OEM or your money back</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="fas fa-truck text-gray-300 text-xl w-6 text-center"></i>
                <div>
                  <strong className="block text-[11px] text-gray-600 uppercase tracking-wide">Expedited Shipping</strong>
                  <span className="text-[10px] text-gray-400 leading-tight block mt-1">Order now, ships when available</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="fas fa-box text-gray-300 text-xl w-6 text-center"></i>
                <div>
                  <strong className="block text-[11px] text-gray-600 uppercase tracking-wide">Easy Returns</strong>
                  <span className="text-[10px] text-gray-400 leading-tight block mt-1">Hassle-free 30 day return policy</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* TABLAS INFERIORES */}
        <div className="border-t border-gray-200 pt-10">
          
          {producto.compatibility && Object.keys(producto.compatibility).length > 0 && (
            <div className="mb-12">
              <h2 className="text-lg font-bold text-black mb-6">Compatibility:</h2>
              <div className="border-b border-gray-300 pb-2 flex text-sm font-bold text-black mb-4">
                <div className="w-1/3">Manufacturer</div>
                <div className="w-2/3">Model</div>
              </div>
              <div className="flex flex-col">
                {Object.entries(producto.compatibility).map(([marca, modelos], i) => (
                  <div key={i} className="flex text-sm py-3 border-b border-gray-100">
                    <div className="w-1/3 font-bold text-gray-700 pr-4">{marca}</div>
                    <div className="w-2/3 text-gray-600 leading-relaxed">{modelos}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {producto.especificaciones && Object.keys(producto.especificaciones).length > 0 && (
            <div className="mb-12">
              <h2 className="text-lg font-bold text-black mb-6">Technical Specifications:</h2>
              <div className="flex flex-col border-t border-gray-200 pt-2">
                {Object.entries(producto.especificaciones).map(([clave, valor], i) => (
                  <div key={i} className="flex text-sm py-3 border-b border-gray-100">
                    <div className="w-1/3 font-bold text-gray-700 pr-4">{clave}</div>
                    <div className="w-2/3 text-gray-600">{valor}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;