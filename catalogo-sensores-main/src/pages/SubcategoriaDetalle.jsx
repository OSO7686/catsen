import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCartStore } from '../store';

const ITEMS_POR_PAGINA = 30;

export default function SubcategoriaDetalle() {
  const { subId } = useParams();
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  const [paginaActual, setPaginaActual] = useState(1);

  const [catalogoCompleto, setCatalogoCompleto] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. EL MOTOR MULTI-TABLAS
  useEffect(() => {
    async function obtenerCatalogoGigante() {
      setCargando(true);

      const tablasDeSupabase = [
        // SpO2
        { nombre_tabla: "spo2_direct_connect_sensors", main: "SpO2", sub: "Direct-Connect SpO2 Sensors" },
        { nombre_tabla: "spo2_short_sensors", main: "SpO2", sub: "Short SpO2 Sensors" },
        { nombre_tabla: "spo2_adapter_cables", main: "SpO2", sub: "SpO2 Adapter Cables" },
        { nombre_tabla: "spo2_disposable_sensors", main: "SpO2", sub: "Disposable Sp02 Sensors" },
        { nombre_tabla: "spo2_accessories", main: "SpO2", sub: "SpO2 Accessories" },
        // ECG
        { nombre_tabla: "ecg_direct_connect_cables", main: "ECG", sub: "Direct-Connect ECG Cables" },
        { nombre_tabla: "ecg_leadwires", main: "ECG", sub: "ECG Leadwires" },
        { nombre_tabla: "ecg_telemetry_leadwires", main: "ECG", sub: "ECG Telemetry" },
        { nombre_tabla: "ecg_trunk_cables", main: "ECG", sub: "ECG Trunk Cables" },
        { nombre_tabla: "ecg_disposable_direct_connect_ecg_cables", main: "ECG", sub: "Disposable Direct-Connect ECG Cables" },
        { nombre_tabla: "ecg_disposable_electrodes", main: "ECG", sub: "Disposable ECG Electrodes" },
        { nombre_tabla: "ecg_disposable_leadwires", main: "ECG", sub: "Disposable ECG Leadwires" },
        { nombre_tabla: "ecg_accessories", main: "ECG", sub: "ECG Accessories" },
        // EKG
        { nombre_tabla: "ekg_leadwires", main: "EKG", sub: "EKG Leadwires" },
        { nombre_tabla: "ekg_trunk_cables", main: "EKG", sub: "EKG Trunk Cables" },
        { nombre_tabla: "ekg_accessories", main: "EKG", sub: "EKG Accessories" },
        // NIBP
        { nombre_tabla: "nibp_cuffd", main: "NIBP", sub: "NIBP Cuffs" },
        { nombre_tabla: "nibp_hoses", main: "NIBP", sub: "NIBP Hoses" },
        { nombre_tabla: "nibp_connectors", main: "NIBP", sub: "NIBP Connectors" },
        { nombre_tabla: "nibp_disposable_cuffs", main: "NIBP", sub: "Disposable NIBP Cuffs" },
        // IBP
        { nombre_tabla: "ibp_adapter_cables", main: "IBP", sub: "IBP Adapter Cables" },
        { nombre_tabla: "ibp_disposable_transducers", main: "IBP", sub: "IBP Disposable Transducers" },
        { nombre_tabla: "ibp_infusion_bags", main: "IBP", sub: "IBP Infusion Bags" },
        // Temperature
        { nombre_tabla: "temperature_reusable_probes", main: "Temperature", sub: "Reusable Temperature Probes" },
        { nombre_tabla: "temperature_disposable_probes", main: "Temperature", sub: "Disposable Temperature Probes" },
        { nombre_tabla: "temperature_adapters", main: "Temperature", sub: "Temperature Adapters" },
        { nombre_tabla: "temperature_accessories", main: "Temperature", sub: "Temperature Accessories" },
        // Fetal
        { nombre_tabla: "fetal_ultrasound_transducers", main: "Fetal", sub: "Ultrasound Transducers" },
        { nombre_tabla: "fetal_toco_transducers", main: "Fetal", sub: "Toco Transducers" },
        { nombre_tabla: "fetal_transducers_repair_cables", main: "Fetal", sub: "Transducers Repair Cables" },
        { nombre_tabla: "fetal_transducers_repair_cases", main: "Fetal", sub: "Transducers Repair Cases" },
        { nombre_tabla: "fetal_fse_cables", main: "Fetal", sub: "FSE Cables" },
        { nombre_tabla: "fetal_accessories", main: "Fetal", sub: "Fetal Accessories" },
        // Oxygen
        { nombre_tabla: "o2_sensors", main: "Oxygen Sensors", sub: "Oxygen Sensors" },
        { nombre_tabla: "o2_flow_sensors", main: "Oxygen Sensors", sub: "Flow Sensors" },
        { nombre_tabla: "o2_etco2_sensors", main: "Oxygen Sensors", sub: "EtCO2 Sensors" }
      ];

      try {
        const promesasDeDescarga = tablasDeSupabase.map(async (infoTabla) => {
          const { data, error } = await supabase.from(infoTabla.nombre_tabla).select('*');
          if (error || !data) return [];
          return data.map(producto => ({
            ...producto,
            categoria: infoTabla.main,
            subcategoria: infoTabla.sub
          }));
        });

        const resultadosSeparados = await Promise.all(promesasDeDescarga);
        const unificado = resultadosSeparados.flat();
        
        setCatalogoCompleto(unificado);
      } catch (error) {
        console.error("Error cargando catálogo en Subcategoría:", error);
      }

      setCargando(false);
    }

    obtenerCatalogoGigante();
  }, []);

  // 2. OBTENER SUBCATEGORÍAS ÚNICAS PARA EL MENÚ LATERAL
  const subcategoriasMenu = useMemo(() => {
    const todas = catalogoCompleto.map(prod => prod.subcategoria).filter(Boolean);
    return [...new Set(todas)].sort();
  }, [catalogoCompleto]);

  // 3. Filtrar productos por subcategoría de la URL
  const productosFiltrados = useMemo(() => {
    return catalogoCompleto.filter(
      (prod) =>
        prod.subcategoria?.toLowerCase().replace(/\s+/g, '-') === subId
    );
  }, [subId, catalogoCompleto]);

  useEffect(() => {
    setPaginaActual(1);
  }, [subId]);

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

  const obtenerPaginas = () => {
    const paginas = [];
    if (totalPaginas <= 7) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
      return paginas;
    }
    paginas.push(1);
    if (paginaActual > 4) paginas.push('...');
    const start = Math.max(2, paginaActual - 1);
    const end = Math.min(totalPaginas - 1, paginaActual + 1);
    for (let i = start; i <= end; i++) paginas.push(i);
    if (paginaActual < totalPaginas - 3) paginas.push('...');
    if (totalPaginas > 1) paginas.push(totalPaginas);
    return paginas;
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 flex flex-col justify-center items-center gap-4">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
        <p className="text-xl text-gray-500 font-bold animate-pulse">Loading product catalog...</p>
      </div>
    );
  }

  if (totalProductos === 0) {
    return (
      <div className="py-20 text-center min-h-screen bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">No products found in this category.</h2>
        <Link to="/categorias" className="text-blue-600 font-bold hover:underline mt-4 inline-block">
          ← Return to Main Categories Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
        
        {/* ================= MENÚ LATERAL (SIDEBAR) ================= */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-24">
            <h2 className="text-lg font-black text-gray-800 mb-4 uppercase border-b pb-2">
              Categories
            </h2>
            <ul className="space-y-1 max-h-[70vh] overflow-y-auto pr-2">
              {subcategoriasMenu.map((subcat, idx) => {
                const subIdUrl = subcat.toLowerCase().replace(/\s+/g, '-');
                const isActivo = subIdUrl === subId;
                
                return (
                  <li key={idx}>
                    <Link
                      to={`/subcategoria/${subIdUrl}`}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActivo 
                          ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                      }`}
                    >
                      {subcat}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* ================= CONTENIDO PRINCIPAL ================= */}
        <main className="w-full lg:w-3/4">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 capitalize text-gray-800">
              {subId.replace(/-/g, ' ')}
            </h1>
            <p className="text-gray-500">
              Mostrando {totalProductos} productos
            </p>
          </div>

          {/* Grid de Productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosPagina.map((producto) => (
              <div key={producto.sku} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col">
                <Link to={`/producto/${producto.sku}`}>
                  <img src={producto.imagen_url || 'https://via.placeholder.com/300'} alt={producto.nombre} className="w-full h-52 object-contain p-4 mix-blend-multiply" />
                </Link>
                <div className="p-4 flex-grow">
                  <Link to={`/producto/${producto.sku}`}>
                    <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-3 hover:text-blue-600">
                      {producto.nombre}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500">SKU: {producto.sku}</p>
                  <p className="text-xl font-bold text-blue-600 mt-3">{producto.precio}</p>
                </div>
                <div className="p-4 pt-0">
                  <button 
                    onClick={() => agregarAlCarrito(producto)}
                    className="w-full bg-blue-900 text-white py-3 rounded-lg text-sm font-bold hover:bg-blue-800 transition shadow-md"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16 flex-wrap">
              <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} className="px-4 py-2 border rounded-lg font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition">
                &laquo; Previous
              </button>
              {obtenerPaginas().map((num, index) => (
                <button key={index} onClick={() => typeof num === 'number' && cambiarPagina(num)} disabled={num === '...'} className={`w-10 h-10 rounded-lg font-bold transition ${paginaActual === num ? 'bg-orange-600 text-white border-orange-600' : num === '...' ? 'cursor-default text-gray-400 bg-transparent border-transparent' : 'bg-white border text-gray-700 hover:bg-gray-100'}`}>
                  {num}
                </button>
              ))}
              <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="px-4 py-2 border rounded-lg font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition">
                Next &raquo;
              </button>
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
}