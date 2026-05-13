const nuevosData = [
  { id: 1, nombre: 'Sensor SpO2 Neo/Ped Desechable', precio: '$350.00 MXN', fabricante: 'Compatible Philips' },
  { id: 2, nombre: 'Cable ECG 3 Puntas tipo Clip', precio: '$1,100.00 MXN', fabricante: 'Compatible Mindray' },
  { id: 3, nombre: 'Brazalete NIBP Neonatal', precio: '$250.00 MXN', fabricante: 'Universal' },
];

function Nuevos() {
  return (
    <div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">

      {/* Banner de Título (Diseño diferente para Nuevos) */}
      <div className="bg-teal-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">
            Nuevos <span className="text-teal-300">Lanzamientos</span>
          </h1>
          <p className="mt-2 text-teal-100">Las adiciones más recientes a nuestro catálogo de conectividad médica.</p>
        </div>
      </div>

      {/* Contenedor Principal */}
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
        
        {/* BARRA LATERAL (Filtros técnicos) */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white p-6 border rounded shadow-sm sticky top-24">
            <h3 className="font-black uppercase tracking-widest text-sm mb-6 border-b pb-2">Filtro de Novedades</h3>
            
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Búsqueda rápida</label>
              <input type="text" placeholder="Ej. Sensor SpO2..." className="w-full border-2 border-gray-100 rounded py-2 px-3 focus:border-teal-500 outline-none text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Marca Compatible</label>
              <select className="w-full border-2 border-gray-100 rounded py-2 px-3 focus:border-teal-500 outline-none text-sm bg-white cursor-pointer">
                <option>Todas las marcas</option>
                <option>Philips</option>
                <option>Mindray</option>
                <option>GE Medical</option>
                <option>Masimo</option>
              </select>
            </div>

            <button className="w-full bg-teal-600 text-white font-bold py-2 rounded text-xs uppercase tracking-widest hover:bg-teal-700 mt-4">
              Mostrar Resultados
            </button>
          </div>
        </aside>

        {/* CUADRÍCULA DE PRODUCTOS NUEVOS */}
        <section className="w-full md:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {nuevosData.map((producto) => (
              <div key={producto.id} className="bg-white border rounded p-6 relative hover:shadow-lg transition-shadow group border-t-4 border-t-teal-500">
                {/* Etiqueta Verde de "NUEVO" */}
                <div className="absolute top-4 right-4 bg-teal-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest z-10 shadow-sm animate-pulse">
                  NUEVO
                </div>
                
                <div className="h-40 bg-gray-50 flex items-center justify-center mb-4 font-bold text-gray-300">
                  [IMAGEN]
                </div>
                
                <h4 className="font-bold text-sm mb-1 uppercase text-gray-800">{producto.nombre}</h4>
                <p className="text-xs text-gray-500 mb-2">{producto.fabricante}</p>
                
                <div className="text-teal-700 font-black text-lg mb-4">{producto.precio}</div>
                
                <button className="w-full bg-white border-2 border-teal-700 text-teal-700 py-2 text-xs font-bold uppercase tracking-widest hover:bg-teal-700 hover:text-white transition-colors">
                  Ver Detalles
                </button>
              </div>
            ))}

          </div>
        </section>

      </main>
    </div>
  );
}

export default Nuevos;  