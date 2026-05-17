import { useState, useEffect } from 'react';
import { obtenerProductosCategoria } from '../api/productos';

// El "export const" es el que soluciona el error que estás viendo
export const useProductosCategoria = (categoriaPrincipal) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      try {
        const data = await obtenerProductosCategoria(categoriaPrincipal);
        setProductos(data);
      } catch (errorGeneral) {
        console.error("Error al descargar el catálogo:", errorGeneral);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, [categoriaPrincipal]);

  return { productos, cargando };
};