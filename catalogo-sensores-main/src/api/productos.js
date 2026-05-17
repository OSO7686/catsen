import { supabase } from './supabase';

// 1. Función para Categorias Principales - PAGINACIÓN DESDE SUPABASE
export const obtenerProductosCategoria = async (categoriaPrincipal, pagina = 1, limite = 30) => {
  // Calculamos en qué fila empezar y terminar (Ej: Pagina 1 = 0 a 29)
  const from = (pagina - 1) * limite;
  const to = from + limite - 1;

  // Pedimos la data y agregamos { count: 'exact' } para saber el total real en la base de datos
  const { data, error, count } = await supabase
    .from('productos_medicos_v2')
    .select('*', { count: 'exact' })
    .ilike('categoria', categoriaPrincipal)
    .range(from, to);

  if (error) throw error;

  // Ahora retornamos un objeto con los productos de esa página y el total global
  return { productos: data, total: count };
};

// 2. Función para Subcategorías - PAGINACIÓN DESDE SUPABASE
export const obtenerProductosPorSubcategoria = async (subcategoriaDb, pagina = 1, limite = 30) => {
  const from = (pagina - 1) * limite;
  const to = from + limite - 1;

  const { data, error, count } = await supabase
     .from('productos_medicos_v2')
     .select('*', { count: 'exact' })
     .eq('subcategoria', subcategoriaDb)
     .range(from, to);
     
  if (error) throw error;

  return { productos: data, total: count };
};