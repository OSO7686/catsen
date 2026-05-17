import { create } from 'zustand';

export const useCartStore = create((set) => ({
  carrito: [], 
  
  // Agregar un producto al carrito (con lógica de suma)
  agregarAlCarrito: (productoNuevo) => set((state) => {
    // Verificamos si el producto ya existe en el carrito usando el SKU
    const itemExiste = state.carrito.find(item => item.mi_sku === productoNuevo.mi_sku);
    
    if (itemExiste) {
      // Si existe, recorremos el carrito y sumamos la cantidad al producto correcto
      return {
        carrito: state.carrito.map(item => 
          item.mi_sku === productoNuevo.mi_sku 
            ? { ...item, cantidad: (item.cantidad || 1) + (productoNuevo.cantidad || 1) }
            : item
        )
      };
    }
    
    // Si no existe, lo agregamos como un nuevo objeto
    return { carrito: [...state.carrito, productoNuevo] };
  }),

  // Eliminar un producto por su posición
  eliminarDelCarrito: (indexToRemove) => set((state) => ({
    carrito: state.carrito.filter((_, index) => index !== indexToRemove)
  })),

  // Limpiar el carrito por completo
  limpiarCarrito: () => set({ carrito: [] })
}));