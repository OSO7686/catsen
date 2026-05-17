// src/hooks/useProductos.js
import { useState, useEffect } from 'react';

// ✅ CORRECTO: Exportación nombrada
export const useProductos = (subcategoriaId, filtrosSeleccionados, paginaActual) => {

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPaginas, setTotalPaginas] = useState(0);

  useEffect(() => {
    // Si no hay subcategoría, no hacemos nada
    if (!subcategoriaId) return;

    const fetchProductos = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('productos_medicos_v2')
          .select('*', { count: 'exact' })
          .eq('subcategoria', subcategoriaId);

        // Aplicamos los filtros JSONB si existen
        if (Object.keys(filtrosSeleccionados).length > 0) {
          query = query.contains('especificaciones', filtrosSeleccionados);
        }

        // Lógica de paginación
        const itemsPorPagina = 12;
        const desde = (paginaActual - 1) * itemsPorPagina;
        const hasta = desde + itemsPorPagina - 1;

        const { data, error, count } = await query
          .order('precio', { ascending: true })
          .range(desde, hasta);

        if (error) throw error;

        setProductos(data);
        setTotalPaginas(Math.ceil(count / itemsPorPagina));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
    
  // Este useEffect se volverá a ejecutar AUTOMÁTICAMENTE si cambias de 
  // subcategoría, si aplicas un filtro nuevo o si cambias de página.
  }, [subcategoriaId, filtrosSeleccionados, paginaActual]); 

  // Devolvemos solo la información que la UI necesita para pintarse
  return { productos, loading, totalPaginas };
};