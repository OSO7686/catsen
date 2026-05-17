import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../api/supabase'; 

export default function Busqueda() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; 
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
   
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(false); // Inicia en false
  const [paginaActual, setPaginaActual] = useState(1);
  const ITEMS_POR_PAGINA = 30;

  // ESTE ES EL ÚNICO LUGAR DONDE HABLAMOS CON SUPABASE
  useEffect(() => {
    async function realizarBusqueda() {
      const terminoBusqueda = query.trim().toLowerCase();

      // Si no hay nada escrito, no buscamos nada
      if (!terminoBusqueda) {
        setProductosFiltrados([]);
        return;
      }

      setCargando(true);

      try {
        // Le preguntamos a la nueva tabla unificada
        const { data, error } = await supabase
          .from('productos_medicos')
          .select('*')
          .or(`nombre.ilike.%${terminoBusqueda}%,mi_sku.ilike.%${terminoBusqueda}%`);

        if (error) throw error;
        
        // Guardamos los resultados
        setProductosFiltrados(data || []);
      } catch (error) {
        console.error("Error en la base de datos:", error);
      }

      setPaginaActual(1);
      setCargando(false);
    }

    realizarBusqueda();
  }, [query]);

  // Lógica de Paginación
  const totalProductos = productosFiltrados.length;
  const totalPaginas = Math.ceil(totalProductos / ITEMS_POR_PAGINA);
  const productosPagina = productosFiltrados.slice((paginaActual - 1) * ITEMS_POR_PAGINA, paginaActual * ITEMS_POR_PAGINA);

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-2">
          Resultados de Búsqueda
        </h1>
        {query && (
          <p className="text-gray-500">
            Encontramos <span className="font-bold text-blue-600">{totalProductos}</span> productos para "{query}"
          </p>
        )}
      </div>

      {cargando ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 font-bold animate-pulse">Buscando...</p>
        </div>
      ) : totalProductos === 0 && query ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No se encontraron productos</h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosPagina.map((producto) => (
              <div key={producto.mi_sku} className="bg-white border rounded-3xl p-5 hover:shadow-xl flex flex-col">
                <Link to={`/producto/${producto.mi_sku}`}>
                  <img src={producto.imagen_url} alt={producto.nombre} className="h-48 w-full object-contain mb-4 mix-blend-multiply" />
                  <h4 className="font-bold text-sm text-gray-800 line-clamp-2 mb-2">{producto.nombre}</h4>
                  <p className="text-xs text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded font-bold">SKU: {producto.mi_sku}</p>
                </Link>
                <div className="mt-auto pt-4 flex justify-between items-center">
                  <span className="text-xl font-black text-blue-900">{producto.precio}</span>
                  <button onClick={() => agregarAlCarrito(producto)} className="bg-blue-900 text-white p-3 rounded-xl">
                    <i className="fas fa-cart-plus"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de página sencillos */}
          {totalPaginas > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button onClick={() => setPaginaActual(p => Math.max(1, p - 1))} className="px-4 py-2 border rounded">Atrás</button>
              <span className="px-4 py-2 font-bold">Página {paginaActual} de {totalPaginas}</span>
              <button onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))} className="px-4 py-2 border rounded">Siguiente</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}