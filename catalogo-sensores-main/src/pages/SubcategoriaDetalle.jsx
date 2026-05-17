import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore'; 
import { mainCategories, MAPA_SUBCATEGORIAS } from '../utils/constants';
import { useSubcategoria } from '../hooks/useSubcategoria';

const ITEMS_POR_PAGINA = 30;

export default function SubcategoriaDetalle() {
  const { subId } = useParams();
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  
  const infoCategoriaActual = MAPA_SUBCATEGORIAS.find(
    item => item.url === subId || item.db === subId
  ) || { db: subId, title: subId.replace(/-/g, ' ') };

  const { 
    productosFiltrados, 
    filtrosDisponibles, 
    filtrosSeleccionados, 
    manejarFiltro, 
    limpiarFiltros, 
    cargando 
  } = useSubcategoria(infoCategoriaActual.db);

  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    setPaginaActual(1);
  }, [subId, filtrosSeleccionados]);

  const totalProductos = productosFiltrados.length;
  const totalPaginas = Math.ceil(totalProductos / ITEMS_POR_PAGINA);
  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA, 
    paginaActual * ITEMS_POR_PAGINA
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-white py-20 flex flex-col justify-center items-center gap-4">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
        <p className="text-xl text-gray-500 font-bold animate-pulse">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-12">
        
        {/* BARRA LATERAL (ASIDE) - Estilo Lienzo / Minimalista */}
        <aside className="w-full lg:w-1/4 h-fit sticky top-24 flex flex-col gap-8 pr-4">
          
          {/* 1. NAVEGACIÓN DE CATEGORÍAS (Sin cajas ni scroll interno) */}
          <div>
            <ul className="space-y-4">
              {mainCategories.map((cat, idx) => {
                const mainName = cat.nombre;
                // Verificamos si esta es la categoría principal activa
                const estaExpandido = infoCategoriaActual.main && infoCategoriaActual.main.toLowerCase() === mainName.toLowerCase();
                
                return (
                  <li key={idx}>
                    {/* Nombre de la categoría principal */}
                    <Link
                      to={`/categorias?tipo=${mainName}`}
                      className={`block text-[15px] transition-colors ${
                        estaExpandido ? 'text-gray-900 font-bold' : 'text-gray-700 hover:text-black'
                      }`}
                    >
                      {mainName}
                    </Link>

                    {/* Subcategorías: Se muestran y empujan el contenido hacia abajo (sin scroll) */}
                    {estaExpandido && (
                      <ul className="mt-3 ml-2 space-y-2.5">
                        {MAPA_SUBCATEGORIAS.filter(s => s.main.toLowerCase() === mainName.toLowerCase()).map((subcat, subIdx) => {
                          const isSubActivo = subcat.url === subId || subcat.db === subId;
                          
                          return (
                            <li key={subIdx} className="flex items-start gap-3">
                              {/* Círculo estilo competencia */}
                              {isSubActivo ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-black flex-shrink-0 mt-1"></div>
                              ) : (
                                <div className="w-2.5 h-2.5 border border-gray-400 rounded-sm flex-shrink-0 opacity-50 mt-1"></div>
                              )}
                              
                              <Link
                                to={`/subcategoria/${subcat.url}`}
                                className={`text-[13px] leading-tight transition-colors ${
                                  isSubActivo 
                                    ? 'text-gray-900 font-medium' 
                                    : 'text-gray-500 hover:text-black'
                                }`}
                              >
                                {subcat.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 2. ESPACIO DE FILTROS AVANZADOS (Estilo texto plano de la competencia) */}
          <div className="pt-4">
            <h2 className="text-[13px] font-bold text-gray-900 mb-6 flex items-center gap-2">
              {infoCategoriaActual.main} Advanced Filters <i className="fas fa-chevron-down text-[10px] text-gray-400"></i>
            </h2>
            
            {/* Si aún no hay especificaciones cargadas en JSON en la base de datos, mostramos el espacio reservado */}
            {Object.keys(filtrosDisponibles || {}).length === 0 ? (
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center mt-2">
                 <i className="fas fa-filter text-2xl text-gray-300 mb-2 block"></i>
                 <p className="text-[11px] text-gray-400">
                    Aquí irán los datos reales (JSON) mapeados con este diseño limpio.
                 </p>
              </div>
            ) : (
              /* Si ya existen datos JSON, ¡se mapearán mágicamente con el diseño de la competencia! */
              <div className="space-y-6">
                {Object.entries(filtrosDisponibles).map(([categoriaFiltro, opciones]) => (
                  <div key={categoriaFiltro}>
                    <h3 className="text-[13px] text-gray-800 mb-3">{categoriaFiltro}</h3>
                    <div className="ml-1 space-y-2.5">
                      {opciones.map(opcion => {
                        const isChecked = (filtrosSeleccionados[categoriaFiltro] || []).includes(opcion.nombre);
                        return (
                          <label key={opcion.nombre} className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isChecked}
                              onChange={() => manejarFiltro(categoriaFiltro, opcion.nombre)}
                            />
                            {isChecked ? (
                              <div className="w-2.5 h-2.5 bg-black rounded-sm flex-shrink-0 flex items-center justify-center mt-1">
                                 <i className="fas fa-check text-white" style={{ fontSize: '6px' }}></i>
                              </div>
                            ) : (
                              <div className="w-2.5 h-2.5 border border-gray-400 rounded-sm flex-shrink-0 group-hover:border-black mt-1"></div>
                            )}
                            <span className={`text-[12px] leading-tight transition-colors ${isChecked ? 'text-black font-bold' : 'text-gray-500 group-hover:text-black'}`}>
                              {opcion.nombre}
                            </span>
                            <span className="text-[10px] text-gray-300 ml-auto">{opcion.cantidad}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {Object.keys(filtrosSeleccionados).length > 0 && (
                  <button 
                    onClick={limpiarFiltros}
                    className="mt-6 text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest block w-fit"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

        </aside>

        {/* CONTENIDO PRINCIPAL DE PRODUCTOS */}
        <main className="w-full lg:w-3/4">
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2 capitalize text-gray-900 tracking-tight">
              {infoCategoriaActual.title}
            </h1>
            <p className="text-gray-500 text-sm">
              Showing {totalProductos} products
            </p>
          </div>

          {totalProductos === 0 ? (
            <div className="py-20 text-center bg-white border border-gray-100 rounded-xl shadow-sm">
              <i className="fas fa-box-open text-4xl text-gray-200 mb-4 block"></i>
              <h2 className="text-xl font-bold text-gray-600">No products available in this category.</h2>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosPagina.map((producto) => (
                  <div key={producto.mi_sku} className="group border border-gray-100 hover:border-blue-200 rounded-xl overflow-hidden transition-all flex flex-col p-4 bg-white">
                    <Link to={`/producto/${producto.mi_sku}`}>
                      <img 
                        src={producto.imagen_url || 'https://via.placeholder.com/300'} 
                        alt={producto.nombre} 
                        className="w-full h-40 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 mb-4" 
                      />
                    </Link>
                    <div className="flex-grow flex flex-col">
                      <Link to={`/producto/${producto.mi_sku}`}>
                        <h3 className="font-bold text-[13px] leading-snug mb-1 text-gray-800 group-hover:text-blue-600 transition-colors">
                          {producto.nombre}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-gray-400 mb-3 font-medium">SKU: {producto.mi_sku}</p>
                      <p className="text-lg font-black text-orange-500 mt-auto">
                        ${producto.precio ? Number(producto.precio).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
                      </p> 
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINACIÓN */}
              {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16">
                  <button 
                    onClick={() => cambiarPagina(paginaActual - 1)} 
                    disabled={paginaActual === 1} 
                    className="text-sm font-bold text-gray-500 hover:text-blue-600 disabled:opacity-30 transition-colors"
                  >
                    <i className="fas fa-chevron-left mr-2"></i> Previous
                  </button>
                  <span className="text-xs font-bold text-gray-400 px-4 py-2 bg-gray-50 rounded-full">
                    {paginaActual} of {totalPaginas}
                  </span>
                  <button 
                    onClick={() => cambiarPagina(paginaActual + 1)} 
                    disabled={paginaActual === totalPaginas} 
                    className="text-sm font-bold text-gray-500 hover:text-blue-600 disabled:opacity-30 transition-colors"
                  >
                    Next <i className="fas fa-chevron-right ml-2"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}