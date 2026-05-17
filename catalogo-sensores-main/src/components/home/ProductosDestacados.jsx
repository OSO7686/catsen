import { useState, useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { Link } from 'react-router-dom';
import { supabase } from '../../api/supabase';

function ProductosDestacados() {
  const [prodActive, setProdActive] = useState(0);
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // EFECTO PARA TRAER SOLO 6 PRODUCTOS DE TU NUEVA TABLA MAESTRA
  useEffect(() => {
    async function obtenerDestacados() {
      try {
        // Pedimos los primeros 6 productos a la tabla unificada
        // Puedes cambiar el '.limit(6)' si quieres mostrar más, o agregar un '.eq("categoria", "SpO2")' 
        // si quieres destacar solo de una categoría específica.
        const { data, error } = await supabase
          .from('productos_medicos')
          .select('*')
          .limit(6);

        if (error) throw error;
        
        if (data) {
          setProductosDestacados(data);
        }
      } catch (error) {
        console.error("Error cargando productos destacados:", error);
      }
      setCargando(false);
    }

    obtenerDestacados();
  }, []);

  // Animación del slider (intacta)
  useEffect(() => {
    const prodInterval = setInterval(() => {
      setProdActive((prev) => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(prodInterval);
  }, []);

  const primerBloque = productosDestacados.slice(0, 3);
  const segundoBloque = productosDestacados.slice(3, 6);

  if (cargando) {
    return (
      <section className="py-16 bg-white overflow-hidden text-center">
        <p className="text-gray-500 animate-pulse font-bold">Cargando productos destacados...</p>
      </section>
    );
  }

  // Si no hay productos suficientes, no mostramos el slider
  if (productosDestacados.length === 0) return null;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-black uppercase tracking-tighter mb-10 text-center">Productos Destacados</h2>
        
        <div className="relative">
          <div className="flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${prodActive * 100}%)` }}>
            
            {/* --- DIAPOSITIVA 1 --- */}
            <div className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {primerBloque.map((producto) => (
                <div key={producto.mi_sku} className="border p-6 rounded hover:shadow-lg transition-shadow bg-white flex flex-col group">
                  
                  {/* ENLACE ACTUALIZADO */}
                  <Link to={`/producto/${producto.mi_sku}`} className="flex flex-col flex-1 cursor-pointer">
                    <img 
                      src={producto.imagen_url || 'https://via.placeholder.com/150'} 
                      alt={producto.nombre} 
                      className="h-40 w-full object-contain mb-4 rounded transform group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                    />
                    <h4 className="font-bold text-sm mb-1 uppercase group-hover:text-blue-600 transition-colors">{producto.nombre}</h4>
                    {/* SKU ACTUALIZADO */}
                    <p className="text-xs text-gray-500 mb-2">SKU: <span className="text-blue-600 font-bold">{producto.mi_sku}</span></p>
                  </Link>
                  
                  <p className="text-blue-600 font-black mb-4 mt-auto">{producto.precio}</p>
                  <button 
                    onClick={() => agregarAlCarrito(producto)}
                    className="w-full bg-blue-900 text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-blue-800"
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>

            {/* --- DIAPOSITIVA 2 --- */}
            <div className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {segundoBloque.map((producto) => (
                <div key={producto.mi_sku} className="border p-6 rounded hover:shadow-lg transition-shadow bg-white flex flex-col group">
                  
                  {/* ENLACE ACTUALIZADO */}
                  <Link to={`/producto/${producto.mi_sku}`} className="flex flex-col flex-1 cursor-pointer">
                    <img 
                      src={producto.imagen_url || 'https://via.placeholder.com/150'} 
                      alt={producto.nombre} 
                      className="h-40 w-full object-contain mb-4 rounded transform group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                    />
                    <h4 className="font-bold text-sm mb-1 uppercase group-hover:text-blue-600 transition-colors">{producto.nombre}</h4>
                    {/* SKU ACTUALIZADO */}
                    <p className="text-xs text-gray-500 mb-2">SKU: <span className="text-blue-600 font-bold">{producto.mi_sku}</span></p>
                  </Link>
                  
                  <p className="text-blue-600 font-black mb-4 mt-auto">{producto.precio}</p>
                  <button 
                    onClick={() => agregarAlCarrito(producto)}
                    className="w-full bg-blue-900 text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-blue-800"
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductosDestacados;