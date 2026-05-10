// src/components/HeroBanner.jsx
import { useState, useEffect } from 'react';

function HeroBanner() {
  // El "cerebro" exclusivo de este banner
  const [heroActive, setHeroActive] = useState(0);

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroActive((prev) => (prev + 1) % 2);
    }, 7000); // Cambia cada 7 segundos

    return () => clearInterval(heroInterval);
  }, []);

  // El diseño del banner
  return (
    <section className="relative overflow-hidden h-[450px] bg-black">
      <div className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${heroActive === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="container mx-auto px-4 relative text-white">
          <span className="bg-blue-600 text-xs px-3 py-1 rounded-full font-bold mb-4 inline-block">NUEVA TEMPORADA</span>
          <h2 className="text-5xl font-black mb-4 uppercase italic">Sensores SpO2<br /><span className="text-blue-400">Grado Médico</span></h2>
          <p className="text-lg mb-8 max-w-lg">Alta precisión y durabilidad garantizada para uso clínico intensivo.</p>
          <a href="#" className="bg-white text-blue-900 px-10 py-4 rounded font-black hover:bg-blue-50 transition-all uppercase tracking-widest">Comprar Ahora</a>
        </div>
      </div>
      <div className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${heroActive === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="container mx-auto px-4 relative text-white text-right ml-auto">
          <span className="bg-green-600 text-xs px-3 py-1 rounded-full font-bold mb-4 inline-block">PROMOCIÓN MAYORISTA</span>
          <h2 className="text-5xl font-black mb-4 uppercase italic">Descuentos en<br /><span className="text-green-400">Cables de ECG</span></h2>
          <p className="text-lg mb-8 max-w-lg ml-auto">Precios especiales para hospitales y clínicas en compras por volumen.</p>
          <a href="#" className="bg-green-500 text-white px-10 py-4 rounded font-black hover:bg-green-600 transition-all uppercase tracking-widest">Ver Ofertas</a>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;