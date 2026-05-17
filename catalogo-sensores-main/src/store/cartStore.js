// src/store/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 👈 1. Importamos el middleware

// 2. Envolvemos toda la creación de la tienda dentro de persist()
export const useCartStore = create(
  persist(
    (set, get) => ({
      carrito: [],

      // Tu función para agregar
      agregarAlCarrito: (producto) => {
        const carritoActual = get().carrito;
        // Buscamos si el producto ya está en el carrito usando el SKU
        const productoExistente = carritoActual.find(item => item.mi_sku === producto.mi_sku);

        if (productoExistente) {
          // Si ya existe, solo le sumamos 1 a la cantidad
          set({
            carrito: carritoActual.map(item =>
              item.mi_sku === producto.mi_sku
                ? { ...item, cantidad: (item.cantidad || 1) + 1 }
                : item
            )
          });
        } else {
          // Si es nuevo, lo agregamos al arreglo con cantidad 1
          set({ carrito: [...carritoActual, { ...producto, cantidad: 1 }] });
        }
      },

      // Función para eliminar un producto específico
      eliminarDelCarrito: (skuId) => {
        set({ carrito: get().carrito.filter(item => item.mi_sku !== skuId) });
      },

      // Función para vaciar todo (útil cuando se completa la compra)
      limpiarCarrito: () => set({ carrito: [] }),
    }),
    {
      // 3. Configuración de persistencia
      name: 'carrito-catsen', // 👈 Este es el nombre con el que se guardará en el navegador
    }
  )
);