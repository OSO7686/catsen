import { useState } from 'react';
import { directConnect } from '../data';
import { Link } from 'react-router-dom';

const ITEMS_POR_PAGINA = 30;

export default function DirectConectSp02() {
  const [paginaActual, setPaginaActual] = useState(1);

  const totalProductos = directConnect.length;
  const totalPaginas = Math.ceil(totalProductos / ITEMS_POR_PAGINA);

  const productosPagina = directConnect.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2">Direct-Connect SpO2 Sensors</h1>
        
        <p className="text-center text-gray-600 mb-8">
          Total: {totalProductos} productos | Mostrando página {paginaActual} de {totalPaginas} 
          ({productosPagina.length} productos)
        </p>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productosPagina.map((producto, index) => (
            <div key={index} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all">
              <Link to={`/producto/${producto.sku}`}>
                <img 
                  src={producto.imagen_url} 
                  alt={producto.nombre}
                  className="w-full h-52 object-contain p-4"
                />
              </Link>
              <div className="p-4">
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

        {/* PAGINACIÓN - Siempre visible */}
        <div className="flex justify-center gap-3 mt-16 flex-wrap">
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
                ${paginaActual === numero ? 'bg-orange-600 text-white border-orange-600' : 'hover:bg-gray-100'}`}
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
      </div>
    </div>
  );
}