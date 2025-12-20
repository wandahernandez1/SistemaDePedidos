import { useState } from "react";
import { createPortal } from "react-dom";
import { formatPrice } from "../utils/formatPrice";
import "./EmpanadaCustomizationModal.css";

const EMPANADA_TYPES = [
  { id: "carne", nombre: "Carne", emoji: "🥩" },
  { id: "pollo", nombre: "Pollo", emoji: "🍗" },
  { id: "jyq", nombre: "Jamón y Queso", emoji: "🧀" },
  { id: "humita", nombre: "Humita", emoji: "🌽" },
];

const PRECIO_DOCENA = 22000;

const EmpanadaCustomizationModal = ({ product, onClose, onAddToCart }) => {
  const TOTAL_EMPANADAS = 12;

  // Estado: objeto con cantidad de cada tipo
  const [quantities, setQuantities] = useState({
    carne: 0,
    pollo: 0,
    jyq: 0,
    humita: 0,
  });

  const handleIncrement = (typeId) => {
    const total = getTotalCount();
    if (total < TOTAL_EMPANADAS) {
      setQuantities((prev) => ({
        ...prev,
        [typeId]: prev[typeId] + 1,
      }));
    }
  };

  const handleDecrement = (typeId) => {
    if (quantities[typeId] > 0) {
      setQuantities((prev) => ({
        ...prev,
        [typeId]: prev[typeId] - 1,
      }));
    }
  };

  const handleInputChange = (typeId, value) => {
    const numValue = parseInt(value) || 0;
    const total = getTotalCount() - quantities[typeId];

    if (numValue >= 0 && total + numValue <= TOTAL_EMPANADAS) {
      setQuantities((prev) => ({
        ...prev,
        [typeId]: numValue,
      }));
    }
  };

  const getTotalCount = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const calculateTotal = () => {
    return PRECIO_DOCENA;
  };

  const handleAddToCart = () => {
    const total = getTotalCount();

    if (total !== TOTAL_EMPANADAS) {
      alert(
        `Debes seleccionar exactamente 12 empanadas. Seleccionadas: ${total}/12`
      );
      return;
    }

    const selectedTypes = EMPANADA_TYPES.filter(
      (type) => quantities[type.id] > 0
    );

    const customizedProduct = {
      ...product,
      nombre: "Docena de Empanadas - Personalizada",
      precio: PRECIO_DOCENA,
      customizacion: {
        empanadas: selectedTypes.map((type) => ({
          tipo: type.nombre,
          cantidad: quantities[type.id],
        })),
        resumen: selectedTypes
          .map((type) => `${quantities[type.id]}x ${type.nombre}`)
          .join(", "),
      },
    };

    onAddToCart(customizedProduct, 1);
    onClose();
  };

  const modalContent = (
    <div className="empanada-modal-overlay" onClick={onClose}>
      <div
        className="empanada-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="empanada-modal-header">
          <button
            className="empanada-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="empanada-modal-header-content">
            <div className="empanada-modal-icon">🥟</div>
            <div className="empanada-modal-title-section">
              <h2 className="empanada-modal-title">Armá tu Docena</h2>
              <p className="empanada-modal-subtitle">
                Elegí 12 empanadas y combiná sabores
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="empanada-modal-main">
          <div className="empanada-selection-header">
            <h3>Elegí tus sabores</h3>
            <span className="empanada-counter">
              {getTotalCount()} / {TOTAL_EMPANADAS}
            </span>
          </div>

          {/* Lista de Empanadas con Controles */}
          <div className="empanada-quantity-list">
            {EMPANADA_TYPES.map((type) => (
              <div key={type.id} className="empanada-quantity-item">
                <div className="empanada-info">
                  <span className="empanada-emoji">{type.emoji}</span>
                  <div className="empanada-details">
                    <span className="empanada-name">{type.nombre}</span>
                  </div>
                </div>

                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleDecrement(type.id)}
                    disabled={quantities[type.id] === 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={quantities[type.id]}
                    onChange={(e) => handleInputChange(type.id, e.target.value)}
                    min="0"
                    max={TOTAL_EMPANADAS}
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleIncrement(type.id)}
                    disabled={getTotalCount() >= TOTAL_EMPANADAS}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen y Total */}
          <div className="empanada-footer">
            <div className="total-section">
              <div className="total-row">
                <span className="total-label">Total</span>
                <span className="total-amount">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={getTotalCount() !== TOTAL_EMPANADAS}
              >
                {getTotalCount() === TOTAL_EMPANADAS
                  ? "Agregar al Carrito"
                  : `Falta seleccionar ${TOTAL_EMPANADAS - getTotalCount()}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EmpanadaCustomizationModal;
