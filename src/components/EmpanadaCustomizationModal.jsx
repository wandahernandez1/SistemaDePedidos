import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { formatPrice } from "../utils/formatPrice";
import { X, Minus, Plus, Beef, Cookie, CircleDot, Wheat } from "lucide-react";

// Mapeo de iconos para cada tipo de empanada (usando iconos disponibles)
const empanadaIcons = {
  carne: Beef,
  pollo: CircleDot, // Drumstick no existe, usamos alternativa
  jyq: CircleDot, // Cheese no existe, usamos alternativa
  humita: Wheat,
};

const EMPANADA_TYPES = [
  { id: "carne", nombre: "Carne" },
  { id: "pollo", nombre: "Pollo" },
  { id: "jyq", nombre: "Jamón y Queso" },
  { id: "humita", nombre: "Humita" },
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
        className="bg-white rounded-3xl max-w-xl w-full max-h-[95vh] overflow-hidden shadow-2xl relative animate-slide-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-6 pb-8 relative">
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-none text-white cursor-pointer flex items-center justify-center transition-all duration-200 z-10 hover:bg-white/30 hover:scale-110"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-md">
              <Cookie className="w-10 h-10 text-white" />
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
            <h3 className="text-xl font-bold text-secondary-900 m-0">
              Elegí tus sabores
            </h3>
            <span className="bg-primary-500 text-white px-3.5 py-1.5 rounded-full font-bold text-sm">
              {getTotalCount()} / {TOTAL_EMPANADAS}
            </span>
          </div>

          {/* Empanada List */}
          <div className="flex flex-col gap-4 mb-6">
            {EMPANADA_TYPES.map((type) => {
              const IconComponent = empanadaIcons[type.id] || Cookie;
              const isActive = quantities[type.id] > 0;
              return (
                <div
                  key={type.id}
                  className={`bg-secondary-50 border-2 rounded-xl px-5 py-4 flex items-center justify-between gap-4 transition-all duration-200 hover:bg-white ${
                    isActive
                      ? "border-primary-500 bg-primary-50"
                      : "border-secondary-200 hover:border-secondary-300"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isActive ? "bg-primary-100" : "bg-secondary-100"
                      }`}
                    >
                      <IconComponent
                        className={`w-7 h-7 ${
                          isActive ? "text-primary-600" : "text-secondary-500"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-bold text-secondary-900">
                        {type.nombre}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="w-10 h-10 rounded-lg border-2 border-primary-500 bg-white text-primary-500 font-bold cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-primary-500 hover:text-white hover:scale-105 active:scale-95 disabled:border-secondary-200 disabled:text-secondary-400 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => handleDecrement(type.id)}
                      disabled={quantities[type.id] === 0}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <input
                      type="number"
                      className="w-16 h-10 text-center border-2 border-secondary-200 rounded-lg text-lg font-bold text-secondary-900 bg-white transition-all duration-200 focus:outline-none focus:border-primary-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={quantities[type.id]}
                      onChange={(e) =>
                        handleInputChange(type.id, e.target.value)
                      }
                      min="0"
                      max={TOTAL_EMPANADAS}
                    />
                    <button
                      className="w-10 h-10 rounded-lg border-2 border-primary-500 bg-white text-primary-500 font-bold cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-primary-500 hover:text-white hover:scale-105 active:scale-95 disabled:border-secondary-200 disabled:text-secondary-400 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => handleIncrement(type.id)}
                      disabled={getTotalCount() >= TOTAL_EMPANADAS}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-secondary-200 pt-6 mt-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-secondary-500">
                Total
              </span>
              <span className="text-3xl font-bold text-secondary-900">
                {formatPrice(PRECIO_DOCENA)}
              </span>
            </div>
            <button
              className="w-full py-5 px-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white border-none rounded-xl text-lg font-bold cursor-pointer shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
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
