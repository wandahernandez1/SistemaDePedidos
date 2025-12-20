import { useState, useEffect } from "react";

/**
 * Hook personalizado para gestionar el carrito de compras
 * Maneja el estado del carrito y la persistencia en localStorage
 */
export const useCart = () => {
  const [cartItems, setCartItems] = useState(() => {
    // Inicializar desde localStorage si existe
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sincronizar con localStorage cada vez que cambia el carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Agregar producto al carrito
   * Si ya existe y no tiene personalización, incrementa la cantidad
   * Si tiene personalización, se agrega como nuevo item
   */
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Crear un ID único para productos personalizados
      const itemId = product.customization
        ? `${product.id}_${Date.now()}_${Math.random()}`
        : product.id;

      const productWithId = { ...product, cartItemId: itemId };

      // Si tiene personalización, siempre agregar como nuevo item
      if (product.customization) {
        return [...prevItems, { ...productWithId, quantity: 1 }];
      }

      // Si no tiene personalización, buscar si ya existe
      const existingItem = prevItems.find(
        (item) => item.id === product.id && !item.customization
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && !item.customization
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...productWithId, quantity: 1 }];
    });
  };

  /**
   * Incrementar cantidad de un producto
   */
  const incrementQuantity = (itemIdentifier) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === itemIdentifier || item.id === itemIdentifier
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  /**
   * Decrementar cantidad de un producto
   * No permite cantidades menores a 1
   */
  const decrementQuantity = (itemIdentifier) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item.cartItemId === itemIdentifier || item.id === itemIdentifier) &&
        item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  /**
   * Eliminar producto del carrito
   */
  const removeFromCart = (itemIdentifier) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          item.cartItemId !== itemIdentifier && item.id !== itemIdentifier
      )
    );
  };

  /**
   * Vaciar todo el carrito
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Calcular el total del carrito
   */
  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.precio * item.quantity,
      0
    );
  };

  /**
   * Obtener la cantidad total de items en el carrito
   */
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getTotalItems,
  };
};
