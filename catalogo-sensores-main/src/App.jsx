import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BotonWhatsapp from './components/BotonWhatsapp';
import Header from './components/Header';

// Importamos todas las páginas
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Tienda from './pages/Tienda';
import Categorias from './pages/Categorias';
import Marcas from './pages/Marcas';
import Promociones from './pages/Promociones';
import Nuevos from './pages/Nuevos';
import ProductoDetalle from './pages/ProductoDetalle';
import SubcategoriaDetalle from './pages/SubcategoriaDetalle';

function App() {
  return (
    <BrowserRouter>
      <Header /> 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/marcas" element={<Marcas />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/nuevos" element={<Nuevos />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/subcategoria/:subId" element={<SubcategoriaDetalle />} />

      </Routes>

      <BotonWhatsapp />
    </BrowserRouter>
  );
}

export default App;