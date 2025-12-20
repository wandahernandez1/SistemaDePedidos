import { formatPrice } from "../utils/formatPrice";
import "./CartItem.css";

/**
 * Componente CartItem - Item individual dentro del carrito
 * Muestra producto con controles de cantidad y opción de eliminar
 */
const CartItem = ({ item, onIncrement, onDecrement, onRemove }) => {
  const subtotal = item.precio * item.quantity;
  const unidadText = item.unidad === "docena" ? "docena(s)" : "unidad(es)";

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.imagen} alt={item.nombre} />
      </div>

      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.nombre}</h4>
        {item.customizationText && (
          <p className="cart-item-customization">{item.customizationText}</p>
        )}
        <p className="cart-item-unit">
          {formatPrice(item.precio)} / {item.unidad}
        </p>

        <div className="cart-item-controls">
          <div className="quantity-controls">
            <button
              className="quantity-button"
              onClick={() => onDecrement(item.id)}
              disabled={item.quantity <= 1}
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="quantity-display">
              {item.quantity} {unidadText}
            </span>
            <button
              className="quantity-button"
              onClick={() => onIncrement(item.id)}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <button
            className="remove-button"
            onClick={() => onRemove(item.id)}
            aria-label="Eliminar del carrito"
          >
            ×
          </button>
        </div>

        <p className="cart-item-subtotal">
          Subtotal: <strong>{formatPrice(subtotal)}</strong>
        </p>
      </div>
    </div>
  );
};

export default CartItem;
