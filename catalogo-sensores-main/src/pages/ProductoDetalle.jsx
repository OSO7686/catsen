import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../store';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 

function ProductoDetalle() {
  const { id } = useParams();
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);

  const [producto, setProducto] = useState(null);
  const [variantes, setVariantes] = useState([]);
  const [varianteActiva, setVarianteActiva] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  // Nuevo estado para el selector de cantidad (igual que la competencia)
  const [cantidad, setCantidad] = useState(1);

  // Lista maestra de tus 30 tablas
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

  useEffect(() => {
    async function cargarTodaLaInformacion() {
      setCargando(true);
      setVarianteActiva(null);
      setCantidad(1);

      try {
        const promesas = tablasDeSupabase.map(tabla => 
          supabase.from(tabla).select('*')
        );
        const resultados = await Promise.all(promesas);
        const catalogoUnificado = resultados.flatMap(res => res.data || []);
        const productoEncontrado = catalogoUnificado.find(p => p.sku === id);

        if (productoEncontrado) {
          setProducto(productoEncontrado);
          // Buscamos variantes
          const listaVariantes = catalogoUnificado.filter(p => 
            p.nombre === productoEncontrado.nombre && 
            p.url === productoEncontrado.url
          );
          setVariantes(listaVariantes);
        }
      } catch (error) {
        console.error("Error cargando detalles del producto:", error);
      }
      setCargando(false);
    }
    cargarTodaLaInformacion();
  }, [id]);

  const manejarCambioCantidad = (valor) => {
    if (cantidad + valor >= 1) {
      setCantidad(cantidad + valor);
    }
  };

