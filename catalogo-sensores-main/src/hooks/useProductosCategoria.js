import { useState, useEffect } from 'react';
import { obtenerProductosCategoria } from '../api/productos';

export const useProductosCategoria = (categoriaPrincipal, paginaActual = 1) => {
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      try {
        
        const { productos: data, total: count } = await obtenerProductosCategoria(categoriaPrincipal, paginaActual, 30);
        setProductos(data);
        setTotal(count || 0);
      } catch (errorGeneral) {
        console.error("Error al descargar el catálogo:", errorGeneral);
      } finally {
        setCargando(false);
      }
    }
    
    if (categoriaPrincipal) cargarDatos();
  }, [categoriaPrincipal, paginaActual]);

  return { productos, total, cargando };
};