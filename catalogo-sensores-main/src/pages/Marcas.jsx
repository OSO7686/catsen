import Header from '../components/Header';
import Footer from '../components/Footer';

function Marcas() {
  return (
    <div className="bg-gray-50 font-sans text-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-black text-blue-900 mb-6 uppercase tracking-tighter">Marcas Compatibles</h1>
        <p className="text-gray-600">Sensores compatibles con Philips, Mindray, Masimo y más.</p>
      </main>
      <Footer />
    </div>
  );
}

export default Marcas;
