import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCartStore } from '../store';
import { supabase } from '../supabaseClient'; 

export default function Busqueda() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; // Atrapa lo que viene en la URL
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [paginaActual, setPaginaActual] = useState(1);
  const ITEMS_POR_PAGINA = 30;

  // EL CEREBRO DE BÚSQUEDA MULTI-TABLA
  useEffect(() => {
    async function realizarBusquedaGigante() {
      const terminoBusqueda = query.trim().toLowerCase();

      if (!terminoBusqueda) {
        setProductosFiltrados([]);
        setCargando(false);
        return;
      }

      setCargando(true);

      const tablasDeSupabase = [
        "spo2_direct_connect_sensors", "spo2_short_sensors", "spo2_adapter_cables", "spo2_disposable_sensors", "spo2_accessories",
        "ecg_direct_connect_cables", "ecg_leadwires", "ecg_telemetry_leadwires", "ecg_trunk_cables", 
        "ecg_disposable_direct_connect_ecg_cables", "ecg_disposable_electrodes", "ecg_disposable_leadwires", "ecg_accessories",
        "ekg_leadwires", "ekg_trunk_cables", "ekg_accessories",
        "nibp_cuffd", "nibp_hoses", "nibp_connectors", "nibp_disposable_cuffs",
        "ibp_adapter_cables", "ibp_disposable_transducers", "ibp_infusion_bags",
        "temperature_reusable_probes", "temperature_disposable_probes", "temperature_adapters", "temperature_accessories",
        "fetal_ultrasound_transducers", "fetal_toco_transducers", "fetal_transducers_repair_cables", 
        "fetal_transducers_repair_cases", "fetal_fse_cables", "fetal_accessories",
        "o2_sensors", "o2_flow_sensors", "o2_etco2_sensors"
      ];

      try {
        // Le pedimos a TODAS las tablas que nos manden productos que coincidan con la búsqueda
        const promesas = tablasDeSupabase.map(tabla => 
          supabase
            .from(tabla)
            .select('*')
            // Busca la palabra clave en el 'nombre' O en el 'sku'
            .or(`nombre.ilike.%${terminoBusqueda}%,sku.ilike.%${terminoBusqueda}%`)
        );

        const resultados = await Promise.all(promesas);
        
        // Juntamos todos los resultados encontrados en las 30 tablas
        const coincidencias = resultados.flatMap(res => res.data || []);
        
        setProductosFiltrados(coincidencias);

      } catch (error) {
        console.error("Error realizando la búsqueda global:", error);
      }

      setPaginaActual(1);
      setCargando(false);
    }

    realizarBusquedaGigante();
  }, [query]);

  // Lógica de Paginación
  const totalProductos = productosFiltrados.length;
  const totalPaginas = Math.ceil(totalProductos / ITEMS_POR_PAGINA);
  const productosPagina = productosFiltrados.slice((paginaActual - 1) * ITEMS_POR_PAGINA, paginaActual * ITEMS_POR_PAGINA);

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

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-2">
          Resultados de Búsqueda
        </h1>
        <p className="text-gray-500">
          Encontramos <span className="font-bold text-blue-600">{totalProductos}</span> products for <span className="font-black">"{query}"</span>
        </p>
      </div>

      {cargando ? (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <i className="fas fa-search fa-spin text-4xl text-blue-600"></i>
          <p className="text-xl text-gray-500 font-bold animate-pulse">Scanning global database...</p>
        </div>
      ) : totalProductos === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center max-w-2xl mx-auto shadow-sm">
          <i className="fas fa-search text-6xl text-gray-200 mb-6 block"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No matches found</h2>
          <p className="text-gray-500 mb-8">Try searching with more general terms, checking the spelling, or searching directly by the part number (SKU).</p>
          <Link to="/categorias" className="bg-blue-900 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-blue-800 transition-colors">
            Ver Catálogo
          </Link>
        </div>
      ) : (
        <>
          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosPagina.map((producto, index) => (
              <div key={index} className="group bg-white border border-gray-100 rounded-3xl p-5 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 flex flex-col relative overflow-hidden">
                <Link to={`/producto/${producto.sku}`} className="flex flex-col flex-1">
                  <div className="h-48 w-full bg-gray-50 rounded-2xl mb-5 flex items-center justify-center p-4 overflow-hidden">
                    <img 
                      src={producto.imagen_url || 'https://via.placeholder.com/150'} 
                      alt={producto.nombre} 
                      className="max-h-full max-w-full object-contain mix-blend-multiply transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <h4 className="font-bold text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {producto.nombre}
                  </h4>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase tracking-tighter">SKU: {producto.sku}</span>
                  </div>
                </Link>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-xl font-black text-blue-900">{producto.precio}</span>
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

          {/* Paginación */}
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
    </div>
  );
}