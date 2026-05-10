import { useParams } from 'react-router-dom';
import { useCartStore } from '../store';
import { catalogoCompleto } from '../data';
import { useState } from 'react';

function ProductoDetalle() {
  const { id } = useParams();
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);

  const producto = catalogoCompleto.find(p => p.sku === id);
  const [varianteActiva, setVarianteActiva] = useState(null);

  if (!producto) return <div className="text-center py-20 text-xl">Producto no encontrado</div>;

  const variantes = catalogoCompleto.filter(p => p.nombre === producto.nombre && p.url === producto.url);
  const actual = varianteActiva || variantes[0] || producto;

  // Función para convertir texto de tabla en array de objetos
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
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-12">

        {/* Imagen */}
        <div>
          <img 
            src={actual.imagen_url} 
            alt={actual.nombre}
            className="w-full max-h-[520px] object-contain border rounded-2xl shadow-sm"
          />
        </div>

        {/* Detalles */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{actual.nombre}</h1>
          <p className="text-gray-500 text-lg">SKU: <span className="font-mono">{actual.sku}</span></p>

          <p className="text-5xl font-black text-blue-600 mt-4 mb-8">{actual.precio}</p>

          {/* Variantes */}
          {variantes.length > 1 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3">Variantes disponibles:</h3>
              <div className="grid grid-cols-2 gap-3">
                {variantes.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setVarianteActiva(v)}
                    className={`p-4 border-2 rounded-2xl text-left transition-all hover:border-blue-600 ${actual.sku === v.sku ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <div className="font-medium">{v.tipo}</div>
                    <div className="text-xl font-bold text-blue-600">{v.precio}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => agregarAlCarrito(actual)}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-2xl font-bold text-lg mb-10 transition"
          >
            🛒 Agregar al Carrito
          </button>

          {/* ESPECIFICACIONES TÉCNICAS */}
          {specs.length > 0 && (
            <div className="mb-10">
              <h3 className="font-bold text-2xl mb-4 flex items-center gap-2">
                📋 Especificaciones Técnicas
              </h3>
              <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-1 gap-y-3 text-sm">
                {specs.map((item, i) => (
                  <div key={i} className="flex justify-between border-b pb-2 last:border-0">
                    <span className="font-medium text-gray-700">{item.clave}</span>
                    <span className="text-right">{item.valor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OEM CROSS REFERENCE */}
          {oem.length > 0 && (
            <div className="mb-10">
              <h3 className="font-bold text-2xl mb-4 flex items-center gap-2">
                🔗 OEM Part Number Cross Reference
              </h3>
              <div className="bg-gray-50 rounded-2xl p-6 text-sm leading-relaxed">
                {actual.oemCross}
              </div>
            </div>
          )}

          {/* COMPATIBILITY */}
          {compat.length > 0 && (
            <div>
              <h3 className="font-bold text-2xl mb-4">🔄 Compatibility</h3>
              <div className="bg-gray-50 rounded-2xl p-6 text-sm leading-relaxed">
                {actual.compatibility}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;