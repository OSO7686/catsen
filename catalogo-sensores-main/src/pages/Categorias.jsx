import { useState, useEffect } from 'react';
import { useCartStore } from '../store';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 

const mainCategories = [
  { nombre: 'SpO2', icon: 'fas fa-fingerprint' },
  { nombre: 'ECG', icon: 'fas fa-wave-square' },
  { nombre: 'EKG', icon: 'fas fa-heartbeat' },
  { nombre: 'NIBP', icon: 'fas fa-stethoscope' },
  { nombre: 'IBP', icon: 'fas fa-tint' },
  { nombre: 'Temperature', icon: 'fas fa-thermometer-half' },
  { nombre: 'Fetal', icon: 'fas fa-baby' },
  { nombre: 'Oxygen Sensors', icon: 'fas fa-lungs' },
];

function Categorias() {
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
 // Atrapamos la URL y la pasamos a minúsculas
  const tipoURL = (searchParams.get('tipo') || 'SpO2').toLowerCase().trim();
  
  // 1. Filtro estricto: Buscamos si la URL es EXACTAMENTE igual al nombre de la categoría
  let categoriaEncontrada = mainCategories.find(
    (cat) => cat.nombre.toLowerCase() === tipoURL
  );

  // 2. Filtro flexible: Si no hubo match exacto, buscamos si la URL CONTIENE el nombre
  if (!categoriaEncontrada) {
    categoriaEncontrada = mainCategories.find(
      (cat) => tipoURL.includes(cat.nombre.toLowerCase())
    );
  }

  // Si después de todo no encuentra nada, el seguro de vida lo manda a SpO2
  const categoriaPrincipal = categoriaEncontrada?.nombre || 'SpO2';


  const [catalogoCompleto, setCatalogoCompleto] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [subcatActiva, setSubcatActiva] = useState('Todas');
  const [paginaActual, setPaginaActual] = useState(1);

  const ITEMS_POR_PAGINA = 30;

  useEffect(() => {
    async function obtenerCatalogoGigante() {
      setCargando(true);

      // --- MAPA DE TABLAS: El código leerá cada una de estas tablas ---
      // Asegúrate de que el 'nombre_tabla' sea EXACTAMENTE igual al de tu menú en Supabase
      const tablasDeSupabase = [
        // SpO2
        { nombre_tabla: "spo2_direct_connect_sensors", main: "SpO2", sub: "Direct-Connect SpO2 Sensors" },
        { nombre_tabla: "spo2_short_sensors", main: "SpO2", sub: "Short SpO2 Sensors" },
        { nombre_tabla: "spo2_adapter_cables", main: "SpO2", sub: "SpO2 Adapter Cables" },
        { nombre_tabla: "spo2_disposable_sensors", main: "SpO2", sub: "Disposable Sp02 Sensors" },
        { nombre_tabla: "spo2_accessories", main: "SpO2", sub: "SpO2 Accessories" },
        // ECG (Ajusta estos nombres si en Supabase dicen otra cosa)
        { nombre_tabla: "ecg_direct_connect_cables", main: "ECG", sub: "Direct-Connect ECG Cables" },
        { nombre_tabla: "ecg_leadwires", main: "ECG", sub: "ECG Leadwires" },
        { nombre_tabla: "ecg_telemetry_leadwires", main: "ECG", sub: "ECG Telemetry" }, // Basado en tu imagen
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
        { nombre_tabla: "ibp_adapter_cables", main: "IBP", sub: "IBP Adapter Cables" }, // Basado en tu imagen
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
        // Disparamos la lectura de TODAS las tablas de forma simultánea (en paralelo)
        const promesasDeDescarga = tablasDeSupabase.map(async (infoTabla) => {
          const { data, error } = await supabase.from(infoTabla.nombre_tabla).select('*');
          
          // Si la tabla no existe o está vacía, regresamos un arreglo vacío
          if (error || !data) {
            if (error) console.warn(`Error leyendo tabla ${infoTabla.nombre_tabla}:`, error.message);
            return [];
          }

          // A cada producto que descargamos, le "inyectamos" su categoría y subcategoría
          return data.map(producto => ({
            ...producto,
            categoria: infoTabla.main,
            subcategoria: infoTabla.sub
          }));
        });

        // Esperamos a que TODAS las tablas terminen de descargarse
        const resultadosSeparados = await Promise.all(promesasDeDescarga);
        
        // Unimos todas las tablitas chiquitas en un solo catálogo gigante
        const unificado = resultadosSeparados.flat();

        setCatalogoCompleto(unificado);
        console.log(`¡Éxito! Se cargaron ${unificado.length} productos en total.`);

      } catch (errorGeneral) {
        console.error("Fallo crítico al descargar el catálogo:", errorGeneral);
      }

      setCargando(false);
    }

    obtenerCatalogoGigante();
  }, []);

  useEffect(() => {
    setSubcatActiva('Todas');
    setPaginaActual(1);
  }, [categoriaPrincipal]);

  const manejarCambioSubcategoria = (nombreSub) => {
    setSubcatActiva(nombreSub);
    setPaginaActual(1); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const productosDeLaCategoria = catalogoCompleto.filter(prod => prod.categoria === categoriaPrincipal);
  const productosFiltrados = subcatActiva === 'Todas' 
    ? productosDeLaCategoria 
    : productosDeLaCategoria.filter(prod => prod.subcategoria === subcatActiva);

  const totalProductos = productosFiltrados.length;
  const totalPaginas = Math.ceil(totalProductos / ITEMS_POR_PAGINA);
  const productosPagina = productosFiltrados.slice((paginaActual - 1) * ITEMS_POR_PAGINA, paginaActual * ITEMS_POR_PAGINA);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 100, behavior: 'smooth' });
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

  const subcategoriasUnicas = [...new Set(productosDeLaCategoria.map(p => p.subcategoria))].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR ÚNICA DINÁMICA CON SCROLL INTERNO */}
        <aside className="w-full lg:w-1/4 h-fit sticky top-24">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col max-h-[75vh]">
            <div className="bg-blue-900 p-4 shrink-0 rounded-t-2xl">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">Navegación de Catálogo</h3>
            </div>
            
            <nav className="p-2 overflow-y-auto">
              {mainCategories.map((cat) => {
                const estaActiva = categoriaPrincipal === cat.nombre;
                
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

                    {estaActiva && !cargando && (
                      <ul className="mt-1 ml-9 space-y-1 border-l-2 border-blue-100 pl-2 py-2">
                        <li>
                          <button
                            onClick={() => manejarCambioSubcategoria('Todas')}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              subcatActiva === 'Todas' ? 'text-blue-600 bg-blue-100/50' : 'text-gray-500 hover:text-blue-500'
                            }`}
                          >
                            • Ver Todo {cat.nombre}
                          </button>
                        </li>
                        {subcategoriasUnicas.map(sub => (
                          <li key={sub}>
                            <button
                              onClick={() => manejarCambioSubcategoria(sub)}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                subcatActiva === sub ? 'text-blue-600 bg-blue-100/50' : 'text-gray-400 hover:text-blue-500'
                              }`}
                            >
                              • {sub}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1">
          {cargando ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-3xl border border-gray-100 shadow-sm flex-col gap-4">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
              <p className="text-xl text-gray-500 font-bold animate-pulse">Sincronizando con Supabase...</p>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <nav className="flex text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 gap-2">
                    <Link to="/" className="hover:text-blue-600">Inicio</Link>
                    <span>/</span>
                    <span className="text-blue-900">{categoriaPrincipal}</span>
                  </nav>
                  <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
                    {subcatActiva === 'Todas' ? categoriaPrincipal : subcatActiva}
                  </h2>
                </div>
                <p className="text-gray-400 font-bold text-sm bg-gray-100 px-4 py-2 rounded-full h-fit">
                  {totalProductos} Productos
                </p>
              </div>

              {totalProductos === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
                  <i className="fas fa-box-open text-6xl text-gray-200 mb-4 block"></i>
                  <h3 className="text-xl font-bold text-gray-800">No hay productos en esta categoría</h3>
                </div>
              ) : (
                <>
                  {/* Grid de productos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {productosPagina.map((producto, index) => (
                      <div key={index} className="group bg-white border border-gray-100 rounded-3xl p-5 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 flex flex-col relative overflow-hidden">
                        <Link to={`/producto/${producto.sku}`} className="flex flex-col flex-1">
                          <div className="h-52 w-full bg-gray-50 rounded-2xl mb-5 flex items-center justify-center p-6 overflow-hidden">
                            <img 
                              src={producto.imagen_url || 'https://via.placeholder.com/150'} 
                              alt={producto.nombre} 
                              className="max-h-full max-w-full object-contain mix-blend-multiply transform group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                          <h4 className="font-bold text-base text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                            {producto.nombre}
                          </h4>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase tracking-tighter">SKU: {producto.sku}</span>
                          </div>
                        </Link>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                          <span className="text-2xl font-black text-blue-900">{producto.precio}</span>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Categorias;
