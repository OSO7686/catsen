function CategoriasPrincipales() {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl font-black uppercase tracking-tighter border-l-4 border-blue-600 pl-4">Categorías Principales</h2>
        <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Ver Todo el Catálogo <i className="fas fa-arrow-right ml-1"></i></a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-8 text-center border hover:border-blue-500 transition-all group cursor-pointer">
          <i className="fas fa-fingerprint text-4xl text-gray-300 group-hover:text-blue-600 mb-4 transition-colors"></i>
          <h3 className="text-xs font-black uppercase tracking-widest">Sensores SpO2</h3>
        </div>
        <div className="bg-white p-8 text-center border hover:border-blue-500 transition-all group cursor-pointer">
          <i className="fas fa-wave-square text-4xl text-gray-300 group-hover:text-blue-600 mb-4 transition-colors"></i>
          <h3 className="text-xs font-black uppercase tracking-widest">Cables ECG</h3>
        </div>
        <div className="bg-white p-8 text-center border hover:border-blue-500 transition-all group cursor-pointer">
          <i className="fas fa-thermometer-half text-4xl text-gray-300 group-hover:text-blue-600 mb-4 transition-colors"></i>
          <h3 className="text-xs font-black uppercase tracking-widest">Temperatura</h3>
        </div>
        <div className="bg-white p-8 text-center border hover:border-blue-500 transition-all group cursor-pointer">
          <i className="fas fa-heartbeat text-4xl text-gray-300 group-hover:text-blue-600 mb-4 transition-colors"></i>
          <h3 className="text-xs font-black uppercase tracking-widest">Accesorios PANI</h3>
        </div>
      </div>
    </section>
  );
}

export default CategoriasPrincipales;