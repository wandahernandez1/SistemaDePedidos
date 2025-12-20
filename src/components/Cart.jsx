import { useState } from "react";
import CartItem from "./CartItem";
import { formatPrice } from "../utils/formatPrice";
import {
  generateWhatsAppMessage,
  calculateEstimatedTime,
  generateWhatsAppUrl,
} from "../utils/generateWhatsAppMessage";
import "./Cart.css";

/**
 * Componente Cart - Carrito de compras lateral
 * Muestra items, total y permite finalizar pedido por WhatsApp
 */
const Cart = ({
  cartItems,
  total,
  isOpen,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onClearCart,
  horarioApertura = "09:00",
  horarioCierre = "21:00",
}) => {
  const [deliveryTime, setDeliveryTime] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [deliveryType, setDeliveryType] = useState("pickup"); // "pickup" o "delivery"
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Función para formatear hora (24h sin AM/PM)
  const formatTime24h = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes} hs`;
  };

  // Generar opciones de horarios cada 30 minutos
  const generateTimeOptions = () => {
    const options = [];
    const [startHour, startMin] = horarioApertura.split(":").map(Number);
    const [endHour, endMin] = horarioCierre.split(":").map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin <= endMin)
    ) {
      const timeValue = `${String(currentHour).padStart(2, "0")}:${String(
        currentMin
      ).padStart(2, "0")}`;
      options.push(timeValue);

      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour += 1;
      }
    }

    return options;
  };

  // Handler para cambio de horario
  const handleTimeChange = (e) => {
    setDeliveryTime(e.target.value);
  };

  // Número de WhatsApp del negocio
  const WHATSAPP_NUMBER = "542284229601"; // Formato: código país + número sin símbolos

  const estimatedTime = deliveryTime
    ? calculateEstimatedTime(deliveryTime)
    : "";

  const handleFinishOrder = () => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    if (!deliveryTime) {
      alert("Por favor selecciona un horario de entrega");
      return;
    }

    if (deliveryType === "delivery" && !deliveryAddress.trim()) {
      alert("Por favor ingresa tu dirección de envío");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmOrder = () => {
    const message = generateWhatsAppMessage(
      cartItems,
      total,
      deliveryTime,
      estimatedTime,
      deliveryType,
      deliveryAddress
    );

    const whatsappUrl = generateWhatsAppUrl(WHATSAPP_NUMBER, message);

    // Abrir WhatsApp
    window.open(whatsappUrl, "_blank");

    // Limpiar carrito y cerrar
    onClearCart();
    setDeliveryTime("");
    setDeliveryType("pickup");
    setDeliveryAddress("");
    setShowConfirmation(false);
    onClose();
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      {/* Cart Drawer */}
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Tu Pedido</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h3>Carrito vacío</h3>
            <p>Agrega productos para comenzar tu pedido</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <CartItem
                  key={item.cartItemId || item.id}
                  item={{ ...item, id: item.cartItemId || item.id }}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                  onRemove={onRemove}
                />
              ))}
            </div>

            <div className="cart-footer">
              {/* Selector de tipo de entrega */}
              <div className="delivery-type-section">
                <label className="delivery-label">Tipo de entrega</label>
                <div className="delivery-type-options">
                  <button
                    type="button"
                    className={`delivery-type-btn ${
                      deliveryType === "pickup" ? "selected" : ""
                    }`}
                    onClick={() => setDeliveryType("pickup")}
                  >
                    <span className="delivery-type-icon">🏪</span>
                    <span className="delivery-type-text">Retiro en local</span>
                  </button>
                  <button
                    type="button"
                    className={`delivery-type-btn ${
                      deliveryType === "delivery" ? "selected" : ""
                    }`}
                    onClick={() => setDeliveryType("delivery")}
                  >
                    <span className="delivery-type-icon">🛵</span>
                    <span className="delivery-type-text">
                      Envío a domicilio
                    </span>
                  </button>
                </div>

                {/* Campo de dirección si es envío a domicilio */}
                {deliveryType === "delivery" && (
                  <div className="delivery-address-section">
                    <label className="address-label">Dirección de envío</label>
                    <input
                      type="text"
                      className="address-input"
                      placeholder="Ej: Calle 123, entre calles..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Selector de horario */}
              <div className="delivery-time-section">
                <label className="delivery-label">Horario de entrega</label>
                <p className="horario-disponible">
                  Disponible de {horarioApertura} hs a {horarioCierre} hs
                </p>

                {/* Botón para abrir selector */}
                <button
                  type="button"
                  className="time-selector-trigger"
                  onClick={() => setShowTimeSelector(true)}
                >
                  <span className="time-selector-icon">🕐</span>
                  <span className="time-selector-text">
                    {deliveryTime
                      ? `${deliveryTime} hs`
                      : "Selecciona un horario"}
                  </span>
                  <span className="time-selector-arrow">▼</span>
                </button>

                {/* Modal de selección de horarios */}
                {showTimeSelector && (
                  <div
                    className="time-modal-overlay"
                    onClick={() => setShowTimeSelector(false)}
                  >
                    <div
                      className="time-modal"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="time-modal-header">
                        <h3>Selecciona un horario</h3>
                        <button
                          className="time-modal-close"
                          onClick={() => setShowTimeSelector(false)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="time-options-grid">
                        {generateTimeOptions().map((time) => (
                          <button
                            key={time}
                            type="button"
                            className={`time-option-btn ${
                              deliveryTime === time ? "selected" : ""
                            }`}
                            onClick={() => {
                              setDeliveryTime(time);
                              setShowTimeSelector(false);
                            }}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {estimatedTime && (
                  <p className="estimated-time">
                    Horario estimado: <strong>{estimatedTime}</strong>
                    <span className="time-info">(+30 min)</span>
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="cart-total">
                <span className="total-label">Total</span>
                <span className="total-amount">{formatPrice(total)}</span>
              </div>

              {/* Botones */}
              <div className="cart-actions">
                <button className="clear-cart-button" onClick={onClearCart}>
                  Vaciar carrito
                </button>
                <button
                  className="finish-order-button"
                  onClick={handleFinishOrder}
                >
                  Finalizar Pedido
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de confirmación */}
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h3>¿Confirmar pedido?</h3>
            <p>Se abrirá WhatsApp con el detalle de tu pedido</p>
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={handleCancelConfirmation}
              >
                Cancelar
              </button>
              <button className="confirm-button" onClick={handleConfirmOrder}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
