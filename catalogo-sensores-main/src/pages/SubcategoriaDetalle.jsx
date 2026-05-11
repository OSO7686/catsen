import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogoCompleto } from '../data';

const ITEMS_POR_PAGINA = 30;

export default function SubcategoriaDetalle() {
  const { subId } = useParams();
  const [paginaActual, setPaginaActual] = useState(1);

  // Filtrar productos por subcategoría (optimizado con useMemo)
  const productosFiltrados = useMemo(() => {
    return catalogoCompleto.filter(
      (prod) =>
        prod.subcategoria?.toLowerCase().replace(/\s+/g, '-') === subId
    );
  }, [subId]);

  // Reiniciar página al cambiar de subcategoría
  useEffect(() => {
    setPaginaActual(1);
  }, [subId]);

  const totalProductos = productosFiltrados.length;
  const totalPaginas = Math.ceil(totalProductos / ITEMS_POR_PAGINA);

  // Productos de la página actual
  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  // Cambiar página
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Lógica de paginación compacta mejorada
  const obtenerPaginas = () => {
    const paginas = [];

    if (totalPaginas <= 7) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
      return paginas;
    }

    // Primera página
    paginas.push(1);

    // Elipsis después de la primera
    if (paginaActual > 4) {
      paginas.push('...');
    }

    // Páginas centrales
    const start = Math.max(2, paginaActual - 1);
    const end = Math.min(totalPaginas - 1, paginaActual + 1);

    for (let i = start; i <= end; i++) {
      paginas.push(i);
    }

    // Elipsis antes de la última
    if (paginaActual < totalPaginas - 3) {
      paginas.push('...');
    }

    // Última página
    if (totalPaginas > 1) {
      paginas.push(totalPaginas);
    }

    return paginas;
  };

  // Si no hay productos
  if (totalProductos === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl text-gray-600">
          No se encontraron productos en esta categoría.
        </h2>
        <Link
          to="/categorias"
          className="text-blue-600 underline mt-4 inline-block"
        >
          ← Volver al menú de categorías
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Título */}
        <h1 className="text-4xl font-bold text-center mb-2 capitalize text-red-600">
          {subId.replace(/-/g, ' ')}
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Encontramos {totalProductos} productos disponibles
        </p>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productosPagina.map((producto) => (
            <div
              key={producto.sku}
              className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col"
            >
              <Link to={`/producto/${producto.sku}`}>
                <img
                  src={
                    producto.imagen_url || 'https://via.placeholder.com/300'
                  }
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

                <p className="text-xl font-bold text-blue-600 mt-3">
                  {producto.precio}
                </p>
              </div>

              <div className="p-4 pt-0">
                <button className="w-full bg-blue-900 text-white py-3 rounded-lg text-sm font-bold hover:bg-blue-800 transition">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16 flex-wrap">
            
            {/* Botón Anterior */}
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="px-4 py-2 border rounded-lg font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              &laquo; Anterior
            </button>

            {/* Números de página */}
            {obtenerPaginas().map((num, index) => (
              <button
                key={index}
                onClick={() => typeof num === 'number' && cambiarPagina(num)}
                disabled={num === '...'}
                className={`w-10 h-10 rounded-lg font-bold transition ${
                  paginaActual === num
                    ? 'bg-orange-600 text-white border-orange-600'
                    : num === '...'
                    ? 'cursor-default text-gray-400 bg-transparent border-transparent'
                    : 'bg-white border text-gray-700 hover:bg-gray-100'
                }`}
              >
                {num}
              </button>
            ))}

            {/* Botón Siguiente */}
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 border rounded-lg font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              Siguiente &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}