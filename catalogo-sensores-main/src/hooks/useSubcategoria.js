import { useState, useEffect, useMemo } from 'react';
import { obtenerProductosPorSubcategoria } from '../api/productos';

export const useSubcategoria = (subcategoriaDb) => {
  const [productosCrudos, setProductosCrudos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState({});

  useEffect(() => {
    async function obtenerDatos() {
      setCargando(true);
      setFiltrosSeleccionados({});
      try {
        const data = await obtenerProductosPorSubcategoria(subcategoriaDb);
        setProductosCrudos(data || []);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setCargando(false);
      }
    }
    if (subcategoriaDb) obtenerDatos();
  }, [subcategoriaDb]);

  // 🧠 EXTRACCIÓN DINÁMICA DE FILTROS
  const filtrosDisponibles = useMemo(() => {
    const opciones = {};
    
    // Aquí ponemos lo que NO queremos que sea un filtro visual
    const ignorar = ["certifications", "warranty", "weight", "category", "latex-free", "sterile", "packaging type", "packaging unit", "lead cable diameter", "lead cable material", "trunk cable material"];

    productosCrudos.forEach(prod => {
      // 1. Extraer Patient Connector (Si viene en la columna 'tipo')
      const patientConnector = prod.tipo?.trim();
      if (patientConnector && patientConnector !== "") {
        if (!opciones["Patient Connector"]) opciones["Patient Connector"] = {};
        opciones["Patient Connector"][patientConnector] = (opciones["Patient Connector"][patientConnector] || 0) + 1;
      }

      // 2. Extraer especificaciones del JSON
      let specs = prod.especificaciones;
      
      // 🛡️ ESCUDO: Si Supabase lo manda como texto, lo convertimos a Objeto JSON
      if (typeof specs === 'string') {
        try {
          specs = JSON.parse(specs);
        } catch (e) {
          specs = null; // Si no es un JSON válido, lo ignoramos
        }
      }

      // Si tenemos un objeto válido, extraemos sus llaves
      if (specs && typeof specs === 'object') {
        Object.entries(specs).forEach(([clave, valor]) => {
          // Solo procesamos si no está en la lista de ignorados
          if (clave && valor && !ignorar.includes(clave.toLowerCase())) {
            // Renombramos "Technology" a algo más claro si es necesario
            const nombreFiltro = clave === "Technology" ? "SpO2 Technology" : clave;
            
            if (!opciones[nombreFiltro]) opciones[nombreFiltro] = {};
            opciones[nombreFiltro][valor] = (opciones[nombreFiltro][valor] || 0) + 1;
          }
        });
      }
    });

    // Formatear el resultado para que la interfaz lo pueda leer fácilmente
    const resultadoFormateado = {};
    for (const key in opciones) {
      if (Object.keys(opciones[key]).length > 0) { 
        resultadoFormateado[key] = Object.entries(opciones[key])
          .map(([nombre, cantidad]) => ({ nombre, cantidad }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
      }
    }
    return resultadoFormateado;
  }, [productosCrudos]);

  // 🕹️ LÓGICA DE SELECCIÓN DE CHECKBOXES
  const manejarFiltro = (categoriaFiltro, valor) => {
    setFiltrosSeleccionados(prev => {
      const seleccionadosActuales = prev[categoriaFiltro] || [];
      if (seleccionadosActuales.includes(valor)) {
        const nuevos = seleccionadosActuales.filter(v => v !== valor);
        if (nuevos.length === 0) {
           const copia = {...prev};
           delete copia[categoriaFiltro];
           return copia;
        }
        return { ...prev, [categoriaFiltro]: nuevos };
      } else {
        return { ...prev, [categoriaFiltro]: [...seleccionadosActuales, valor] };
      }
    });
  };

  const limpiarFiltros = () => setFiltrosSeleccionados({});

  // ⚙️ APLICACIÓN DE FILTROS A LOS PRODUCTOS
  const productosFiltrados = useMemo(() => {
    if (Object.keys(filtrosSeleccionados).length === 0) return productosCrudos;

    return productosCrudos.filter(prod => {
      return Object.entries(filtrosSeleccionados).every(([catFiltro, valoresSeleccionados]) => {
        
        if (catFiltro === "Patient Connector") {
          return valoresSeleccionados.includes(prod.tipo?.trim());
        }

        // Parsear de nuevo para leer y filtrar
        let specs = prod.especificaciones;
        if (typeof specs === 'string') {
          try { specs = JSON.parse(specs); } catch(e) { specs = null; }
        }

        if (!specs) return false;
        
        let valorDelProducto = specs[catFiltro];
        
        // Manejo especial si renombramos la categoría
        if (catFiltro === "SpO2 Technology" && !valorDelProducto) {
           valorDelProducto = specs["Technology"];
        }

        return valoresSeleccionados.includes(valorDelProducto);
      });
    });
  }, [productosCrudos, filtrosSeleccionados]);

  return {
    productosFiltrados,
    filtrosDisponibles,
    filtrosSeleccionados,
    manejarFiltro,
    limpiarFiltros,
    cargando
  };
};