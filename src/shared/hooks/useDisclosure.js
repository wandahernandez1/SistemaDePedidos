import { useState, useCallback } from "react";

/**
 * Hook para manejar estados de apertura/cierre
 * Útil para modales, dropdowns, tooltips, etc.
 *
 * @param {boolean} initialState - Estado inicial (default: false)
 * @returns {Object} Objeto con estado y funciones de control
 *
 * @example
 * const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
 *
 * <Button onClick={onOpen}>Abrir Modal</Button>
 * <Modal isOpen={isOpen} onClose={onClose}>...</Modal>
 */
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    setIsOpen,
  };
}

export default useDisclosure;
