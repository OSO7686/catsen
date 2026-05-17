import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 📂 RUTAS ACTUALIZADAS (Apuntan a las nuevas subcarpetas que creamos)
import BotonWhatsapp from './components/common/BotonWhatsapp';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop'; 

// 📄 PÁGINAS (Estas se quedan igual porque la carpeta pages no cambió)
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Tienda from './pages/Tienda';
import Categorias from './pages/Categorias';
import Marcas from './pages/Marcas';
import Promociones from './pages/Promociones';
import Nuevos from './pages/Nuevos';
import ProductoDetalle from './pages/ProductoDetalle';
import SubcategoriaDetalle from './pages/SubcategoriaDetalle';
import Busqueda from './pages/Busqueda';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> {/* <-- 2. Ponlo aquí, arriba de todo */}
      
      <Header /> 

      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/marcas" element={<Marcas />} />
          <Route path="/promociones" element={<Promociones />} />
          <Route path="/nuevos" element={<Nuevos />} />
          <Route path="/buscar" element={<Busqueda />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/subcategoria/:subId" element={<SubcategoriaDetalle />} />
        </Routes>
      </main>

      <Footer />
      <BotonWhatsapp />
    </BrowserRouter>
  );
}

export default App;