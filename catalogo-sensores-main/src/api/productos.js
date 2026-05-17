import { supabase } from './supabase';

// 1. Esta es la función que usa Categorias.jsx (busca por categoría principal)
export const obtenerProductosCategoria = async (categoriaPrincipal) => {
  let todosLosProductos = [];
  let rangoInicio = 0;
  let cantidadPorLote = 1000;
  let seguirBuscando = true;

  while (seguirBuscando) {
    const { data, error } = await supabase
      .from('productos_medicos')
      .select('*')
      .eq('categoria', categoriaPrincipal)
      .range(rangoInicio, rangoInicio + cantidadPorLote - 1);

    if (error) throw error;

    todosLosProductos = [...todosLosProductos, ...data];

    if (data.length < cantidadPorLote) {
      seguirBuscando = false;
    } else {
      rangoInicio += cantidadPorLote;
    }
  }

  return todosLosProductos;
};

// 2. Esta es la función que usa SubcategoriaDetalle.jsx (busca por subcategoría específica en v2)
export const obtenerProductosPorSubcategoria = async (subcategoriaDb) => {
  let todosLosProductos = [];
  let rangoInicio = 0;
  let cantidadPorLote = 1000;
  let seguirBuscando = true;

  while (seguirBuscando) {
    const { data, error } = await supabase
      .from('productos_medicos_v2')
      .select('*')
      .eq('subcategoria', subcategoriaDb)
      .range(rangoInicio, rangoInicio + cantidadPorLote - 1);

    if (error) throw error;

    todosLosProductos = [...todosLosProductos, ...data];

    if (data.length < cantidadPorLote) {
      seguirBuscando = false;
    } else {
      rangoInicio += cantidadPorLote;
    }
  }

  return todosLosProductos;
};