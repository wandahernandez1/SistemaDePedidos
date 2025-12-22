import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { formatPrice } from "../utils/formatPrice";

const EMPANADA_TYPES = [
  { id: "carne", nombre: "Carne", emoji: "🥩" },
  { id: "pollo", nombre: "Pollo", emoji: "🍗" },
  { id: "jyq", nombre: "Jamón y Queso", emoji: "🧀" },
  { id: "humita", nombre: "Humita", emoji: "🌽" },
];

const PRECIO_DOCENA = 22000;

const EmpanadaCustomizationModal = ({ product, onClose, onAddToCart }) => {
  const TOTAL_EMPANADAS = 12;

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
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 m-0 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[95vh] overflow-hidden shadow-2xl relative animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-700 px-6 py-6 pb-8 relative">
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-none text-white cursor-pointer flex items-center justify-center transition-all duration-200 z-10 hover:bg-white/30 hover:scale-110"
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

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl shadow-md">
              🥟
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white m-0 drop-shadow-sm">
                Armá tu Docena
              </h2>
              <p className="text-white/90 m-0 mt-1 font-medium">
                Elegí 12 empanadas y combiná sabores
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-zinc-900 m-0">
              Elegí tus sabores
            </h3>
            <span className="bg-zinc-900 text-white px-3.5 py-1.5 rounded-full font-bold text-sm">
              {getTotalCount()} / {TOTAL_EMPANADAS}
            </span>
          </div>

          {/* Empanada List */}
          <div className="flex flex-col gap-4 mb-6">
            {EMPANADA_TYPES.map((type) => (
              <div
                key={type.id}
                className="bg-zinc-50 border-2 border-zinc-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4 transition-all duration-200 hover:border-zinc-300 hover:bg-white"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-4xl leading-none">{type.emoji}</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-bold text-zinc-900">
                      {type.nombre}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="w-10 h-10 rounded-lg border-2 border-zinc-900 bg-white text-zinc-900 text-xl font-bold cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:scale-105 active:scale-95 disabled:border-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => handleDecrement(type.id)}
                    disabled={quantities[type.id] === 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="w-16 h-10 text-center border-2 border-zinc-200 rounded-lg text-lg font-bold text-zinc-900 bg-white transition-all duration-200 focus:outline-none focus:border-zinc-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={quantities[type.id]}
                    onChange={(e) => handleInputChange(type.id, e.target.value)}
                    min="0"
                    max={TOTAL_EMPANADAS}
                  />
                  <button
                    className="w-10 h-10 rounded-lg border-2 border-zinc-900 bg-white text-zinc-900 text-xl font-bold cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:scale-105 active:scale-95 disabled:border-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => handleIncrement(type.id)}
                    disabled={getTotalCount() >= TOTAL_EMPANADAS}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-zinc-200 pt-6 mt-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-zinc-500">
                Total
              </span>
              <span className="text-3xl font-bold text-zinc-900">
                {formatPrice(PRECIO_DOCENA)}
              </span>
            </div>
            <button
              className="w-full py-5 px-6 bg-gradient-to-r from-zinc-900 to-zinc-700 text-white border-none rounded-xl text-lg font-bold cursor-pointer shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
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
  );

  return createPortal(modalContent, document.body);
};

export default EmpanadaCustomizationModal;
