import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCartStore } from '../store';

const ITEMS_POR_PAGINA = 30;

const MAPA_SUBCATEGORIAS = [
  { db: "spo2_direct_connect_sensors", url: "direct-connect-spo2-sensors", title: "Direct-Connect SpO2 Sensors" },
  { db: "spo2_short_sensors", url: "short-spo2-sensors", title: "Short SpO2 Sensors" },
  { db: "spo2_adapter_cables", url: "spo2-adapter-cables", title: "SpO2 Adapter Cables" },
  { db: "spo2_disposable_sensors", url: "disposable-sp02-sensors", title: "Disposable Sp02 Sensors" },
  { db: "spo2_accessories", url: "spo2-accessories", title: "SpO2 Accessories" },
  { db: "ecg_direct_connect_cables", url: "direct-connect-ecg-cables", title: "Direct-Connect ECG Cables" },
  { db: "ecg_leadwires", url: "ecg-leadwires", title: "ECG Leadwires" },
  { db: "ecg_telemetry_leadwires", url: "ecg-telemetry", title: "ECG Telemetry" },
  { db: "ecg_trunk_cables", url: "ecg-trunk-cables", title: "ECG Trunk Cables" },
  { db: "ecg_disposable_direct_connect_ecg_cables", url: "disposable-direct-connect-ecg-cables", title: "Disposable Direct-Connect ECG Cables" },
  { db: "ecg_disposable_electrodes", url: "disposable-ecg-electrodes", title: "Disposable ECG Electrodes" },
  { db: "ecg_disposable_leadwires", url: "disposable-ecg-leadwires", title: "Disposable ECG Leadwires" },
  { db: "ecg_accessories", url: "ecg-accessories", title: "ECG Accessories" },
  { db: "ekg_direct_connect_cables", url: "direct-connect-ekg-cables", title: "Direct-Connect EKG Cables" },
  { db: "ekg_leadwires", url: "ekg-leadwires", title: "EKG Leadwires" },
  { db: "ekg_trunk_cables", url: "ekg-trunk-cables", title: "EKG Trunk Cables" },
  { db: "ekg_accessories", url: "ekg-accessories", title: "EKG Accessories" },
  { db: "nibp_cuffs", url: "nibp-cuffs", title: "NIBP Cuffs" }, 
  { db: "nibp_hoses", url: "nibp-hoses", title: "NIBP Hoses" },
  { db: "nibp_connectors", url: "nibp-connectors", title: "NIBP Connectors" },
  { db: "nibp_disposable_cuffs", url: "disposable-nibp-cuffs", title: "Disposable NIBP Cuffs" },
  { db: "ibp_adapter_cables", url: "ibp-adapter-cables", title: "IBP Adapter Cables" },
  { db: "ibp_disposable_transducers", url: "ibp-disposable-transducers", title: "IBP Disposable Transducers" },
  { db: "ibp_infusion_bags", url: "ibp-infusion-bags", title: "IBP Infusion Bags" },
  { db: "temperature_reusable_probes", url: "reusable-temperature-probes", title: "Reusable Temperature Probes" },
  { db: "temperature_disposable_probes", url: "disposable-temperature-probes", title: "Disposable Temperature Probes" },
  { db: "temperature_adapters", url: "temperature-adapters", title: "Temperature Adapters" },
  { db: "temperature_accessories", url: "temperature-accessories", title: "Temperature Accessories" },
  { db: "fetal_ultrasound_transducers", url: "ultrasound-transducers", title: "Ultrasound Transducers" },
  { db: "fetal_toco_transducers", url: "toco-transducers", title: "Toco Transducers" },
  { db: "fetal_transducers_repair_cables", url: "transducers-repair-cables", title: "Transducers Repair Cables" },
  { db: "fetal_transducers_repair_cases", url: "transducers-repair-cases", title: "Transducers Repair Cases" },
  { db: "fetal_fse_cables", url: "fse-cables", title: "FSE Cables" },
  { db: "fetal_accessories", url: "fetal-accessories", title: "Fetal Accessories" },
  { db: "o2_sensors", url: "oxygen-sensors", title: "Oxygen Sensors" },
  { db: "o2_flow_sensors", url: "flow-sensors", title: "Flow Sensors" },
  { db: "o2_etco2_sensors", url: "etco2-sensors", title: "EtCO2 Sensors" }
];

