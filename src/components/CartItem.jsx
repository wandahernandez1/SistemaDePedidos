import { memo, useCallback, useMemo } from "react";
import { Minus, Plus, X } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";

/**
 * Componente CartItem - Item individual dentro del carrito
 * Muestra producto con controles de cantidad y opción de eliminar
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
const CartItem = memo(({ item, onIncrement, onDecrement, onRemove }) => {
  const subtotal = useMemo(
    () => item.precio * item.quantity,
    [item.precio, item.quantity]
  );
  const unidadText = item.unidad === "docena" ? "docena(s)" : "unidad(es)";

  const handleIncrement = useCallback(() => {
    onIncrement(item.id);
  }, [onIncrement, item.id]);

  const handleDecrement = useCallback(() => {
    onDecrement(item.id);
  }, [onDecrement, item.id]);

  const handleRemove = useCallback(() => {
    onRemove(item.id);
  }, [onRemove, item.id]);

  return (
    <div className="flex gap-3 p-3 bg-secondary-50 dark:bg-secondary-900 rounded-xl border border-secondary-200 dark:border-secondary-700 transition-colors duration-150 hover:border-secondary-300 dark:hover:border-secondary-600">
      {/* Image */}
      <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-secondary-100 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
        <img
          src={item.imagen}
          alt={item.nombre}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col gap-2">
        <h4 className="text-[0.9375rem] font-bold text-secondary-800 dark:text-secondary-100 m-0 tracking-tight leading-tight">
          {item.nombre}
        </h4>

        {item.customizationText && (
          <p className="text-xs text-green-600 dark:text-green-400 m-0 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded border border-green-100 dark:border-green-800 font-medium">
            {item.customizationText}
          </p>
        )}

        <p className="text-sm text-secondary-500 dark:text-secondary-400 m-0 font-medium">
          {formatPrice(item.precio)} / {item.unidad}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 mt-1">
          <div className="flex items-center gap-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1 border border-secondary-200 dark:border-secondary-700">
            <button
              className="w-7 h-7 border-none bg-primary-500 text-white rounded-md text-base font-semibold cursor-pointer flex items-center justify-center transition-colors duration-150 hover:bg-primary-600 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[85px] text-center text-sm font-bold text-secondary-800 dark:text-secondary-100">
              {item.quantity} {unidadText}
            </span>
            <button
              className="w-7 h-7 border-none bg-primary-500 text-white rounded-md text-base font-semibold cursor-pointer flex items-center justify-center transition-colors duration-150 hover:bg-primary-600 active:scale-95"
              onClick={handleIncrement}
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            className="bg-transparent border border-secondary-300 dark:border-secondary-700 rounded-md w-7 h-7 cursor-pointer flex items-center justify-center transition-colors duration-150 text-secondary-500 dark:text-secondary-400 hover:bg-error-500 hover:border-error-500 hover:text-white"
            onClick={handleRemove}
            aria-label="Eliminar del carrito"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-secondary-500 dark:text-secondary-400 m-0 mt-1 font-medium">
          Subtotal:{" "}
          <strong className="text-secondary-800 dark:text-secondary-100 text-[0.9375rem]">
            {formatPrice(subtotal)}
          </strong>
        </p>
      </div>
    </div>
  );
});

CartItem.displayName = "CartItem";

export default CartItem;
