import { useState, useEffect } from 'react';
import { useCartStore } from '../store';
import { Link } from 'react-router-dom';
// 1. IMPORTAMOS SUPABASE
import { supabase } from '../supabaseClient';

function ProductosDestacados() {
  const [prodActive, setProdActive] = useState(0);
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  
  // 2. NUEVOS ESTADOS PARA SUPABASE
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 3. EFECTO PARA TRAER SOLO 6 PRODUCTOS DESDE SUPABASE
  useEffect(() => {
    async function obtenerDestacados() {
      // Como solo quieres mostrar algunos para el carrusel, 
      // podemos jalar de una sola tabla (ej. los primeros 6 de spo2)
      // o usar .limit(6) para no sobrecargar la red.
      const { data, error } = await supabase
        .from('spo2_direct_connect_sensors') // Puedes cambiar la tabla por la que quieras destacar
        .select('*')
        .limit(6);

      if (!error && data) {
        setProductosDestacados(data);
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

  // 4. USAMOS EL ESTADO EN LUGAR DE LA VARIABLE BORRADA
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
        <h2 className="text-xl font-black uppercase tracking-tighter mb-10 text-center">Products Destacados</h2>
        
        <div className="relative">
          <div className="flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${prodActive * 100}%)` }}>
            
            {/* --- DIAPOSITIVA 1 --- */}
            <div className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {primerBloque.map((producto, index) => (
                <div key={index} className="border p-6 rounded hover:shadow-lg transition-shadow bg-white flex flex-col group">
                  <Link to={`/producto/${producto.sku}`} className="flex flex-col flex-1 cursor-pointer">
                    <img 
                      src={producto.imagen_url || 'https://via.placeholder.com/150'} 
                      alt={producto.nombre} 
                      className="h-40 w-full object-contain mb-4 rounded transform group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                    />
                    <h4 className="font-bold text-sm mb-1 uppercase group-hover:text-blue-600 transition-colors">{producto.nombre}</h4>
                    <p className="text-xs text-gray-500 mb-2">Modelo: {producto.sku}</p>
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
              {segundoBloque.map((producto, index) => (
                <div key={index} className="border p-6 rounded hover:shadow-lg transition-shadow bg-white flex flex-col group">
                  <Link to={`/producto/${producto.sku}`} className="flex flex-col flex-1 cursor-pointer">
                    <img 
                      src={producto.imagen_url || 'https://via.placeholder.com/150'} 
                      alt={producto.nombre} 
                      className="h-40 w-full object-contain mb-4 rounded transform group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                    />
                    <h4 className="font-bold text-sm mb-1 uppercase group-hover:text-blue-600 transition-colors">{producto.nombre}</h4>
                    <p className="text-xs text-gray-500 mb-2">Modelo: {producto.sku}</p>
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