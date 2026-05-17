import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore'; 
import { MAPA_SUBCATEGORIAS } from '../utils/constants'; 
import { useSubcategoria } from '../hooks/useSubcategoria';

// HERRAMIENTAS Y COMPONENTES
import Paginacion from '../components/common/Paginacion';
import CardProducto from '../components/common/CardProducto';
import SidebarFiltros from '../components/subcategoria/SidebarFiltros';
import ErrorState from '../components/common/ErrorState'; // 👈 Importamos tu nuevo diseño de error

const ITEMS_POR_PAGINA = 30;

export default function SubcategoriaDetalle() {
  const { subId } = useParams();
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  
  const infoCategoriaActual = MAPA_SUBCATEGORIAS.find(
    item => item.url === subId || item.db === subId
  ) || { db: subId, title: subId.replace(/-/g, ' '), main: 'SpO2' };

  // 👈 Obtenemos el error y la función reintentar del hook
  const { 
    productosFiltrados, 
    filtrosDisponibles, 
    filtrosSeleccionados, 
    manejarFiltro, 
    limpiarFiltros, 
    cargando,
    error,
    reintentar
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

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
        
        {/* BARRA LATERAL (Siempre visible, incluso si hay error o está cargando) */}
        <SidebarFiltros 
          infoCategoriaActual={infoCategoriaActual}
          subId={subId}
          filtrosDisponibles={filtrosDisponibles}
          filtrosSeleccionados={filtrosSeleccionados}
          manejarFiltro={manejarFiltro}
          limpiarFiltros={limpiarFiltros}
        />

        {/* CONTENIDO PRINCIPAL */}
        <main className="w-full lg:w-3/4">
          
          {/* Lógica de Estados: Cargando -> Error -> Mostrar Productos */}
          {cargando ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-3xl border border-gray-100 shadow-sm flex-col gap-4">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
              <p className="text-xl text-gray-500 font-bold animate-pulse">Cargando catálogo...</p>
            </div>
          ) : error ? (
            /* 🚨 MOSTRAMOS TU COMPONENTE DE ERROR AQUÍ */
            <ErrorState mensaje={error} reintentar={reintentar} />
          ) : (
            <>
              {/* Encabezado */}
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
                      <CardProducto 
                        key={producto.mi_sku} 
                        producto={producto} 
                        agregarAlCarrito={agregarAlCarrito} 
                      />
                    ))}
                  </div>

                  <Paginacion 
                    paginaActual={paginaActual} 
                    totalPaginas={totalPaginas} 
                    cambiarPagina={cambiarPagina} 
                  />
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}