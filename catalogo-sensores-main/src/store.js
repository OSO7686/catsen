import { create } from 'zustand';

export const useCartStore = create((set) => ({
  carrito: [], 
  
  // agregar un producto al carrito
  agregarAlCarrito: (producto) => set((state) => ({
    carrito: [...state.carrito, producto]
  })),

  // eliminar un producto por su posición
  eliminarDelCarrito: (indexToRemove) => set((state) => ({
    carrito: state.carrito.filter((_, index) => index !== indexToRemove)
  })),

  // limpiar el carrito por completo
  limpiarCarrito: () => set({ carrito: [] })
})); 