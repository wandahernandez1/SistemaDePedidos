import { formatPrice } from "../utils/formatPrice";

/**
 * Componente CartItem - Item individual dentro del carrito
 * Muestra producto con controles de cantidad y opción de eliminar
 */
const CartItem = ({ item, onIncrement, onDecrement, onRemove }) => {
  const subtotal = item.precio * item.quantity;
  const unidadText = item.unidad === "docena" ? "docena(s)" : "unidad(es)";

  return (
    <div className="flex gap-3 p-3 bg-white rounded-xl border border-zinc-200 transition-all duration-200 hover:border-zinc-300 hover:shadow-sm">
      {/* Image */}
      <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
        <img
          src={item.imagen}
          alt={item.nombre}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col gap-2">
        <h4 className="text-[0.9375rem] font-bold text-zinc-800 m-0 tracking-tight leading-tight">
          {item.nombre}
        </h4>

        {item.customizationText && (
          <p className="text-xs text-green-600 m-0 bg-green-50 px-2 py-1 rounded border border-green-100 font-medium">
            {item.customizationText}
          </p>
        )}

        <p className="text-sm text-zinc-500 m-0 font-medium">
          {formatPrice(item.precio)} / {item.unidad}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 mt-1">
          <div className="flex items-center gap-2 bg-zinc-100 rounded-lg p-1 border border-zinc-200">
            <button
              className="w-7 h-7 border-none bg-zinc-900 text-white rounded-md text-base font-semibold cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-zinc-700 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => onDecrement(item.id)}
              disabled={item.quantity <= 1}
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="min-w-[85px] text-center text-sm font-bold text-zinc-800">
              {item.quantity} {unidadText}
            </span>
            <button
              className="w-7 h-7 border-none bg-zinc-900 text-white rounded-md text-base font-semibold cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-zinc-700 hover:scale-105 active:scale-95"
              onClick={() => onIncrement(item.id)}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <button
            className="bg-white border border-zinc-200 rounded-md w-7 h-7 text-xl font-light cursor-pointer flex items-center justify-center transition-all duration-200 text-zinc-500 hover:bg-red-500 hover:border-red-500 hover:text-white hover:scale-105"
            onClick={() => onRemove(item.id)}
            aria-label="Eliminar del carrito"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-zinc-500 m-0 mt-1 font-medium">
          Subtotal:{" "}
          <strong className="text-zinc-800 text-[0.9375rem]">
            {formatPrice(subtotal)}
          </strong>
        </p>
      </div>
    </div>
  );
};

export default CartItem;
