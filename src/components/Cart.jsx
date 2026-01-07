import { useState, memo, useCallback, useMemo } from "react";
import {
  X,
  Store,
  Truck,
  Clock,
  Trash2,
  MessageCircle,
  Send,
  AlertCircle,
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
 * Mapeo de categorías de items a categorías de horarios
 */
const CATEGORY_MAPPING = {
  hamburguesas: "hamburguesas",
  hamburguesa: "hamburguesas",
  empanadas: "empanadas",
  empanada: "empanadas",
  pizzas: "pizzas",
  pizza: "pizzas",
  bebidas: "bebidas",
  bebida: "bebidas",
  postres: "postres",
  postre: "postres",
};

/**
 * Componente Cart - Carrito de compras lateral
 * Muestra items, total y permite finalizar pedido por WhatsApp
 * Optimizado para rendimiento en móviles
 */
const Cart = memo(
  ({
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
    categorySchedules = null,
  }) => {
    const [deliveryTime, setDeliveryTime] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showTimeSelector, setShowTimeSelector] = useState(false);
    const [deliveryType, setDeliveryType] = useState("pickup");
    const [deliveryAddress, setDeliveryAddress] = useState("");

    const { warning } = useToast();

    const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

    /**
     * Detectar categorías únicas de los items en el carrito
     */
    const cartCategories = useMemo(() => {
      const categories = new Set();
      cartItems.forEach((item) => {
        const itemCategory = item.categoria?.toLowerCase() || "";
        const mappedCategory = CATEGORY_MAPPING[itemCategory];
        if (mappedCategory) {
          categories.add(mappedCategory);
        }
      });
      return Array.from(categories);
    }, [cartItems]);

    /**
     * Calcular el rango de horarios válidos basado en las categorías del carrito
     * El horario de inicio es el MÁS TARDÍO de todas las categorías
     * El horario de fin es el MÁS TEMPRANO de todas las categorías
     */
    const effectiveSchedule = useMemo(() => {
      // Si no hay schedules de categorías o no hay items, usar horarios generales
      if (!categorySchedules || cartCategories.length === 0) {
        return {
          start: horarioApertura,
          end: horarioCierre,
          categories: [],
          restrictiveCategory: null,
        };
      }

      // Filtrar solo categorías principales (excluir bebidas y postres que siempre están disponibles)
      const mainCategories = cartCategories.filter(
        (cat) => !["bebidas", "postres"].includes(cat)
      );

      // Si solo hay bebidas/postres, usar horarios generales
      if (mainCategories.length === 0) {
        return {
          start: horarioApertura,
          end: horarioCierre,
          categories: cartCategories,
          restrictiveCategory: null,
        };
      }

      let latestStart = "00:00";
      let earliestEnd = "23:59";
      let restrictiveCategory = null;

      mainCategories.forEach((cat) => {
        const schedule = categorySchedules[cat];
        if (schedule && schedule.habilitado) {
          const catStart = schedule.horario_pedidos_inicio || "19:00";
          const catEnd = schedule.horario_entrega_fin || schedule.horario_pedidos_fin || "22:00";

          // Comparar horarios
          if (catStart > latestStart) {
            latestStart = catStart;
            restrictiveCategory = cat;
          }
          if (catEnd < earliestEnd) {
            earliestEnd = catEnd;
          }
        }
      });

      // Si no se encontraron horarios válidos, usar generales
      if (latestStart === "00:00" || earliestEnd === "23:59") {
        return {
          start: horarioApertura,
          end: horarioCierre,
          categories: cartCategories,
          restrictiveCategory: null,
        };
      }

      return {
        start: latestStart,
        end: earliestEnd,
        categories: cartCategories,
        restrictiveCategory,
      };
    }, [categorySchedules, cartCategories, horarioApertura, horarioCierre]);

    // Generar opciones de horarios cada 30 minutos - memoizado
    const timeOptions = useMemo(() => {
      const options = [];
      const [startHour, startMin] = effectiveSchedule.start.split(":").map(Number);
      const [endHour, endMin] = effectiveSchedule.end.split(":").map(Number);

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
    }, [effectiveSchedule]);

    const estimatedTime = useMemo(
      () => (deliveryTime ? calculateEstimatedTime(deliveryTime) : ""),
      [deliveryTime]
    );

    const handleClose = useCallback(() => {
      onClose?.();
    }, [onClose]);

    const handleClearCart = useCallback(() => {
      onClearCart?.();
    }, [onClearCart]);

    const handleSetPickup = useCallback(() => {
      setDeliveryType("pickup");
    }, []);

    const handleSetDelivery = useCallback(() => {
      setDeliveryType("delivery");
    }, []);

    const handleOpenTimeSelector = useCallback(() => {
      setShowTimeSelector(true);
    }, []);

    const handleCloseTimeSelector = useCallback(() => {
      setShowTimeSelector(false);
    }, []);

    const handleSelectTime = useCallback((time) => {
      setDeliveryTime(time);
      setShowTimeSelector(false);
    }, []);

    const handleAddressChange = useCallback((e) => {
      setDeliveryAddress(e.target.value);
    }, []);

    const handleFinishOrder = useCallback(() => {
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
    }, [
      cartItems.length,
      deliveryTime,
      deliveryType,
      deliveryAddress,
      warning,
    ]);

    const handleCancelConfirmation = useCallback(() => {
      setShowConfirmation(false);
    }, []);

    const handleConfirmOrder = useCallback(async () => {
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
            item.customizations ||
            item.ingredientesElegidos?.join(", ") ||
            null,
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
    }, [
      cartItems,
      total,
      deliveryType,
      deliveryTime,
      deliveryAddress,
      estimatedTime,
      WHATSAPP_NUMBER,
      onClearCart,
      onClose,
    ]);

    return (
      <>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity duration-200 z-[998] ${
            isOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
          onClick={handleClose}
        />

        {/* Cart Drawer */}
        <div
          className={`fixed top-0 right-0 w-full max-w-md h-screen bg-white dark:bg-secondary-950 shadow-2xl transition-transform duration-250 z-[999] flex flex-col gpu-accelerated ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-secondary-200 dark:border-secondary-800 bg-white dark:bg-secondary-950">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 m-0 tracking-tight">
              Tu Pedido
            </h2>
            <button
              className="bg-transparent border-none cursor-pointer text-secondary-500 dark:text-secondary-400 w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-150 hover:bg-secondary-100 dark:hover:bg-secondary-900 hover:text-secondary-800 dark:hover:text-secondary-200"
              onClick={handleClose}
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
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border-2 rounded-lg cursor-pointer transition-colors duration-150 ${
                        deliveryType === "pickup"
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-950/50"
                          : "border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-900 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/30"
                      }`}
                      onClick={handleSetPickup}
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
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border-2 rounded-lg cursor-pointer transition-colors duration-150 ${
                        deliveryType === "delivery"
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-950/50"
                          : "border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-900 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/30"
                      }`}
                      onClick={handleSetDelivery}
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
                        className="w-full px-3 py-2.5 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg text-sm transition-colors duration-150 bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 placeholder:text-secondary-400 dark:placeholder:text-secondary-500"
                        placeholder="Dirección de envío..."
                        value={deliveryAddress}
                        onChange={handleAddressChange}
                      />
                    </div>
                  )}
                </div>

                {/* Time Selection */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-secondary-800 dark:text-secondary-200">
                      <Clock className="h-4 w-4 text-primary-500" />
                      Horario de entrega
                    </label>
                    <span className="text-[10px] text-secondary-400">
                      {effectiveSchedule.start} - {effectiveSchedule.end} hs
                    </span>
                  </div>

                  {/* Info de horario restrictivo */}
                  {effectiveSchedule.restrictiveCategory && (
                    <div className="flex items-start gap-2 p-2 mb-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Horario según disponibilidad de <span className="font-semibold capitalize">{effectiveSchedule.restrictiveCategory}</span>
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    className="w-full px-3 py-2.5 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg text-sm font-semibold transition-colors duration-150 bg-white dark:bg-secondary-900 text-secondary-800 dark:text-secondary-100 cursor-pointer flex items-center gap-2 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/30"
                    onClick={handleOpenTimeSelector}
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
                      className="fixed inset-0 bg-black/50 flex items-end justify-center z-[10000] modal-overlay"
                      onClick={handleCloseTimeSelector}
                    >
                      <div
                        className="bg-white dark:bg-secondary-950 rounded-t-3xl w-full max-w-md max-h-[70vh] overflow-hidden animate-slide-in modal-content"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between px-6 py-5 border-b border-secondary-200 dark:border-secondary-800 sticky top-0 bg-white dark:bg-secondary-950">
                          <h3 className="text-lg font-bold m-0 text-secondary-900 dark:text-secondary-50">
                            Selecciona un horario
                          </h3>
                          <button
                            className="w-9 h-9 rounded-full border-none bg-secondary-100 dark:bg-secondary-800 cursor-pointer flex items-center justify-center transition-colors duration-150 hover:bg-secondary-200 dark:hover:bg-secondary-700"
                            onClick={handleCloseTimeSelector}
                          >
                            <X className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3 p-5 max-h-[calc(70vh-80px)] overflow-y-auto">
                          {timeOptions.map((time) => (
                            <button
                              key={time}
                              type="button"
                              className={`py-4 px-3 border-2 rounded-xl text-base font-semibold cursor-pointer transition-colors duration-150 min-h-[52px] ${
                                deliveryTime === time
                                  ? "bg-primary-500 border-primary-500 text-white"
                                  : "bg-white dark:bg-secondary-900 border-secondary-300 dark:border-secondary-700 text-secondary-800 dark:text-secondary-100 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/30"
                              }`}
                              onClick={() => handleSelectTime(time)}
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
                    className="py-3.5 px-4 border-2 border-secondary-300 dark:border-secondary-700 rounded-xl text-sm font-bold cursor-pointer transition-colors duration-150 flex items-center justify-center gap-2 bg-white dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 hover:bg-error-50 dark:hover:bg-error-950/30 hover:border-error-400 hover:text-error-600 dark:hover:text-error-400 active:scale-[0.98]"
                    onClick={handleClearCart}
                    aria-label="Vaciar carrito"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Vaciar</span>
                  </button>
                  <button
                    className="flex-1 py-3.5 px-5 border-none rounded-xl text-sm font-bold cursor-pointer transition-colors duration-150 flex items-center justify-center gap-2 bg-primary-500 text-white shadow-md hover:bg-primary-600 active:scale-[0.98]"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4 modal-overlay">
            <div className="bg-white dark:bg-secondary-950 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-slide-in border border-secondary-200 dark:border-secondary-800 modal-content">
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
                  className="flex-1 py-3.5 border-2 border-secondary-300 dark:border-secondary-700 rounded-xl text-base font-bold cursor-pointer transition-colors duration-150 bg-white dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 active:scale-[0.98]"
                  onClick={handleCancelConfirmation}
                >
                  Cancelar
                </button>
                <button
                  className="flex-1 py-3.5 border-none rounded-xl text-base font-bold cursor-pointer transition-colors duration-150 bg-primary-500 text-white shadow-md hover:bg-primary-600 flex items-center justify-center gap-2 active:scale-[0.98]"
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
  }
);

Cart.displayName = "Cart";

export default Cart;
