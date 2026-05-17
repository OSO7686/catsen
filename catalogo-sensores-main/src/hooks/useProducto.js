// src/hooks/useProducto.js
import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase';

export const useProducto = (sku) => {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [variantes, setVariantes] = useState([]);

  useEffect(() => {
    if (!sku) return;

    const fetchProductoYVariantes = async () => {
      setLoading(true);
      try {
        // 1. Buscamos el producto principal
        const { data: productoData, error: productoError } = await supabase
          .from('productos_medicos_v2')
          .select('*')
          .eq('mi_sku', sku)
          .maybeSingle(); 

        if (productoError) throw productoError;

        if (productoData) {
          setProducto(productoData);

          // 2. LA SOLUCIÓN DEFINITIVA: Buscamos por la misma URL de origen
          // Esto garantiza que traigas EXACTAMENTE las mismas variantes que la competencia agrupó en esa página.
          const { data: variantesData, error: variantesError } = await supabase
            .from('productos_medicos_v2')
            .select('mi_sku, nombre, precio, imagen_url, tipo')
            .eq('url', productoData.url) // <--- Agrupamos por URL
            .neq('mi_sku', sku); 

          if (variantesError) throw variantesError;
          setVariantes(variantesData || []);
        } else {
          setProducto(null);
          setVariantes([]);
        }
      } catch (err) {
        console.error("Error al cargar el producto o variantes:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductoYVariantes();
  }, [sku]);

  return { producto, variantes, loading, error };
};