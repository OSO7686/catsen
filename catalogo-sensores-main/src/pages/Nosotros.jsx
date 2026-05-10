import Header from '../components/Header';
import Footer from '../components/Footer';

function Nosotros() {
  return (
    <div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
      <Header />
      
      {/* El contenido central de esta página */}
      <main className="flex-grow container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-black text-blue-900 mb-6 uppercase tracking-tighter">Contáctanos</h1>
        <p className="text-gray-600 mb-10 max-w-lg mx-auto">
          ¿Necesitas una cotización por volumen para tu hospital o clínica? Déjanos tus datos y un asesor especializado se pondrá en contacto contigo.
        </p>
        
        {/* Un formulario "boceto" rápido */}
        <form className="max-w-md mx-auto bg-white p-8 border rounded shadow-sm text-left">
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nombre completo</label>
            <input type="text" className="w-full border-2 border-gray-100 rounded py-2 px-4 focus:border-blue-500 outline-none" />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Hospital o Clínica</label>
            <input type="text" className="w-full border-2 border-gray-100 rounded py-2 px-4 focus:border-blue-500 outline-none" />
          </div>
          <button className="w-full bg-blue-600 text-white font-black py-3 rounded uppercase tracking-widest hover:bg-blue-700 mt-4">
            Enviar Mensaje
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default Nosotros;
