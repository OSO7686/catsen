import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// Importamos el catálogo completo, no solo una variable
import { catalogoCompleto } from '../data'; 

const ITEMS_POR_PAGINA = 30;

export default function SubcategoriaDetalle() {
  // 1. Obtenemos el nombre de la subcategoría desde la URL
  const { subId } = useParams(); 
  const [paginaActual, setPaginaActual] = useState(1);

  // 2. Filtramos el catálogo para obtener SOLO los productos de esta subcategoría
  // Nota: Asegúrate que en data.js tus productos tengan la propiedad "subcategoria"
  const productosFiltrados = catalogoCompleto.filter(
    (prod) => prod.subcategoria?.toLowerCase().replace(/\s+/g, '-') === subId
  );

  // Si cambiamos de categoría, regresamos a la página 1
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

  // Si no hay productos, mostramos un aviso
  if (totalProductos === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl text-gray-600">No se encontraron productos en esta categoría.</h2>
        <Link to="/categorias" className="text-blue-600 underline">Volver al menú</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Título Dinámico basado en la URL */}
        <h1 className="text-4xl font-bold text-center mb-2 capitalize">
          {subId.replace(/-/g, ' ')}
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          Encontramos {totalProductos} productos disponibles.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productosPagina.map((producto) => (
            <div key={producto.sku} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col">
              <Link to={`/producto/${producto.sku}`}>
                <img 
                  src={producto.imagen_url || 'https://via.placeholder.com/300'} 
                  alt={producto.nombre}
                  className="w-full h-52 object-contain p-4"
                />
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
                <button className="w-full bg-blue-900 text-white py-3 rounded-lg text-sm font-bold hover:bg-blue-800">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación Dinámica */}
        {totalPaginas > 1 && (
          <div className="flex justify-center gap-2 mt-16 flex-wrap">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => cambiarPagina(num)}
                className={`w-10 h-10 rounded-lg font-bold transition ${
                  paginaActual === num ? 'bg-orange-600 text-white' : 'bg-white border hover:bg-gray-100'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}