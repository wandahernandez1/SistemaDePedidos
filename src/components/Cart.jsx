import { useState } from "react";
import {
  X,
  Store,
  Truck,
  Clock,
  Trash2,
  MessageCircle,
  Send,
} from "lucide-react";
import CartItem from "./CartItem";
import { formatPrice } from "../utils/formatPrice";
import {
  generateWhatsAppMessage,
  calculateEstimatedTime,
  generateWhatsAppUrl,
} from "../utils/generateWhatsAppMessage";
import { createOrder } from "../supabase/supabaseService";
import { useToast } from "../context/ToastContext";

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

  const { warning } = useToast();

  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

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
      warning("El carrito está vacío");
      return;
    }

    if (!deliveryTime) {
      warning("Por favor selecciona un horario de entrega");
      return;
    }

    if (deliveryType === "delivery" && !deliveryAddress.trim()) {
      warning("Por favor ingresa tu dirección de envío");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    // Preparar los datos del pedido para guardar en la base de datos
    const orderData = {
      order_number: `ORD-${Date.now()}`,
      items: cartItems.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        quantity: item.quantity,
        imagen: item.imagen,
        customizations:
          item.customizations || item.ingredientesElegidos?.join(", ") || null,
      })),
      total,
      delivery_type: deliveryType,
      delivery_time: deliveryTime,
      delivery_address: deliveryType === "delivery" ? deliveryAddress : null,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    try {
      // Guardar el pedido en Supabase
      await createOrder(orderData);
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      // Continuamos con WhatsApp aunque falle el guardado
    }

    // Generar mensaje y abrir WhatsApp
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
        className={`fixed top-0 right-0 w-full max-w-md h-screen bg-white dark:bg-secondary-950 shadow-2xl transition-transform duration-300 z-[999] flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-secondary-200 dark:border-secondary-800 bg-white dark:bg-secondary-950">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 m-0 tracking-tight">
            Tu Pedido
          </h2>
          <button
            className="bg-transparent border-none cursor-pointer text-secondary-500 dark:text-secondary-400 w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-secondary-100 dark:hover:bg-secondary-900 hover:text-secondary-800 dark:hover:text-secondary-200"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center">
            <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-100 m-0 mb-2 tracking-tight">
              Carrito vacío
            </h3>
            <p className="text-secondary-500 dark:text-secondary-400 m-0 text-base">
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
            <div className="border-t border-secondary-200 dark:border-secondary-800 p-4 bg-white dark:bg-secondary-950 flex-shrink-0">
              {/* Delivery Type */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-xs font-bold text-secondary-800 dark:text-secondary-200 mb-2">
                  Tipo de entrega
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      deliveryType === "pickup"
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950/50"
                        : "border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-900 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/30"
                    }`}
                    onClick={() => setDeliveryType("pickup")}
                  >
                    <Store
                      className={`h-5 w-5 ${
                        deliveryType === "pickup"
                          ? "text-primary-500"
                          : "text-secondary-500 dark:text-secondary-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        deliveryType === "pickup"
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-secondary-700 dark:text-secondary-300"
                      }`}
                    >
                      Retiro
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      deliveryType === "delivery"
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950/50"
                        : "border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-900 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/30"
                    }`}
                    onClick={() => setDeliveryType("delivery")}
                  >
                    <Truck
                      className={`h-5 w-5 ${
                        deliveryType === "delivery"
                          ? "text-primary-500"
                          : "text-secondary-500 dark:text-secondary-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        deliveryType === "delivery"
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-secondary-700 dark:text-secondary-300"
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
                      className="w-full px-3 py-2.5 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg text-sm transition-all duration-200 bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 placeholder:text-secondary-400 dark:placeholder:text-secondary-500"
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
                  <label className="flex items-center gap-1.5 text-xs font-bold text-secondary-800 dark:text-secondary-200">
                    <Clock className="h-4 w-4 text-primary-500" />
                    Horario
                  </label>
                  <span className="text-[10px] text-secondary-400">
                    {horarioApertura} - {horarioCierre} hs
                  </span>
                </div>

                <button
                  type="button"
                  className="w-full px-3 py-2.5 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg text-sm font-semibold transition-all duration-200 bg-white dark:bg-secondary-900 text-secondary-800 dark:text-secondary-100 cursor-pointer flex items-center gap-2 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/30"
                  onClick={() => setShowTimeSelector(true)}
                >
                  <span className="flex-1 text-left">
                    {deliveryTime
                      ? `${deliveryTime} hs`
                      : "Seleccionar horario"}
                  </span>
                  <span className="text-xs text-secondary-400">▼</span>
                </button>

                {/* Time Modal */}
                {showTimeSelector && (
                  <div
                    className="fixed inset-0 bg-black/50 flex items-end justify-center z-[10000] animate-fade-in"
                    onClick={() => setShowTimeSelector(false)}
                  >
                    <div
                      className="bg-white dark:bg-secondary-950 rounded-t-3xl w-full max-w-md max-h-[70vh] overflow-hidden animate-slide-in"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between px-6 py-5 border-b border-secondary-200 dark:border-secondary-800 sticky top-0 bg-white dark:bg-secondary-950">
                        <h3 className="text-lg font-bold m-0 text-secondary-900 dark:text-secondary-50">
                          Selecciona un horario
                        </h3>
                        <button
                          className="w-9 h-9 rounded-full border-none bg-secondary-100 dark:bg-secondary-800 cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-secondary-200 dark:hover:bg-secondary-700"
                          onClick={() => setShowTimeSelector(false)}
                        >
                          <X className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3 p-5 max-h-[calc(70vh-80px)] overflow-y-auto">
                        {generateTimeOptions().map((time) => (
                          <button
                            key={time}
                            type="button"
                            className={`py-4 px-3 border-2 rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 min-h-[52px] ${
                              deliveryTime === time
                                ? "bg-primary-500 border-primary-500 text-white"
                                : "bg-white dark:bg-secondary-900 border-secondary-300 dark:border-secondary-700 text-secondary-800 dark:text-secondary-100 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/30"
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
                  <p className="mt-2 px-2.5 py-2 bg-primary-500 rounded-lg text-xs text-white font-semibold text-center">
                    Estimado: <strong>{estimatedTime}</strong>
                    <span className="ml-1 opacity-80">(+30 min)</span>
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-4 mb-4 bg-secondary-50 dark:bg-secondary-900 rounded-xl border border-secondary-200 dark:border-secondary-700">
                <span className="text-sm font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
                  Total
                </span>
                <span className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 tracking-tight">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="py-3.5 px-4 border-2 border-secondary-300 dark:border-secondary-700 rounded-xl text-sm font-bold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 bg-white dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 hover:bg-error-50 dark:hover:bg-error-950/30 hover:border-error-400 hover:text-error-600 dark:hover:text-error-400 hover:-translate-y-0.5 active:scale-[0.98]"
                  onClick={onClearCart}
                  aria-label="Vaciar carrito"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Vaciar</span>
                </button>
                <button
                  className="flex-1 py-3.5 px-5 border-none rounded-xl text-sm font-bold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 bg-primary-500 text-white shadow-md hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
                  onClick={handleFinishOrder}
                  aria-label="Finalizar pedido por WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Enviar a WhatsApp</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in">
          <div className="bg-white dark:bg-secondary-950 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-slide-in border border-secondary-200 dark:border-secondary-800">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-950/50 rounded-full flex items-center justify-center border border-primary-200 dark:border-primary-800">
              <MessageCircle className="h-8 w-8 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-800 dark:text-secondary-100 m-0 mb-3 tracking-tight">
              Confirmar pedido
            </h3>
            <p className="text-secondary-500 dark:text-secondary-400 m-0 mb-7 text-base leading-relaxed">
              Se abrirá WhatsApp con el detalle de tu pedido
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 py-3.5 border-2 border-secondary-300 dark:border-secondary-700 rounded-xl text-base font-bold cursor-pointer transition-all duration-300 bg-white dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:border-secondary-400 dark:hover:border-secondary-600 hover:-translate-y-0.5 active:scale-[0.98]"
                onClick={() => setShowConfirmation(false)}
              >
                Cancelar
              </button>
              <button
                className="flex-1 py-3.5 border-none rounded-xl text-base font-bold cursor-pointer transition-all duration-300 bg-primary-500 text-white shadow-md hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-[0.98]"
                onClick={handleConfirmOrder}
              >
                <Send className="h-4 w-4" />
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
