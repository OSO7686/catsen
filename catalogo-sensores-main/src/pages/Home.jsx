// src/pages/Home.jsx
import '../index.css';

// Fíjate en los dos puntitos ../ para buscar la carpeta components
import TopBanner from '../components/TopBanner';
import HeroBanner from '../components/HeroBanner';
import CarruselMarcas from '../components/CarruselMarcas';
import CategoriasPrincipales from '../components/CategoriasPrincipales';
import ProductosDestacados from '../components/ProductosDestacados';
import SeccionMayoristas from '../components/SeccionMayoristas';
import Footer from '../components/Footer';

function Home() { // Le cambiamos el nombre de App a Home
  return (
    <div className="bg-gray-50 font-sans text-gray-900">
      <TopBanner />
      <HeroBanner />
      <CarruselMarcas />
      <CategoriasPrincipales />
      <ProductosDestacados />
      <SeccionMayoristas />
      <Footer />
    </div>
  );
}

export default Home;