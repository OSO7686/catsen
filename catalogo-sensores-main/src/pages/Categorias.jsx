import { useState, useEffect } from 'react';
import { catalogoCompleto } from '../data';
import { useCartStore } from '../store';
import { Link, useSearchParams } from 'react-router-dom';

function Categorias() {
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  
  const [searchParams] = useSearchParams();
  const categoriaPrincipal = searchParams.get('tipo') || 'SpO2';

  const [subcatActiva, setSubcatActiva] = useState('Todas');
  const [paginaActual, setPaginaActual] = useState(1);

  const ITEMS_POR_PAGINA = 30;

  useEffect(() => {
    setSubcatActiva('Todas');
    setPaginaActual(1);
  }, [categoriaPrincipal]);

  // Filtros
  const productosDeLaCategoria = catalogoCompleto.filter(prod => prod.categoria === categoriaPrincipal);

  const productosFiltrados = subcatActiva === 'Todas' 
    ? productosDeLaCategoria 
    : productosDeLaCategoria.filter(prod => prod.subcategoria === subcatActiva);

  // Paginación
  const totalProductos = productosFiltrados.length;
  const totalPaginas = Math.ceil(totalProductos / ITEMS_POR_PAGINA);

  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const subcategoriasUnicas = [...new Set(productosDeLaCategoria.map(p => p.subcategoria))].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      
      {/* BARRA LATERAL */}
      <aside className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit">
        <h3 className="font-black text-xl mb-4 uppercase text-gray-800">{categoriaPrincipal}</h3>
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => setSubcatActiva('Todas')}
              className={`w-full text-left px-2 py-1 rounded transition-colors ${subcatActiva === 'Todas' ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              Ver Todos
            </button>
          </li>
          
          {subcategoriasUnicas.map(sub => (
            <li key={sub}>
              <button 
                onClick={() => setSubcatActiva(sub)}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${subcatActiva === sub ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {sub}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="w-full md:w-3/4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {subcatActiva === 'Todas' ? `Catálogo de ${categoriaPrincipal}` : subcatActiva}
          </h2>
          <span className="text-gray-500 text-sm">{totalProductos} productos</span>
        </div>

        {/* Grid de productos (solo la página actual) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosPagina.map((producto, index) => (
            <div key={index} className="border p-4 rounded-lg hover:shadow-xl transition-shadow bg-white flex flex-col group">
              <Link to={`/producto/${producto.sku}`} className="flex flex-col flex-1 cursor-pointer">
                <img 
                  src={producto.imagen_url || 'https://via.placeholder.com/150'} 
                  alt={producto.nombre} 
                  className="h-48 w-full object-contain mb-4 rounded transform group-hover:scale-105 transition-transform duration-300"
                />
                <h4 className="font-bold text-sm mb-1 uppercase text-gray-800 group-hover:text-blue-600 transition-colors">
                  {producto.nombre}
                </h4>
                <p className="text-xs text-gray-500 mb-2">Modelo: {producto.sku}</p>
              </Link>
              <p className="text-blue-600 font-black mb-4 mt-auto">{producto.precio}</p>
              <button 
                onClick={() => agregarAlCarrito(producto)}
                className="w-full bg-blue-900 text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-blue-800 rounded relative z-10"
              >
                Agregar al Carrito
              </button>
            </div>
          ))}
        </div>

        {/* PAGINACIÓN */}
        {totalPaginas > 1 && (
          <div className="flex justify-center gap-3 mt-12 flex-wrap">
            <button 
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="px-6 py-3 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
            >
              ← Anterior
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
              <button
                key={numero}
                onClick={() => cambiarPagina(numero)}
                className={`w-11 h-11 border rounded-lg font-medium transition
                  ${paginaActual === numero ? 'bg-orange-600 text-white' : 'hover:bg-gray-100'}`}
              >
                {numero}
              </button>
            ))}

            <button 
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="px-6 py-3 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
            >
              Siguiente →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Categorias;