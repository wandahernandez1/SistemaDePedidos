import { useState } from "react";
import CartItem from "./CartItem";
import { formatPrice } from "../utils/formatPrice";
import {
  generateWhatsAppMessage,
  calculateEstimatedTime,
  generateWhatsAppUrl,
} from "../utils/generateWhatsAppMessage";

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
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const WHATSAPP_NUMBER = "542284229601";

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
    window.open(whatsappUrl, "_blank");

    onClearCart();
    setDeliveryTime("");
    setDeliveryType("pickup");
    setDeliveryAddress("");
    setShowConfirmation(false);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-250 z-[998] ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 w-full max-w-md h-screen bg-white shadow-2xl transition-transform duration-300 z-[999] flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-200 bg-white">
          <h2 className="text-2xl font-bold text-zinc-900 m-0 tracking-tight">
            Tu Pedido
          </h2>
          <button
            className="bg-transparent border-none text-2xl cursor-pointer text-zinc-500 w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 font-light hover:bg-zinc-100 hover:text-zinc-800"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center">
            <h3 className="text-xl font-bold text-zinc-800 m-0 mb-2 tracking-tight">
              Carrito vacío
            </h3>
            <p className="text-zinc-500 m-0 text-base">
              Agrega productos para comenzar tu pedido
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-[35vh]">
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

            {/* Footer */}
            <div className="border-t border-zinc-200 p-4 bg-white flex-shrink-0">
              {/* Delivery Type */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-800 mb-2">
                  Tipo de entrega
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border-2 rounded-lg bg-white cursor-pointer transition-all duration-200 ${
                      deliveryType === "pickup"
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-900"
                    }`}
                    onClick={() => setDeliveryType("pickup")}
                  >
                    <span className="text-lg">🏪</span>
                    <span
                      className={`text-xs font-semibold ${
                        deliveryType === "pickup"
                          ? "text-zinc-900"
                          : "text-zinc-800"
                      }`}
                    >
                      Retiro
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border-2 rounded-lg bg-white cursor-pointer transition-all duration-200 ${
                      deliveryType === "delivery"
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-900"
                    }`}
                    onClick={() => setDeliveryType("delivery")}
                  >
                    <span className="text-lg">🛵</span>
                    <span
                      className={`text-xs font-semibold ${
                        deliveryType === "delivery"
                          ? "text-zinc-900"
                          : "text-zinc-800"
                      }`}
                    >
                      Envío
                    </span>
                  </button>
                </div>

                {/* Address Input */}
                {deliveryType === "delivery" && (
                  <div className="mt-3 animate-fade-in">
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 border-2 border-zinc-200 rounded-lg text-sm transition-all duration-200 bg-white focus:outline-none focus:border-zinc-900"
                      placeholder="Dirección de envío..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Time Selection */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                    🕐 Horario
                  </label>
                  <span className="text-[10px] text-zinc-400">
                    {horarioApertura} - {horarioCierre} hs
                  </span>
                </div>

                <button
                  type="button"
                  className="w-full px-3 py-2.5 border-2 border-zinc-200 rounded-lg text-sm font-semibold transition-all duration-200 bg-white text-zinc-800 cursor-pointer flex items-center gap-2 hover:border-zinc-900 hover:bg-zinc-50"
                  onClick={() => setShowTimeSelector(true)}
                >
                  <span className="flex-1 text-left">
                    {deliveryTime
                      ? `${deliveryTime} hs`
                      : "Seleccionar horario"}
                  </span>
                  <span className="text-xs text-zinc-400">▼</span>
                </button>

                {/* Time Modal */}
                {showTimeSelector && (
                  <div
                    className="fixed inset-0 bg-black/50 flex items-end justify-center z-[10000] animate-fade-in"
                    onClick={() => setShowTimeSelector(false)}
                  >
                    <div
                      className="bg-white rounded-t-3xl w-full max-w-md max-h-[70vh] overflow-hidden animate-slide-up"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 sticky top-0 bg-white">
                        <h3 className="text-lg font-bold m-0">
                          Selecciona un horario
                        </h3>
                        <button
                          className="w-9 h-9 rounded-full border-none bg-zinc-100 text-2xl cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-zinc-200"
                          onClick={() => setShowTimeSelector(false)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3 p-5 max-h-[calc(70vh-80px)] overflow-y-auto">
                        {generateTimeOptions().map((time) => (
                          <button
                            key={time}
                            type="button"
                            className={`py-4 px-3 border-2 rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 min-h-[52px] ${
                              deliveryTime === time
                                ? "bg-zinc-900 border-zinc-900 text-white"
                                : "bg-white border-zinc-200 text-zinc-800 hover:border-zinc-900 hover:bg-zinc-50"
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
                  <p className="mt-2 px-2.5 py-2 bg-zinc-900 rounded-lg text-xs text-white font-semibold text-center">
                    Estimado: <strong>{estimatedTime}</strong>
                    <span className="ml-1 opacity-80">(+30 min)</span>
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-3 mb-3 bg-zinc-100 rounded-lg border border-zinc-200">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">
                  Total
                </span>
                <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="py-3 px-3 border border-zinc-200 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200 flex items-center justify-center gap-1 bg-white text-zinc-500 hover:bg-zinc-100 hover:border-zinc-400 hover:text-zinc-800"
                  onClick={onClearCart}
                >
                  🗑️ Vaciar
                </button>
                <button
                  className="flex-1 py-3 px-4 border-none rounded-lg text-sm font-bold cursor-pointer transition-all duration-200 flex items-center justify-center gap-1.5 bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  onClick={handleFinishOrder}
                >
                  ✨ Finalizar Pedido
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-slide-up border border-zinc-200">
            <h3 className="text-2xl font-bold text-zinc-800 m-0 mb-3 tracking-tight">
              📱 ¿Confirmar pedido?
            </h3>
            <p className="text-zinc-500 m-0 mb-7 text-base leading-relaxed">
              Se abrirá WhatsApp con el detalle de tu pedido
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 py-3.5 border border-zinc-200 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 hover:-translate-y-0.5"
                onClick={() => setShowConfirmation(false)}
              >
                Cancelar
              </button>
              <button
                className="flex-1 py-3.5 border-none rounded-xl text-base font-bold cursor-pointer transition-all duration-200 bg-zinc-900 text-white shadow-md hover:bg-zinc-800 hover:-translate-y-0.5 hover:shadow-lg"
                onClick={handleConfirmOrder}
              >
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
