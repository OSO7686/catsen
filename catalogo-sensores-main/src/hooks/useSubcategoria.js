import { useState, useEffect, useMemo } from 'react';
import { obtenerProductosPorSubcategoria } from '../api/productos';

export const useSubcategoria = (subcategoriaDb) => {
  const [productosCrudos, setProductosCrudos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState({});

  // 1. Descargamos el catálogo en bruto
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

  // 2. Extracción dinámica: Convertimos el JSON y armamos la lista de filtros
  const filtrosDisponibles = useMemo(() => {
    const opciones = {};
    
    // Filtramos ruido: Especificaciones que son útiles pero no sirven como filtros visuales
    const ignorar = [
      "certifications", "warranty", "weight", "category", 
      "latex-free", "sterile", "packaging type", "packaging unit", 
      "lead cable diameter", "lead cable material", "trunk cable material",
      "cable color", "cable diameter"
    ];

    productosCrudos.forEach(prod => {
      let specs = prod.especificaciones;
      
      // 🛡️ ESCUDO: Desempaquetamos la señal si Supabase la envía como texto
      if (typeof specs === 'string') {
        try {
          specs = JSON.parse(specs);
        } catch (e) {
          specs = null; // Si el dato viene corrupto, lo descartamos
        }
      }

      // 1. Rescatamos el Conector de Paciente si viene guardado en la columna 'tipo'
      const patientConnector = prod.tipo?.trim();
      if (patientConnector && patientConnector !== "") {
        if (!opciones["Patient Connector"]) opciones["Patient Connector"] = {};
        opciones["Patient Connector"][patientConnector] = (opciones["Patient Connector"][patientConnector] || 0) + 1;
      }

      // 2. Extraemos el resto de variables del objeto JSON ya limpio
      if (specs && typeof specs === 'object') {
        Object.entries(specs).forEach(([clave, valor]) => {
          const claveLimpia = clave.trim();
          const valorLimpio = String(valor).trim();

          // Solo procesamos si no está en la lista negra
          if (claveLimpia && valorLimpio && !ignorar.includes(claveLimpia.toLowerCase())) {
            
            // Renombramos "Technology" a "SpO2 Technology" para igualar a la competencia
            let nombreFiltro = claveLimpia;
            if (claveLimpia.toLowerCase() === "technology") nombreFiltro = "SpO2 Technology";
            
            // Evitamos duplicar "Patient Connector" si ya lo sacamos de la columna 'tipo'
            if (nombreFiltro === "Patient Connector" && patientConnector === valorLimpio) return;

            if (!opciones[nombreFiltro]) opciones[nombreFiltro] = {};
            opciones[nombreFiltro][valorLimpio] = (opciones[nombreFiltro][valorLimpio] || 0) + 1;
          }
        });
      }
    });

    // Formateamos y ordenamos el bloque alfabéticamente para que se vea estético
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

  // 3. Controladores de la interfaz (Checkboxes)
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

  // 4. Lógica de Filtrado: Oculta los productos que no coinciden con la selección
  const productosFiltrados = useMemo(() => {
    if (Object.keys(filtrosSeleccionados).length === 0) return productosCrudos;

    return productosCrudos.filter(prod => {
      return Object.entries(filtrosSeleccionados).every(([catFiltro, valoresSeleccionados]) => {
        
        let specs = prod.especificaciones;
        if (typeof specs === 'string') {
          try { specs = JSON.parse(specs); } catch(e) { specs = null; }
        }

        let valorDelProducto = null;

        if (specs && typeof specs === 'object') {
          valorDelProducto = specs[catFiltro];
          
          if (catFiltro === "SpO2 Technology" && !valorDelProducto) {
            valorDelProducto = specs["Technology"];
          }
        }

        if (!valorDelProducto && catFiltro === "Patient Connector") {
          valorDelProducto = prod.tipo;
        }

        if (!valorDelProducto) return false;

        return valoresSeleccionados.includes(String(valorDelProducto).trim());
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