// src/components/subcategoria/SidebarFiltros.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mainCategories, MAPA_SUBCATEGORIAS } from '../../utils/constants';

export default function SidebarFiltros({
  infoCategoriaActual,
  subId,
  filtrosDisponibles,
  filtrosSeleccionados,
  manejarFiltro,
  limpiarFiltros
}) {
  const navigate = useNavigate();

  return (
    <aside className="w-full lg:w-1/4 h-fit flex flex-col gap-6">
      
      {/* 1. NAVEGACIÓN ORIGINAL DE CATÁLOGO */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="bg-blue-900 p-4 shrink-0 rounded-t-2xl">
          <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">Catalog Navigation</h3>
        </div>
        
        <nav className="p-3">
          {mainCategories.map((cat) => {
            const estaActiva = (infoCategoriaActual.main || '').toLowerCase() === cat.nombre.toLowerCase();
            const subsDeEsteMenu = MAPA_SUBCATEGORIAS.filter(sub => sub.main.toLowerCase() === cat.nombre.toLowerCase());
            
            return (
              <div key={cat.nombre} className="mb-1">
                <button
                  onClick={() => navigate(`/categorias?tipo=${cat.nombre}`)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                    estaActiva ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`${cat.icon} w-5 text-center ${estaActiva ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-400'}`}></i>
                    <span className={`text-sm font-bold ${estaActiva ? 'text-blue-900' : ''}`}>{cat.nombre}</span>
                  </div>
                  <i className={`fas fa-chevron-right text-[10px] transition-transform duration-300 ${estaActiva ? 'rotate-90 text-blue-600' : 'text-gray-300'}`}></i>
                </button>

                {estaActiva && (
                  <ul className="mt-1 ml-9 space-y-1 border-l-2 border-blue-100 pl-2 py-2 h-auto">
                    <li>
                      <Link
                        to={`/categorias?tipo=${cat.nombre}`}
                        className="w-full block text-left px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
                      >
                        • View All {cat.nombre}
                      </Link>
                    </li>
                    
                    {subsDeEsteMenu.map(sub => {
                      const isSubActivo = sub.url === subId || sub.db === subId;
                      return (
                        <li key={sub.db}>
                          <Link
                            to={`/subcategoria/${sub.url}`}
                            className={`w-full block text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              isSubActivo ? 'text-blue-600 bg-blue-100/50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50/50'
                            }`}
                          >
                            • {sub.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* 2. CARD DE FILTROS AVANZADOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="bg-blue-900 p-4 shrink-0 rounded-t-2xl">
          <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">Advanced Filters</h3>
        </div>
        
        <div className="p-4 flex flex-col gap-6">
          {Object.keys(filtrosDisponibles || {}).length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400">
              <i className="fas fa-filter text-3xl mb-3 text-gray-300"></i>
              <p className="text-xs font-bold text-center text-gray-500">Sin filtros activos</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(filtrosDisponibles || {}).map(([categoriaFiltro, opciones]) => (
                <div key={categoriaFiltro} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider mb-3">
                    {categoriaFiltro}
                  </h4>
                  <div className="space-y-2 h-auto">
                    {opciones.map(opcion => {
                      const isChecked = (filtrosSeleccionados[categoriaFiltro] || []).includes(opcion.nombre);
                      return (
                        <label key={opcion.nombre} className="flex items-center justify-between cursor-pointer group py-0.5">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-900 focus:ring-blue-900 w-3.5 h-3.5"
                              checked={isChecked}
                              onChange={() => manejarFiltro(categoriaFiltro, opcion.nombre)}
                            />
                            <span className={`text-xs transition-colors ${isChecked ? 'text-blue-900 font-bold' : 'text-gray-600 group-hover:text-blue-700'}`}>
                              {opcion.nombre}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded-full">
                            {opcion.cantidad}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {Object.keys(filtrosSeleccionados || {}).length > 0 && (
                <button 
                  onClick={limpiarFiltros}
                  className="w-full mt-2 text-[11px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest text-center border border-red-100 py-2 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Clean Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}