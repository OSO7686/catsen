import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../SupabaseClient'; 
import { useCartStore } from '../store';

const ITEMS_POR_PAGINA = 30;

const MAPA_SUBCATEGORIAS = [
  { db: "spo2_direct_connect_sensors", url: "direct-connect-spo2-sensors", title: "Direct-Connect SpO2 Sensors", main: "spo2" },
  { db: "spo2_short_sensors", url: "short-spo2-sensors", title: "Short SpO2 Sensors", main: "spo2" },
  { db: "spo2_adapter_cables", url: "spo2-adapter-cables", title: "SpO2 Adapter Cables", main: "spo2" },
  { db: "spo2_disposable_sensors", url: "disposable-sp02-sensors", title: "Disposable Sp02 Sensors", main: "spo2" },
  { db: "spo2_accessories", url: "spo2-accessories", title: "SpO2 Accessories", main: "spo2" },
  { db: "ecg_direct_connect_cables", url: "direct-connect-ecg-cables", title: "Direct-Connect ECG Cables", main: "ecg" },
  { db: "ecg_leadwires", url: "ecg-leadwires", title: "ECG Leadwires", main: "ecg" },
  { db: "ecg_telemetry_leadwires", url: "ecg-telemetry", title: "ECG Telemetry", main: "ecg" },
  { db: "ecg_trunk_cables", url: "ecg-trunk-cables", title: "ECG Trunk Cables", main: "ecg" },
  { db: "ecg_disposable_direct_connect_ecg_cables", url: "disposable-direct-connect-ecg-cables", title: "Disposable Direct-Connect ECG Cables", main: "ecg" },
  { db: "ecg_disposable_electrodes", url: "disposable-ecg-electrodes", title: "Disposable ECG Electrodes", main: "ecg" },
  { db: "ecg_disposable_leadwires", url: "disposable-ecg-leadwires", title: "Disposable ECG Leadwires", main: "ecg" },
  { db: "ecg_accessories", url: "ecg-accessories", title: "ECG Accessories", main: "ecg" },
  { db: "ekg_direct_connect_cables", url: "direct-connect-ekg-cables", title: "Direct-Connect EKG Cables", main: "ekg" },
  { db: "ekg_leadwires", url: "ekg-leadwires", title: "EKG Leadwires", main: "ekg" },
  { db: "ekg_trunk_cables", url: "ekg-trunk-cables", title: "EKG Trunk Cables", main: "ekg" },
  { db: "ekg_accessories", url: "ekg-accessories", title: "EKG Accessories", main: "ekg" },
  { db: "nibp_cuffs", url: "nibp-cuffs", title: "NIBP Cuffs", main: "nibp" }, 
  { db: "nibp_hoses", url: "nibp-hoses", title: "NIBP Hoses", main: "nibp" },
  { db: "nibp_connectors", url: "nibp-connectors", title: "NIBP Connectors", main: "nibp" },
  { db: "nibp_disposable_cuffs", url: "disposable-nibp-cuffs", title: "Disposable NIBP Cuffs", main: "nibp" },
  { db: "ibp_adapter_cables", url: "ibp-adapter-cables", title: "IBP Adapter Cables", main: "ibp" },
  { db: "ibp_disposable_transducers", url: "ibp-disposable-transducers", title: "IBP Disposable Transducers", main: "ibp" },
  { db: "ibp_infusion_bags", url: "ibp-infusion-bags", title: "IBP Infusion Bags", main: "ibp" },
  { db: "temperature_reusable_probes", url: "reusable-temperature-probes", title: "Reusable Temperature Probes", main: "temperature" },
  { db: "temperature_disposable_probes", url: "disposable-temperature-probes", title: "Disposable Temperature Probes", main: "temperature" },
  { db: "temperature_adapters", url: "temperature-adapters", title: "Temperature Adapters", main: "temperature" },
  { db: "temperature_accessories", url: "temperature-accessories", title: "Temperature Accessories", main: "temperature" },
  { db: "fetal_ultrasound_transducers", url: "ultrasound-transducers", title: "Ultrasound Transducers", main: "fetal" },
  { db: "fetal_toco_transducers", url: "toco-transducers", title: "Toco Transducers", main: "fetal" },
  { db: "fetal_transducers_repair_cables", url: "transducers-repair-cables", title: "Transducers Repair Cables", main: "fetal" },
  { db: "fetal_transducers_repair_cases", url: "transducers-repair-cases", title: "Transducers Repair Cases", main: "fetal" },
  { db: "fetal_fse_cables", url: "fse-cables", title: "FSE Cables", main: "fetal" },
  { db: "fetal_accessories", url: "fetal-accessories", title: "Fetal Accessories", main: "fetal" },
  { db: "o2_sensors", url: "oxygen-sensors", title: "Oxygen Sensors", main: "o2" },
  { db: "o2_flow_sensors", url: "flow-sensors", title: "Flow Sensors", main: "o2" },
  { db: "o2_etco2_sensors", url: "etco2-sensors", title: "EtCO2 Sensors", main: "o2" }
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
            .from('productos_medicos_v2')
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

  // ================= EXTRACCIÓN CON CONTADORES =================
  const filtrosDisponibles = useMemo(() => {
    const opciones = {};
    const ignorar = ["certifications", "warranty", "weight", "category", "latex-free", "sterile", "packaging type", "packaging unit", "lead cable diameter", "lead cable material", "trunk cable material"];

    productosCrudos.forEach(prod => {
      const patientConnector = prod.tipo?.trim();
      if (patientConnector && patientConnector !== "") {
        if (!opciones["Patient Connector"]) opciones["Patient Connector"] = {};
        opciones["Patient Connector"][patientConnector] = (opciones["Patient Connector"][patientConnector] || 0) + 1;
      }

      if (prod.especificaciones && typeof prod.especificaciones === 'object') {
        Object.entries(prod.especificaciones).forEach(([clave, valor]) => {
          if (clave && valor && !ignorar.includes(clave.toLowerCase())) {
            const nombreFiltro = clave === "Technology" ? "SpO2 Technology" : clave;
            if (!opciones[nombreFiltro]) opciones[nombreFiltro] = {};
            opciones[nombreFiltro][valor] = (opciones[nombreFiltro][valor] || 0) + 1;
          }
        });
      }
    });

    const resultadoFormateado = {};
    for (const key in opciones) {
      if (Object.keys(opciones[key]).length > 0) { 
        resultadoFormateado[key] = Object.entries(opciones[key])
          .map(([nombre, cantidad]) => ({ nombre, cantidad }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
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

  const limpiarFiltros = () => setFiltrosSeleccionados({});

  const productosFiltrados = useMemo(() => {
    if (Object.keys(filtrosSeleccionados).length === 0) return productosCrudos;

    return productosCrudos.filter(prod => {
      return Object.entries(filtrosSeleccionados).every(([catFiltro, valoresSeleccionados]) => {
        if (catFiltro === "Patient Connector") {
          return valoresSeleccionados.includes(prod.tipo?.trim());
        }

        if (!prod.especificaciones) return false;
        
        let valorDelProducto = prod.especificaciones[catFiltro];
        if (catFiltro === "SpO2 Technology" && !valorDelProducto) {
           valorDelProducto = prod.especificaciones["Technology"];
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
        
        {/* BARRA LATERAL (ASIDE) */}
        <aside className="w-full lg:w-1/4">
          
          {/* 1. TABLA DE CATEGORÍAS (ARRIBA) */}
          <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 sticky top-24">
            <h2 className="text-lg font-black text-gray-800 mb-4 uppercase border-b pb-2">
              Categories
            </h2>
            <ul className="space-y-1 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
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

          {/* 2. TABLA DE FILTROS (ABAJO) */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-black text-gray-800 mb-4 uppercase border-b pb-2">
              Advanced Filters
            </h2>
            
            {Object.keys(filtrosDisponibles).length === 0 ? (
              // ESTE ES EL CUADRO DE PRUEBA: Si no hay datos, verás este cuadro amarillo enorme
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm font-bold border-2 border-yellow-400 text-center">
                <i className="fas fa-tools text-2xl mb-2 block"></i>
                ¡EL ESPACIO DE FILTROS YA ESTÁ CREADO AQUÍ!
                <br/><span className="text-xs font-normal">Aún no hay especificaciones (JSON) en la base de datos para esta subcategoría.</span>
              </div>
            ) : (
              <>
                {Object.entries(filtrosDisponibles).map(([categoriaFiltro, opciones]) => (
                  <div key={categoriaFiltro} className="mb-6">
                    <h3 className="font-medium text-sm text-gray-900 mb-3">{categoriaFiltro}</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {opciones.map(opcion => (
                        <label key={opcion.nombre} className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5"
                              checked={(filtrosSeleccionados[categoriaFiltro] || []).includes(opcion.nombre)}
                              onChange={() => manejarFiltro(categoriaFiltro, opcion.nombre)}
                            />
                            <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors leading-tight">
                              {opcion.nombre}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400">{opcion.cantidad}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                
                {Object.keys(filtrosSeleccionados).length > 0 && (
                  <button 
                    onClick={limpiarFiltros}
                    className="w-full mt-4 text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest text-center border border-red-100 p-2 rounded hover:bg-red-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </>
            )}
          </div>
        </aside>

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
              <button onClick={limpiarFiltros} className="text-blue-600 font-bold hover:underline mt-4 inline-block">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
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
                      <p className="text-xl font-bold text-gray-900 mt-3">
                        ${Number(producto.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
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

              {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-2 mt-16 flex-wrap">
                  <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} className="px-4 py-2 border rounded-lg font-bold text-gray-700 hover:bg-gray-100">Anterior</button>
                  {/* Paginación */}
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