import { useEffect, useCallback, useRef } from "react";

/**
 * Hook para manejar la navegación hacia atrás en móviles
 * Evita que el usuario salga de la aplicación accidentalmente
 * al presionar el botón atrás del navegador/dispositivo
 *
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.isModalOpen - Si hay un modal abierto
 * @param {boolean} options.isCartOpen - Si el carrito está abierto
 * @param {boolean} options.showMenuView - Si está en la vista de menú principal
 * @param {Function} options.onCloseModal - Función para cerrar modal
 * @param {Function} options.onCloseCart - Función para cerrar carrito
 * @param {Function} options.onBackToMenu - Función para volver al menú
 */
export const useBackNavigation = ({
  isModalOpen = false,
  isCartOpen = false,
  showMenuView = true,
  onCloseModal,
  onCloseCart,
  onBackToMenu,
}) => {
  const hasInitialized = useRef(false);
  const lastStateRef = useRef({
    isModalOpen,
    isCartOpen,
    showMenuView,
  });

  /**
   * Manejar el evento popstate (botón atrás del navegador)
   */
  const handlePopState = useCallback(
    (event) => {
      // Prevenir la navegación por defecto
      event.preventDefault();

      // Prioridad 1: Cerrar modal si está abierto
      if (isModalOpen && onCloseModal) {
        onCloseModal();
        // Agregar estado de vuelta para mantener el historial
        window.history.pushState({ page: "modal-closed" }, "");
        return;
      }

      // Prioridad 2: Cerrar carrito si está abierto
      if (isCartOpen && onCloseCart) {
        onCloseCart();
        // Agregar estado de vuelta para mantener el historial
        window.history.pushState({ page: "cart-closed" }, "");
        return;
      }

      // Prioridad 3: Volver al menú si está en una categoría
      if (!showMenuView && onBackToMenu) {
        onBackToMenu();
        // Agregar estado de vuelta para mantener el historial
        window.history.pushState({ page: "menu" }, "");
        return;
      }

      // Si ya estamos en el menú principal, agregar entrada al historial
      // para evitar salir de la aplicación
      window.history.pushState({ page: "main" }, "");
    },
    [isModalOpen, isCartOpen, showMenuView, onCloseModal, onCloseCart, onBackToMenu]
  );

  /**
   * Inicializar el historial al montar el componente
   */
  useEffect(() => {
    if (!hasInitialized.current) {
      // Agregar estado inicial al historial
      window.history.pushState({ page: "main" }, "");
      hasInitialized.current = true;
    }
  }, []);

  /**
   * Manejar cambios de estado para agregar entradas al historial
   */
  useEffect(() => {
    const prevState = lastStateRef.current;

    // Si se abre el carrito, agregar al historial
    if (isCartOpen && !prevState.isCartOpen) {
      window.history.pushState({ page: "cart" }, "");
    }

    // Si se abre un modal, agregar al historial
    if (isModalOpen && !prevState.isModalOpen) {
      window.history.pushState({ page: "modal" }, "");
    }

    // Si se cambia a una categoría (sale del menú principal), agregar al historial
    if (!showMenuView && prevState.showMenuView) {
      window.history.pushState({ page: "category" }, "");
    }

    // Actualizar referencia del estado anterior
    lastStateRef.current = {
      isModalOpen,
      isCartOpen,
      showMenuView,
    };
  }, [isModalOpen, isCartOpen, showMenuView]);

  /**
   * Suscribirse al evento popstate
   */
  useEffect(() => {
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handlePopState]);

  return null;
};

export default useBackNavigation;
