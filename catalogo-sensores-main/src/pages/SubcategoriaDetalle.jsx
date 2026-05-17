import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore'; 
import { mainCategories, MAPA_SUBCATEGORIAS } from '../utils/constants';
import { useSubcategoria } from '../hooks/useSubcategoria';

const ITEMS_POR_PAGINA = 30;

// 🛡️ FUNCIÓN ESCUDO: Convierte el precio a dólares
const formatearPrecio = (precio) => {
  if (precio === null || precio === undefined || precio === '') return '$0.00';
  const textoLimpio = String(precio).replace(/[^0-9.]/g, '');
  const numero = Number(textoLimpio);
  if (isNaN(numero)) return String(precio).includes('$') ? String(precio) : `$${precio}`;
  return '$' + numero.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function SubcategoriaDetalle() {
  const { subId } = useParams();
  const navigate = useNavigate();
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  
  const infoCategoriaActual = MAPA_SUBCATEGORIAS.find(
    item => item.url === subId || item.db === subId
  ) || { db: subId, title: subId.replace(/-/g, ' '), main: 'SpO2' };

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

  const totalProductos = (productosFiltrados || []).length;
  const totalPaginas = Math.max(1, Math.ceil(totalProductos / ITEMS_POR_PAGINA));
  const productosPagina = (productosFiltrados || []).slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA, 
    paginaActual * ITEMS_POR_PAGINA
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const obtenerPaginas = () => {
    const paginas = [];
    if (totalPaginas <= 5) return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    if (paginaActual <= 3) {
      for (let i = 1; i <= 4; i++) paginas.push(i);
      paginas.push('...');
      paginas.push(totalPaginas);
      return paginas;
    }
    if (paginaActual >= totalPaginas - 2) {
      paginas.push(1);
      paginas.push('...');
      for (let i = totalPaginas - 3; i <= totalPaginas; i++) paginas.push(i);
      return paginas;
    }
    paginas.push(1);
    paginas.push('...');
    paginas.push(paginaActual - 1);
    paginas.push(paginaActual);
    paginas.push(paginaActual + 1);
    paginas.push('...');
    paginas.push(totalPaginas);
    return paginas;
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-white py-20 flex flex-col justify-center items-center gap-4">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
        <p className="text-xl text-gray-500 font-bold animate-pulse">Loading catalog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
        
        {/* BARRA LATERAL (Fluida y libre de scrolls o comportamiento sticky trabado) */}
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

          {/* 2. CARD DE FILTROS AVANZADOS (Desplegado completo sin scroll interno) */}
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

        {/* CONTENIDO PRINCIPAL DE PRODUCTOS */}
        <main className="w-full lg:w-3/4">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 gap-2">
                <Link to="/" className="hover:text-blue-600">Home</Link>
                <span>/</span>
                <Link to={`/categorias?tipo=${infoCategoriaActual.main}`} className="hover:text-blue-600 uppercase">{infoCategoriaActual.main || 'Catálogo'}</Link>
                <span>/</span>
                <span className="text-blue-900 uppercase">{infoCategoriaActual.title}</span>
              </nav>
              
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
                {infoCategoriaActual.title}
              </h1>
            </div>
            <p className="text-gray-400 font-bold text-sm bg-gray-100 px-4 py-2 rounded-full h-fit">
              {totalProductos} Products
            </p>
          </div>

          {totalProductos === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
              <i className="fas fa-box-open text-6xl text-gray-200 mb-4 block"></i>
              <h3 className="text-xl font-bold text-gray-800">No hay productos que coincidan</h3>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosPagina.map((producto) => (
                  <div key={producto.mi_sku} className="group bg-white border border-gray-100 rounded-3xl p-5 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 flex flex-col relative overflow-hidden">
                    
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
                ))}
              </div>

              {/* PAGINACIÓN */}
              {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-3 mt-16 bg-white p-4 rounded-2xl shadow-sm border w-fit mx-auto">
                  <button 
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border hover:bg-gray-50 disabled:opacity-20"
                  >
                    <i className="fas fa-chevron-left text-xs"></i>
                  </button>
                  
                  <div className="flex gap-2">
                    {obtenerPaginas().map((num, index) => (
                      <button
                        key={index}
                        onClick={() => typeof num === 'number' && cambiarPagina(num)}
                        disabled={num === '...'}
                        className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                          paginaActual === num 
                            ? 'bg-blue-900 text-white shadow-lg' 
                            : num === '...' 
                              ? 'text-gray-400 cursor-default border-transparent' 
                              : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600 border'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border hover:bg-gray-50 disabled:opacity-20"
                  >
                    <i className="fas fa-chevron-right text-xs"></i>
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