const agregarConCantidad = (prod) => {
    // Hacemos un ciclo para enviar la señal de "agregar" las veces exactas que marca el contador
    for (let i = 0; i < cantidad; i++) {
      agregarAlCarrito(prod);
    }
    
    // Opcional pero recomendado: regresamos el contador a 1 después de agregarlo
    // para que esté listo si quiere comprar otra cosa
    setCantidad(1);
  };

  if (cargando) {
    return (
      <div className="container mx-auto px-4 py-32 text-center flex flex-col items-center gap-4">
        <i className="fas fa-spinner fa-spin text-5xl text-blue-600"></i>
        <p className="text-xl text-gray-500 font-bold animate-pulse">Cargando ficha técnica...</p>
      </div>
    );
  }

  if (!producto) return <div className="text-center py-32 text-2xl font-bold text-gray-800">Producto no encontrado</div>;

  const actual = varianteActiva || producto;

  const parseTabla = (texto) => {
    if (!texto || texto === "Sin tabla") return [];
    return texto.split(' | ').map(item => {
      const [clave, valor] = item.split(': ');
      return { clave: clave?.trim(), valor: valor?.trim() };
    }).filter(item => item.clave && item.valor);
  };

  const specs = parseTabla(actual.especificaciones);
  const oem = parseTabla(actual.oemCross);
  const compat = parseTabla(actual.compatibility);

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* BREADCRUMBS (Migas de pan) */}
        <nav className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-8 flex gap-2">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/categorias" className="hover:text-blue-600">Medical Catalog</Link>
          <span>/</span>
          <span className="text-blue-900 truncate">{actual.nombre}</span>
        </nav>

        {/* ================= PARTE SUPERIOR: 3 COLUMNAS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          
          {/* COLUMNA 1: IMÁGENES (5 columnas de ancho) */}
          <div className="lg:col-span-5">
            <div className="border border-gray-100 rounded-lg p-8 flex items-center justify-center mb-4 relative group">
              <img 
                src={actual.imagen_url || 'https://via.placeholder.com/500'} 
                alt={actual.nombre}
                className="w-full max-h-[400px] object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              />
              {/* Botón de zoom ficticio */}
              <button className="absolute bottom-4 right-4 bg-white border border-gray-200 p-2 rounded text-gray-400 hover:text-blue-600 shadow-sm">
                <i className="fas fa-search-plus"></i>
              </button>
            </div>
            {/* Thumbnails (Si tuvieras más imágenes, irían aquí. Pongo 3 iguales de ejemplo de diseño) */}
            <div className="grid grid-cols-4 gap-2">
              <div className="border border-blue-600 rounded p-2 cursor-pointer opacity-100"><img src={actual.imagen_url} alt="thumb" className="h-12 w-full object-contain mix-blend-multiply" /></div>
              <div className="border border-gray-200 rounded p-2 cursor-pointer opacity-50 hover:opacity-100 transition"><img src={actual.imagen_url} alt="thumb" className="h-12 w-full object-contain mix-blend-multiply" /></div>
            </div>
          </div>

          {/* COLUMNA 2: INFO Y VARIANTES (4 columnas de ancho) */}
          <div className="lg:col-span-4 flex flex-col">
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight mb-3">
              {actual.nombre}
            </h1>
            
            {/* Estrellas y SKU */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-blue-500 text-sm">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <span className="text-sm font-bold text-gray-500">Part Number: <span className="text-gray-900">{actual.sku}</span></span>
            </div>

            <div className="border-t border-gray-100 mb-6"></div>

            {/* GRID DE VARIANTES (Igual al de la competencia) */}
            {variantes.length > 1 && (
              <div>
                <h3 className="font-bold text-gray-800 text-sm mb-3">Opciones Disponibles:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {variantes.map((v, i) => {
                    const isActive = actual.sku === v.sku;
                    return (
                      <button
                        key={i}
                        onClick={() => setVarianteActiva(v)}
                        className={`p-3 border text-left flex flex-col transition-all duration-200 ${
                          isActive 
                            ? 'border-blue-600 shadow-[0_0_0_1px_rgba(37,99,235,1)] bg-blue-50/30' 
                            : 'border-gray-200 bg-white hover:border-gray-400'
                        }`}
                      >
                        <span className={`text-[11px] font-bold uppercase ${isActive ? 'text-blue-900' : 'text-gray-500'}`}>
                          {v.tipo || `Opción ${i + 1}`}
                        </span>
                        <span className={`font-black mt-1 ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                          {v.precio}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA 3: PRECIO Y CHECKOUT (3 columnas de ancho) */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-100">
              
              <div className="flex justify-between items-end mb-6">
                <span className="text-sm font-bold text-gray-500">Price:</span>
                <span className="text-4xl font-black text-blue-600">{actual.precio}</span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-800">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded bg-white">
                  <button onClick={() => manejarCambioCantidad(-1)} className="px-3 py-1 text-gray-500 hover:text-blue-600 transition">-</button>
                  <span className="w-8 text-center font-bold text-sm">{cantidad}</span>
                  <button onClick={() => manejarCambioCantidad(1)} className="px-3 py-1 text-gray-500 hover:text-blue-600 transition">+</button>
                </div>
              </div>
              
              <div className="text-right text-xs font-bold text-green-600 mb-6">
                <i className="fas fa-check-circle mr-1"></i> In stock
              </div>

              <button 
                onClick={() => agregarConCantidad(actual)}
                className="w-full bg-blue-600 hover:bg-blue-800 text-white py-4 rounded font-black uppercase tracking-widest transition-colors mb-6 shadow-md shadow-blue-200 flex items-center justify-center gap-2"
              >
                <i className="fas fa-shopping-cart"></i> Add to Cart
              </button>

              {/* LISTA DE BENEFICIOS (Value Props) */}
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <i className="fas fa-piggy-bank text-blue-600 mt-0.5 w-4 text-center"></i>
                  <div>
                    <strong className="block text-gray-900 uppercase">Up to 50% Savings</strong>
                    <span className="text-gray-500">Quality compatibles save you money.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-shield-alt text-blue-600 mt-0.5 w-4 text-center"></i>
                  <div>
                    <strong className="block text-gray-900 uppercase">100% Guaranteed Compatible</strong>
                    <span className="text-gray-500">Works like the OEM or your money back.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-truck-fast text-blue-600 mt-0.5 w-4 text-center"></i>
                  <div>
                    <strong className="block text-gray-900 uppercase">Expedited Shipping</strong>
                    <span className="text-gray-500">Order now, ships when available.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fas fa-box-open text-blue-600 mt-0.5 w-4 text-center"></i>
                  <div>
                    <strong className="block text-gray-900 uppercase">Easy Returns</strong>
                    <span className="text-gray-500">Hassle-free 30 day return policy.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ================= PARTE INFERIOR: TABLAS TÉCNICAS ================= */}
        <div className="border-t border-gray-200 pt-12">
          
          {/* TABLA: OEM CROSS REFERENCE */}
          {oem.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-black text-gray-900 mb-6">OEM Part Number Cross References:</h2>
              <div className="border-b-2 border-gray-800 pb-2 flex text-sm font-bold text-gray-800 mb-4">
                <div className="w-1/3">Manufacturer</div>
                <div className="w-2/3">OEM Part #</div>
              </div>
              <div className="flex flex-col">
                {oem.map((item, i) => (
                  <div key={i} className="flex text-sm py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="w-1/3 font-bold text-gray-700 pr-4">{item.clave}</div>
                    <div className="w-2/3 text-gray-600">{item.valor}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TABLA: COMPATIBILITY */}
          {compat.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-black text-gray-900 mb-6">Compatibility:</h2>
              <div className="border-b-2 border-gray-800 pb-2 flex text-sm font-bold text-gray-800 mb-4">
                <div className="w-1/3">Manufacturer</div>
                <div className="w-2/3">Model</div>
              </div>
              <div className="flex flex-col">
                {compat.map((item, i) => (
                  <div key={i} className="flex text-sm py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="w-1/3 font-bold text-gray-700 pr-4">{item.clave}</div>
                    <div className="w-2/3 text-gray-600 leading-relaxed">{item.valor}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TABLA: TECHNICAL SPECIFICATIONS */}
          {specs.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-black text-gray-900 mb-6">Technical Specifications:</h2>
              <div className="flex flex-col border-t border-gray-200 pt-2">
                {specs.map((item, i) => (
                  <div key={i} className="flex text-sm py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="w-1/3 font-bold text-gray-700 pr-4">{item.clave}</div>
                    <div className="w-2/3 text-gray-600">{item.valor}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;