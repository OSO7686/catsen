import { useState, useEffect, useMemo } from 'react';
import { obtenerProductosPorSubcategoria } from '../api/productos';

export const useSubcategoria = (subcategoriaDb) => {
  const [productosCrudos, setProductosCrudos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState({});

  // 🚨 NUEVOS ESTADOS PARA MANEJO DE ERRORES
  const [error, setError] = useState(null);
  const [intentos, setIntentos] = useState(0);

  const reintentar = () => setIntentos(prev => prev + 1);

  // 1. Descargamos el catálogo en bruto
  useEffect(() => {
    async function obtenerDatos() {
      setCargando(true);
      setError(null); // Limpiamos errores previos
      setFiltrosSeleccionados({});
      try {
        const respuesta = await obtenerProductosPorSubcategoria(subcategoriaDb, 1, 2000);
        setProductosCrudos(respuesta.productos || []);
      } catch (errorGeneral) {
        console.error("Error cargando productos:", errorGeneral);
        // Si la red falla, activamos el mensaje
        setError("No pudimos conectar con la base de datos. Revisa tu conexión a internet o intenta de nuevo en unos segundos.");
      } finally {
        setCargando(false);
      }
    }
    if (subcategoriaDb) obtenerDatos();
    
    // Agregamos 'intentos' a las dependencias para que el botón de reintentar funcione
  }, [subcategoriaDb, intentos]);

  // 2. Extracción dinámica (ESTO SE QUEDA EXACTAMENTE IGUAL)
  const filtrosDisponibles = useMemo(() => {
    const opciones = {};
    const ignorar = [
      "certifications", "warranty", "weight", "category", 
      "latex-free", "sterile", "packaging type", "packaging unit", 
      "lead cable diameter", "lead cable material", "trunk cable material",
      "cable color", "cable diameter"
    ];

    productosCrudos.forEach(prod => {
      let specs = prod.especificaciones;
      if (typeof specs === 'string') {
        try { specs = JSON.parse(specs); } catch (e) { specs = null; }
      }

      const patientConnector = prod.tipo?.trim();
      if (patientConnector && patientConnector !== "") {
        if (!opciones["Patient Connector"]) opciones["Patient Connector"] = {};
        opciones["Patient Connector"][patientConnector] = (opciones["Patient Connector"][patientConnector] || 0) + 1;
      }

      if (specs && typeof specs === 'object') {
        Object.entries(specs).forEach(([clave, valor]) => {
          const claveLimpia = clave.trim();
          const valorLimpio = String(valor).trim();

          if (claveLimpia && valorLimpio && !ignorar.includes(claveLimpia.toLowerCase())) {
            let nombreFiltro = claveLimpia;
            if (claveLimpia.toLowerCase() === "technology") nombreFiltro = "SpO2 Technology";
            if (nombreFiltro === "Patient Connector" && patientConnector === valorLimpio) return;

            if (!opciones[nombreFiltro]) opciones[nombreFiltro] = {};
            opciones[nombreFiltro][valorLimpio] = (opciones[nombreFiltro][valorLimpio] || 0) + 1;
          }
        });
      }
    });

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

  // 3. Controladores de la interfaz (SE QUEDA IGUAL)
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

  // 4. Lógica de Filtrado (SE QUEDA IGUAL)
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
    cargando,
    error,         // 👈 Retornamos el error
    reintentar     // 👈 Retornamos la función
  };
};