export default function SubcategoriaDetalle() {
  const { subId } = useParams();
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  
  const [productosCrudos, setProductosCrudos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState({});

  const infoCategoriaActual = MAPA_SUBCATEGORIAS.find(item => item.url === subId || item.db === subId) || { db: subId, title: subId.replace(/-/g, ' ') };

  useEffect(() => {
    async function obtenerDatos() {
      setCargando(true);
      setFiltrosSeleccionados({});

      try {
        let todosLosProductos = [];
        let rangoInicio = 0;
        let cantidadPorLote = 1000;
        let seguirBuscando = true;

        while (seguirBuscando) {
          const { data, error } = await supabase
            .from('productos_medicos')
            .select('*')
            .eq('subcategoria', infoCategoriaActual.db)
            .range(rangoInicio, rangoInicio + cantidadPorLote - 1);

          if (error) throw error;

          todosLosProductos = [...todosLosProductos, ...data];

          if (data.length < cantidadPorLote) {
            seguirBuscando = false;
          } else {
            rangoInicio += cantidadPorLote;
          }
        }

        setProductosCrudos(todosLosProductos || []);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
      setCargando(false);
    }
    obtenerDatos();
  }, [infoCategoriaActual.db]);

  useEffect(() => {
    setPaginaActual(1);
  }, [subId]);

  // ================= EXTRACCIÓN A PRUEBA DE BALAS =================
  const filtrosDisponibles = useMemo(() => {
    const opciones = {};
    const ignorar = ["certifications", "warranty", "weight", "category", "latex-free", "sterile"];

    productosCrudos.forEach(prod => {
      // Intentar sacar el Tipo
      if (prod.tipo && typeof prod.tipo === 'string' && prod.tipo.trim() !== "") {
        if (!opciones["Patient Connector"]) opciones["Patient Connector"] = new Set();
        opciones["Patient Connector"].add(prod.tipo.trim());
      }

      // Intentar sacar Especificaciones
      if (prod.especificaciones && typeof prod.especificaciones === 'string') {
        const specs = prod.especificaciones.split('|');
        specs.forEach(s => {
          if (s.includes(':')) {
            const partes = s.split(':');
            const clave = partes[0].trim();
            const valor = partes.slice(1).join(':').trim(); 
            
            if (clave && valor && !ignorar.includes(clave.toLowerCase())) {
              if (!opciones[clave]) opciones[clave] = new Set();
              opciones[clave].add(valor);
            }
          }
        });
      }
    });

    const resultadoFormateado = {};
    for (const key in opciones) {
      if (opciones[key].size > 0) { // Si hay por lo menos 1, lo mostramos
        resultadoFormateado[key] = Array.from(opciones[key]).sort();
      }
    }
    return resultadoFormateado;
  }, [productosCrudos]);

  const manejarFiltro = (categoriaFiltro, valor) => {
    setFiltrosSeleccionados(prev => {
      const seleccionadosActuales = prev[categoriaFiltro] || [];
      if (seleccionadosActuales.includes(valor)) {
        const nuevos = seleccionadosActuales.filter(v => v !== valor);
        if (nuevos.length === 0) {
           const copia = {...prev};
           delete copia[categoriaFiltro];
           return copia;
        }
        return { ...prev, [categoriaFiltro]: nuevos };
      } else {
        return { ...prev, [categoriaFiltro]: [...seleccionadosActuales, valor] };
      }
    });
    setPaginaActual(1);
  };

  const productosFiltrados = useMemo(() => {
    if (Object.keys(filtrosSeleccionados).length === 0) return productosCrudos;

    return productosCrudos.filter(prod => {
      return Object.entries(filtrosSeleccionados).every(([catFiltro, valoresSeleccionados]) => {
        if (catFiltro === "Patient Connector") {
          return valoresSeleccionados.includes(prod.tipo?.trim());
        }

        if (!prod.especificaciones) return false;
        
        let valorDelProducto = null;
        const specs = prod.especificaciones.split('|');
        for (let s of specs) {
          const partes = s.split(':');
          if (partes.length >= 2 && partes[0].trim() === catFiltro) {
            valorDelProducto = partes.slice(1).join(':').trim();
            break;
          }
        }

        return valoresSeleccionados.includes(valorDelProducto);
      });
    });
  }, [productosCrudos, filtrosSeleccionados]);

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
        <p className="text-xl text-gray-500 font-bold animate-pulse">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
        
        <aside className="w-full lg:w-1/4">
          
          {/* ================= CAJA BLANCA FORZADA (SIEMPRE VISIBLE) ================= */}
          <div className="bg-white p-6 rounded-xl border shadow-sm mb-6">
            <h2 className="text-lg font-black text-gray-800 mb-4 uppercase border-b pb-2">
              Advanced Filters
            </h2>
            
            {/* Si no hay filtros, imprimimos esto para ver si leyó los productos */}
            {Object.keys(filtrosDisponibles).length === 0 ? (
              <div className="bg-red-50 text-red-600 p-4 rounded text-sm font-bold border border-red-200">
                <i className="fas fa-exclamation-circle"></i> Error leyendo filtros.<br/>
                Productos descargados: {productosCrudos.length}
              </div>
            ) : (
              /* Si SÍ hay filtros, los mostramos */
              <>
                {Object.entries(filtrosDisponibles).map(([categoriaFiltro, opciones]) => (
                  <div key={categoriaFiltro} className="mb-6">
                    <h3 className="font-bold text-sm text-gray-800 mb-3">{categoriaFiltro}</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {opciones.map(opcion => (
                        <label key={opcion} className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                            checked={(filtrosSeleccionados[categoriaFiltro] || []).includes(opcion)}
                            onChange={() => manejarFiltro(categoriaFiltro, opcion)}
                          />
                          <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors leading-tight">
                            {opcion}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                
                {Object.keys(filtrosSeleccionados).length > 0 && (
                  <button 
                    onClick={() => setFiltrosSeleccionados({})}
                    className="w-full mt-4 text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest text-center border border-red-100 p-2 rounded hover:bg-red-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </>
            )}
          </div>

          {/* Menú normal de subcategorías */}
          <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-24">
            <h2 className="text-lg font-black text-gray-800 mb-4 uppercase border-b pb-2">
              Categories
            </h2>
            <ul className="space-y-1 max-h-[50vh] overflow-y-auto pr-2">
              {MAPA_SUBCATEGORIAS.filter(s => s.main === MAPA_SUBCATEGORIAS.find(x => x.db === infoCategoriaActual.db)?.main).map((subcat, idx) => {
                const isActivo = subcat.url === subId || subcat.db === subId;
                return (
                  <li key={idx}>
                    <Link
                      to={`/subcategoria/${subcat.url}`}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActivo 
                          ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                      }`}
                    >
                      {subcat.title}
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
              {infoCategoriaActual.title}
            </h1>
            <p className="text-gray-500">
              Mostrando {totalProductos} productos {Object.keys(filtrosSeleccionados).length > 0 && <span className="text-blue-600 font-bold">(Filtrados)</span>}
            </p>
          </div>

          {totalProductos === 0 ? (
            <div className="py-20 text-center bg-white border rounded-xl shadow-sm">
              <i className="fas fa-filter text-4xl text-gray-300 mb-4 block"></i>
              <h2 className="text-2xl font-bold text-gray-800">No products match your filters.</h2>
              <button onClick={() => setFiltrosSeleccionados({})} className="text-blue-600 font-bold hover:underline mt-4 inline-block">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Grid de Productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosPagina.map((producto) => (
                  <div key={producto.mi_sku} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col">
                    <Link to={`/producto/${producto.mi_sku}`}>
                      <img src={producto.imagen_url || 'https://via.placeholder.com/300'} alt={producto.nombre} className="w-full h-52 object-contain p-4 mix-blend-multiply" />
                    </Link>
                    <div className="p-4 flex-grow">
                      <Link to={`/producto/${producto.mi_sku}`}>
                        <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-3 hover:text-blue-600">
                          {producto.nombre}
                        </h3>
                      </Link>
                      <p className="text-xs text-blue-600 font-bold bg-blue-50 inline-block px-2 py-1 rounded">SKU: {producto.mi_sku}</p>
                      <p className="text-xl font-bold text-gray-900 mt-3">{producto.precio}</p>
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
                  <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} className="px-4 py-2 border rounded-lg font-bold text-gray-700 hover:bg-gray-100">Anterior</button>
                  {obtenerPaginas().map((num, index) => (
                    <button key={index} onClick={() => typeof num === 'number' && cambiarPagina(num)} disabled={num === '...'} className={`w-10 h-10 rounded-lg font-bold ${paginaActual === num ? 'bg-blue-600 text-white' : 'bg-white border'}`}>{num}</button>
                  ))}
                  <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="px-4 py-2 border rounded-lg font-bold text-gray-700 hover:bg-gray-100">Siguiente</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}