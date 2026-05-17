import { supabase } from './supabase';

// 1. Función para Categorias Principales (Ver Todo) - USA .ilike Y APUNTA A v2
export const obtenerProductosCategoria = async (categoriaPrincipal) => {
  let todosLosProductos = [];
  let rangoInicio = 0;
  let cantidadPorLote = 1000;
  let seguirBuscando = true;

  while (seguirBuscando) {
    const { data, error } = await supabase
      .from('productos_medicos_v2') // ✅ Apunta a la tabla nueva
      .select('*')
      .ilike('categoria', categoriaPrincipal) // ✅ ignora mayúsculas/minúsculas
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

// 2. Función para Subcategorías Específicas - APUNTA A v2 Y BUSCA POR SUBCATEGORÍA
export const obtenerProductosPorSubcategoria = async (subcategoriaDb) => {
  let todosLosProductos = [];
  let rangoInicio = 0;
  let cantidadPorLote = 1000;
  let seguirBuscando = true;

  while (seguirBuscando) {
    const { data, error } = await supabase
       .from('productos_medicos_v2') // ✅ Apunta a la tabla nueva
       .select('*')
       .eq('subcategoria', subcategoriaDb) // ✅ Filtra por la subcategoría correcta
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