import { useState, useEffect } from 'react';
import { catalogoCompleto } from '../data';
import { useCartStore } from '../store';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const mainCategories = [
  { nombre: 'SpO2', icon: 'fas fa-fingerprint' },
  { nombre: 'ECG Cables', icon: 'fas fa-wave-square' },
  { nombre: 'EKG Cables', icon: 'fas fa-heartbeat' },
  { nombre: 'NIBP', icon: 'fas fa-stethoscopes' },
  { nombre: 'IBP Cables', icon: 'fas fa-tint' },
  { nombre: 'Temperature', icon: 'fas fa-thermometer-half' },
  { nombre: 'Fetal', icon: 'fas fa-baby' },
  { nombre: 'Oxygen Sensors', icon: 'fas fa-lungs' },
];

function Categorias() {
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const categoriaPrincipal = searchParams.get('tipo') || 'SpO2';

  const [subcatActiva, setSubcatActiva] = useState('Todas');
  const [paginaActual, setPaginaActual] = useState(1);

  const ITEMS_POR_PAGINA = 30;

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
          {/* Aquí aplicamos la altura máxima (max-h-[75vh]) y flex-col */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col max-h-[75vh]">
            
            {/* El encabezado se queda fijo (shrink-0) */}
            <div className="bg-blue-900 p-4 shrink-0 rounded-t-2xl">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">Navegación de Catálogo</h3>
            </div>
            
            {/* La lista tiene overflow-y-auto para scrollear si es muy larga */}
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

                    {estaActiva && (
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

          {/* PAGINACIÓN COMPACTA */}
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
        </main>
      </div>
    </div>
  );
}

export default Categorias;